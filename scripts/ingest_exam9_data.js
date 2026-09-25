/**
 * TA12 Data Ingestion Pipeline & Local Repository Builder
 * Strictly scoped to Course: "Ôn thi vào 10 môn Anh - HN" (Exam ID = 9)
 *
 * Scrapes, enriches, sanitizes, and indexes all 7 categories from Tak12 Public API:
 * - 5 Exam Categories (1097, 1687, 1489, 1263, 170) -> 138 exams -> data/exams/
 * - 10 Section Question Banks (Dạng bài) -> data/sections/
 * - 2 Study Categories (44 Vocab, 240 Grammar) -> 152 study modules -> data/theories/ & data/questions/
 * - Images downloaded and localized -> public/images/
 *
 * Features:
 * - Polite concurrency (4 workers) + 120ms throttle
 * - Resilient exponential backoff on 429/5xx
 * - Checkpoint persistence (data/crawler_checkpoint.json)
 * - HTML entity decoding for image URLs
 * - Zero legacy "K" brand sanitization (TAK12/Tak12 -> TA12)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const BASE_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(BASE_DIR, 'data');
const EXAMS_DIR = path.join(DATA_DIR, 'exams');
const BUNDLES_DIR = path.join(EXAMS_DIR, 'bundles');
const SECTIONS_DIR = path.join(DATA_DIR, 'sections');
const THEORIES_DIR = path.join(DATA_DIR, 'theories');
const QUESTIONS_DIR = path.join(DATA_DIR, 'questions');
const THEORIES_VOCAB_DIR = path.join(THEORIES_DIR, 'vocabulary');
const THEORIES_GRAMMAR_DIR = path.join(THEORIES_DIR, 'grammar');
const QUESTIONS_VOCAB_DIR = path.join(QUESTIONS_DIR, 'vocabulary');
const QUESTIONS_GRAMMAR_DIR = path.join(QUESTIONS_DIR, 'grammar');

const PUBLIC_IMAGES_DIR = path.join(BASE_DIR, 'public', 'images');
const IMAGES_EXAMS_DIR = path.join(PUBLIC_IMAGES_DIR, 'exams');
const IMAGES_RULES_DIR = path.join(PUBLIC_IMAGES_DIR, 'rules');

const CHECKPOINT_FILE = path.join(DATA_DIR, 'crawler_checkpoint.json');

const API_BASE = 'https://data.tak12.com/api/services/app/QuizPublic/';
const CONCURRENCY = 4;
const THROTTLE_MS = 120;
const MAX_RETRIES = 3;

// Ensure all target directories exist
[
  DATA_DIR,
  EXAMS_DIR,
  BUNDLES_DIR,
  SECTIONS_DIR,
  THEORIES_DIR,
  QUESTIONS_DIR,
  THEORIES_VOCAB_DIR,
  THEORIES_GRAMMAR_DIR,
  QUESTIONS_VOCAB_DIR,
  QUESTIONS_GRAMMAR_DIR,
  PUBLIC_IMAGES_DIR,
  IMAGES_EXAMS_DIR,
  IMAGES_RULES_DIR
].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Sleep utility
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Decode HTML entities
function decodeHtmlEntities(text) {
  if (!text || typeof text !== 'string') return text || '';
  return text
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&ocirc;/gi, 'ô').replace(/&Ocirc;/gi, 'Ô')
    .replace(/&acirc;/gi, 'â').replace(/&Acirc;/gi, 'Â')
    .replace(/&ecirc;/gi, 'ê').replace(/&Ecirc;/gi, 'Ê')
    .replace(/&aacute;/gi, 'á').replace(/&Aacute;/gi, 'Á')
    .replace(/&agrave;/gi, 'à').replace(/&Agrave;/gi, 'À')
    .replace(/&eacute;/gi, 'é').replace(/&Eacute;/gi, 'É')
    .replace(/&egrave;/gi, 'è').replace(/&Egrave;/gi, 'È')
    .replace(/&iacute;/gi, 'í').replace(/&Iacute;/gi, 'Í')
    .replace(/&igrave;/gi, 'ì').replace(/&Igrave;/gi, 'Ì')
    .replace(/&oacute;/gi, 'ó').replace(/&Oacute;/gi, 'Ó')
    .replace(/&ograve;/gi, 'ò').replace(/&Ograve;/gi, 'Ò')
    .replace(/&uacute;/gi, 'ú').replace(/&Uacute;/gi, 'Ú')
    .replace(/&ugrave;/gi, 'ù').replace(/&Ugrave;/gi, 'Ù')
    .replace(/&yacute;/gi, 'ý').replace(/&Yacute;/gi, 'Ý')
    .replace(/&atilde;/gi, 'ã').replace(/&otilde;/gi, 'õ')
    .replace(/&ntilde;/gi, 'ñ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

// Brand sanitizer: strictly replace legacy TAK12 / Tak12 with TA12
function sanitizeBrand(text) {
  if (!text || typeof text !== 'string') return text || '';
  return text
    .replace(/TAK12/g, 'TA12')
    .replace(/Tak12/g, 'TA12')
    .replace(/tak12(?!\.com)/gi, 'ta12');
}

// Checkpoint state management
let checkpoint = {
  completedQuizIds: [],
  lastUpdated: new Date().toISOString()
};

function loadCheckpoint() {
  if (fs.existsSync(CHECKPOINT_FILE)) {
    try {
      checkpoint = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf8'));
      if (!Array.isArray(checkpoint.completedQuizIds)) {
        checkpoint.completedQuizIds = [];
      }
    } catch (e) {
      console.warn('[Checkpoint] Failed to read existing checkpoint, initializing fresh.');
    }
  }
}

function saveCheckpoint(quizId) {
  if (quizId && !checkpoint.completedQuizIds.includes(quizId)) {
    checkpoint.completedQuizIds.push(quizId);
  }
  checkpoint.lastUpdated = new Date().toISOString();
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), 'utf8');
}

// Resilient API request with retry and backoff
async function apiRequest(endpoint, options = {}, retries = MAX_RETRIES) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sleep(THROTTLE_MS);
      const res = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });

      if (res.status === 429 || res.status >= 500) {
        // If it's a 500 on CheckGuestAnswer, it might be the WordOrder bug, re-throw to be caught specifically
        if (res.status === 500 && endpoint.includes('CheckGuestAnswer')) {
          const errText = await res.text().catch(() => '');
          throw new Error(`API_500: ${errText}`);
        }
        if (attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 1000;
          console.warn(`[HTTP ${res.status}] Retrying ${endpoint} in ${waitTime}ms (attempt ${attempt}/${retries})...`);
          await sleep(waitTime);
          continue;
        }
        throw new Error(`HTTP_${res.status}: Failed after ${retries} attempts`);
      }

      if (!res.ok) {
        throw new Error(`HTTP_${res.status}: ${res.statusText}`);
      }

      const json = await res.json();
      return json.result;
    } catch (err) {
      if (err.message && err.message.startsWith('API_500')) {
        throw err;
      }
      if (attempt === retries) throw err;
      const waitTime = Math.pow(2, attempt) * 1000;
      await sleep(waitTime);
    }
  }
}

// In-memory cache for downloaded images: remoteUrl -> localPath
const imageCache = new Map();

async function downloadAndRewriteImages(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string') return htmlContent || '';

  // Find all image sources matching /Upload/ or tak12.com/Upload/
  const imgRegex = /(src=["'])(https?:\/\/(?:data\.)?tak12\.com)?(\/Upload\/[^"'\r\n<>]+)(["'])/gi;
  let match;
  const matches = [];

  while ((match = imgRegex.exec(htmlContent)) !== null) {
    matches.push({
      fullMatch: match[0],
      prefix: match[1],
      rawPath: match[3],
      suffix: match[4]
    });
  }

  let rewrittenHtml = htmlContent;

  for (const m of matches) {
    try {
      const decodedPath = decodeHtmlEntities(m.rawPath);
      let localPath = imageCache.get(decodedPath);

      if (!localPath) {
        // Determine whether this is a rule infographic or an exam illustration
        const isRule = decodedPath.includes('Ghi nhớ Tiếng Anh') || decodedPath.includes('[OFFICIAL]');
        const targetDir = isRule ? IMAGES_RULES_DIR : IMAGES_EXAMS_DIR;
        const relativePrefix = isRule ? '/images/rules/' : '/images/exams/';

        // Create a safe, unique filename
        const ext = path.extname(decodedPath).toLowerCase() || '.png';
        const cleanBase = path.basename(decodedPath, ext)
          .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .substring(0, 40);
        const hash = crypto.createHash('md5').update(decodedPath).digest('hex').substring(0, 8);
        const fileName = `${cleanBase}_${hash}${ext}`;
        const destFile = path.join(targetDir, fileName);

        if (!fs.existsSync(destFile)) {
          const fetchUrl = 'https://tak12.com' + encodeURI(decodedPath);
          const res = await fetch(fetchUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
          });

          if (res.ok) {
            const ct = res.headers.get('content-type') || '';
            if (ct.includes('image') || ct.includes('octet-stream')) {
              const buf = Buffer.from(await res.arrayBuffer());
              if (buf.length > 0) {
                fs.writeFileSync(destFile, buf);
                localPath = `${relativePrefix}${fileName}`;
              }
            }
          }
        } else {
          localPath = `${relativePrefix}${fileName}`;
        }

        if (localPath) {
          imageCache.set(decodedPath, localPath);
        }
      }

      if (localPath) {
        rewrittenHtml = rewrittenHtml.replace(m.fullMatch, `${m.prefix}${localPath}${m.suffix}`);
      }
    } catch (err) {
      // If image download fails, keep original or fallback gracefully
    }
  }

  return rewrittenHtml;
}

// Extract year from exam title
function extractYear(title) {
  if (!title) return 2024;
  const match = title.match(/(?:năm\s*|[-_/\s])(201\d|202\d)/i);
  if (match) return parseInt(match[1], 10);
  return 2024;
}

// Classify question into one of 10 standard Grade 10 Hanoi sections
function classifyQuestion(q, parentQ) {
  const text = (q.questionText || '') + ' ' + (q.hint || '') + (parentQ ? ' ' + parentQ.questionText : '');
  const clean = text.replace(/<[^>]+>/g, ' ').toLowerCase();

  // 1. Pronunciation
  if (
    clean.includes('pronounced differently') ||
    clean.includes('phần gạch chân được phát âm') ||
    clean.includes('phát âm khác') ||
    clean.includes('underlined part pronounced') ||
    clean.includes('underlined part that differs from the other three in pronunciation') ||
    clean.includes('whose underlined part is pronounced')
  ) {
    return 'pronunciation';
  }

  // 2. Stress
  if (
    clean.includes('position of the main stress') ||
    clean.includes('position of primary stress') ||
    clean.includes('differs from the other three in the position of stress') ||
    clean.includes('differs from the other three in the position of the main stress') ||
    clean.includes('trọng âm chính') ||
    clean.includes('trọng âm khác') ||
    clean.includes('position of stress')
  ) {
    return 'stress';
  }

  // 3. Error Identification
  if (
    clean.includes('underlined part that needs correction') ||
    clean.includes('needs correction') ||
    clean.includes('tìm lỗi sai') ||
    clean.includes('underlined word or phrase that must be changed') ||
    clean.includes('underlined part that contains an error')
  ) {
    return 'error_identification';
  }

  // 4. Signs & Notices
  if (
    clean.includes('what does this sign say') ||
    clean.includes('what does the sign say') ||
    clean.includes('what does the notice say') ||
    clean.includes('biển báo') ||
    clean.includes('thông báo') ||
    clean.includes('announcement') ||
    clean.includes('leaflet')
  ) {
    return 'sign_notices';
  }

  // 5. Communicative Functions
  if (
    clean.includes('most suitable response') ||
    clean.includes('complete each of the following exchanges') ||
    clean.includes('exchanges') ||
    clean.includes('chức năng giao tiếp') ||
    clean.includes('giao tiếp') ||
    clean.includes('talking about') ||
    clean.includes('conversation') ||
    /:\s*["“][^"”]+["”].+:\s*["“]?[_]+/i.test(text) ||
    /[-–]\s*[A-Za-z]+:\s*["“]/i.test(text) ||
    /[A-Za-z]+:\s*["“][^"”]+["”]/i.test(text) ||
    /:\s*["“].+["”]\s*\n/i.test(text) ||
    /^[a-z]+:\s*["“].+["”]\s*-\s*[a-z]+:/i.test(clean)
  ) {
    return 'communicative_functions';
  }

  // 6. Sentence Transformation
  if (
    clean.includes('closest in meaning') ||
    clean.includes('đồng nghĩa với câu') ||
    clean.includes('viết lại câu') ||
    clean.includes('sentence that is closest in meaning')
  ) {
    return 'sentence_transformation';
  }

  // 7. Sentence Combination & Rearrangement
  if (
    clean.includes('combines each pair of sentences') ||
    clean.includes('combines two sentences') ||
    clean.includes('best sentence that can be made from the words given') ||
    clean.includes('kết hợp câu') ||
    clean.includes('sắp xếp lại câu') ||
    clean.includes('rearrange the words')
  ) {
    return 'sentence_combination';
  }

  // 8. Guided Cloze
  if (
    clean.includes('fits each of the numbered blanks') ||
    clean.includes('choose the best answer for each blank') ||
    clean.includes('điền từ vào đoạn văn') ||
    q.questionType === 'FillBlank'
  ) {
    return 'guided_cloze';
  }

  // 9. Reading Comprehension
  if (
    clean.includes('read the following passage and choose the correct answer') ||
    clean.includes('according to the passage') ||
    clean.includes('what is the main idea') ||
    clean.includes('đọc hiểu') ||
    (q.parentQuestionId && q.parentQuestionId > 0)
  ) {
    return 'reading_comprehension';
  }

  // 10. Default Grammar & Vocabulary MCQ
  return 'grammar_vocab_cloze';
}

// Enrich a single question via CheckGuestAnswer
async function enrichQuestion(rawQ) {
  const qType = rawQ.questionTypeName || 'MultipleChoice';

  const enriched = {
    id: rawQ.id,
    questionNumber: rawQ.questionNumber || 0,
    questionName: sanitizeBrand(rawQ.questionName || `Question ${rawQ.questionNumber || rawQ.id}`),
    questionType: qType,
    questionText: sanitizeBrand(await downloadAndRewriteImages(rawQ.questionText || '')),
    passageText: null,
    parentQuestionId: rawQ.parentQuestionId || 0,
    choices: [],
    correctChoiceId: null,
    fillblankAnswers: null,
    shortAnswers: null,
    hint: sanitizeBrand(await downloadAndRewriteImages(rawQ.hint || '')),
    explanation: '',
    answerFeedbacks: {},
    images: []
  };

  // Build standard choices
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  if (Array.isArray(rawQ.answerList)) {
    for (let i = 0; i < rawQ.answerList.length; i++) {
      const a = rawQ.answerList[i];
      enriched.choices.push({
        id: a.id,
        label: letters[i] || `Opt ${i + 1}`,
        text: sanitizeBrand(await downloadAndRewriteImages(a.answerText || '')),
        isCorrect: false
      });
    }
  }

  // Skip answer check for Description items
  if (qType === 'Description') {
    return enriched;
  }

  // Call CheckGuestAnswer
  try {
    const checkRes = await apiRequest('CheckGuestAnswer', {
      method: 'POST',
      body: JSON.stringify({
        questionId: rawQ.id,
        quizAttemptId: 0,
        userAnswers: ''
      })
    });

    if (checkRes) {
      // Explanation & feedbacks
      if (checkRes.feedback) {
        enriched.explanation = sanitizeBrand(await downloadAndRewriteImages(checkRes.feedback));
      }

      if (checkRes.answerFeedbacks && typeof checkRes.answerFeedbacks === 'object') {
        const rewrittenFeedbacks = {};
        for (const [k, v] of Object.entries(checkRes.answerFeedbacks)) {
          rewrittenFeedbacks[k] = sanitizeBrand(await downloadAndRewriteImages(v || ''));
        }
        enriched.answerFeedbacks = rewrittenFeedbacks;
      }

      // Missing / correct choice ID
      if (Array.isArray(checkRes.missing) && checkRes.missing.length > 0) {
        enriched.correctChoiceId = checkRes.missing[0];
        const correctSet = new Set(checkRes.missing);
        enriched.choices.forEach(c => {
          if (correctSet.has(c.id)) c.isCorrect = true;
        });
      }

      // FillBlank
      if (Array.isArray(checkRes.fillblankAnswers)) {
        enriched.fillblankAnswers = checkRes.fillblankAnswers.map((item, idx) => ({
          index: idx,
          correctAnswers: item.answers || []
        }));
      }

      // ShortAnswer
      if (Array.isArray(checkRes.shortAnswers)) {
        enriched.shortAnswers = checkRes.shortAnswers;
      }

      // WordOrder
      if (Array.isArray(checkRes.wordOrderCorrectAnswers)) {
        enriched.wordOrderCorrectAnswers = checkRes.wordOrderCorrectAnswers;
      }
    }
  } catch (err) {
    if (err.message && err.message.startsWith('API_500')) {
      // Known Tak12 backend edge case (WordOrder / missing DB entry)
      enriched.needsManualReview = true;
    } else {
      console.warn(`[Enrich] Q#${rawQ.id} error: ${err.message}`);
    }
  }

  // Collect image URLs
  const allHtml = enriched.questionText + enriched.explanation + enriched.hint;
  const localImgRegex = /src=["'](\/images\/[^"']+)["']/g;
  let imgMatch;
  const imgSet = new Set();
  while ((imgMatch = localImgRegex.exec(allHtml)) !== null) {
    imgSet.add(imgMatch[1]);
  }
  enriched.images = Array.from(imgSet);

  return enriched;
}

// Concurrency queue runner
async function runConcurrent(items, workerFn, limit = CONCURRENCY) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const currentIndex = index++;
      try {
        const res = await workerFn(items[currentIndex], currentIndex);
        results[currentIndex] = res;
      } catch (err) {
        console.error(`[Worker] Error processing item ${currentIndex}:`, err.message);
        results[currentIndex] = null;
      }
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

// --- Main Pipeline Execution ---

async function main() {
  console.log('================================================================');
  console.log('🚀 TA12 Milestone 1 Data Ingestion Pipeline (Course Exam ID = 9)');
  console.log('================================================================\n');

  loadCheckpoint();
  console.log(`[Checkpoint] ${checkpoint.completedQuizIds.length} quizzes already marked completed.`);

  // CLI Flags: --limit-exams=N, --limit-study=N, --only-exams, --only-study, --only-sections
  const args = process.argv.slice(2);
  const getArgVal = (name) => {
    const found = args.find(a => a.startsWith(`--${name}=`));
    return found ? found.split('=')[1] : null;
  };
  const limitExams = getArgVal('limit-exams') ? parseInt(getArgVal('limit-exams'), 10) : null;
  const limitStudy = getArgVal('limit-study') ? parseInt(getArgVal('limit-study'), 10) : null;
  const onlyExams = args.includes('--only-exams');
  const onlyStudy = args.includes('--only-study');
  const onlySections = args.includes('--only-sections');

  // 1. Fetch categories for Exam ID = 9
  console.log('\n▶ Step 1: Discovering Exam 9 Categories...');
  const allCategories = await apiRequest('GetQuizCategoryByExamId?examId=9');
  console.log(`  ✓ Found ${allCategories.length} categories on Tak12 public API.`);

  // Filter 5 exam categories
  const examCatIds = [1097, 1687, 1489, 1263, 170];
  const examCategoriesMetadata = [
    {
      id: 1097,
      name: 'Đề thi chính thức/minh họa vào 10 môn Anh Sở Hà Nội qua các năm',
      shortName: 'Đề chính thức (2019-2026)',
      description: 'Tuyển tập 10 đề thi chính thức và đề thi minh họa vào lớp 10 của Sở GD&ĐT Hà Nội'
    },
    {
      id: 1687,
      name: 'Đề thi môn Anh điều kiện các trường THPT Chuyên tại Hà Nội',
      shortName: 'Đề THPT Chuyên điều kiện',
      description: 'Đề thi điều kiện tiếng Anh vào các trường THPT Chuyên (KHTN, KHXH&NV, Sư Phạm...)'
    },
    {
      id: 1489,
      name: 'Đề thi thử vào 10 môn Anh của các đơn vị GD tại Hà Nội',
      shortName: 'Đề đơn vị GD Hà Nội',
      description: 'Đề thi khảo sát và thi thử chất lượng từ các phòng GD&ĐT quận/huyện tại Hà Nội'
    },
    {
      id: 1263,
      name: 'Đề luyện thi vào 10 môn Anh Sở Hà Nội theo chương trình mới',
      shortName: 'Đề theo chương trình mới',
      description: 'Bộ đề luyện thi bám sát cấu trúc định dạng đề thi mới nhất của Bộ và Sở GD&ĐT Hà Nội'
    },
    {
      id: 170,
      name: 'Đề luyện thi vào 10 môn Anh Sở Hà Nội từ năm 2024 trở về trước',
      shortName: 'Đề luyện thi chuẩn cấu trúc',
      description: 'Ngân hàng đề ôn thi tổng hợp bám sát cấu trúc thi chuẩn môn Tiếng Anh vào 10 Hà Nội'
    }
  ];

  // 2. Process Exam Categories and Catalog
  console.log('\n▶ Step 2: Extracting Exam Catalogs...');
  const examMap = new Map(); // id -> metadata
  const categoryExamsMap = new Map();

  for (const catMeta of examCategoriesMetadata) {
    const catId = catMeta.id;
    const catQuizzesData = await apiRequest(`GetQuizByCategory?quizCategoryId=${catId}&maxResultCount=100`);
    const quizItems = catQuizzesData.items || [];
    console.log(`  ✓ Category ${catId} (${catMeta.shortName}): ${quizItems.length} exams`);

    catMeta.examCount = quizItems.length;

    const formattedList = quizItems.map(q => {
      const year = extractYear(q.quizName);
      const cleanTitle = sanitizeBrand(decodeHtmlEntities(q.quizName));
      const examItem = {
        id: q.id,
        quizName: cleanTitle,
        title: cleanTitle,
        year,
        categoryId: catId,
        categoryName: catMeta.name,
        timeLimit: q.timeLimit && q.timeLimit > 0 ? q.timeLimit : 60,
        questionCount: q.questionCount || 0,
        totalPoint: q.totalPoint || 10,
        description: sanitizeBrand(decodeHtmlEntities(q.description || '')),
        isPremium: Boolean(q.isPremium)
      };
      examMap.set(q.id, examItem);
      return examItem;
    });

    categoryExamsMap.set(catId, formattedList);
    fs.writeFileSync(
      path.join(EXAMS_DIR, `category_${catId}.json`),
      JSON.stringify(formattedList, null, 2),
      'utf8'
    );
  }

  // Save data/exams/categories.json
  fs.writeFileSync(
    path.join(EXAMS_DIR, 'categories.json'),
    JSON.stringify(examCategoriesMetadata, null, 2),
    'utf8'
  );
  console.log('  ✓ Saved data/exams/categories.json');

  // 3. Process Exam Bundles with Questions & Explanations
  if (!onlyStudy && !onlySections) {
    console.log('\n▶ Step 3: Ingesting Exam Bundles (100% Cat 1097, 1687, 1489, 1263, 170)...');
    let allExamItems = Array.from(examMap.values());
    if (limitExams) {
      console.log(`  [Notice] Limiting to first ${limitExams} exams as requested.`);
      allExamItems = allExamItems.slice(0, limitExams);
    }
    let processedExamCount = 0;

    for (const examItem of allExamItems) {
    const bundlePath = path.join(BUNDLES_DIR, `${examItem.id}.json`);
    const isCompleted = checkpoint.completedQuizIds.includes(examItem.id) && fs.existsSync(bundlePath);

    if (isCompleted) {
      processedExamCount++;
      process.stdout.write(`\r  [Cached] Exam ${processedExamCount}/${allExamItems.length} (ID: ${examItem.id}): ${examItem.title.substring(0, 45)}...`);
      continue;
    }

    try {
      const rawQuestions = await apiRequest(`GetQuestionByQuiz?quizId=${examItem.id}`);
      if (!Array.isArray(rawQuestions)) {
        console.warn(`\n  ⚠️ Exam ${examItem.id} returned non-array questions`);
        continue;
      }

      // Map parent questions for passage lookup
      const parentMap = new Map();
      rawQuestions.forEach(q => parentMap.set(q.id, q));

      // Enrich all questions concurrently with throttle
      const enrichedQuestions = await runConcurrent(rawQuestions, async (q, idx) => {
        const enriched = await enrichQuestion(q);
        enriched.questionNumber = idx + 1;

        // If child of a Description passage, link passageText
        if (enriched.parentQuestionId && enriched.parentQuestionId > 0) {
          const parentQ = parentMap.get(enriched.parentQuestionId);
          if (parentQ) {
            enriched.passageText = sanitizeBrand(await downloadAndRewriteImages(parentQ.questionText || ''));
          }
        }
        return enriched;
      }, CONCURRENCY);

      const validQuestions = enrichedQuestions.filter(Boolean);

      const examBundle = {
        id: examItem.id,
        title: examItem.title,
        year: examItem.year,
        categoryId: examItem.categoryId,
        categoryName: examItem.categoryName,
        timeLimit: examItem.timeLimit,
        totalPoint: examItem.totalPoint,
        questionCount: validQuestions.length,
        author: 'Tổ GV Tiếng Anh - TA12',
        description: examItem.description,
        createdAt: new Date().toISOString(),
        questions: validQuestions
      };

      fs.writeFileSync(bundlePath, JSON.stringify(examBundle, null, 2), 'utf8');
      saveCheckpoint(examItem.id);
      processedExamCount++;

      process.stdout.write(`\r  [Saved] Exam ${processedExamCount}/${allExamItems.length} (ID: ${examItem.id}): ${examItem.title.substring(0, 45)}...`);
    } catch (err) {
      console.error(`\n  ❌ Failed to ingest exam bundle ${examItem.id}:`, err.message);
    }
  }
  console.log(`\n  ✓ Completed all ${allExamItems.length} exams.`);
}

  // 4. Index Exam Questions into 10 Canonical Section Banks (Luyện từng phần)
  if (!onlyStudy) {
    console.log('\n▶ Step 4: Indexing Questions into 10 Section Banks...');
  const sectionDefinitions = [
    {
      sectionId: 'pronunciation',
      sectionName: 'Phát âm (Pronunciation)',
      description: 'Luyện tập phát âm đuôi -ed, -s/es, các nguyên âm và phụ âm thường gặp trong đề thi vào 10 Hà Nội',
      icon: 'volume-2'
    },
    {
      sectionId: 'stress',
      sectionName: 'Trọng âm (Word Stress)',
      description: 'Luyện tập quy tắc trọng âm từ 2 âm tiết và 3 âm tiết chuẩn cấu trúc thi',
      icon: 'sparkles'
    },
    {
      sectionId: 'error_identification',
      sectionName: 'Tìm lỗi sai (Error Identification)',
      description: 'Nhận diện lỗi sai về thì của động từ, đại từ quan hệ, sự hòa hợp chủ - vị và ngữ pháp trọng tâm',
      icon: 'alert-circle'
    },
    {
      sectionId: 'communicative_functions',
      sectionName: 'Chức năng giao tiếp (Communicative Exchanges)',
      description: 'Đáp lại lời khen, lời mời, lời đề nghị, cảm ơn và các tình huống giao tiếp thường ngày',
      icon: 'message-circle'
    },
    {
      sectionId: 'sign_notices',
      sectionName: 'Đọc hiểu biển báo & Thông báo (Signs & Notices)',
      description: 'Dạng bài mới nhận diện ý nghĩa biển báo công cộng, thông báo trường học và tờ rơi',
      icon: 'info'
    },
    {
      sectionId: 'grammar_vocab_cloze',
      sectionName: 'Trắc nghiệm Ngữ pháp & Từ vựng (Grammar & Vocab)',
      description: 'Câu hỏi trắc nghiệm đơn lẻ về từ vựng, từ đồng nghĩa/trái nghĩa, cụm động từ và thì ngữ pháp',
      icon: 'book-open'
    },
    {
      sectionId: 'guided_cloze',
      sectionName: 'Điền từ vào đoạn văn (Guided Cloze)',
      description: 'Điền liên từ, mạo từ, đại từ quan hệ và giới từ thích hợp vào các chỗ trống trong đoạn văn',
      icon: 'edit-3'
    },
    {
      sectionId: 'reading_comprehension',
      sectionName: 'Đọc hiểu văn bản (Reading Comprehension)',
      description: 'Đọc hiểu các chủ đề đời sống, môi trường, công nghệ và trả lời câu hỏi tìm ý chính, chi tiết',
      icon: 'file-text'
    },
    {
      sectionId: 'sentence_transformation',
      sectionName: 'Viết lại câu đồng nghĩa (Sentence Transformation)',
      description: 'Chuyển đổi câu bị động, câu điều kiện, câu tường thuật, so sánh và cấu trúc tương đương',
      icon: 'repeat'
    },
    {
      sectionId: 'sentence_combination',
      sectionName: 'Kết hợp & Sắp xếp câu (Sentence Combination)',
      description: 'Kết hợp hai câu đơn thành một câu phức và sắp xếp lại các từ xáo trộn để tạo câu hoàn chỉnh',
      icon: 'layers'
    }
  ];

  const sectionBuckets = new Map();
  sectionDefinitions.forEach(s => {
    sectionBuckets.set(s.sectionId, {
      ...s,
      totalQuestions: 0,
      examSourceIds: new Set(),
      questions: []
    });
  });

  // Read all bundle files in data/exams/bundles/
  const bundleFiles = fs.readdirSync(BUNDLES_DIR).filter(f => f.endsWith('.json'));
  for (const bFile of bundleFiles) {
    try {
      const bundle = JSON.parse(fs.readFileSync(path.join(BUNDLES_DIR, bFile), 'utf8'));
      const parentMap = new Map();
      bundle.questions.forEach(q => parentMap.set(q.id, q));

      for (const q of bundle.questions) {
        if (q.questionType === 'Description') continue;

        const parentQ = q.parentQuestionId ? parentMap.get(q.parentQuestionId) : null;
        const sectionId = classifyQuestion(q, parentQ);

        const bucket = sectionBuckets.get(sectionId) || sectionBuckets.get('grammar_vocab_cloze');
        bucket.questions.push({
          ...q,
          sourceExamId: bundle.id,
          sourceExamName: bundle.title,
          year: bundle.year
        });
        bucket.examSourceIds.add(bundle.id);
      }
    } catch (e) {
      console.warn(`[Sections] Error reading bundle ${bFile}:`, e.message);
    }
  }

  // Save each section bank
  const sectionSummaryList = [];
  for (const [secId, bucket] of sectionBuckets.entries()) {
    bucket.totalQuestions = bucket.questions.length;
    bucket.examSourceIds = Array.from(bucket.examSourceIds);

    fs.writeFileSync(
      path.join(SECTIONS_DIR, `${secId}.json`),
      JSON.stringify(bucket, null, 2),
      'utf8'
    );

    console.log(`  ✓ Section ${secId.padEnd(25)}: ${bucket.totalQuestions.toString().padStart(4)} questions (from ${bucket.examSourceIds.length} exams)`);

    sectionSummaryList.push({
      sectionId: bucket.sectionId,
      sectionName: bucket.sectionName,
      description: bucket.description,
      icon: bucket.icon,
      totalQuestions: bucket.totalQuestions,
      examCount: bucket.examSourceIds.length
    });
  }

    // Save data/sections/index.json
    fs.writeFileSync(
      path.join(SECTIONS_DIR, 'index.json'),
      JSON.stringify(sectionSummaryList, null, 2),
      'utf8'
    );
    console.log('  ✓ Saved data/sections/index.json');
  }

  // 5. Ingest Học Ôn Study Modules (Cat 44 Vocab & Cat 240 Grammar)
  if (!onlyExams && !onlySections) {
    console.log('\n▶ Step 5: Ingesting Học Ôn Study Modules (Cat 44 & 240)...');
    const studyCategories = [
      {
        id: 44,
        type: 'vocabulary',
        name: 'Ôn luyện Từ vựng thi vào 10 môn Anh Sở Hà Nội',
        theoriesDir: THEORIES_VOCAB_DIR,
        questionsDir: QUESTIONS_VOCAB_DIR,
        prefix: 'vocab'
      },
      {
        id: 240,
        type: 'grammar',
        name: 'Ôn luyện Ngữ pháp thi vào 10 môn Anh Sở Hà Nội',
        theoriesDir: THEORIES_GRAMMAR_DIR,
        questionsDir: QUESTIONS_GRAMMAR_DIR,
        prefix: 'grammar'
      }
    ];

    for (const studyCat of studyCategories) {
      console.log(`\n  Ingesting ${studyCat.name} (Cat ${studyCat.id})...`);
      const catData = await apiRequest(`GetQuizByCategory?quizCategoryId=${studyCat.id}&maxResultCount=100`);
      let quizList = catData.items || [];
      if (limitStudy) {
        console.log(`  [Notice] Limiting ${studyCat.type} to first ${limitStudy} sets as requested.`);
        quizList = quizList.slice(0, limitStudy);
      }
      console.log(`  ✓ Found ${quizList.length} sets for ${studyCat.type}`);

    const indexItems = [];
    let count = 0;

    for (const quiz of quizList) {
      const qzId = quiz.id;
      const cleanTitle = sanitizeBrand(decodeHtmlEntities(quiz.quizName));
      const theoryFile = path.join(studyCat.theoriesDir, `${studyCat.prefix}_${qzId}.json`);
      const questionsFile = path.join(studyCat.questionsDir, `${studyCat.prefix}_${qzId}.json`);

      indexItems.push({
        id: qzId,
        title: cleanTitle,
        type: studyCat.type,
        questionCount: quiz.questionCount || 0
      });

      const isCompleted = checkpoint.completedQuizIds.includes(qzId) && fs.existsSync(theoryFile) && fs.existsSync(questionsFile);
      if (isCompleted) {
        count++;
        process.stdout.write(`\r  [Cached] ${studyCat.type} ${count}/${quizList.length} (ID: ${qzId})...`);
        continue;
      }

      try {
        const rawQs = await apiRequest(`GetQuestionByQuiz?quizId=${qzId}`);
        if (!Array.isArray(rawQs)) continue;

        // Split into theory lessons and practice questions
        const lessonItems = [];
        const practiceQuestionsRaw = [];

        for (const q of rawQs) {
          if (q.questionTypeName === 'Description') {
            const content = sanitizeBrand(await downloadAndRewriteImages(q.questionText || ''));
            // Check for iframe embed
            const embedMatch = content.match(/<iframe[^>]+src=["']([^"']+)["']/i);
            lessonItems.push({
              order: lessonItems.length + 1,
              title: sanitizeBrand(decodeHtmlEntities(q.questionName || `Bài học ${lessonItems.length + 1}`)),
              contentHtml: content,
              embedUrl: embedMatch ? embedMatch[1] : null
            });
          } else {
            practiceQuestionsRaw.push(q);
          }
        }

        // Enrich practice questions
        const enrichedPractice = await runConcurrent(practiceQuestionsRaw, async (q, idx) => {
          const eq = await enrichQuestion(q);
          eq.questionNumber = idx + 1;
          return eq;
        }, CONCURRENCY);

        // Save theory
        const theoryData = {
          quizId: qzId,
          title: cleanTitle,
          type: studyCat.type,
          lessons: lessonItems
        };
        fs.writeFileSync(theoryFile, JSON.stringify(theoryData, null, 2), 'utf8');

        // Save practice questions
        const questionsData = {
          quizId: qzId,
          title: cleanTitle,
          totalQuestions: enrichedPractice.length,
          questions: enrichedPractice.filter(Boolean)
        };
        fs.writeFileSync(questionsFile, JSON.stringify(questionsData, null, 2), 'utf8');

        saveCheckpoint(qzId);
        count++;
        process.stdout.write(`\r  [Saved] ${studyCat.type} ${count}/${quizList.length} (ID: ${qzId}): ${cleanTitle.substring(0, 40)}...`);
      } catch (err) {
        console.error(`\n  ❌ Error on ${studyCat.type} quiz ${qzId}:`, err.message);
      }
    }

    // Save study index inside subdirectory to avoid colliding with data/theories/*.json root files
    fs.writeFileSync(
      path.join(studyCat.theoriesDir, 'index.json'),
      JSON.stringify(indexItems, null, 2),
      'utf8'
    );
    console.log(`\n  ✓ Saved ${studyCat.type} index.json (${indexItems.length} units).`);
  }
}

  console.log('\n================================================================');
  console.log('✅ Milestone 1 Data Ingestion Pipeline Finished Successfully!');
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('\n❌ Fatal error in data ingestion pipeline:', err);
  process.exit(1);
});
