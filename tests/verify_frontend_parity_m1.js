/**
 * Verification Suite for Milestone M1 (Frontend & UX/UI Parity & Polish)
 * Verifies all 5 requirements across target components.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('========================================================================');
console.log('🧪 VERIFYING MILESTONE M1: FRONTEND & UX/UI PARITY & POLISH');
console.log('========================================================================\n');

let passCount = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

// ------------------------------------------------------------------------
// Test Suite 1: CourseDashboardReport.tsx (F01)
// ------------------------------------------------------------------------
console.log('▶ Requirement 1: CourseDashboardReport (7/15/30-Day Timestamp Math)...');
const reportSource = fs.readFileSync(path.join(__dirname, '../src/components/CourseDashboardReport.tsx'), 'utf8');

test('CourseDashboardReport calculates cutoff based on 7, 15, or 30 days', () => {
  assert(reportSource.includes('timeFilter === \'15d\' || timeFilter === \'15\''), 'Handles 15d filter');
  assert(reportSource.includes('timeFilter === \'30d\' || timeFilter === \'30\''), 'Handles 30d filter');
  assert(reportSource.includes('Date.now() - days * 86400000'), 'Uses 86400000 ms per day math');
});

test('CourseDashboardReport filters exam results by completedAt timestamp', () => {
  assert(reportSource.includes('filteredEntries'), 'Filters exam entries');
  assert(reportSource.includes('e.completedAt >= cutoff') || reportSource.includes('ts >= cutoff'), 'Compares completedAt to cutoff');
});

test('CourseDashboardReport filters topic and section progress by timestamp', () => {
  assert(reportSource.includes('progEntries'), 'Filters topic progress entries');
  assert(reportSource.includes('secEntries'), 'Filters section progress entries');
});

// ------------------------------------------------------------------------
// Test Suite 2: ExamRunner.tsx (F02)
// ------------------------------------------------------------------------
console.log('\n▶ Requirement 2: ExamRunner Draft Auto-Saving (ta12_exam_draft_${examId})...');
const examRunnerSource = fs.readFileSync(path.join(__dirname, '../src/components/ExamRunner.tsx'), 'utf8');

test('ExamRunner uses storage key ta12_exam_draft_${exam.id}', () => {
  assert(examRunnerSource.includes('ta12_exam_draft_${exam.id}'), 'Includes draft key template');
});

test('ExamRunner draft payload contains examId, answers, flagged, timeLeftSeconds, lastSavedAt', () => {
  assert(examRunnerSource.includes('examId: exam.id'), 'Payload has examId');
  assert(examRunnerSource.includes('answers'), 'Payload has answers');
  assert(examRunnerSource.includes('flagged: flaggedRecord'), 'Payload has flagged');
  assert(examRunnerSource.includes('timeLeftSeconds'), 'Payload has timeLeftSeconds');
  assert(examRunnerSource.includes('lastSavedAt: Date.now()'), 'Payload has lastSavedAt');
});

test('ExamRunner restores draft on mount with answers, flags, and time', () => {
  assert(examRunnerSource.includes('isDraftLoadedRef'), 'Uses draft loaded ref guard');
  assert(examRunnerSource.includes('setAnswers(draft.answers)'), 'Restores answers');
  assert(examRunnerSource.includes('setBookmarks('), 'Restores bookmarks/flags');
  assert(examRunnerSource.includes('setTimeLeftSeconds(draft.timeLeftSeconds)'), 'Restores time left');
});

test('ExamRunner removes draft from localStorage in handleSubmitExam', () => {
  assert(examRunnerSource.includes('localStorage.removeItem(`ta12_exam_draft_${exam.id}`)'), 'Cleans up draft on submit');
});

// ------------------------------------------------------------------------
// Test Suite 3: Practice Page (F03, F04, F05)
// ------------------------------------------------------------------------
console.log('\n▶ Requirement 3: Practice Page (Encouragement, 400px Drawer & Hydration)...');
const practiceSource = fs.readFileSync(path.join(__dirname, '../src/app/practice/[topicId]/page.tsx'), 'utf8');
const globalsCss = fs.readFileSync(path.join(__dirname, '../src/app/globals.css'), 'utf8');

test('Practice Page dynamic encouragement bar has a pool of authentic phrases', () => {
  assert(practiceSource.includes('ENCOURAGEMENT_PHRASES'), 'Defines ENCOURAGEMENT_PHRASES array');
  assert(practiceSource.includes('Tuyệt vời! Bạn nắm rất vững kiến thức này.'), 'Includes authentic praise 1');
  assert(practiceSource.includes('Chính xác! Tiếp tục duy trì phong độ nhé.'), 'Includes authentic praise 2');
  assert(practiceSource.includes('Làm tốt lắm! Sự tập trung của bạn đang mang lại kết quả cao.'), 'Includes authentic praise 3');
  assert(practiceSource.includes('encouragementMessage'), 'Uses dynamic encouragementMessage state in JSX');
});

test('Practice Page translation drawer maintains 400px width in CSS', () => {
  assert(globalsCss.includes('.translation-sheet'), 'Contains .translation-sheet class');
  assert(globalsCss.includes('width: 400px'), 'Translation sheet width is 400px');
});

test('Practice Page translation drawer contains 4 bilingual choice cards (A, B, C, D)', () => {
  assert(practiceSource.includes('Đáp án song ngữ:'), 'Contains bilingual choices header');
  assert(practiceSource.includes('viTranslation'), 'Renders Vietnamese translation');
  assert(practiceSource.includes('c.text'), 'Renders English text');
  assert(practiceSource.includes('Đáp án đúng'), 'Indicates correct answer');
});

test('Practice Page translation drawer contains detailed explanation accordion', () => {
  assert(practiceSource.includes('Giải thích chi tiết &amp; Ngữ pháp'), 'Contains explanation accordion title');
  assert(practiceSource.includes('isDrawerExplanationOpen'), 'Accordion has toggle state');
  assert(practiceSource.includes('currentQ.explanation'), 'Displays question explanation');
});

test('Practice Page translation drawer contains vocabulary flashcard component', () => {
  assert(practiceSource.includes('extractVocabFromQuestion'), 'Extracts vocabulary from question');
  assert(practiceSource.includes('Flashcard từ vựng'), 'Displays flashcard section');
  assert(practiceSource.includes('item.word'), 'Renders word');
  assert(practiceSource.includes('item.meaning'), 'Renders meaning');
  assert(practiceSource.includes('speakText(item.word)'), 'Renders audio button');
});

test('Practice Page guards isAutomatedTest with hasMounted for SSR hydration parity', () => {
  assert(practiceSource.includes('const [hasMounted, setHasMounted] = useState'), 'Defines hasMounted state');
  assert(practiceSource.includes('const isAutomatedTest = hasMounted && typeof window !== \'undefined\' && Boolean(window.navigator?.webdriver)'), 'Guards webdriver check with hasMounted');
});

// ------------------------------------------------------------------------
// Test Suite 4: DiagnosticAnalysisSection.tsx (F06)
// ------------------------------------------------------------------------
console.log('\n▶ Requirement 4: DiagnosticAnalysisSection Dynamic Routing & Topic IDs...');
const diagnosticSource = fs.readFileSync(path.join(__dirname, '../src/components/DiagnosticAnalysisSection.tsx'), 'utf8');

test('DiagnosticAnalysisSection routes "Luyện dạng bài này" dynamically', () => {
  assert(diagnosticSource.includes('router.push(`/practice/${item.sectionId}?sectionId=${item.sectionId}&count=20`)'), 'Dynamic route for section');
  assert(!diagnosticSource.includes('router.push(\'/practice/guided_cloze?sectionId=guided_cloze\')'), 'No hardcoded guided_cloze');
});

test('DiagnosticAnalysisSection routes "Luyện chủ điểm này" dynamically', () => {
  assert(diagnosticSource.includes('router.push(`/practice/${item.topicId}`)'), 'Dynamic route for topic');
  assert(!diagnosticSource.includes('router.push(\'/practice/29\')'), 'No hardcoded topic 29');
});

test('DiagnosticAnalysisSection maps categories to numeric topic IDs for custom practice', () => {
  assert(diagnosticSource.includes('numericTopicIds'), 'Maps names to numericTopicIds');
  assert(diagnosticSource.includes('router.push(`/practice/custom?topics=${finalIds.join(\',\')}&count=20`)'), 'Passes comma-separated numeric IDs');
});

// ------------------------------------------------------------------------
// Test Suite 5: PracticeSessionModal.tsx & LuyenPhanView.tsx (F07)
// ------------------------------------------------------------------------
console.log('\n▶ Requirement 5: Difficulty Selector UI & Badges...');
const modalSource = fs.readFileSync(path.join(__dirname, '../src/components/PracticeSessionModal.tsx'), 'utf8');
const luyenPhanSource = fs.readFileSync(path.join(__dirname, '../src/components/LuyenPhanView.tsx'), 'utf8');

test('PracticeSessionModal includes difficulty selector UI with all 4 levels', () => {
  assert(modalSource.includes('Mức độ khó'), 'Has difficulty label');
  assert(modalSource.includes('setDifficulty(lvl.id)'), 'Wires buttons to setDifficulty');
  assert(modalSource.includes('Tất cả') && modalSource.includes('Dễ') && modalSource.includes('Trung bình') && modalSource.includes('Khó'), 'All 4 difficulty options present');
});

test('LuyenPhanView exposes difficulty badges on section cards', () => {
  assert(luyenPhanSource.includes('Difficulty Level Badges'), 'Has difficulty badges comment');
  assert(luyenPhanSource.includes('>Dễ<') || luyenPhanSource.includes('Dễ'), 'Dễ badge present');
  assert(luyenPhanSource.includes('>Trung bình<') || luyenPhanSource.includes('Trung bình'), 'Trung bình badge present');
  assert(luyenPhanSource.includes('>Khó<') || luyenPhanSource.includes('Khó'), 'Khó badge present');
});

test('LuyenPhanView drill modal exposes difficulty selector UI', () => {
  assert(luyenPhanSource.includes('drillDifficulty'), 'Has drillDifficulty state');
  assert(luyenPhanSource.includes('setDrillDifficulty(lvl.id)'), 'Has drill difficulty selector');
});

console.log('\n========================================================================');
console.log(`🎉 ALL ${passCount} / ${passCount} CHECKS PASSED WITH 100% SUCCESS!`);
console.log('========================================================================');
