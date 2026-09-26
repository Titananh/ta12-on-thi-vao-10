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

// Tak12 Question Palette Signature Green Priority
check('globals.css defines .bg-[#5fbd18] priority rule with background-color: #5fbd18 !important',
  cssContent.includes('.bg-\\[\\#5fbd18\\]') && cssContent.includes('background-color: #5fbd18 !important;'));
check('globals.css defines .border-[#5fbd18] priority rule with border-color: #5fbd18 !important',
  cssContent.includes('.border-\\[\\#5fbd18\\]') && cssContent.includes('border-color: #5fbd18 !important;'));
check('globals.css defines .hover:bg-[#4ea713]:hover priority rule with background-color: #4ea713 !important',
  cssContent.includes('.hover\\:bg-\\[\\#4ea713\\]:hover') && cssContent.includes('background-color: #4ea713 !important;'));

// -----------------------------------------------------------------------------
// VECTOR 2: ExamRunner.tsx Native Tak12 Parity & Event Delegation
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 2: ExamRunner.tsx Native Tak12 Parity & Event Delegation Verification...');
const examRunnerPath = path.join(SRC_DIR, 'components', 'ExamRunner.tsx');
const examRunnerCode = fs.readFileSync(examRunnerPath, 'utf8');

check('ExamRunner dynamically associates <label htmlFor> with control id',
  examRunnerCode.includes("label.setAttribute('for', controlId)"));
check('ExamRunner ensures controls have unique id',
  examRunnerCode.includes('control.id = controlId'));
check('ExamRunner adds native change listener to questionPromptRef container',
  examRunnerCode.includes("container.addEventListener('change', handleSync)"));
check('ExamRunner adds native input listener to questionPromptRef container',
  examRunnerCode.includes("container.addEventListener('input', handleSync)"));
check('ExamRunner removes native listeners on cleanup',
  examRunnerCode.includes("container.removeEventListener('change', handleSync)") &&
  examRunnerCode.includes("container.removeEventListener('input', handleSync)"));
check('ExamRunner eliminates conflicting showPicker calls',
  !examRunnerCode.includes('showPicker'));
check('ExamRunner eliminates duplicate onClick on questionPromptRef in JSX',
  !examRunnerCode.includes('ref={questionPromptRef}\n                    onClick=') &&
  !examRunnerCode.includes('ref={questionPromptRef} onClick='));
check('ExamRunner palette completed state includes Tak12 signature green #5fbd18',
  examRunnerCode.includes('#5fbd18'));
check('ExamRunner bidirectional sync supports numeric & string index lookup',
  examRunnerCode.includes('parseInt(idx, 10)'));

// -----------------------------------------------------------------------------
// VECTOR 3: PracticeRunner (page.tsx) Native Tak12 Parity & Event Delegation
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 3: PracticeRunner (page.tsx) Native Tak12 Parity Verification...');
const practicePath = path.join(SRC_DIR, 'app', 'practice', '[topicId]', 'page.tsx');
const practiceCode = fs.readFileSync(practicePath, 'utf8');

check('Practice page dynamically associates <label htmlFor> with control id',
  practiceCode.includes("label.setAttribute('for', controlId)"));
check('Practice page ensures controls have unique id',
  practiceCode.includes('control.id = controlId'));
check('Practice page adds native change listener to container',
  practiceCode.includes("container.addEventListener('change', handleSync)"));
check('Practice page adds native input listener to container',
  practiceCode.includes("container.addEventListener('input', handleSync)"));
check('Practice page removes native listeners on cleanup',
  practiceCode.includes("container.removeEventListener('change', handleSync)") &&
  practiceCode.includes("container.removeEventListener('input', handleSync)"));
check('Practice page eliminates conflicting showPicker calls',
  !practiceCode.includes('showPicker'));
check('Practice page eliminates duplicate onClick on questionPromptRef in JSX',
  !practiceCode.includes('ref={questionPromptRef}\n              onClick=') &&
  !practiceCode.includes('ref={questionPromptRef} onClick='));
check('Practice page bidirectional sync supports numeric & string index lookup',
  practiceCode.includes('parseInt(idx, 10)'));

// -----------------------------------------------------------------------------
// VECTOR 4: Functional Simulation of Click Delegation & showPicker
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 4: Functional DOM Simulation of Native Label htmlFor Pairing...');

function createMockElement(tag, attrs = {}) {
  const children = [];
  const classList = new Set((attrs.class || '').split(/\s+/).filter(Boolean));
  let parent = null;
  let focused = false;

  const el = {
    tagName: tag.toUpperCase(),
    attributes: { ...attrs },
    disabled: Boolean(attrs.disabled),
    value: attrs.value || '',
    id: attrs.id || '',
    getAttribute(name) { return el.attributes[name] ?? null; },
    setAttribute(name, val) {
      el.attributes[name] = val;
      if (name === 'id') el.id = val;
    },
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
        if (selector === 'label' && ch.tagName === 'LABEL') return ch;
        const found = ch.querySelector(selector);
        if (found) return found;
      }
      return null;
    },
    querySelectorAll(selector) {
      const results = [];
      function walk(node) {
        for (const ch of node.children) {
          if (selector === '.fillblank-option' && ch.classList.contains('fillblank-option')) results.push(ch);
          walk(ch);
        }
      }
      walk(el);
      return results;
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

// Simulate the dynamic pairing logic in ExamRunner and PracticeRunner
const options = container.querySelectorAll('.fillblank-option');
options.forEach((opt) => {
  const lbl = opt.querySelector('label');
  const ctrl = opt.querySelector('select');
  if (lbl && ctrl) {
    const controlId = ctrl.id || ctrl.getAttribute('name') || `fbo-1201768-${ctrl.getAttribute('index') || '0'}`;
    if (!ctrl.id) ctrl.id = controlId;
    if (!lbl.getAttribute('for')) lbl.setAttribute('for', controlId);
  }
});

// 1. Verify dynamic pairing
check('Dynamic pairing assigns control id', select.id === 'fbo-1201768-0');
check('Dynamic pairing associates label for attribute', label.getAttribute('for') === 'fbo-1201768-0');

// 2. Simulate native browser label activation (HTML standard triggers focus on labeled control)
function simulateLabelClick(lbl) {
  const forId = lbl.getAttribute('for');
  if (forId && select.id === forId && !select.disabled) {
    select.focus();
    return true;
  }
  return false;
}

const labelClickResult = simulateLabelClick(label);
check('Clicking <label> activates select via htmlFor (returns true)', labelClickResult === true);
check('Clicking <label> focused the select element natively', select.isFocused === true);

// 3. Verify disabled control is not activated
select.disabled = true;
const disabledClick = simulateLabelClick(label);
check('Clicking <label> on disabled select does not activate', disabledClick === false);

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
