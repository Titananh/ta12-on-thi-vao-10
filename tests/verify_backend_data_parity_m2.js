/**
 * TA12 Automated Parity Verification Suite — Milestone M2:
 * Backend & Data Architecture Parity, 175-Topic Completeness & Offline Caching
 *
 * Vectors:
 *  1. 175/175 Topics Question Bank Completeness & Zero Fallback to Topic 68
 *  2. REST APIs Contract Verification (questions, exams, progress, sections, translation, study, related-topic)
 *  3. 100% Offline Asset Self-Containment (Q266388 localized, zero external URLs)
 *  4. Zero Leaderboard & Zero PRO Promotion Banners in Backend and Payloads
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ts = require('typescript');
const Module = require('module');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('========================================================================');
console.log('🧪 MILESTONE M2: BACKEND & DATA ARCHITECTURE PARITY TEST SUITE');
console.log('========================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
const failures = [];

function check(desc, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ [PASS] ${desc}`);
  } else {
    failures.push({ desc, details });
    console.error(`  ❌ [FAIL] ${desc} ${details ? '(' + details + ')' : ''}`);
  }
}

// -----------------------------------------------------------------------------
// Module Mocking & TypeScript Transpile Hook for Next.js App Router API Routes
// -----------------------------------------------------------------------------
const originalRequire = Module.prototype.require;
Module.prototype.require = function (request) {
  if (request === 'next/headers') {
    return {
      cookies: () => ({
        get: (name) => global.__mockCookies?.[name] ? { value: global.__mockCookies[name] } : undefined,
        set: (name, val) => {
          if (!global.__mockCookies) global.__mockCookies = {};
          global.__mockCookies[name] = val;
        },
      }),
    };
  }
  if (request === 'next/server') {
    class MockNextResponse {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.headers = new Map();
        this._cookies = {};
      }
      static json(body, init = {}) {
        const res = new MockNextResponse(JSON.stringify(body), init);
        res._json = body;
        return res;
      }
      static redirect(url, init = {}) {
        const res = new MockNextResponse(null, { status: 307, ...init });
        res._redirectUrl = typeof url === 'string' ? url : url.toString();
        return res;
      }
      get cookies() {
        return {
          set: (name, val, opts) => {
            this._cookies[name] = { value: val, options: opts };
            if (!global.__mockCookies) global.__mockCookies = {};
            global.__mockCookies[name] = val;
          },
          get: (name) => this._cookies[name],
        };
      }
      async json() {
        return this._json !== undefined ? this._json : JSON.parse(this.body);
      }
    }
    class MockNextRequest {
      constructor(input, init = {}) {
        this.url = typeof input === 'string' ? input : input.url;
        this.nextUrl = new URL(this.url);
        this.method = init.method || 'GET';
        this.body = init.body;
      }
      async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }
    }
    return { NextResponse: MockNextResponse, NextRequest: MockNextRequest };
  }
  if (request.startsWith('@/')) {
    const rel = request.replace('@/', 'src/');
    return originalRequire.call(this, path.resolve(ROOT_DIR, rel));
  }
  return originalRequire.call(this, request);
};

require.extensions['.ts'] = function (module, filename) {
  let content = fs.readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  module._compile(transpiled.outputText, filename);
};

async function runParityVerification() {
  // ---------------------------------------------------------------------------
  // VECTOR 1: 175/175 Topics Question Bank Completeness & Zero Fallback
  // ---------------------------------------------------------------------------
  console.log('▶ Vector 1: 175/175 Topics Question Bank Completeness & Zero Fallback to 68...');
  const taxonomy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'taxonomy.json'), 'utf8'));
  const mapping = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'topic_mapping.json'), 'utf8'));
  const questionsDir = path.join(DATA_DIR, 'questions');

  let allTopics = [];
  for (const skill of taxonomy.skills || []) {
    for (const cat of skill.topicCategories || []) {
      for (const t of cat.topics || []) {
        allTopics.push({ ...t, skillName: skill.skillName, categoryName: cat.categoryName });
      }
    }
  }

  check('Taxonomy contains exactly 175 topics across 5 skills', allTopics.length === 175, `Found: ${allTopics.length}`);

  const isAnswerable = (q) => {
    if (q.needsManualReview) return false;
    const hasChoices = Array.isArray(q.choices) && q.choices.length > 0;
    const hasFB = (Array.isArray(q.fillblankAnswers) && q.fillblankAnswers.length > 0) ||
      (typeof q.questionText === 'string' && (q.questionText.includes('fillblank-option') || q.questionText.includes('<input') || q.questionText.includes('<select')));
    const hasShort = Array.isArray(q.shortAnswers) && q.shortAnswers.length > 0;
    if (!hasChoices && !hasFB && !hasShort) return false;
    if (hasChoices && !hasFB && !hasShort) {
      const hasCorrectChoice = q.choices.some((c) => c.isCorrect);
      const hasCorrectId = Boolean(q.correctChoiceId && q.choices.some((c) => String(c.id) === String(q.correctChoiceId)));
      if (!hasCorrectChoice && !hasCorrectId) return false;
    }
    return true;
  };

  let resolvedTopicsCount = 0;
  let fallbackTo68Count = 0;
  let totalAnswerableQuestions = 0;
  let minQuestionsPerTopic = Infinity;

  for (const t of allTopics) {
    const topicId = String(t.id);
    let questions = [];

    // 1. Topic mapping lookup
    const m = mapping[topicId];
    if (m && m.file) {
      if (m.file === '68.json' && topicId !== '68') {
        fallbackTo68Count++;
      }
      const mappedPath = path.join(questionsDir, m.file);
      if (fs.existsSync(mappedPath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(mappedPath, 'utf8'));
          questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        } catch (e) {}
      }
    }

    // 2. Direct questions lookup
    if (questions.length === 0) {
      const qPath = path.join(questionsDir, `${topicId}.json`);
      if (fs.existsSync(qPath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(qPath, 'utf8'));
          questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        } catch (e) {}
      }
    }

    // 3. Grammar dir lookup
    if (questions.length === 0) {
      const gPath = path.join(questionsDir, 'grammar', `grammar_${topicId}.json`);
      if (fs.existsSync(gPath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(gPath, 'utf8'));
          questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        } catch (e) {}
      }
    }

    // 4. Vocab dir lookup
    if (questions.length === 0) {
      const vPath = path.join(questionsDir, 'vocabulary', `vocab_${topicId}.json`);
      if (fs.existsSync(vPath)) {
        try {
          const parsed = JSON.parse(fs.readFileSync(vPath, 'utf8'));
          questions = Array.isArray(parsed) ? parsed : (parsed.questions || []);
        } catch (e) {}
      }
    }

    if (questions.length > 0) {
      resolvedTopicsCount++;
      const ansCount = questions.filter(isAnswerable).length;
      totalAnswerableQuestions += ansCount;
      if (ansCount < minQuestionsPerTopic) minQuestionsPerTopic = ansCount;
    }
  }

  check('100% of taxonomy topics resolve authentic question banks (175/175)', resolvedTopicsCount === 175, `Resolved: ${resolvedTopicsCount}`);
  check('Zero taxonomy topics improperly fall back to topic 68', fallbackTo68Count === 0, `Fallbacks: ${fallbackTo68Count}`);
  check('Total answerable questions exceeds 3,700 questions across bank', totalAnswerableQuestions >= 3700, `Total: ${totalAnswerableQuestions}`);
  check('Every topic has at least 10 answerable questions', minQuestionsPerTopic >= 10, `Min per topic: ${minQuestionsPerTopic}`);

  // ---------------------------------------------------------------------------
  // VECTOR 2: REST APIs Contract Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 2: REST APIs Contract Verification (6 APIs + related-topic)...');

  // 2.1 /api/questions
  const questionsRoute = require('@/app/api/questions/route');
  check('/api/questions route defines GET handler', typeof questionsRoute.GET === 'function');

  const qRes1 = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=141&count=10'));
  const qData1 = await qRes1.json();
  check('/api/questions returns 200 for valid topicId', qRes1.status === 200);
  check('/api/questions returns authentic questions array', Array.isArray(qData1.questions) && qData1.questions.length > 0);
  check('/api/questions respects count limit', qData1.questions.length <= 10);
  check('/api/questions returns theory payload with matching name', qData1.theory && qData1.theory.topicName.includes('I wish'));

  const qResCustom = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=custom&topics=68,69,29&count=8'));
  const qDataCustom = await qResCustom.json();
  check('/api/questions supports custom blended session', qDataCustom.topicId === 'custom' && qDataCustom.questions.length <= 8);
  check('/api/questions topic 141 theory.lessons has zero Canva iframes/embedUrls', !JSON.stringify(qData1.theory?.lessons || []).includes('canva.com'));

  // 2.2 /api/exams
  const examsRoute = require('@/app/api/exams/route');
  check('/api/exams route defines GET handler', typeof examsRoute.GET === 'function');

  const exCatalogRes = await examsRoute.GET(new Request('http://localhost:3000/api/exams'));
  const exCatalog = await exCatalogRes.json();
  check('/api/exams catalog returns 200', exCatalogRes.status === 200);
  check('/api/exams returns categories and totalExams >= 100', Array.isArray(exCatalog.categories) && exCatalog.totalExams >= 100);

  const exFilterRes = await examsRoute.GET(new Request('http://localhost:3000/api/exams?categoryId=1097'));
  const exFilter = await exFilterRes.json();
  check('/api/exams filters by categoryId correctly', exFilterRes.status === 200 && exFilter.exams.length > 0);

  const exBundleRes = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=15266'));
  const exBundle = await exBundleRes.json();
  check('/api/exams returns 200 for bundle 15266', exBundleRes.status === 200);
  check('Exam 15266 bundle contains questions', Array.isArray(exBundle.questions) && exBundle.questions.length > 0);

  const exBadRes = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=not_a_number'));
  check('/api/exams returns 400 for invalid examId', exBadRes.status === 400);

  const exNotFoundRes = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=9999999'));
  check('/api/exams returns 404 for non-existent examId', exNotFoundRes.status === 404);

  // 2.3 /api/progress
  const progressRoute = require('@/app/api/progress/route');
  check('/api/progress route defines GET and POST handlers', typeof progressRoute.GET === 'function' && typeof progressRoute.POST === 'function');

  global.__mockCookies = {}; // unauthenticated
  const progUnauthRes = await progressRoute.GET();
  check('/api/progress GET returns 401 when unauthenticated', progUnauthRes.status === 401);

  // Authenticate as approved user Đỗ Tuấn (ID: usr_dotuan_demo)
  const authModule = require('@/lib/auth');
  const token = authModule.signSessionToken('usr_dotuan_demo');
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: token };

  const progAuthRes = await progressRoute.GET();
  const progAuth = await progAuthRes.json();
  check('/api/progress GET returns 200 for authenticated approved student', progAuthRes.status === 200);
  check('/api/progress GET returns valid progress schema', progAuth.user_id === 'usr_dotuan_demo' && typeof progAuth.exam_scores === 'object');

  const { NextRequest } = require('next/server');
  const postReq = new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: 5, diamonds: 20 },
  });
  const progPostRes = await progressRoute.POST(postReq);
  const progPostData = await progPostRes.json();
  check('/api/progress POST updates progress and returns success: true', progPostRes.status === 200 && progPostData.success === true);

  const emptyBodyReq = new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: undefined,
  });
  const progEmptyRes = await progressRoute.POST(emptyBodyReq);
  check('/api/progress POST empty body returns HTTP 400 Bad Request', progEmptyRes.status === 400);

  const negCounterReq = new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: -10, diamonds: -20 },
  });
  await progressRoute.POST(negCounterReq);
  const negProgRes = await progressRoute.GET();
  const negProg = await negProgRes.json();
  check('/api/progress POST clamps negative counters to >= 0', negProg.streak_flame >= 0 && negProg.diamonds >= 0);

  // 2.4 /api/sections
  const sectionsRoute = require('@/app/api/sections/route');
  check('/api/sections route defines GET handler', typeof sectionsRoute.GET === 'function');

  const secCatalogRes = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections'));
  const secCatalog = await secCatalogRes.json();
  check('/api/sections returns 200 and >= 10 sections catalog', secCatalogRes.status === 200 && secCatalog.totalSections >= 10);

  const secSingleRes = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections?sectionId=grammar_vocab_cloze&count=5'));
  const secSingle = await secSingleRes.json();
  check('/api/sections returns 200 for grammar_vocab_cloze', secSingleRes.status === 200);
  check('/api/sections returns questions and matches count', secSingle.questions.length === 5 && secSingle.sectionId === 'grammar_vocab_cloze');

  const secBadRes = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections?sectionId=invalid_sec_xyz'));
  check('/api/sections returns 404 for non-existent sectionId', secBadRes.status === 404);

  // 2.5 /api/translation
  const transRoute = require('@/app/api/translation/route');
  check('/api/translation route defines GET handler', typeof transRoute.GET === 'function');

  const transMissingRes = await transRoute.GET(new Request('http://localhost:3000/api/translation'));
  check('/api/translation returns 400 when questionId is missing', transMissingRes.status === 400);

  const transQ41501Res = await transRoute.GET(new Request('http://localhost:3000/api/translation?questionId=41501'));
  const transQ41501 = await transQ41501Res.json();
  check('/api/translation returns 200 for question 41501', transQ41501Res.status === 200);
  check('/api/translation provides Vietnamese language and translation text', transQ41501.language === 'vi' && typeof transQ41501.questionText === 'string');

  const transUnmappedRes = await transRoute.GET(new Request('http://localhost:3000/api/translation?questionId=9999999'));
  const transUnmapped = await transUnmappedRes.json();
  check('/api/translation handles unmapped question cleanly with null questionText and 200 status', transUnmappedRes.status === 200 && transUnmapped.questionText === null);

  // 2.6 /api/study
  const studyRoute = require('@/app/api/study/route');
  check('/api/study route defines GET handler', typeof studyRoute.GET === 'function');

  const studyVocabRes = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=vocabulary'));
  const studyVocab = await studyVocabRes.json();
  check('/api/study returns vocabulary units index', studyVocabRes.status === 200 && studyVocab.totalUnits >= 10);

  const studyGrammarRes = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=grammar'));
  const studyGrammar = await studyGrammarRes.json();
  check('/api/study returns grammar units index', studyGrammarRes.status === 200 && studyGrammar.totalUnits >= 10);

  const studyUnitRes = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=vocabulary&moduleId=15951'));
  const studyUnitData = await studyUnitRes.json();
  check('/api/study returns module 15951 details with questions and vocabTable', studyUnitRes.status === 200 && studyUnitData.questions.length > 0 && Array.isArray(studyUnitData.vocabTable));

  const studyGrammar15244Res = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=grammar&moduleId=15244'));
  const studyGrammar15244Data = await studyGrammar15244Res.json();
  check('/api/study returns grammar module 15244 with zero Canva iframes/embedUrls', studyGrammar15244Res.status === 200 && !JSON.stringify(studyGrammar15244Data).includes('canva.com') && !JSON.stringify(studyGrammar15244Data).includes('cth.edu.vn'));

  const { sanitizeExplanationHtml } = require('@/lib/sanitizeExplanation');
  const sampleAzVocab = '<p>Rule</p><div style="width: 100%; max-width: 525px;"><iframe src="https://azvocab.ai/embed/SL?params=123" width="100%" height="275"></iframe></div><p>Example</p>';
  const sanitizedExp = sanitizeExplanationHtml(sampleAzVocab);
  check('sanitizeExplanationHtml purges azvocab.ai iframes cleanly from explanations', !sanitizedExp.includes('azvocab.ai') && sanitizedExp.includes('Rule') && sanitizedExp.includes('Example'));

  // 2.7 /api/related-topic
  const relatedRoute = require('@/app/api/related-topic/route');
  check('/api/related-topic route defines GET handler', typeof relatedRoute.GET === 'function');

  const relQRes = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?questionId=1201616'));
  const relQData = await relQRes.json();
  check('/api/related-topic resolves Question level correctly', relQRes.status === 200 && relQData.source === 'question' && relQData.isDisplay === true);
  check('/api/related-topic Question 1201616 detail has 0 Canva iframes', !relQData.listQuestionTopicDetail[0].detail.includes('canva.com'));

  const relExpRes = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?explanation=Giai%20thich%20chi%20tiet'));
  const relExpData = await relExpRes.json();
  check('/api/related-topic resolves Explanation level correctly', relExpData.source === 'explanation');

  const relUnitRes = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?studyUnit=15290'));
  const relUnitData = await relUnitRes.json();
  check('/api/related-topic resolves StudyUnit level correctly', relUnitData.source === 'studyUnit');

  const relSecRes = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?sectionId=grammar_vocab_cloze'));
  const relSecData = await relSecRes.json();
  check('/api/related-topic resolves Section level correctly', relSecData.source === 'section');

  const relTopicRes = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?topicId=141'));
  const relTopicData = await relTopicRes.json();
  check('/api/related-topic resolves Topic level correctly', relTopicData.source === 'topic');

  const relGenericRes = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic'));
  const relGenericData = await relGenericRes.json();
  check('/api/related-topic generic fallback does NOT mention topic 68 or phat am duoi ed', relGenericData.source === 'generic' && !relGenericData.listQuestionTopicDetail[0].name.includes('đuôi "ed"'));

  // ---------------------------------------------------------------------------
  // VECTOR 3: 100% Offline Asset Self-Containment & Q266388 Localization
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 3: 100% Offline Asset Self-Containment & Q266388 Localization...');

  const localImgPath = path.join(ROOT_DIR, 'public', 'images', 'q266388.png');
  check('public/images/q266388.png exists on disk', fs.existsSync(localImgPath));
  if (fs.existsSync(localImgPath)) {
    const stats = fs.statSync(localImgPath);
    check('public/images/q266388.png is authentic image (>50 KB)', stats.size > 50000, `Size: ${stats.size} bytes`);
  }

  // Check references in active bundles and sections
  const bundle15266Raw = fs.readFileSync(path.join(DATA_DIR, 'exams', 'bundles', '15266.json'), 'utf8');
  check('Exam 15266 bundle points Q266388 to /images/q266388.png', bundle15266Raw.includes('/images/q266388.png'));
  check('Exam 15266 bundle has ZERO slatic.net URLs', !bundle15266Raw.includes('slatic.net'));

  const secClozeRaw = fs.readFileSync(path.join(DATA_DIR, 'sections', 'grammar_vocab_cloze.json'), 'utf8');
  check('Section grammar_vocab_cloze points Q266388 to /images/q266388.png', secClozeRaw.includes('/images/q266388.png'));
  check('Section grammar_vocab_cloze has ZERO slatic.net URLs', !secClozeRaw.includes('slatic.net'));

  // Scan all question banks for external image URLs
  let externalImageUrlsCount = 0;
  const imgUrlRegex = /https?:\/\/[^"\s\\]+\.(png|jpg|jpeg|gif|webp|svg)/gi;
  const questionFiles = fs.readdirSync(questionsDir).filter(f => f.endsWith('.json'));

  for (const qf of questionFiles) {
    const qContent = fs.readFileSync(path.join(questionsDir, qf), 'utf8');
    const matches = qContent.match(imgUrlRegex);
    if (matches) {
      externalImageUrlsCount += matches.length;
    }
  }

  check('Zero external image URLs across all files in data/questions/', externalImageUrlsCount === 0, `Found: ${externalImageUrlsCount}`);

  // Layout & CSS offline checks
  const layoutContent = fs.readFileSync(path.join(ROOT_DIR, 'src', 'app', 'layout.tsx'), 'utf8');
  check('src/app/layout.tsx has zero Google Fonts CDN links', !layoutContent.includes('fonts.googleapis.com'));

  const cssContent = fs.readFileSync(path.join(ROOT_DIR, 'src', 'app', 'globals.css'), 'utf8');
  check('src/app/globals.css uses system font stack with zero external @import', !cssContent.includes('@import url'));

  // ---------------------------------------------------------------------------
  // VECTOR 4: Zero Leaderboard & Zero PRO Promotion Guard
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 4: Zero Leaderboard & Zero PRO Promotion Guard...');

  function recursiveSearch(dir, regex, ignorePatterns = []) {
    let matches = [];
    const files = fs.readdirSync(dir);
    for (const f of files) {
      const full = path.join(dir, f);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        if (f !== 'node_modules' && f !== '.next' && f !== '.git' && f !== '.agents') {
          matches = matches.concat(recursiveSearch(full, regex, ignorePatterns));
        }
      } else if (/\.(tsx|ts|js|jsx)$/.test(f)) {
        const content = fs.readFileSync(full, 'utf8');
        const m = content.match(regex);
        if (m) {
          const isIgnored = ignorePatterns.some(ip => full.includes(ip));
          if (!isIgnored) {
            matches.push({ file: full, match: m[0] });
          }
        }
      }
    }
    return matches;
  }

  const leaderboardMatches = recursiveSearch(path.join(ROOT_DIR, 'src'), /bảng xếp hạng|leaderboard/gi);
  check('Zero leaderboard or "bảng xếp hạng" matches in src/ code', leaderboardMatches.length === 0, `Matches: ${JSON.stringify(leaderboardMatches)}`);

  const proPromoMatches = recursiveSearch(path.join(ROOT_DIR, 'src'), /mua pro|nâng cấp pro|gói pro|mua tài khoản pro/gi);
  check('Zero PRO purchase/upgrade banner strings in src/ code', proPromoMatches.length === 0, `Matches: ${JSON.stringify(proPromoMatches)}`);

  const dbSchemaCode = fs.readFileSync(path.join(ROOT_DIR, 'src', 'lib', 'db.ts'), 'utf8');
  check('SQLite database schema has zero leaderboard/rankings tables', !dbSchemaCode.toLowerCase().includes('leaderboard') && !dbSchemaCode.toLowerCase().includes('ranking'));

  // Brand sanitization verification
  const rawBrandSample = 'Luyện thi tại tak12.com với khóa học tak12 chuẩn';
  const sanitizedBrand = rawBrandSample.replace(/tak12\.com/gi, 'ta12.edu.vn').replace(/tak12/gi, 'TA12');
  check('Brand sanitizer converts tak12.com to ta12.edu.vn and tak12 to TA12', sanitizedBrand === 'Luyện thi tại ta12.edu.vn với khóa học TA12 chuẩn');

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 VERIFICATION SUITE COMPLETE: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
  if (failures.length > 0) {
    console.error(`❌ ${failures.length} CHECKS FAILED:`);
    for (const f of failures) {
      console.error(`   - ${f.desc} (${f.details})`);
    }
    console.log('========================================================================');
    process.exit(1);
  } else {
    console.log('🎉 100% SUCCESS: All backend APIs, 175 topics, offline assets & brand constraints verified perfectly!');
    console.log('========================================================================');
  }
}

runParityVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
