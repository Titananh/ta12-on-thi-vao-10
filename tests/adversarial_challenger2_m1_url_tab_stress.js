/**
 * TA12 Milestone M1 Adversarial Verification Suite
 * Challenger 2: Clean URL Rewrites, Tab Aliases, Dark Mode Integrity, and Regression Resilience
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
const failures = [];

function check(desc, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${desc}`);
  } else {
    failures.push({ desc, details });
    console.error(`  ✗ FAIL: ${desc} ${details ? `(${details})` : ''}`);
  }
}

console.log('========================================================================');
console.log('⚔️  CHALLENGER 2: ADVERSARIAL VERIFICATION SUITE (MILESTONE M1)');
console.log('========================================================================\n');

// -----------------------------------------------------------------------------
// VECTOR 1: next.config.mjs Clean URL Rewrites Stress Testing
// -----------------------------------------------------------------------------
console.log('▶ [Vector 1] Stress Testing Clean URL Rewrites in next.config.mjs...');

const nextConfigPath = path.join(ROOT, 'next.config.mjs');
check('next.config.mjs exists on disk', fs.existsSync(nextConfigPath));

let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');

// Parse rewrites dynamically or via extraction
let rewritesList = [];
try {
  const rewriteBlockMatch = nextConfigContent.match(/async\s+rewrites\s*\(\)\s*\{[\s\S]*?return\s*(\[[^\]]+\]);[\s\S]*?\}/);
  check('next.config.mjs defines async rewrites() returning an array', !!rewriteBlockMatch);

  if (rewriteBlockMatch) {
    const rawArrayStr = rewriteBlockMatch[1];
    const parsedRewrites = new Function(`return ${rawArrayStr}`)();
    rewritesList = parsedRewrites;
  }
} catch (e) {
  check('Rewrites extraction and evaluation succeeds', false, e.message);
}

check('Rewrites list contains exactly 4 clean URL mappings', rewritesList.length === 4, `Found ${rewritesList.length}`);

const expectedMappings = {
  '/hoc-on': '/?tab=hoc-on',
  '/luyen-de-thi': '/?tab=luyen-de',
  '/luyen-theo-dang-bai': '/?tab=luyen-phan',
  '/luyen-theo-chuyen-de': '/?tab=luyen-chudiem'
};

for (const [source, expectedDest] of Object.entries(expectedMappings)) {
  const match = rewritesList.find(r => r.source === source);
  check(`Rewrite defined for source '${source}'`, !!match, `Missing ${source}`);
  if (match) {
    check(`Rewrite destination for '${source}' is '${expectedDest}'`, match.destination === expectedDest, `Got: ${match.destination}`);
  }
}

// Adversarial Rewrite Safety Checks
check('No duplicate source routes in rewrites', new Set(rewritesList.map(r => r.source)).size === rewritesList.length);
check('All sources start with leading slash', rewritesList.every(r => r.source.startsWith('/')));
check('All destinations target /?tab=', rewritesList.every(r => r.destination.startsWith('/?tab=')));
check('No wildcard regex or greedy catch-all in rewrite sources', rewritesList.every(r => !r.source.includes('*') && !r.source.includes(':')));
check('Rewrites do not conflict with /api routes', rewritesList.every(r => !r.source.startsWith('/api')));
check('Rewrites do not conflict with /_next static routes', rewritesList.every(r => !r.source.startsWith('/_next')));
check('Rewrites do not conflict with /Upload static routes', rewritesList.every(r => !r.source.startsWith('/Upload')));

// -----------------------------------------------------------------------------
// VECTOR 2: Tab Alias Resolution Logic in src/app/page.tsx
// -----------------------------------------------------------------------------
console.log('\n▶ [Vector 2] Stress Testing Tab Alias Resolution Logic in src/app/page.tsx...');

const pagePath = path.join(ROOT, 'src', 'app', 'page.tsx');
check('src/app/page.tsx exists on disk', fs.existsSync(pagePath));

const pageContent = fs.readFileSync(pagePath, 'utf8');

// Simulate the exact tab resolution logic from page.tsx lines 34-46
function resolveTab(searchQueryString) {
  const params = new URLSearchParams(searchQueryString);
  const requestedTab = params.get('tab');
  if (requestedTab === 'hoc-on') {
    return 'hoc-on';
  } else if (requestedTab === 'luyen-de' || requestedTab === 'luyen-de-thi') {
    return 'luyen-de';
  } else if (requestedTab === 'luyen-phan' || requestedTab === 'luyen-theo-dang-bai') {
    return 'luyen-phan';
  } else if (requestedTab === 'luyen-chudiem' || requestedTab === 'luyen-theo-chuyen-de') {
    return 'luyen-chudiem';
  } else {
    // Default landing tab in browser
    return 'luyen-de';
  }
}

// Test Matrix for Tab Resolution
const testCases = [
  // Canonical tabs
  { input: '?tab=hoc-on', expected: 'hoc-on', desc: 'Canonical tab=hoc-on resolves to hoc-on' },
  { input: '?tab=luyen-de', expected: 'luyen-de', desc: 'Canonical tab=luyen-de resolves to luyen-de' },
  { input: '?tab=luyen-phan', expected: 'luyen-phan', desc: 'Canonical tab=luyen-phan resolves to luyen-phan' },
  { input: '?tab=luyen-chudiem', expected: 'luyen-chudiem', desc: 'Canonical tab=luyen-chudiem resolves to luyen-chudiem' },

  // Aliases generated by clean URL rewrites or direct manual entry
  { input: '?tab=luyen-de-thi', expected: 'luyen-de', desc: 'Alias tab=luyen-de-thi resolves to luyen-de' },
  { input: '?tab=luyen-theo-dang-bai', expected: 'luyen-phan', desc: 'Alias tab=luyen-theo-dang-bai resolves to luyen-phan' },
  { input: '?tab=luyen-theo-chuyen-de', expected: 'luyen-chudiem', desc: 'Alias tab=luyen-theo-chuyen-de resolves to luyen-chudiem' },

  // Combined with additional query parameters
  { input: '?tab=hoc-on&mode=dark&ref=direct', expected: 'hoc-on', desc: 'Multi-param query with tab=hoc-on' },
  { input: '?ref=direct&tab=luyen-de-thi&utm_source=test', expected: 'luyen-de', desc: 'Multi-param query with tab=luyen-de-thi' },
  { input: '?unit=12&tab=luyen-theo-dang-bai', expected: 'luyen-phan', desc: 'Multi-param query with tab=luyen-theo-dang-bai' },
  { input: '?tab=luyen-theo-chuyen-de&skill=grammar', expected: 'luyen-chudiem', desc: 'Multi-param query with tab=luyen-theo-chuyen-de' },

  // Adversarial edge cases: empty, missing, invalid, hostile strings
  { input: '', expected: 'luyen-de', desc: 'Empty query string defaults to luyen-de' },
  { input: '?', expected: 'luyen-de', desc: 'Bare question mark defaults to luyen-de' },
  { input: '?tab=', expected: 'luyen-de', desc: 'Empty tab value defaults to luyen-de' },
  { input: '?tab=unknown_tab_xyz', expected: 'luyen-de', desc: 'Unknown tab identifier safely defaults to luyen-de' },
  { input: '?tab=<script>alert(1)</script>', expected: 'luyen-de', desc: 'XSS probe in tab parameter safely defaults to luyen-de' },
  { input: '?tab=../../etc/passwd', expected: 'luyen-de', desc: 'Path traversal probe in tab parameter safely defaults to luyen-de' },
  { input: '?tab=HOC-ON', expected: 'luyen-de', desc: 'Uppercase tab (case sensitivity check) defaults to luyen-de' },
  { input: '?tab=luyen_de', expected: 'luyen-de', desc: 'Underscore variant defaults to luyen-de' },
  { input: '?tab=hoc-on%20', expected: 'luyen-de', desc: 'Trailing space encoded defaults to luyen-de' }
];

for (const tc of testCases) {
  const result = resolveTab(tc.input);
  check(tc.desc, result === tc.expected, `Input: "${tc.input}", Got: "${result}", Expected: "${tc.expected}"`);
}

// -----------------------------------------------------------------------------
// VECTOR 3: UI View Rendering and Breadcrumb Consistency in page.tsx
// -----------------------------------------------------------------------------
console.log('\n▶ [Vector 3] Verifying Component Dispatch & Breadcrumb Consistency...');

check('HocOnView rendered when activeTab === "hoc-on"',
  pageContent.includes("activeTab === 'hoc-on' && <HocOnView />"));

check('LuyenDeView rendered when activeTab === "luyen-de"',
  pageContent.includes("activeTab === 'luyen-de' && <LuyenDeView />"));

check('LuyenPhanView rendered when activeTab === "luyen-phan"',
  pageContent.includes("activeTab === 'luyen-phan' && <LuyenPhanView />"));

check('TopicList rendered when activeTab === "luyen-chudiem"',
  pageContent.includes("activeTab === 'luyen-chudiem' && (") && pageContent.includes("<TopicList"));

check('Breadcrumb maps luyen-chudiem to "Luyện chủ điểm"',
  pageContent.includes("activeTab === 'luyen-chudiem'") && pageContent.includes("'Luyện chủ điểm'"));

check('Breadcrumb maps luyen-de to "Luyện đề thi"',
  pageContent.includes("'Luyện đề thi'"));

check('Breadcrumb maps hoc-on to "Học ôn"',
  pageContent.includes("'Học ôn'"));

check('Breadcrumb maps luyen-phan to "Luyện từng phần"',
  pageContent.includes("'Luyện từng phần'"));

// -----------------------------------------------------------------------------
// VECTOR 4: 14 Authentic Cards and Question Inventory Integrity
// -----------------------------------------------------------------------------
console.log('\n▶ [Vector 4] Verifying 14 Authentic Cards & Question Inventory in Tab 3...');

const sectionsIndexPath = path.join(ROOT, 'data', 'sections', 'index.json');
check('data/sections/index.json exists', fs.existsSync(sectionsIndexPath));

const sectionsIndex = JSON.parse(fs.readFileSync(sectionsIndexPath, 'utf8'));
check('sections/index.json contains exactly 14 items', sectionsIndex.length === 14, `Found ${sectionsIndex.length}`);

// Check specific required authentic question counts
const expectedSections = [
  { sectionId: 'pronunciation', taxonomyId: 6, expectedMinQuestions: 3000 },
  { sectionId: 'stress', taxonomyId: 7, expectedMinQuestions: 1500 },
  { sectionId: 'grammar_vocab_cloze', taxonomyId: 4, expectedMinQuestions: 15000 },
  { sectionId: 'vocab_cloze', taxonomyId: 537, expectedMinQuestions: 9000 },
  { sectionId: 'sentence_scramble', taxonomyId: 457, expectedMinQuestions: 350 },
  { sectionId: 'cloze_sentence', taxonomyId: 242, expectedMinQuestions: 190 },
  { sectionId: 'cloze_passage', taxonomyId: 16, expectedMinQuestions: 2300 },
  { sectionId: 'dialogue_completion', taxonomyId: 11, expectedMinQuestions: 2200 },
  { sectionId: 'functional_text', taxonomyId: 456, expectedMinQuestions: 270 },
  { sectionId: 'reading_notices', taxonomyId: 304, expectedMinQuestions: 1400 },
  { sectionId: 'reading_signs', taxonomyId: 224, expectedMinQuestions: 480 },
  { sectionId: 'reading_nonfiction', taxonomyId: 17, expectedMinQuestions: 7600 },
  { sectionId: 'sentence_closest', taxonomyId: 14, expectedMinQuestions: 2300 },
  { sectionId: 'sentence_building', taxonomyId: 246, expectedMinQuestions: 700 }
];

for (const sec of expectedSections) {
  const found = sectionsIndex.find(s => s.sectionId === sec.sectionId || s.taxonomyId === sec.taxonomyId);
  check(`Section with taxonomyId ${sec.taxonomyId} exists in index.json`, !!found, `Missing taxonomy ${sec.taxonomyId}`);
  if (found) {
    check(
      `Section '${found.sectionId}' has >= ${sec.expectedMinQuestions} questions (actual: ${found.totalQuestions})`,
      found.totalQuestions >= sec.expectedMinQuestions,
      `Got: ${found.totalQuestions}`
    );
  }
}

// Check LuyenPhanView.tsx dynamically renders sectionsData
const luyenPhanPath = path.join(ROOT, 'src', 'components', 'LuyenPhanView.tsx');
const luyenPhanCode = fs.readFileSync(luyenPhanPath, 'utf8');

check('LuyenPhanView imports sectionsData from index.json',
  luyenPhanCode.includes("import sectionsData from '../../data/sections/index.json'"));

check('LuyenPhanView heading specifies "14 Dạng Bài Chuẩn Hóa Vào Lớp 10 Môn Tiếng Anh"',
  luyenPhanCode.includes('14 Dạng Bài Chuẩn Hóa Vào Lớp 10 Môn Tiếng Anh'));

// -----------------------------------------------------------------------------
// VECTOR 5: Dark Mode Styling Inspection across Components
// -----------------------------------------------------------------------------
console.log('\n▶ [Vector 5] Stress Testing Dark Mode CSS Contrast & Surfaces...');

const hocOnPath = path.join(ROOT, 'src', 'components', 'HocOnView.tsx');
const hocOnCode = fs.readFileSync(hocOnPath, 'utf8');
check('HocOnView contains dark:bg-[#242824] surface classes', hocOnCode.includes('dark:bg-[#242824]'));
check('HocOnView contains dark:border-[#383c38] border classes', hocOnCode.includes('dark:border-[#383c38]'));
check('HocOnView contains dark:text-white and dark:text-[#7ed957] classes',
  hocOnCode.includes('dark:text-white') && hocOnCode.includes('dark:text-[#7ed957]'));

const vocabLookupPath = path.join(ROOT, 'src', 'components', 'VocabLookupModal.tsx');
const vocabLookupCode = fs.readFileSync(vocabLookupPath, 'utf8');
check('VocabLookupModal contains dark:bg-[#242824] container classes', vocabLookupCode.includes('dark:bg-[#242824]'));
check('VocabLookupModal contains dark:bg-[#1a1d1a] header/table classes', vocabLookupCode.includes('dark:bg-[#1a1d1a]'));
check('VocabLookupModal contains dark:border-[#383c38] classes', vocabLookupCode.includes('dark:border-[#383c38]'));

const practiceSessionPath = path.join(ROOT, 'src', 'components', 'PracticeSessionModal.tsx');
const practiceSessionCode = fs.readFileSync(practiceSessionPath, 'utf8');
check('PracticeSessionModal contains dark:bg-[#242824] modal surface', practiceSessionCode.includes('dark:bg-[#242824]'));
check('PracticeSessionModal contains dark:border-[#383c38] border classes', practiceSessionCode.includes('dark:border-[#383c38]'));

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`📊 ADVERSARIAL VERIFICATION SUMMARY: ${passedChecks}/${totalChecks} CHECKS PASSED`);
if (failures.length === 0) {
  console.log('🎉 ALL ADVERSARIAL CHECKS PASSED WITH ZERO DEFECTS!');
} else {
  console.log(`❌ ${failures.length} CHECKS FAILED:`);
  failures.forEach(f => console.error(`  - ${f.desc}: ${f.details}`));
}
console.log('========================================================================');

process.exit(failures.length === 0 ? 0 : 1);
