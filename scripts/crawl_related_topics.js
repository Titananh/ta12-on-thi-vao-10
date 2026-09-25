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

function collectJsonFilesRecursively(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectJsonFilesRecursively(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.json')) files.push(fullPath);
  }
  return files;
}

// 3. Question sets, including nested grammar/ and vocabulary/ study banks
const qDir = path.join(DATA_DIR, 'questions');
if (fs.existsSync(qDir)) {
  const qFiles = collectJsonFilesRecursively(qDir);
  for (const f of qFiles) {
    try {
      const d = JSON.parse(fs.readFileSync(f, 'utf8'));
      addIdsFromObj(d);
    } catch(e){}
  }
}

const idList = Array.from(questionIds);
console.log(`Total questions discovered: ${idList.length}`);

// Filter out those already cached with non-empty results
const pendingIds = idList.filter(id => !cache[id]);
console.log(`Questions pending fetch: ${pendingIds.length}`);

function decodeHtmlEntities(value) {
  const namedEntities = {
    amp: '&', quot: '"', apos: "'", lt: '<', gt: '>',
    aacute: 'á', eacute: 'é', iacute: 'í', oacute: 'ó', uacute: 'ú',
    Aacute: 'Á', Eacute: 'É', Iacute: 'Í', Oacute: 'Ó', Uacute: 'Ú',
  };
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (entity, name) => namedEntities[name] || entity);
}

// Download image helper. Resolve only after the file is completely written so
// the generated cache can be verified and deployed as a self-contained bundle.
function downloadImage(imgUrl) {
  let fullUrl = decodeHtmlEntities(imgUrl);
  if (fullUrl.startsWith('/')) {
    fullUrl = 'https://tak12.com' + fullUrl;
  }
  if (!fullUrl.startsWith('http')) return Promise.resolve(false);

  return new Promise((resolve) => {
    try {
      const urlObj = new URL(fullUrl);
      const decodedPath = decodeURIComponent(urlObj.pathname);
      const localRelPath = decodedPath.startsWith('/Upload/') ? decodedPath.slice(8) : path.basename(decodedPath);
      const destPath = path.join(UPLOAD_DIR, localRelPath);
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 100) return resolve(true);

      https.get(urlObj, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return resolve(false);
        }
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => fileStream.close(() => resolve(true)));
        fileStream.on('error', () => resolve(false));
      }).on('error', () => resolve(false));
    } catch (err) {
      resolve(false);
    }
  });
}

function extractImageUrls(html) {
  if (!html) return [];
  const urls = [];
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
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
const CONCURRENCY = 4;
const REQUEST_DELAY_MS = 125;
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

    await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
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
  const imageUrls = new Set();
  for (const result of Object.values(cache)) {
    for (const topic of result.listQuestionTopicDetail || []) {
      for (const imageUrl of extractImageUrls(topic && topic.detail)) imageUrls.add(imageUrl);
    }
  }
  const images = Array.from(imageUrls);
  let downloadedImages = 0;
  for (let i = 0; i < images.length; i += CONCURRENCY) {
    const batch = images.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(downloadImage));
    downloadedImages += results.filter(Boolean).length;
  }
  console.log(`Verified/downloaded ${downloadedImages}/${images.length} unique related-topic images.`);
  console.log(`Crawl completed! Saved ${Object.keys(cache).length} entries to ${OUT_FILE}`);
}

main();
