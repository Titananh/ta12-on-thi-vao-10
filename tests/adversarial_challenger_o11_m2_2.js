/**
 * Adversarial Challenger 2 Test Suite for Milestone M2
 * Focus: 175-Topic Traversal, Zero Fallback to 68, Zero External URLs, and Offline Asset Integrity
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ts = require('typescript');
const Module = require('module');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

console.log('========================================================================');
console.log('⚔️  CHALLENGER 2 (M2): 175-TOPIC TRAVERSAL & OFFLINE ASSETS AUDIT');
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
// Module Mocking & TypeScript Transpilation for Next.js App Router
// -----------------------------------------------------------------------------
const originalRequire = Module.prototype.require;
Module.prototype.require = function (request) {
  if (request === 'next/server') {
    class MockNextResponse {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.headers = new Map();
      }
      static json(body, init = {}) {
        const res = new MockNextResponse(JSON.stringify(body), init);
        res._json = body;
        return res;
      }
      async json() {
        return this._json !== undefined ? this._json : JSON.parse(this.body);
      }
    }
    return { NextResponse: MockNextResponse };
  }
  if (request.startsWith('@/')) {
    const rel = request.replace('@/', 'src/');
    return originalRequire.call(this, path.resolve(ROOT_DIR, rel));
  }
  return originalRequire.call(this, request);
};

require.extensions['.ts'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const transpiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  module._compile(transpiled.outputText, filename);
};

async function runChallengerSuite() {
  // ===========================================================================
  // VECTOR 1: 175-Topic Traversal Asserting >= 10 Questions and 0 Fallback to 68
  // ===========================================================================
  console.log('▶ [Vector 1] 175-Topic Traversal via API Route Logic...');

  const taxonomyPath = path.join(DATA_DIR, 'taxonomy.json');
  check('data/taxonomy.json exists', fs.existsSync(taxonomyPath));
  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));

  const allTopics = [];
  for (const skill of taxonomy.skills || []) {
    for (const cat of skill.topicCategories || []) {
      for (const t of cat.topics || []) {
        allTopics.push({
          id: t.id,
          topicName: t.topicName,
          englishName: t.englishName,
          skillName: skill.skillName,
          categoryName: cat.categoryName,
        });
      }
    }
  }

  check('Taxonomy has exactly 175 topics', allTopics.length === 175, `Found: ${allTopics.length}`);

  // Load Question Route
  const questionsRoute = require('@/app/api/questions/route');
  check('Questions API route loaded successfully', typeof questionsRoute.GET === 'function');

  // Load authentic topic 68 questions to detect leak/fallback
  const topic68Raw = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'questions', '68.json'), 'utf8'));
  const topic68Ids = new Set(topic68Raw.map(q => String(q.id)));

  let minQuestions = Infinity;
  let maxQuestions = 0;
  let totalQuestionsCount = 0;
  const under10Topics = [];
  const leaked68Topics = [];
  const theoryMismatchTopics = [];

  for (let idx = 0; idx < allTopics.length; idx++) {
    const t = allTopics[idx];
    const topicId = String(t.id);

    const req = new Request(`http://localhost:3000/api/questions?topicId=${topicId}`);
    const res = await questionsRoute.GET(req);

    if (res.status !== 200) {
      under10Topics.push({ id: topicId, name: t.topicName, reason: `HTTP status ${res.status}` });
      continue;
    }

    const data = await res.json();
    const qs = data.questions || [];

    if (qs.length < minQuestions) minQuestions = qs.length;
    if (qs.length > maxQuestions) maxQuestions = qs.length;
    totalQuestionsCount += qs.length;

    if (qs.length < 10) {
      under10Topics.push({ id: topicId, name: t.topicName, count: qs.length });
    }

    // Check for unwanted fallback to topic 68
    if (topicId !== '68') {
      const contains68Id = qs.some(q => topic68Ids.has(String(q.id)) || String(q.id).startsWith('68_'));
      const contains68EdTheory = data.theory && typeof data.theory.topicName === 'string' && data.theory.topicName.includes('đuôi "ed"');
      if (contains68Id || contains68EdTheory) {
        leaked68Topics.push({ id: topicId, name: t.topicName, contains68Id, contains68EdTheory });
      }
    }

    // Check theory presence and no Canva / H5P iframe leak
    if (data.theory && typeof data.theory.detail === 'string') {
      if (data.theory.detail.includes('canva.com') || data.theory.detail.includes('cth.edu.vn')) {
        theoryMismatchTopics.push({ id: topicId, name: t.topicName, reason: 'External iframe found in theory' });
      }
    }
  }

  console.log(`    Traversed ${allTopics.length} topics: total questions loaded = ${totalQuestionsCount}, min = ${minQuestions}, max = ${maxQuestions}`);

  check(
    'All 175 topics return at least 10 authentic questions',
    under10Topics.length === 0,
    `Failing topics (<10): ${JSON.stringify(under10Topics)}`
  );

  check(
    'Zero non-68 topics return topic 68 questions or "ed" theory fallback',
    leaked68Topics.length === 0,
    `Leaked topics: ${JSON.stringify(leaked68Topics)}`
  );

  check(
    'Zero topics contain Canva/H5P external iframes in theory details returned by /api/questions',
    theoryMismatchTopics.length === 0,
    `Failing theories: ${JSON.stringify(theoryMismatchTopics)}`
  );

  // ===========================================================================
  // VECTOR 2: Scan All JSON Files in data/ for External URLs (Zero Dependencies)
  // ===========================================================================
  console.log('\n▶ [Vector 2] Deep Scan of JSON Data Files for External URLs...');

  function scanDirectoryRecursive(dir) {
    let files = [];
    if (!fs.existsSync(dir)) return files;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        files = files.concat(scanDirectoryRecursive(full));
      } else if (ent.isFile() && ent.name.endsWith('.json')) {
        files.push(full);
      }
    }
    return files;
  }

  const targetDirs = {
    'data/questions': scanDirectoryRecursive(path.join(DATA_DIR, 'questions')),
    'data/theories': scanDirectoryRecursive(path.join(DATA_DIR, 'theories')),
    'data/exams/bundles': scanDirectoryRecursive(path.join(DATA_DIR, 'exams', 'bundles')),
    'data/sections': scanDirectoryRecursive(path.join(DATA_DIR, 'sections')),
  };

  const urlRegex = /https?:\/\/[^\s"'\`<>]+/gi;
  const externalUrlsFound = [];
  const domainBreakdown = {};

  for (const [dirName, jsonFiles] of Object.entries(targetDirs)) {
    let dirMatches = 0;
    for (const jf of jsonFiles) {
      const content = fs.readFileSync(jf, 'utf8');
      const matches = content.match(urlRegex);
      if (matches) {
        dirMatches += matches.length;
        for (const m of matches) {
          const clean = m.replace(/\\+$/, '').replace(/["'\\]+$/, '');
          let host = 'unknown';
          try {
            const u = new URL(clean);
            host = u.hostname;
          } catch (e) {
            host = clean.split('/')[2] || 'unknown';
          }
          domainBreakdown[host] = (domainBreakdown[host] || 0) + 1;
          externalUrlsFound.push({ file: path.relative(ROOT_DIR, jf), url: clean, domain: host });
        }
      }
    }
    console.log(`    Scanning ${dirName}: ${jsonFiles.length} files, ${dirMatches} URL matches`);
  }

  console.log(`    Total external URL matches found: ${externalUrlsFound.length}`);
  console.log(`    Domain breakdown:`, domainBreakdown);

  check(
    'Zero external URLs across data/questions, data/theories, data/exams/bundles, data/sections',
    externalUrlsFound.length === 0,
    `Found ${externalUrlsFound.length} external URLs (azvocab.ai: ${domainBreakdown['azvocab.ai'] || 0}, canva.com: ${domainBreakdown['www.canva.com'] || 0})`
  );

  // Special check: slatic.net in any data/ or src/ file
  function scanForString(dir, str) {
    let matches = [];
    if (!fs.existsSync(dir)) return matches;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (ent.name !== 'node_modules' && ent.name !== '.next' && ent.name !== '.git' && ent.name !== '.agents') {
          matches = matches.concat(scanForString(full, str));
        }
      } else {
        const content = fs.readFileSync(full, 'utf8');
        if (content.includes(str)) {
          matches.push(path.relative(ROOT_DIR, full));
        }
      }
    }
    return matches;
  }

  const slaticMatches = scanForString(DATA_DIR, 'slatic.net').concat(scanForString(path.join(ROOT_DIR, 'src'), 'slatic.net'));
  check('Zero occurrences of "slatic.net" in data/ or src/', slaticMatches.length === 0, `Matches in: ${JSON.stringify(slaticMatches)}`);

  // Vector 2B: Audit /api/study for Canva iframe leakage
  console.log('\n▶ [Vector 2B] Auditing /api/study for Canva iframe leakage...');
  const studyRoute = require('@/app/api/study/route');
  const studyRes = await studyRoute.GET(new Request('http://localhost:3000/api/study?type=grammar&moduleId=15244'));
  const studyData = await studyRes.json();
  const studyHasCanva = (studyData.lessons || []).some(l => (l.contentHtml && l.contentHtml.includes('canva.com')) || (l.embedUrl && l.embedUrl.includes('canva.com')));
  check('/api/study?type=grammar&moduleId=15244 returns zero Canva iframes/embeds in lessons', !studyHasCanva, `Canva detected in lesson: ${studyData.lessons?.[0]?.embedUrl}`);

  // ===========================================================================
  // VECTOR 3: Image Integrity Check for public/images/q266388.png
  // ===========================================================================
  console.log('\n▶ [Vector 3] Image Integrity Check for public/images/q266388.png...');

  const q266388Path = path.join(PUBLIC_DIR, 'images', 'q266388.png');
  check('public/images/q266388.png exists', fs.existsSync(q266388Path));

  if (fs.existsSync(q266388Path)) {
    const stat = fs.statSync(q266388Path);
    check('public/images/q266388.png is non-empty (>100 KB)', stat.size > 100000, `Size: ${stat.size} bytes`);

    const buffer = fs.readFileSync(q266388Path);
    // Valid PNG signature: 89 50 4E 47 0D 0A 1A 0A
    const isPng = buffer[0] === 0x89 &&
                  buffer[1] === 0x50 &&
                  buffer[2] === 0x4E &&
                  buffer[3] === 0x47 &&
                  buffer[4] === 0x0D &&
                  buffer[5] === 0x0A &&
                  buffer[6] === 0x1A &&
                  buffer[7] === 0x0A;
    check('public/images/q266388.png has valid PNG 8-byte signature', isPng);

    // Read IHDR chunk: starts at byte 8 (chunk length), byte 12 (IHDR)
    const chunkType = buffer.toString('ascii', 12, 16);
    check('First PNG chunk is IHDR', chunkType === 'IHDR');

    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    const bitDepth = buffer[24];
    const colorType = buffer[25];

    console.log(`    PNG parsed header: ${width}x${height}, bitDepth: ${bitDepth}, colorType: ${colorType}`);
    check('PNG dimensions are 720x720', width === 720 && height === 720, `${width}x${height}`);
    check('PNG bit depth is 8', bitDepth === 8);
    check('PNG color type is 2 (RGB)', colorType === 2);
  }

  // Verify referencing files
  const bundle15266 = fs.readFileSync(path.join(DATA_DIR, 'exams', 'bundles', '15266.json'), 'utf8');
  check('Exam 15266 references /images/q266388.png', bundle15266.includes('/images/q266388.png'));

  const secCloze = fs.readFileSync(path.join(DATA_DIR, 'sections', 'grammar_vocab_cloze.json'), 'utf8');
  check('Section grammar_vocab_cloze references /images/q266388.png', secCloze.includes('/images/q266388.png'));

  // ===========================================================================
  // VECTOR 4: Adversarial Edge Cases & Security Fuzzing
  // ===========================================================================
  console.log('\n▶ [Vector 4] Adversarial Edge Cases & Security Fuzzing...');

  // 1. Path traversal attempt
  const travReq = new Request('http://localhost:3000/api/questions?topicId=../../../../etc/passwd');
  const travRes = await questionsRoute.GET(travReq);
  const travData = await travRes.json();
  check(
    'Path traversal attempt in topicId is safely normalized to fallback without crashing',
    travRes.status === 200 && Array.isArray(travData.questions)
  );

  // 2. Non-numeric topicId
  const nonNumReq = new Request('http://localhost:3000/api/questions?topicId=injection%27OR%201=1');
  const nonNumRes = await questionsRoute.GET(nonNumReq);
  const nonNumData = await nonNumRes.json();
  check(
    'SQL injection style string in topicId is safely handled',
    nonNumRes.status === 200 && Array.isArray(nonNumData.questions)
  );

  // 3. Count limits boundary check
  const countHighReq = new Request('http://localhost:3000/api/questions?topicId=68&count=999999');
  const countHighRes = await questionsRoute.GET(countHighReq);
  const countHighData = await countHighRes.json();
  check('Excessive count parameter is clamped to max 50', countHighData.questions.length <= 50);

  const countNegativeReq = new Request('http://localhost:3000/api/questions?topicId=68&count=-5');
  const countNegativeRes = await questionsRoute.GET(countNegativeReq);
  const countNegativeData = await countNegativeRes.json();
  check('Negative count parameter is clamped to min 1', countNegativeData.questions.length >= 1);

  // 4. Custom practice with corrupted topics param
  const corruptedCustomReq = new Request('http://localhost:3000/api/questions?topicId=custom&topics=bad,evil,999999');
  const corruptedCustomRes = await questionsRoute.GET(corruptedCustomReq);
  const corruptedCustomData = await corruptedCustomRes.json();
  check(
    'Custom practice with non-existent topic IDs degrades gracefully',
    corruptedCustomRes.status === 200 && Array.isArray(corruptedCustomData.questions)
  );

  // ===========================================================================
  // SUMMARY
  // ===========================================================================
  console.log('\n========================================================================');
  console.log(`📊 ADVERSARIAL SUITE COMPLETE: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
  if (failures.length > 0) {
    console.error(`❌ ${failures.length} CHECKS FAILED:`);
    for (const f of failures) {
      console.error(`   - ${f.desc} (${f.details})`);
    }
    console.log('========================================================================');
  } else {
    console.log('🎉 100% SUCCESS: All 175 topics, offline assets, image integrity & edge cases verified!');
    console.log('========================================================================');
  }
}

runChallengerSuite().catch(err => {
  console.error('Fatal challenger execution error:', err);
  process.exit(1);
});
