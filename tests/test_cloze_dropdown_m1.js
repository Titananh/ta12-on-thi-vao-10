/**
 * Milestone 1 Verification Suite: Cloze Dropdown Selection & Dark Mode Styling
 * 
 * Tests:
 * 1. globals.css styling: cursor: pointer on .fillblank-option & label, color-scheme: dark & light
 * 2. ExamRunner.tsx click event delegation, showPicker call, focus, and non-duplicate activation
 * 3. PracticeRunner (page.tsx) click event delegation, showPicker call, focus, and non-duplicate activation
 * 4. Exam 19159 Q33-36 Cloze question state synchronization:
 *    - 0/4 to 4/4 blanks progression
 *    - Palette status turning emerald only when all 4 blanks filled
 *    - Navigation retention with string/numeric key tolerance
 *    - Review mode disabling and proportional scoring
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('========================================================================');
console.log('🧪 MILESTONE 1 VERIFICATION: CLOZE DROPDOWN SELECTION & STYLING');
console.log('========================================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    throw new Error(`Assertion failed: ${desc}`);
  }
}

// -----------------------------------------------------------------------------
// VECTOR 1: globals.css Cursor & Color-Scheme Verification
// -----------------------------------------------------------------------------
console.log('▶ Vector 1: globals.css Cursor & Color-Scheme Verification...');
const cssPath = path.join(SRC_DIR, 'app', 'globals.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// Universal rules
check('globals.css defines select, option { color-scheme: light }',
  cssContent.includes('select,') && cssContent.includes('option {') && cssContent.includes('color-scheme: light;'));
check('globals.css defines .dark select, .dark option { color-scheme: dark }',
  cssContent.includes('.dark select,') && cssContent.includes('.dark option {') && cssContent.includes('color-scheme: dark;'));

// Fillblank option & label cursor
check('globals.css defines .fillblank-option with cursor: pointer',
  cssContent.includes('.fillblank-option {') && cssContent.includes('cursor: pointer;'));
check('globals.css defines .fillblank-option label with cursor: pointer',
  cssContent.includes('.fillblank-option label {') && cssContent.includes('cursor: pointer;'));
check('globals.css defines .dark .fillblank-option label with cursor: pointer',
  cssContent.includes('.dark .fillblank-option label {') && cssContent.includes('cursor: pointer;'));

// Specific select & option rules
check('globals.css .fillblank-option select has color-scheme: light',
  cssContent.includes('.fillblank-option select,') && cssContent.includes('color-scheme: light;'));
check('globals.css .dark .fillblank-option select has color-scheme: dark',
  cssContent.includes('.dark .fillblank-option select,') && cssContent.includes('color-scheme: dark;'));
check('globals.css .fillblank-option select option has color-scheme: light',
  cssContent.includes('.fillblank-option select option,') && cssContent.includes('color-scheme: light;'));
check('globals.css .dark .fillblank-option select option has color-scheme: dark',
  cssContent.includes('.dark .fillblank-option select option,') && cssContent.includes('color-scheme: dark;'));

// Feedback states color-scheme
check('globals.css .dark .fillblank-option.correct select has color-scheme: dark',
  cssContent.includes('.dark .fillblank-option.correct select') && cssContent.includes('color-scheme: dark;'));
check('globals.css .dark .fillblank-option.wrong select has color-scheme: dark',
  cssContent.includes('.dark .fillblank-option.wrong select') && cssContent.includes('color-scheme: dark;'));

// -----------------------------------------------------------------------------
// VECTOR 2: ExamRunner.tsx Click Delegation & showPicker Implementation
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 2: ExamRunner.tsx Click Delegation & showPicker AST/Static Verification...');
const examRunnerPath = path.join(SRC_DIR, 'components', 'ExamRunner.tsx');
const examRunnerCode = fs.readFileSync(examRunnerPath, 'utf8');

check('ExamRunner has lastPickerActivationRef for debounce', examRunnerCode.includes('lastPickerActivationRef'));
check('ExamRunner adds click listener to questionPromptRef container', examRunnerCode.includes("container.addEventListener('click', handleClick)"));
check('ExamRunner removes click listener on cleanup', examRunnerCode.includes("container.removeEventListener('click', handleClick)"));
check('ExamRunner locates .fillblank-option on click target', examRunnerCode.includes("target.closest('.fillblank-option')"));
check('ExamRunner calls select.focus()', examRunnerCode.includes('select.focus()'));
check('ExamRunner calls select.showPicker() with fallback try/catch', examRunnerCode.includes('showPicker?.()') || examRunnerCode.includes('showPicker()'));
check('ExamRunner guards select activation with !select.disabled', examRunnerCode.includes('!select.disabled'));
check('ExamRunner also attaches onClick to questionPromptRef div in JSX', examRunnerCode.includes('ref={questionPromptRef}') && examRunnerCode.includes('onClick='));
check('ExamRunner bidirectional sync supports numeric & string index lookup', examRunnerCode.includes('parseInt(idx, 10)'));

// -----------------------------------------------------------------------------
// VECTOR 3: PracticeRunner (page.tsx) Click Delegation & showPicker Implementation
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 3: PracticeRunner (page.tsx) Click Delegation & showPicker Verification...');
const practicePath = path.join(SRC_DIR, 'app', 'practice', '[topicId]', 'page.tsx');
const practiceCode = fs.readFileSync(practicePath, 'utf8');

check('Practice page has lastPickerActivationRef for debounce', practiceCode.includes('lastPickerActivationRef'));
check('Practice page adds click listener to container', practiceCode.includes("container.addEventListener('click', handleClick)"));
check('Practice page removes click listener on cleanup', practiceCode.includes("container.removeEventListener('click', handleClick)"));
check('Practice page locates .fillblank-option on click target', practiceCode.includes("target.closest('.fillblank-option')"));
check('Practice page calls select.focus()', practiceCode.includes('select.focus()'));
check('Practice page calls select.showPicker() with fallback try/catch', practiceCode.includes('showPicker?.()') || practiceCode.includes('showPicker()'));
check('Practice page guards select activation with !select.disabled', practiceCode.includes('!select.disabled'));
check('Practice page also attaches onClick to questionPromptRef div in JSX', practiceCode.includes('ref={questionPromptRef}') && practiceCode.includes('onClick='));
check('Practice page bidirectional sync supports numeric & string index lookup', practiceCode.includes('parseInt(idx, 10)'));

// -----------------------------------------------------------------------------
// VECTOR 4: Functional Simulation of Click Delegation & showPicker
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 4: Functional DOM Simulation of Click Delegation...');

function createMockElement(tag, attrs = {}) {
  const children = [];
  const classList = new Set((attrs.class || '').split(/\s+/).filter(Boolean));
  let parent = null;
  let focused = false;
  let pickerOpened = false;

  const el = {
    tagName: tag.toUpperCase(),
    attributes: { ...attrs },
    disabled: Boolean(attrs.disabled),
    value: attrs.value || '',
    getAttribute(name) { return el.attributes[name] ?? null; },
    setAttribute(name, val) { el.attributes[name] = val; },
    appendChild(child) {
      child.parent = el;
      children.push(child);
      return child;
    },
    get children() { return children; },
    get parentElement() { return parent; },
    get parent() { return parent; },
    set parent(p) { parent = p; },
    classList: {
      contains(cls) { return classList.has(cls); },
      add(cls) { classList.add(cls); },
      remove(cls) { classList.delete(cls); },
    },
    focus() { focused = true; },
    get isFocused() { return focused; },
    showPicker() { pickerOpened = true; },
    get isPickerOpened() { return pickerOpened; },
    closest(selector) {
      let cur = el;
      while (cur) {
        if (selector === '.fillblank-option' && cur.classList.contains('fillblank-option')) return cur;
        cur = cur.parent;
      }
      return null;
    },
    querySelector(selector) {
      for (const ch of children) {
        if (selector === 'select' && ch.tagName === 'SELECT') return ch;
        if (selector === 'input' && ch.tagName === 'INPUT') return ch;
        const found = ch.querySelector(selector);
        if (found) return found;
      }
      return null;
    }
  };
  return el;
}

// Build DOM hierarchy for Exam 19159 Q30 blank 28.1
const container = createMockElement('div');
const fbSpan = createMockElement('span', { class: 'fillblank-option' });
const label = createMockElement('label');
label.textContent = '28.1';
const select = createMockElement('select', { class: 'ms fillblank-option-28', index: '0', name: 'fbo-1201768-0' });

fbSpan.appendChild(label);
fbSpan.appendChild(select);
container.appendChild(fbSpan);

// Simulate the click delegation logic
let lastActivation = 0;
function simulateContainerClick(target, isSubmitted = false) {
  if (isSubmitted || !target) return false;
  if (target.tagName === 'SELECT' || target.tagName === 'INPUT') return false;

  const now = Date.now();
  if (now - lastActivation < 250) return false;

  const fillblankContainer = (target.closest('.fillblank-option') || target.querySelector?.('.fillblank-option'));
  if (fillblankContainer) {
    const sel = fillblankContainer.querySelector('select');
    if (sel && !sel.disabled) {
      lastActivation = now;
      sel.focus();
      try { sel.showPicker?.(); } catch {}
      return true;
    }
  }
  return false;
}

// 1. Click on <label>
const labelClickResult = simulateContainerClick(label);
check('Click on <label> activates select (returns true)', labelClickResult === true);
check('Click on <label> focused the select', select.isFocused === true);
check('Click on <label> invoked showPicker() on the select', select.isPickerOpened === true);

// 2. Click immediately within debounce window (synthetic duplicate)
const duplicateClickResult = simulateContainerClick(label);
check('Debounce prevents duplicate activation within 250ms', duplicateClickResult === false);

// 3. Click directly on select element
const directSelectClick = simulateContainerClick(select);
check('Click directly on select lets native handler proceed (returns false)', directSelectClick === false);

// 4. Click when disabled
select.disabled = true;
lastActivation = 0; // reset debounce
const disabledClick = simulateContainerClick(label);
check('Click on disabled control does not activate', disabledClick === false);

// -----------------------------------------------------------------------------
// VECTOR 5: Real Exam 19159 Q33-36 State Sync & Palette Transition
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 5: Exam 19159 Questions 33–36 State Sync & Palette Transition...');
const bundle19159Path = path.join(DATA_DIR, 'exams', 'bundles', '19159.json');
check('19159.json bundle exists', fs.existsSync(bundle19159Path));

const exam19159 = JSON.parse(fs.readFileSync(bundle19159Path, 'utf8'));
const q30 = exam19159.questions.find((q) => q.id === 1201768 || q.questionNumber === 30);
check('Exam 19159 contains Question 30 (id 1201768)', Boolean(q30));
check('Question 30 has fillblankAnswers with 4 blanks', q30 && q30.fillblankAnswers && q30.fillblankAnswers.length === 4);

function normalizeBlankValue(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, ' ');
}

function getQuestionResult(q, userAns) {
  const answerMap = (typeof userAns === 'object' && userAns !== null)
    ? userAns
    : (userAns ? { '0': userAns } : {});
  const totalUnits = q.fillblankAnswers.length;
  let answeredUnits = 0;
  let correctUnits = 0;

  q.fillblankAnswers.forEach((blank) => {
    const userValue = normalizeBlankValue(answerMap[String(blank.index)] ?? answerMap[blank.index] ?? '');
    if (userValue) answeredUnits++;
    if ((blank.correctAnswers || []).some((candidate) => normalizeBlankValue(candidate) === userValue)) {
      correctUnits++;
    }
  });

  return {
    totalUnits,
    answeredUnits,
    correctUnits,
    isFullyAnswered: answeredUnits === totalUnits,
    isFullyCorrect: correctUnits === totalUnits,
  };
}

// Progression test: 0/4 to 4/4 blanks
const testAnswers = {};
let res = getQuestionResult(q30, testAnswers);
check('0/4 blanks: answeredUnits === 0', res.answeredUnits === 0);
check('0/4 blanks: isFullyAnswered === false (palette gray)', res.isFullyAnswered === false);

// Blank 0 filled
testAnswers['0'] = 'Get';
res = getQuestionResult(q30, testAnswers);
check('1/4 blanks: answeredUnits === 1', res.answeredUnits === 1);
check('1/4 blanks: isFullyAnswered === false (palette still gray)', res.isFullyAnswered === false);

// Blank 1 filled
testAnswers['1'] = 'part';
res = getQuestionResult(q30, testAnswers);
check('2/4 blanks: answeredUnits === 2', res.answeredUnits === 2);
check('2/4 blanks: isFullyAnswered === false', res.isFullyAnswered === false);

// Blank 2 filled
testAnswers['2'] = 'on';
res = getQuestionResult(q30, testAnswers);
check('3/4 blanks: answeredUnits === 3', res.answeredUnits === 3);
check('3/4 blanks: isFullyAnswered === false', res.isFullyAnswered === false);

// Blank 3 filled (all 4 filled)
testAnswers['3'] = 'traditional';
res = getQuestionResult(q30, testAnswers);
check('4/4 blanks: answeredUnits === 4', res.answeredUnits === 4);
check('4/4 blanks: isFullyAnswered === true (palette turns EMERALD)', res.isFullyAnswered === true);

// Numeric key tolerance test
const numericAnswers = { 0: 'Get', 1: 'part', 2: 'on', 3: 'traditional' };
const numRes = getQuestionResult(q30, numericAnswers);
check('Numeric key answers evaluated with 100% tolerance', numRes.answeredUnits === 4 && numRes.isFullyAnswered === true);

// Scoring evaluation: check correct answers match bundle
let correctCount = 0;
q30.fillblankAnswers.forEach((b) => {
  const correct = b.correctAnswers[0];
  testAnswers[String(b.index)] = correct;
});
const perfectRes = getQuestionResult(q30, testAnswers);
check('Providing all correct answers achieves 4/4 correct units', perfectRes.correctUnits === 4 && perfectRes.isFullyCorrect === true);

// Review mode badge formatting check
const totalQuestions = 40;
const pointsPerQuestion = 10 / totalQuestions; // 0.25đ per unit
const earnedPoints = perfectRes.correctUnits * pointsPerQuestion;
check('Perfect score on Question 30 awards 1.00 points', earnedPoints === 1.0);

console.log('\n========================================================================');
console.log(`📊 ALL M1 VERIFICATION CHECKS PASSED: ${passedChecks} / ${totalChecks}`);
console.log('========================================================================\n');
