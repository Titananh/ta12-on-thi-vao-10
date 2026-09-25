const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUT_FILE = path.join(DATA_DIR, 'related_topics.json');
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'Upload');

// Ensure output dirs exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Load existing cache if any
let cache = {};
if (fs.existsSync(OUT_FILE)) {
  try {
    cache = JSON.parse(fs.readFileSync(OUT_FILE, 'utf8'));
    console.log(`Loaded ${Object.keys(cache).length} existing cached topics.`);
  } catch (e) {
    console.error('Error reading existing cache:', e.message);
  }
}

// Collect question IDs
const questionIds = new Set();

function addIdsFromObj(obj) {
  if (!obj) return;
  if (Array.isArray(obj.questions)) {
    for (const q of obj.questions) {
      if (q && q.id) questionIds.add(Number(q.id));
    }
  }
}

// 1. Prioritize sections
const sectionsDir = path.join(DATA_DIR, 'sections');
if (fs.existsSync(sectionsDir)) {
  const sFiles = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.json') && f !== 'index.json');
  for (const f of sFiles) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(sectionsDir, f), 'utf8'));
      addIdsFromObj(d);
    } catch(e){}
  }
}

// 2. Exam bundles
const examsDir = path.join(DATA_DIR, 'exams', 'bundles');
if (fs.existsSync(examsDir)) {
  const eFiles = fs.readdirSync(examsDir).filter(f => f.endsWith('.json'));
  for (const f of eFiles) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(examsDir, f), 'utf8'));
      addIdsFromObj(d);
    } catch(e){}
  }
}

// 3. Question sets
const qDir = path.join(DATA_DIR, 'questions');
if (fs.existsSync(qDir)) {
  const qFiles = fs.readdirSync(qDir).filter(f => f.endsWith('.json'));
  for (const f of qFiles) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(qDir, f), 'utf8'));
      addIdsFromObj(d);
    } catch(e){}
  }
}

const idList = Array.from(questionIds);
console.log(`Total questions discovered: ${idList.length}`);

// Filter out those already cached with non-empty results
const pendingIds = idList.filter(id => !cache[id]);
console.log(`Questions pending fetch: ${pendingIds.length}`);

// Download image helper
function downloadImage(imgUrl) {
  let fullUrl = imgUrl;
  if (fullUrl.startsWith('/')) {
    fullUrl = 'https://tak12.com' + fullUrl;
  }
  if (!fullUrl.startsWith('http')) return;

  try {
    const urlObj = new URL(fullUrl);
    const localRelPath = urlObj.pathname.startsWith('/Upload/') ? urlObj.pathname.slice(8) : path.basename(urlObj.pathname);
    const destPath = path.join(UPLOAD_DIR, localRelPath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    if (fs.existsSync(destPath)) return;

    https.get(fullUrl, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
      }
    }).on('error', () => {});
  } catch (err) {}
}

function extractAndDownloadImages(html) {
  if (!html) return;
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    downloadImage(match[1]);
  }
}

// Fetch single question topic
function fetchTopic(qId) {
  return new Promise((resolve) => {
    const req = https.get(`https://data.tak12.com/api/services/app/QuizPublic/GetRelatedTopicOfQuestion?questionId=${qId}`, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json && json.success && json.result) {
            resolve(json.result);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('timeout', () => { req.destroy(); resolve(null); });
    req.on('error', () => resolve(null));
  });
}

// Concurrency runner
const CONCURRENCY = 20;
let currentIndex = 0;
let completedCount = 0;
let saveCounter = 0;

async function worker() {
  while (currentIndex < pendingIds.length) {
    const idx = currentIndex++;
    const qId = pendingIds[idx];
    const res = await fetchTopic(qId);
    if (res) {
      cache[qId] = res;
      if (res.listQuestionTopicDetail) {
        for (const t of res.listQuestionTopicDetail) {
          if (t && t.detail) {
            extractAndDownloadImages(t.detail);
          }
        }
      }
    } else {
      // Record empty response so we don't refetch forever
      cache[qId] = { isDisplay: false, listQuestionTopicDetail: [] };
    }

    completedCount++;
    saveCounter++;

    if (saveCounter >= 100) {
      saveCounter = 0;
      fs.writeFileSync(OUT_FILE, JSON.stringify(cache));
      console.log(`[Progress] ${completedCount}/${pendingIds.length} done (${((completedCount / pendingIds.length) * 100).toFixed(1)}%). Cache size: ${Object.keys(cache).length}`);
    }
  }
}

async function main() {
  console.log(`Starting crawl with ${CONCURRENCY} workers...`);
  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    workers.push(worker());
  }
  await Promise.all(workers);

  fs.writeFileSync(OUT_FILE, JSON.stringify(cache, null, 2));
  console.log(`Crawl completed! Saved ${Object.keys(cache).length} entries to ${OUT_FILE}`);
}

main();
