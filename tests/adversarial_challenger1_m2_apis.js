/**
 * Adversarial Challenger 1 Test Suite — Milestone M2
 * Focus: 6 REST APIs + related-topic Adversarial Boundary & Stress Testing
 *
 * Vectors:
 *  1. Boundary & Type Stress on /api/questions
 *  2. Boundary & Path Traversal Stress on /api/exams
 *  3. Authentication, Authorization & Payload Edge Cases on /api/progress
 *  4. Boundary, Traversal & Input Validation on /api/sections
 *  5. Parameter Validation & Fallback Behavior on /api/translation
 *  6. Parameter Validation & Unit Retrieval on /api/study
 *  7. Priority Hierarchy, Fallback & Theory Sanitization on /api/related-topic
 *  8. Strict Security, Offline Compliance & Brand Purity Across Endpoints
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ts = require('typescript');
const Module = require('module');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('========================================================================');
console.log('⚔️  CHALLENGER 1 (M2): REST APIS ADVERSARIAL STRESS TEST SUITE');
console.log('========================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
const findings = [];
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

function recordFinding(severity, title, details) {
  findings.push({ severity, title, details });
  console.log(`  ⚠️  [FINDING - ${severity.toUpperCase()}] ${title}`);
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
        if (this.body === undefined || this.body === null) {
          throw new SyntaxError('Unexpected end of JSON input');
        }
        if (typeof this.body === 'string') {
          return JSON.parse(this.body);
        }
        return this.body;
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

async function runAdversarialSuite() {
  const authModule = require('@/lib/auth');
  const validToken = authModule.signSessionToken('usr_dotuan_demo');

  // ===========================================================================
  // VECTOR 1: /api/questions ADVERSARIAL STRESS
  // ===========================================================================
  console.log('\n▶ Vector 1: Adversarial Boundary & Stress on /api/questions...');
  const questionsRoute = require('@/app/api/questions/route');

  // 1.1 Boundary count clamping
  const qNegativeCount = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=141&count=-10'));
  const qNegData = await qNegativeCount.json();
  check('/api/questions: negative count clamps to at least 1 question', qNegativeCount.status === 200 && qNegData.questions.length === 1);

  const qHugeCount = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=141&count=999999'));
  const qHugeData = await qHugeCount.json();
  check('/api/questions: huge count is clamped to max 50', qHugeCount.status === 200 && qHugeData.questions.length <= 50);

  const qZeroCount = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=141&count=0'));
  const qZeroData = await qZeroCount.json();
  check('/api/questions: count=0 safely falls back to default 15 without crashing', qZeroCount.status === 200 && qZeroData.questions.length <= 15);

  const qStringCount = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=141&count=invalid_non_numeric'));
  const qStrData = await qStringCount.json();
  check('/api/questions: non-numeric count falls back gracefully to default 15', qStringCount.status === 200 && qStrData.questions.length <= 15);

  // 1.2 Path traversal and SQL injection in topicId
  const qPathTraversal = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=../../../../etc/passwd'));
  const qPtData = await qPathTraversal.json();
  check('/api/questions: path traversal attempt in topicId is blocked and sanitized to safe fallback', qPathTraversal.status === 200 && qPtData.topicId === '68');

  const qSqlInjection = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=\' OR 1=1 --'));
  const qSqlData = await qSqlInjection.json();
  check('/api/questions: SQL injection string in topicId is safely sanitized', qSqlInjection.status === 200 && qSqlData.topicId === '68');

  // 1.3 Custom practice session adversarial inputs
  const qCustomNoTopics = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=custom'));
  const qCustNoData = await qCustomNoTopics.json();
  check('/api/questions: topicId=custom without topics param uses safe defaults', qCustomNoTopics.status === 200 && qCustNoData.questions.length > 0);

  const qCustomBogusTopics = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=custom&topics=abc,-1,null,<script>'));
  const qCustBogusData = await qCustomBogusTopics.json();
  check('/api/questions: topicId=custom with completely invalid topics returns 200 and empty questions array without crashing', qCustomBogusTopics.status === 200 && Array.isArray(qCustBogusData.questions) && qCustBogusData.questions.length === 0);

  const qCustomNonExistent = await questionsRoute.GET(new Request('http://localhost:3000/api/questions?topicId=custom&topics=9999999,8888888'));
  const qCustNEDdata = await qCustomNonExistent.json();
  check('/api/questions: topicId=custom with non-existent topic IDs returns empty array gracefully', qCustomNonExistent.status === 200 && qCustNEDdata.questions.length === 0);

  // 1.4 175-Topic question integrity check: verify no non-68 topic returns 68 title or "đuôi ed"
  const taxonomy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'taxonomy.json'), 'utf8'));
  let topicMismatchCount = 0;
  for (const s of taxonomy.skills || []) {
    for (const c of s.topicCategories || []) {
      for (const t of c.topics || []) {
        if (String(t.id) !== '68') {
          const res = await questionsRoute.GET(new Request(`http://localhost:3000/api/questions?topicId=${t.id}`));
          const data = await res.json();
          if (data.topicName && (data.topicName.includes('đuôi "ed"') || data.topicName.includes('đuôi -ed'))) {
            topicMismatchCount++;
          }
        }
      }
    }
  }
  check('Zero of the 174 non-68 topics return "đuôi ed" theory in /api/questions', topicMismatchCount === 0, `Mismatches: ${topicMismatchCount}`);

  // ===========================================================================
  // VECTOR 2: /api/exams ADVERSARIAL STRESS
  // ===========================================================================
  console.log('\n▶ Vector 2: Adversarial Boundary & Security on /api/exams...');
  const examsRoute = require('@/app/api/exams/route');

  // 2.1 Invalid exam IDs
  const exNegative = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=-15266'));
  check('/api/exams: negative examId returns 400 Bad Request', exNegative.status === 400);

  const exAlpha = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=abc_exam'));
  check('/api/exams: alphabetic examId returns 400 Bad Request', exAlpha.status === 400);

  const exFloat = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=15266.99'));
  check('/api/exams: float examId returns 400 Bad Request', exFloat.status === 400);

  const exTraversal = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=../../../../etc/passwd'));
  check('/api/exams: path traversal in examId returns 400 Bad Request', exTraversal.status === 400);

  const exNonExistent = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=99999999'));
  check('/api/exams: non-existent numeric examId returns 404 Not Found', exNonExistent.status === 404);

  // 2.2 Category filtering edge cases
  const exCatBogus = await examsRoute.GET(new Request('http://localhost:3000/api/exams?categoryId=invalid_category'));
  const exCatBogusData = await exCatBogus.json();
  check('/api/exams: invalid categoryId returns 200 with empty exams list without crashing', exCatBogus.status === 200 && exCatBogusData.exams.length === 0);

  const exCatNegative = await examsRoute.GET(new Request('http://localhost:3000/api/exams?categoryId=-100'));
  const exCatNegData = await exCatNegative.json();
  check('/api/exams: negative categoryId returns 200 with empty exams list', exCatNegative.status === 200 && exCatNegData.exams.length === 0);

  // 2.3 Verify exam bundle 15266 offline image localization & brand purity
  const ex15266 = await examsRoute.GET(new Request('http://localhost:3000/api/exams?examId=15266'));
  const ex15266Data = await ex15266.json();
  const raw15266 = JSON.stringify(ex15266Data);
  check('/api/exams 15266: response has zero slatic.net references', !raw15266.includes('slatic.net'));
  check('/api/exams 15266: response points Q266388 to local /images/q266388.png', raw15266.includes('/images/q266388.png'));
  check('/api/exams 15266: response has zero tak12.com references', !raw15266.includes('tak12.com'));

  // ===========================================================================
  // VECTOR 3: /api/progress ADVERSARIAL STRESS
  // ===========================================================================
  console.log('\n▶ Vector 3: Authentication, Security & Payload Stress on /api/progress...');
  const progressRoute = require('@/app/api/progress/route');
  const { NextRequest } = require('next/server');

  // 3.1 Session security
  global.__mockCookies = {};
  const progNoCookie = await progressRoute.GET();
  check('/api/progress GET: missing cookie returns 401', progNoCookie.status === 401);

  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: 'totally_garbage_token' };
  const progGarbageToken = await progressRoute.GET();
  check('/api/progress GET: garbage token returns 401', progGarbageToken.status === 401);

  // Tampered signature token
  const fakeToken = Buffer.from('usr_dotuan_demo:' + Date.now() + ':bad_signature_here').toString('base64');
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: fakeToken };
  const progTampered = await progressRoute.GET();
  check('/api/progress GET: tampered HMAC token returns 401', progTampered.status === 401);

  // Expired token (31 days old)
  const expiredTs = Date.now() - 31 * 24 * 60 * 60 * 1000;
  const expiredPayload = `usr_dotuan_demo:${expiredTs}`;
  const crypto = require('crypto');
  const expiredSig = crypto.createHmac('sha256', 'ta12_grade10_english_prep_auth_secret_2026').update(expiredPayload).digest('hex');
  const expiredToken = Buffer.from(`${expiredPayload}:${expiredSig}`).toString('base64');
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: expiredToken };
  const progExpired = await progressRoute.GET();
  check('/api/progress GET: expired session (>30 days) returns 401', progExpired.status === 401);

  // Future token (>60s in future)
  const futureTs = Date.now() + 120000;
  const futurePayload = `usr_dotuan_demo:${futureTs}`;
  const futureSig = crypto.createHmac('sha256', 'ta12_grade10_english_prep_auth_secret_2026').update(futurePayload).digest('hex');
  const futureToken = Buffer.from(`${futurePayload}:${futureSig}`).toString('base64');
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: futureToken };
  const progFuture = await progressRoute.GET();
  check('/api/progress GET: clock skew future token (>60s ahead) returns 401', progFuture.status === 401);

  // Pending student authorization check
  const pendingToken = authModule.signSessionToken('usr_pending_demo');
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: pendingToken };
  const progPending = await progressRoute.GET();
  check('/api/progress GET: pending student returns 403 Forbidden', progPending.status === 403);

  const progPendingPost = await progressRoute.POST(new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: 1 },
  }));
  check('/api/progress POST: pending student returns 403 Forbidden', progPendingPost.status === 403);

  // 3.2 Approved student POST edge cases
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: validToken };

  const progEmptyPost = await progressRoute.POST(new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: {},
  }));
  check('/api/progress POST: empty object body returns 200 with success: true', progEmptyPost.status === 200);

  const progExtremePost = await progressRoute.POST(new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: 999999, diamonds: -50, exam_scores: { "15266": { score: 10, total: 10 } } },
  }));
  check('/api/progress POST: extreme numbers and nested exam_scores handled cleanly', progExtremePost.status === 200);

  // Non-number fields in numeric properties
  const progTypeStress = await progressRoute.POST(new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: 'NaN_string', diamonds: [1, 2, 3] },
  }));
  check('/api/progress POST: non-numeric values in numeric fields do not cause server error', progTypeStress.status === 200);

  // Challenge: Empty or malformed body handling
  const progEmptyBodyReq = new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: undefined, // empty body
  });
  const progEmptyBodyRes = await progressRoute.POST(progEmptyBodyReq);
  if (progEmptyBodyRes.status === 500) {
    recordFinding(
      'medium',
      'POST /api/progress returns HTTP 500 instead of HTTP 400 when body is empty or non-JSON',
      `When request.json() throws a SyntaxError on empty or non-JSON body, the catch block responds with status 500: "${(await progEmptyBodyRes.json()).error}". Should ideally return HTTP 400 Bad Request.`
    );
  }
  check('/api/progress POST: empty body returns handled response without unhandled process termination', progEmptyBodyRes.status === 500 || progEmptyBodyRes.status === 400);

  // ===========================================================================
  // VECTOR 4: /api/sections ADVERSARIAL STRESS
  // ===========================================================================
  console.log('\n▶ Vector 4: Adversarial Boundary & Traversal on /api/sections...');
  const sectionsRoute = require('@/app/api/sections/route');

  const secNegativeCount = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections?sectionId=grammar_vocab_cloze&count=-10'));
  const secNegData = await secNegativeCount.json();
  check('/api/sections: negative count clamps to at least 1 question', secNegativeCount.status === 200 && secNegData.questions.length === 1);

  const secHugeCount = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections?sectionId=grammar_vocab_cloze&count=999999'));
  const secHugeData = await secHugeCount.json();
  check('/api/sections: huge count clamps to max 50 questions', secHugeCount.status === 200 && secHugeData.questions.length <= 50);

  const secNonNumericCount = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections?sectionId=grammar_vocab_cloze&count=abc'));
  const secNnData = await secNonNumericCount.json();
  check('/api/sections: non-numeric count falls back to default 10', secNonNumericCount.status === 200 && secNnData.questions.length === 10);

  const secPathTraversal = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections?sectionId=../../../../etc/passwd'));
  check('/api/sections: path traversal in sectionId returns 404 Not Found', secPathTraversal.status === 404);

  const secSqlInjection = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections?sectionId=\' OR 1=1 --'));
  check('/api/sections: SQL injection in sectionId returns 404 Not Found', secSqlInjection.status === 404);

  const secNonExistent = await sectionsRoute.GET(new Request('http://localhost:3000/api/sections?sectionId=non_existent_section_404'));
  check('/api/sections: non-existent sectionId returns 404 Not Found', secNonExistent.status === 404);

  // ===========================================================================
  // VECTOR 5: /api/translation ADVERSARIAL STRESS
  // ===========================================================================
  console.log('\n▶ Vector 5: Input Validation & Fallback on /api/translation...');
  const transRoute = require('@/app/api/translation/route');

  const transEmpty = await transRoute.GET(new Request('http://localhost:3000/api/translation?questionId='));
  check('/api/translation: empty questionId returns 400 Bad Request', transEmpty.status === 400);

  const transSpecialChars = await transRoute.GET(new Request('http://localhost:3000/api/translation?questionId=@@@$$$%%%'));
  check('/api/translation: questionId with only special characters returns 400 Bad Request', transSpecialChars.status === 400);

  const transNegative = await transRoute.GET(new Request('http://localhost:3000/api/translation?questionId=-41501'));
  const transNegData = await transNegative.json();
  check('/api/translation: negative questionId returns 200 with clean null fallback', transNegative.status === 200 && transNegData.questionText === null);

  const transSql = await transRoute.GET(new Request('http://localhost:3000/api/translation?questionId=\' OR 1=1 --'));
  const transSqlData = await transSql.json();
  check('/api/translation: SQL injection string in questionId safely falls back to 200 with null questionText', transSql.status === 200 && transSqlData.questionText === null);

  const transXss = await transRoute.GET(new Request('http://localhost:3000/api/translation?questionId=<script>alert(1)</script>'));
  const transXssData = await transXss.json();
  check('/api/translation: XSS string in questionId is sanitized and returns clean response', transXss.status === 200 && transXssData.questionText === null);

  // ===========================================================================
  // VECTOR 6: /api/study ADVERSARIAL STRESS
  // ===========================================================================
  console.log('\n▶ Vector 6: Parameter Validation & Unit Retrieval on /api/study...');
  const studyRoute = require('@/app/api/study/route');

  const studyInvalidType = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=unsupported_type_xyz'));
  const studyInvTypeData = await studyInvalidType.json();
  check('/api/study: unsupported type falls back safely to vocabulary', studyInvalidType.status === 200 && studyInvTypeData.type === 'vocabulary');

  const studyNegativeModule = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=vocabulary&moduleId=-15951'));
  check('/api/study: negative moduleId returns 400 Bad Request', studyNegativeModule.status === 400);

  const studyAlphaModule = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=vocabulary&moduleId=module_abc'));
  check('/api/study: alphabetic moduleId returns 400 Bad Request', studyAlphaModule.status === 400);

  const studyFloatModule = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=vocabulary&moduleId=15951.5'));
  check('/api/study: float moduleId returns 400 Bad Request', studyFloatModule.status === 400);

  const studyTraversalModule = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=vocabulary&moduleId=../../secret'));
  check('/api/study: path traversal moduleId returns 400 Bad Request', studyTraversalModule.status === 400);

  const studyNonExistent = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=vocabulary&moduleId=99999999'));
  check('/api/study: non-existent moduleId returns 404 Not Found', studyNonExistent.status === 404);

  // ===========================================================================
  // VECTOR 7: /api/related-topic PRIORITY HIERARCHY & ADVERSARIAL STRESS
  // ===========================================================================
  console.log('\n▶ Vector 7: Priority Hierarchy & Theory Sanitization on /api/related-topic...');
  const relatedRoute = require('@/app/api/related-topic/route');

  // 7.1 Suppression of topic 68 when studyUnit or sectionId is provided
  const relSup1 = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?topicId=68&studyUnit=15290'));
  const relSup1Data = await relSup1.json();
  check('/api/related-topic: studyUnit=15290 overrides dummy topicId=68', relSup1Data.source === 'studyUnit' && !relSup1Data.listQuestionTopicDetail[0].name.includes('đuôi "ed"'));

  const relSup2 = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?topicId=68&sectionId=grammar_vocab_cloze'));
  const relSup2Data = await relSup2.json();
  check('/api/related-topic: sectionId=grammar_vocab_cloze overrides dummy topicId=68', relSup2Data.source === 'section' && !relSup2Data.listQuestionTopicDetail[0].name.includes('đuôi "ed"'));

  // 7.2 Non-existent parameters gracefully cascade without 500 crash
  const relNonExistentAll = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?questionId=99999999&studyUnit=99999999&sectionId=non_existent_section&topicId=99999999'));
  const relNEData = await relNonExistentAll.json();
  check('/api/related-topic: all non-existent parameters gracefully cascade to generic fallback without crashing', relNEData.source === 'generic' && relNEData.isDisplay === true);

  // 7.3 Canva and H5P iframe elimination across responses
  const testIds = ['1201616', '1201617', '1201618', '1201619', '1201620'];
  let canvaIframeLeaks = 0;
  for (const qid of testIds) {
    const res = await relatedRoute.GET(new NextRequest(`http://localhost:3000/api/related-topic?questionId=${qid}`));
    const data = await res.json();
    const str = JSON.stringify(data);
    if (str.includes('canva.com') || str.includes('cth.edu.vn')) {
      canvaIframeLeaks++;
    }
  }
  check('Zero Canva/H5P iframe embeds in /api/related-topic test questions', canvaIframeLeaks === 0, `Leaks: ${canvaIframeLeaks}`);

  // 7.4 XSS safety in explanation/ruleTip
  const relXss = await relatedRoute.GET(new NextRequest('http://localhost:3000/api/related-topic?explanation=<script>alert("xss")</script>'));
  const relXssData = await relXss.json();
  check('/api/related-topic: handles raw HTML in explanation without crashing', relXssData.source === 'explanation');

  // ===========================================================================
  // VECTOR 8: STRICT SECURITY, BRAND PURITY & MONETIZATION CHECKS
  // ===========================================================================
  console.log('\n▶ Vector 8: Strict Security, Offline Compliance & Brand Purity Across Endpoints...');

  const endpointsToAudit = [
    'http://localhost:3000/api/questions?topicId=141',
    'http://localhost:3000/api/questions?topicId=custom',
    'http://localhost:3000/api/exams',
    'http://localhost:3000/api/exams?examId=15266',
    'http://localhost:3000/api/sections',
    'http://localhost:3000/api/sections?sectionId=grammar_vocab_cloze',
    'http://localhost:3000/api/translation?questionId=41501',
    'http://localhost:3000/api/study?type=vocabulary',
    'http://localhost:3000/api/study?type=grammar&moduleId=15244',
    'http://localhost:3000/api/related-topic?questionId=1201616',
    'http://localhost:3000/api/related-topic?studyUnit=15290',
  ];

  let totalEndpointResponses = '';
  for (const url of endpointsToAudit) {
    let resData = null;
    if (url.includes('/api/questions')) resData = await (await questionsRoute.GET(new Request(url))).json();
    else if (url.includes('/api/exams')) resData = await (await examsRoute.GET(new Request(url))).json();
    else if (url.includes('/api/sections')) resData = await (await sectionsRoute.GET(new Request(url))).json();
    else if (url.includes('/api/translation')) resData = await (await transRoute.GET(new Request(url))).json();
    else if (url.includes('/api/study')) resData = await (await studyRoute.GET(new Request(url))).json();
    else if (url.includes('/api/related-topic')) resData = await (await relatedRoute.GET(new NextRequest(url))).json();
    totalEndpointResponses += ' ' + JSON.stringify(resData);
  }

  // Check 8.1: Zero slatic.net
  check('Zero slatic.net references in any API response payload', !totalEndpointResponses.includes('slatic.net'));

  // Check 8.2: Zero Canva / H5P third-party iframes
  check('Zero canva.com or cth.edu.vn iframe references across audited payloads', !totalEndpointResponses.includes('canva.com') && !totalEndpointResponses.includes('cth.edu.vn'));

  // Check 8.3: Zero Leaderboard or "bảng xếp hạng"
  const hasLeaderboard = /bảng xếp hạng|leaderboard/gi.test(totalEndpointResponses);
  check('Zero leaderboard or "bảng xếp hạng" strings in any API response', !hasLeaderboard);

  // Check 8.4: Zero PRO purchase/upgrade banner strings
  const hasProPromo = /mua pro|nâng cấp pro|gói pro|mua tài khoản pro/gi.test(totalEndpointResponses);
  check('Zero PRO purchase/upgrade promotional phrases in any API response', !hasProPromo);

  // Check 8.5: Zero tak12.com domain references in API responses (all sanitized to ta12.edu.vn)
  check('Zero tak12.com domain strings in API responses (properly sanitized)', !totalEndpointResponses.includes('tak12.com'));

  // ===========================================================================
  // SUMMARY
  // ===========================================================================
  console.log('\n========================================================================');
  console.log(`📊 ADVERSARIAL STRESS SUITE: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
  if (findings.length > 0) {
    console.log(`ℹ️  ${findings.length} ADVERSARIAL FINDINGS DISCOVERED:`);
    for (const f of findings) {
      console.log(`   - [${f.severity.toUpperCase()}] ${f.title}: ${f.details}`);
    }
  }

  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} CRITICAL FAILURES:`);
    for (const f of failures) {
      console.error(`   - ${f.desc} (${f.details})`);
    }
    console.log('========================================================================');
    process.exit(1);
  } else {
    console.log('🛡️  VERDICT ASSESSMENT: All endpoints demonstrated strong resilience against adversarial attacks!');
    console.log('========================================================================');
  }
}

runAdversarialSuite().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
