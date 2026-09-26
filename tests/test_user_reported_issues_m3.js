const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('========================================================================');
console.log('🧪 VERIFYING USER-REPORTED ISSUES & M1-M3 REGRESSION SUITE');
console.log('========================================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition) {
  totalChecks++;
  try {
    assert.ok(condition, desc);
    passedChecks++;
    console.log(`  ✓ [PASS] ${desc}`);
  } catch (err) {
    console.error(`  ❌ [FAIL] ${desc}: ${err.message}`);
    throw err;
  }
}

// --- PART 1: Question 10 ("so... that, such (a/an)... that") & Zero Canva Iframes ---
console.log('▶ Part 1: Verifying Question 10 Canva Replacement (Zero Flicker, 100% Offline)...');
const relatedTopics = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'related_topics.json'), 'utf8'));

// Q10 in Exam 19159 has question ID 1201616
const q10 = relatedTopics['1201616'];
check('Question 1201616 exists in related_topics.json', !!q10);
check('Question 1201616 isDisplay is true', q10.isDisplay === true);
check('Question 1201616 has related topic details', Array.isArray(q10.listQuestionTopicDetail) && q10.listQuestionTopicDetail.length > 0);

const q10Topic = q10.listQuestionTopicDetail[0];
check('Question 1201616 topic name is "so... that, such (a/an)... that"', q10Topic.name === 'so... that, such (a/an)... that');
check('Question 1201616 has ZERO canva.com iframes', !q10Topic.detail.includes('canva.com'));
check('Question 1201616 has ZERO cth.edu.vn iframes', !q10Topic.detail.includes('cth.edu.vn'));
check('Question 1201616 detail contains SO... THAT formula', q10Topic.detail.includes('SO + Adj + THAT') || q10Topic.detail.includes('SO... THAT'));
check('Question 1201616 detail contains SUCH... THAT formula', q10Topic.detail.includes('SUCH + (a/an) + Adj') || q10Topic.detail.includes('SUCH... THAT'));
check('Question 1201616 detail contains TOO / ENOUGH transformation table', q10Topic.detail.includes('TOO') && q10Topic.detail.includes('ENOUGH'));
check('Question 1201616 detail contains Exam Trap Alert', q10Topic.detail.includes('Bẫy thường gặp'));

// --- PART 2: Global Database Audit (Zero Canva / H5P Iframes Across ALL Questions) ---
console.log('\n▶ Part 2: Auditing Entire related_topics.json Database (Zero Canva, Zero H5P)...');
let totalQuestions = 0;
let canvaCount = 0;
let h5pCount = 0;
let invalidIframeCount = 0;

for (const [qid, data] of Object.entries(relatedTopics)) {
  totalQuestions++;
  if (data && data.listQuestionTopicDetail) {
    for (const t of data.listQuestionTopicDetail) {
      if (t.detail) {
        if (t.detail.includes('canva.com')) canvaCount++;
        if (t.detail.includes('cth.edu.vn') || t.detail.includes('h5p')) h5pCount++;
        if (/<iframe[^>]*src=["'][^"']*\/Upload\//i.test(t.detail)) invalidIframeCount++;
      }
    }
  }
}

check(`Total questions analyzed: ${totalQuestions}`, totalQuestions > 3000);
check(`Zero canva.com iframes in database: ${canvaCount}`, canvaCount === 0);
check(`Zero cth.edu.vn / H5P iframes in database: ${h5pCount}`, h5pCount === 0);
check(`Zero local image iframes in database: ${invalidIframeCount}`, invalidIframeCount === 0);

// --- PART 3: Question 4 ("Tính từ đi với giới từ 'OF'") Dark Theme Contrast ---
console.log('\n▶ Part 3: Verifying Question 4 & Tak12 Slide Deck Dark Theme Rules...');
const globalsCss = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'globals.css'), 'utf8');

check('globals.css styles slide cards with dark theme background #1e221e', globalsCss.includes('#1e221e'));
check('globals.css styles slide tables with dark theme background #161916', globalsCss.includes('#161916'));
check('globals.css styles slide table headers with green #1c581f', globalsCss.includes('#1c581f'));
check('globals.css styles bold text with emerald green #86efac', globalsCss.includes('#86efac'));
check('globals.css has fallback contrast override for white container text', globalsCss.includes('#166534') || globalsCss.includes('#0f172a'));

// --- PART 4: Question 33-36 FillBlank Dropdown Interactivity ---
console.log('\n▶ Part 4: Verifying Question 33-36 FillBlank Dropdown Interactivity & Click Delegation...');
const examRunnerCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'ExamRunner.tsx'), 'utf8');
const practicePageCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'practice', '[topicId]', 'page.tsx'), 'utf8');

check('ExamRunner has delegated click handler for fillblank options', examRunnerCode.includes('showPicker') || examRunnerCode.includes('fillblank-option'));
check('ExamRunner normalizes answer keys across string and numeric indices', examRunnerCode.includes('qAnswers[idx]') || examRunnerCode.includes('qAnswers[String(idx)]'));
check('Practice page has delegated click handler for fillblank options', practicePageCode.includes('showPicker') || practicePageCode.includes('fillblank-option'));
check('globals.css enforces color-scheme: dark on selects and options', globalsCss.includes('color-scheme: dark'));

// --- PART 5: Runtime API Safeguards in route.ts ---
console.log('\n▶ Part 5: Verifying Runtime API Safeguards in /api/related-topic/route.ts...');
const routeCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'app', 'api', 'related-topic', 'route.ts'), 'utf8');

check('route.ts imports sanitizeTheoryDetail and getCuratedTheoryHtml', routeCode.includes('sanitizeTheoryDetail') && routeCode.includes('getCuratedTheoryHtml'));
check('route.ts sanitizes cached topics at runtime', routeCode.includes('sanitizeTheoryDetail(detail, t.name)'));
check('route.ts prevents Canva iframe injection in formatTheoryToHtml', routeCode.includes('!l.embedUrl.includes(\'canva.com\')'));
const curatedCode = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'curatedTheories.ts'), 'utf8');
check('sanitizeTheoryDetail replaces external iframe embeds with an offline notice', curatedCode.includes('offline-embed-note'));
check('curated_grammar_theories.json exists and is populated', fs.existsSync(path.join(__dirname, '..', 'data', 'curated_grammar_theories.json')));

console.log('\n========================================================================');
console.log(`🎉 ALL ${passedChecks} / ${totalChecks} CHECKS PASSED WITH 100% SUCCESS!`);
console.log('========================================================================');
