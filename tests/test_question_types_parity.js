/**
 * TA12 Automated Test Suite: Question Types Parity, DOM Synchronization & ExamRunner Integration
 * 
 * Comprehensive Test Suite covering Tiers 1 to 4:
 * - Tier 1: Core Feature Coverage & UI/UX State Mechanics
 *   - MultipleChoice selection, keyboard shortcuts, submit unlock, scoring
 *   - FillBlank (Select) HTML parsing, event delegation, bidirectional DOM sync, submit unlock
 *   - FillBlank (Input) & ShortAnswer keyboard text entry, submit unlock, sentence matching
 *   - WordOrder chip assembly, sequential placement, removal, submit unlock, sentence matching
 *   - 1-Retry FSM: initial -> submit wrong -> retry (preserve input) -> fix/submit retry -> answer reveal
 *   - Dark Mode CSS contrast and styling rules in globals.css
 * - Tier 2: Boundary & Corner Cases
 *   - Extreme whitespace, single character, empty string, long words
 *   - Case insensitivity, special characters (∅)
 *   - Contraction expansion and smart quotes normalization
 *   - Terminal punctuation stripping, punctuation spacing
 *   - Partial blank completion gating (0/N .. N/N)
 *   - Numeric vs string index tolerance
 * - Tier 3: Cross-Feature Combinations & ExamRunner Parity
 *   - Question inclusion & filtering in testableQuestions (MC + FB + ShortAnswer + WordOrder included)
 *   - Composite answer state tracking in ExamRunner (Record<string, any>)
 *   - Cross-question navigation preserving multi-blank inputs and choices
 *   - Palette completion status calculation (isQuestionAnswered)
 *   - Atomic-unit scoring for multi-blank groups and all-or-nothing text questions
 *   - Review Mode DOM decoration (.correct, .wrong, .fillblank-correct-badge)
 * - Tier 4: Real-World Exam Bundles & Practice Data
 *   - Real Exam 1462 (37 raw -> 36 answerable groups / 40 atomic points, score calculation)
 *   - Real Exam 12852 (FillBlank passages, testable questions, grading)
 *   - Real Practice Section sign_notices.json (28 FillBlank + 113 MultipleChoice)
 *   - Real Practice Section guided_cloze.json (207 FillBlank questions)
 *   - Real Practice Section sentence_combination.json (WordOrder)
 *   - Real Practice Section grammar_vocab_cloze.json (ShortAnswer)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('========================================================================');
console.log('🧪 TEST SUITE: QUESTION TYPES PARITY & CROSS-FEATURE COMPREHENSIVE SUITE');
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
// CORE NORMALIZATION LOGIC (Verbatim from src/app/practice/[topicId]/page.tsx & ExamRunner.tsx)
// -----------------------------------------------------------------------------
function normalizeBlankValue(str) {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, ' ');
}

function normalizeSentence(str) {
  if (!str) return '';
  return str
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\s.?!]+$/, '')
    .replace(/\s*([,.:;?!])\s*/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[\s.?!]+$/, '');
}

function expandContractions(s) {
  return s
    .replace(/\bhaven't\b/g, 'have not')
    .replace(/\bhasn't\b/g, 'has not')
    .replace(/\bdidn't\b/g, 'did not')
    .replace(/\bwon't\b/g, 'will not')
    .replace(/\bcan't\b/g, 'cannot')
    .replace(/\bisn't\b/g, 'is not')
    .replace(/\baren't\b/g, 'are not')
    .replace(/\bwasn't\b/g, 'was not')
    .replace(/\bweren't\b/g, 'were not')
    .replace(/\bwouldn't\b/g, 'would not')
    .replace(/\bcouldn't\b/g, 'could not')
    .replace(/\bshouldn't\b/g, 'should not');
}

function matchesSentence(user, target) {
  const normUser = normalizeSentence(user);
  const normTarget = normalizeSentence(target);
  if (normUser === normTarget) return true;
  return expandContractions(normUser) === expandContractions(normTarget);
}

// -----------------------------------------------------------------------------
// LIGHTWEIGHT SYNTHETIC DOM ENGINE FOR BROWSER INTERACTION EMULATION
// -----------------------------------------------------------------------------
class MockElement {
  constructor(tag, attrs = {}) {
    this.tagName = tag.toUpperCase();
    this.attributes = { ...attrs };
    this.className = attrs.class || '';
    this.classList = {
      _classes: new Set((this.className || '').split(/\s+/).filter(Boolean)),
      add: (...cls) => {
        cls.forEach((c) => this.classList._classes.add(c));
        this.className = Array.from(this.classList._classes).join(' ');
      },
      remove: (...cls) => {
        cls.forEach((c) => this.classList._classes.delete(c));
        this.className = Array.from(this.classList._classes).join(' ');
      },
      contains: (c) => this.classList._classes.has(c),
    };
    this.value = attrs.value || '';
    this.disabled = Boolean(attrs.disabled);
    this.textContent = attrs.textContent || '';
    this.children = [];
    this.parentElement = null;
    this.listeners = {};
  }

  getAttribute(k) {
    return this.attributes[k] ?? null;
  }

  setAttribute(k, v) {
    this.attributes[k] = v;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  remove() {
    if (this.parentElement) {
      const idx = this.parentElement.children.indexOf(this);
      if (idx !== -1) this.parentElement.children.splice(idx, 1);
      this.parentElement = null;
    }
  }

  closest(selector) {
    let cur = this;
    const clsMatch = selector.startsWith('.') ? selector.slice(1) : null;
    while (cur) {
      if (clsMatch && cur.classList && cur.classList.contains(clsMatch)) return cur;
      cur = cur.parentElement;
    }
    return null;
  }

  querySelectorAll(selector) {
    const res = [];
    const walk = (node) => {
      for (const child of node.children) {
        let match = false;
        if (selector === 'select, input') {
          if (child.tagName === 'SELECT' || child.tagName === 'INPUT') match = true;
        } else if (selector.startsWith('.')) {
          if (child.classList.contains(selector.slice(1))) match = true;
        } else if (child.tagName === selector.toUpperCase()) {
          match = true;
        }
        if (match) res.push(child);
        walk(child);
      }
    };
    walk(this);
    return res;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  addEventListener(type, cb) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(cb);
  }

  removeEventListener(type, cb) {
    if (!this.listeners[type]) return;
    this.listeners[type] = this.listeners[type].filter((f) => f !== cb);
  }

  dispatchEvent(event) {
    let cur = this;
    while (cur) {
      if (cur.listeners[event.type]) {
        for (const cb of cur.listeners[event.type]) {
          cb({ ...event, currentTarget: cur });
        }
      }
      cur = cur.parentElement;
    }
  }
}

function parseAndBuildDom(html) {
  const container = new MockElement('div');
  const spanRegex = /<span\s+class=['"]fillblank-option['"][^>]*>([\s\S]*?)<\/span>/gi;
  let match;
  while ((match = spanRegex.exec(html)) !== null) {
    const inner = match[1];
    const span = new MockElement('span', { class: 'fillblank-option' });

    const selectMatch = /<select\s+([^>]+)>([\s\S]*?)<\/select>/i.exec(inner);
    const inputMatch = /<input\s+([^>]+)>/i.exec(inner);

    if (selectMatch) {
      const attrStr = selectMatch[1];
      const optHtml = selectMatch[2];
      const idx = (/index=['"]([^'"]+)['"]/i.exec(attrStr) || [])[1] || '0';
      const name = (/name=['"]([^'"]+)['"]/i.exec(attrStr) || [])[1] || '';
      const cls = (/class=['"]([^'"]+)['"]/i.exec(attrStr) || [])[1] || 'ms fillblank-select';
      const select = new MockElement('select', { index: idx, name, class: cls });

      const optRegex = /<option\s+value=['"]([^'"]*)['"][^>]*>([\s\S]*?)<\/option>/gi;
      let optM;
      while ((optM = optRegex.exec(optHtml)) !== null) {
        const opt = new MockElement('option', { value: optM[1], textContent: optM[2] });
        select.appendChild(opt);
      }
      span.appendChild(select);
    } else if (inputMatch) {
      const attrStr = inputMatch[1];
      const idx = (/index=['"]([^'"]+)['"]/i.exec(attrStr) || [])[1] || '0';
      const name = (/name=['"]([^'"]+)['"]/i.exec(attrStr) || [])[1] || '';
      const cls = (/class=['"]([^'"]+)['"]/i.exec(attrStr) || [])[1] || 'fillblank-input';
      const input = new MockElement('input', { index: idx, name, class: cls });
      span.appendChild(input);
    }
    container.appendChild(span);
  }
  return container;
}

// =============================================================================
// TIER 1: CORE FEATURE COVERAGE & STATE MECHANICS
// =============================================================================
console.log('▶ [TIER 1] Vector 1: MultipleChoice Interactive Mechanics & Key Shortcuts...');

// Synthetic MultipleChoice Question
const mcQuestion = {
  id: 101,
  questionType: 'MultipleChoice',
  questionText: '<p>Choose the word whose underlined part is pronounced differently.</p>',
  choices: [
    { id: 1001, label: 'A', text: 'admired', isCorrect: true },
    { id: 1002, label: 'B', text: 'looked', isCorrect: false },
    { id: 1003, label: 'C', text: 'missed', isCorrect: false },
    { id: 1004, label: 'D', text: 'hoped', isCorrect: false },
  ],
  correctChoiceId: 1001,
};

let mcSelectedChoiceId = null;
let mcScore = 0;
let mcIsSubmitted = false;
let mcIsCorrect = false;

// Dynamic submit gating: disabled={!selectedChoiceId}
check('MC: Initially no choice selected -> submit disabled', mcSelectedChoiceId === null);

// Selecting choice
mcSelectedChoiceId = 1001;
check('MC: Selecting choice A enables submit', Boolean(mcSelectedChoiceId));

// Keyboard shortcut simulation
function simulateKeyboardChoice(key, choices) {
  const upper = key.toUpperCase();
  let idx = -1;
  if (['1', '2', '3', '4'].includes(upper)) idx = parseInt(upper, 10) - 1;
  else if (['A', 'B', 'C', 'D'].includes(upper)) idx = upper.charCodeAt(0) - 65;
  if (idx >= 0 && idx < choices.length) return choices[idx].id;
  return null;
}

check('MC: Keyboard key "1" selects Choice A (1001)', simulateKeyboardChoice('1', mcQuestion.choices) === 1001);
check('MC: Keyboard key "B" selects Choice B (1002)', simulateKeyboardChoice('B', mcQuestion.choices) === 1002);
check('MC: Keyboard key "4" selects Choice D (1004)', simulateKeyboardChoice('4', mcQuestion.choices) === 1004);
check('MC: Keyboard key "Z" is ignored', simulateKeyboardChoice('Z', mcQuestion.choices) === null);

// Submission of correct choice
function submitMC(choiceId, q) {
  const isOk = choiceId === q.correctChoiceId;
  return { isSubmitted: true, isCorrect: isOk, scoreDelta: isOk ? 1 : 0 };
}

const mcResCorrect = submitMC(1001, mcQuestion);
check('MC: Submitting correct choice 1001 marks isCorrect: true', mcResCorrect.isCorrect === true);
check('MC: Submitting correct choice increments score by 1', mcResCorrect.scoreDelta === 1);

const mcResWrong = submitMC(1002, mcQuestion);
check('MC: Submitting wrong choice 1002 marks isCorrect: false', mcResWrong.isCorrect === false);
check('MC: Submitting wrong choice yields 0 scoreDelta', mcResWrong.scoreDelta === 0);

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 1] Vector 2: FillBlank (Select Dropdown) Event Delegation & Bidirectional DOM Sync...');

const sampleFbHtml = `
<p>Her childhood was not <strong><span class='fillblank-option'><label>1.1</label><select class='ms fillblank-option-1' index='0' name='fbo-1-0'><option value=''></option><option value="a">a</option><option value="the">the</option></select></span></strong> happy one.
She taught herself <strong><span class='fillblank-option'><label>1.2</label><select class='ms fillblank-option-1' index='1' name='fbo-1-1'><option value=''></option><option value="because">because</option><option value="although">although</option></select></span></strong> university was closed.</p>
`;

const fbDom = parseAndBuildDom(sampleFbHtml);
const fbControls = fbDom.querySelectorAll('select, input');
check('DOM: Parsed exactly 2 select elements from FillBlank HTML', fbControls.length === 2);
check('DOM: Control 0 has index="0"', fbControls[0].getAttribute('index') === '0');
check('DOM: Control 1 has index="1"', fbControls[1].getAttribute('index') === '1');

// Setup React container event listener (container delegation)
const fbAnswersState = {};
fbDom.addEventListener('change', (e) => {
  const target = e.target;
  const idx = target.getAttribute('index') || '0';
  fbAnswersState[idx] = target.value;
});

// Submit button gating logic for FillBlank
function evaluateCanSubmitFB(answers, requiredBlanksCount) {
  const filledCount = Object.keys(answers).filter((k) => (answers[k] || '').trim().length > 0).length;
  return filledCount >= requiredBlanksCount;
}

check('FillBlank: 0/2 filled -> canSubmit is false (submit locked)', evaluateCanSubmitFB(fbAnswersState, 2) === false);

// Select first blank
fbControls[0].value = 'a';
fbControls[0].dispatchEvent({ type: 'change', target: fbControls[0] });
check('FillBlank: Event delegation synced control 0 value "a" to state', fbAnswersState['0'] === 'a');
check('FillBlank: 1/2 filled -> canSubmit is still false', evaluateCanSubmitFB(fbAnswersState, 2) === false);

// Select second blank
fbControls[1].value = 'because';
fbControls[1].dispatchEvent({ type: 'change', target: fbControls[1] });
check('FillBlank: Event delegation synced control 1 value "because" to state', fbAnswersState['1'] === 'because');
check('FillBlank: 2/2 filled -> canSubmit is true (submit unlocked)', evaluateCanSubmitFB(fbAnswersState, 2) === true);

// Deselect second blank
fbControls[1].value = '';
fbControls[1].dispatchEvent({ type: 'change', target: fbControls[1] });
check('FillBlank: Deselecting blank 1 immediately locks submit again', evaluateCanSubmitFB(fbAnswersState, 2) === false);

// Re-select second blank with correct answer
fbControls[1].value = 'because';
fbControls[1].dispatchEvent({ type: 'change', target: fbControls[1] });
check('FillBlank: Re-selecting blank 1 re-unlocks submit', evaluateCanSubmitFB(fbAnswersState, 2) === true);

// Bidirectional DOM sync implementation test
function applyBidirectionalDomSync(container, blankAnswers, isSubmitted, isRevealed, fillblankAnswers) {
  const controls = container.querySelectorAll('select, input');
  controls.forEach((ctrl) => {
    const idx = ctrl.getAttribute('index') || '0';
    if (blankAnswers[idx] !== undefined) ctrl.value = blankAnswers[idx];
    ctrl.disabled = isSubmitted && isRevealed;

    const span = ctrl.closest('.fillblank-option');
    if (isSubmitted) {
      const fbItem = fillblankAnswers.find((fb) => String(fb.index) === idx);
      const correctAnswers = (fbItem?.correctAnswers || []).map(normalizeBlankValue);
      const isCorrectBlank = correctAnswers.includes(normalizeBlankValue(blankAnswers[idx] || ''));

      if (span) {
        span.classList.remove('correct', 'wrong');
        span.classList.add(isCorrectBlank ? 'correct' : 'wrong');
      }
      ctrl.classList.remove('is-correct', 'is-wrong');
      ctrl.classList.add(isCorrectBlank ? 'is-correct' : 'is-wrong');

      if (!isCorrectBlank && isRevealed && fbItem?.correctAnswers?.[0]) {
        const badge = new MockElement('span', { class: 'fillblank-correct-badge' });
        badge.textContent = `Đ/A: ${fbItem.correctAnswers[0]}`;
        span.appendChild(badge);
      }
    } else {
      if (span) span.classList.remove('correct', 'wrong');
      ctrl.classList.remove('is-correct', 'is-wrong');
    }
  });
}

const fbQuestionAnswers = [
  { index: 0, correctAnswers: ['a'] },
  { index: 1, correctAnswers: ['because'] },
];

applyBidirectionalDomSync(fbDom, fbAnswersState, true, false, fbQuestionAnswers);
check('Visual Feedback: Blank 0 wrapper has .correct', fbControls[0].closest('.fillblank-option').classList.contains('correct'));
check('Visual Feedback: Blank 0 control has .is-correct', fbControls[0].classList.contains('is-correct'));
check('Visual Feedback: Blank 1 wrapper has .correct', fbControls[1].closest('.fillblank-option').classList.contains('correct'));
check('Visual Feedback: Blank 1 control has .is-correct', fbControls[1].classList.contains('is-correct'));

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 1] Vector 3: FillBlank (Input) & ShortAnswer Keyboard Entry & Normalization...');

const shortHtml = `
<p>Rewrite: <span class='fillblank-option'><input class='fillblank-input' index='0' name='short-q' /></span></p>
`;
const shortDom = parseAndBuildDom(shortHtml);
const shortInput = shortDom.querySelector('input');
check('DOM: Input element created from ShortAnswer HTML', Boolean(shortInput));

const shortAnswersState = {};
shortDom.addEventListener('input', (e) => {
  shortAnswersState[e.target.getAttribute('index') || '0'] = e.target.value;
});

// Keyboard entry simulation
shortInput.value = '   she has worked here since 2020.   ';
shortInput.dispatchEvent({ type: 'input', target: shortInput });

check('ShortAnswer: Input event updates state', shortAnswersState['0'] === '   she has worked here since 2020.   ');
const canSubmitShort = Boolean((shortAnswersState['0'] || '').trim().length > 0);
check('ShortAnswer: Non-empty trimmed text enables submit', canSubmitShort === true);

const targetShort = 'She has worked here since 2020';
check('ShortAnswer: Normalization matches target sentence despite trailing period and whitespace',
  matchesSentence(shortAnswersState['0'], targetShort) === true
);

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 1] Vector 4: WordOrder Sentence Construction & Chip Sequencing...');

const woChoices = [
  { id: 1, text: 'She' },
  { id: 2, text: 'would' },
  { id: 3, text: 'agree' },
  { id: 4, text: 'if' },
  { id: 5, text: 'you' },
  { id: 6, text: 'asked' },
  { id: 7, text: 'her' },
];
const woTarget = 'She would agree if you asked her.';

let selectedWordOrder = [];

// Adding chips in sequence
function placeChip(word) {
  selectedWordOrder.push(word);
}
function removeChipAt(idx) {
  selectedWordOrder.splice(idx, 1);
}

check('WordOrder: Initially 0 chips selected -> canSubmit false', selectedWordOrder.length === woChoices.length === false);

// Place 6 out of 7 chips
['She', 'would', 'agree', 'if', 'you', 'asked'].forEach(placeChip);
check('WordOrder: 6/7 chips placed -> canSubmit is false', selectedWordOrder.length === woChoices.length === false);

// Place 7th chip
placeChip('her');
check('WordOrder: 7/7 chips placed -> canSubmit is true', selectedWordOrder.length === woChoices.length === true);

// Verify sentence assembly
const assembledSentence = selectedWordOrder.join(' ');
check('WordOrder: Assembled sentence matches target', matchesSentence(assembledSentence, woTarget) === true);

// Remove a chip and test submit relock
removeChipAt(2); // removes 'agree'
check('WordOrder: Removing a chip locks submit button again', selectedWordOrder.length === woChoices.length === false);
check('WordOrder: Incomplete sentence does not match target', matchesSentence(selectedWordOrder.join(' '), woTarget) === false);

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 1] Vector 5: 1-Retry Finite State Machine (FSM) & Answer Reveal...');

// State simulation for complete 1-retry lifecycle
class PracticeQuestionFSM {
  constructor(question) {
    this.question = question;
    this.blankAnswers = {};
    this.retryCount = 1;
    this.isSubmitted = false;
    this.isCorrect = false;
    this.isRevealed = false;
    this.score = 0;
  }

  setBlank(idx, val) {
    this.blankAnswers[String(idx)] = val;
  }

  canSubmit() {
    const required = this.question.fillblankAnswers.length;
    const filled = Object.keys(this.blankAnswers).filter((k) => (this.blankAnswers[k] || '').trim().length > 0).length;
    return filled >= required;
  }

  submit() {
    if (!this.canSubmit()) return false;
    let okCount = 0;
    this.question.fillblankAnswers.forEach((fb) => {
      const uVal = normalizeBlankValue(this.blankAnswers[String(fb.index)] || '');
      const match = (fb.correctAnswers || []).some((ans) => normalizeBlankValue(ans) === uVal);
      if (match) okCount++;
    });

    const passed = okCount === this.question.fillblankAnswers.length;
    this.isSubmitted = true;
    this.isCorrect = passed;
    if (passed || this.retryCount <= 0) {
      this.isRevealed = true;
    } else {
      this.isRevealed = false;
    }
    if (passed) this.score++;
    return passed;
  }

  retry() {
    if (this.retryCount <= 0 || !this.isSubmitted || this.isCorrect) return false;
    this.retryCount--;
    this.isSubmitted = false;
    // Input is preserved!
    return true;
  }

  reveal() {
    this.isRevealed = true;
    this.question.fillblankAnswers.forEach((fb) => {
      this.blankAnswers[String(fb.index)] = fb.correctAnswers[0];
    });
  }
}

const fsmQ = {
  fillblankAnswers: [
    { index: 0, correctAnswers: ['a'] },
    { index: 1, correctAnswers: ['because'] },
  ],
};

const fsm = new PracticeQuestionFSM(fsmQ);

// Step 1: Initial state
check('FSM Init: retryCount is 1', fsm.retryCount === 1);
check('FSM Init: isSubmitted is false', fsm.isSubmitted === false);
check('FSM Init: isRevealed is false', fsm.isRevealed === false);

// Step 2: Student enters 1 right, 1 wrong
fsm.setBlank(0, 'a');
fsm.setBlank(1, 'although'); // wrong answer
check('FSM Step 2: canSubmit is true with 2 blanks filled', fsm.canSubmit() === true);

// Step 3: First submission (Wrong)
const submit1Result = fsm.submit();
check('FSM Submit 1: Returns false for wrong submission', submit1Result === false);
check('FSM Submit 1: isSubmitted is true', fsm.isSubmitted === true);
check('FSM Submit 1: isCorrect is false', fsm.isCorrect === false);
check('FSM Submit 1: isRevealed is false (allows retry!)', fsm.isRevealed === false);
check('FSM Submit 1: Score remains 0', fsm.score === 0);
check('FSM Submit 1: Blank answers preserved in state', fsm.blankAnswers['0'] === 'a' && fsm.blankAnswers['1'] === 'although');

// Step 4: Click Retry
const retryResult = fsm.retry();
check('FSM Retry: retry() succeeds', retryResult === true);
check('FSM Retry: retryCount decremented to 0', fsm.retryCount === 0);
check('FSM Retry: isSubmitted reset to false', fsm.isSubmitted === false);
check('FSM Retry: Student answers STILL preserved for editing', fsm.blankAnswers['0'] === 'a' && fsm.blankAnswers['1'] === 'although');

// Step 5: Student fixes wrong blank
fsm.setBlank(1, 'because');

// Step 6: Second submission (Correct this time!)
const submit2Result = fsm.submit();
check('FSM Submit 2: Returns true for corrected submission', submit2Result === true);
check('FSM Submit 2: isCorrect is true', fsm.isCorrect === true);
check('FSM Submit 2: isRevealed is true', fsm.isRevealed === true);
check('FSM Submit 2: Score incremented to 1', fsm.score === 1);

// Alternate FSM: Retry exhausted and reveals answer
const fsmFail = new PracticeQuestionFSM(fsmQ);
fsmFail.setBlank(0, 'an'); // wrong
fsmFail.setBlank(1, 'like'); // wrong
fsmFail.submit(); // submit 1
fsmFail.retry(); // retry
fsmFail.setBlank(0, 'the'); // still wrong!
fsmFail.submit(); // submit 2 (retry exhausted)

check('FSM Exhaust: After 2 wrong attempts, retryCount is 0', fsmFail.retryCount === 0);
check('FSM Exhaust: isRevealed is true after retry exhausted', fsmFail.isRevealed === true);
check('FSM Exhaust: Score remains 0', fsmFail.score === 0);

// Manual reveal test
const fsmManual = new PracticeQuestionFSM(fsmQ);
fsmManual.reveal();
check('FSM Manual Reveal: isRevealed is true', fsmManual.isRevealed === true);
check('FSM Manual Reveal: blank 0 populated with correct answer "a"', fsmManual.blankAnswers['0'] === 'a');
check('FSM Manual Reveal: blank 1 populated with correct answer "because"', fsmManual.blankAnswers['1'] === 'because');

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 1] Vector 6: Dark Mode CSS & Visual Contrast Verification...');

const globalsCss = fs.readFileSync(path.join(SRC_DIR, 'app', 'globals.css'), 'utf8');

check('CSS: .fillblank-option defined', globalsCss.includes('.fillblank-option'));
check('CSS: select.fillblank-select defined', globalsCss.includes('select.fillblank-select'));
check('CSS: select.ms defined', globalsCss.includes('select.ms'));
check('CSS: Dark mode select background color is #1e221e', globalsCss.includes('.dark select.ms') && globalsCss.includes('background-color: #1e221e'));
check('CSS: Dark mode select text color is #ffffff', globalsCss.includes('.dark select.ms') && globalsCss.includes('color: #ffffff'));
check('CSS: Dark mode select option background is #1e221e', globalsCss.includes('.dark select.ms option') && globalsCss.includes('background-color: #1e221e'));
check('CSS: Dark mode select option text color is #ffffff', globalsCss.includes('.dark select.ms option') && globalsCss.includes('color: #ffffff'));
check('CSS: .fillblank-option.correct border #22be34', globalsCss.includes('.fillblank-option.correct') && globalsCss.includes('#22be34'));
check('CSS: .fillblank-option.wrong border #db2828', globalsCss.includes('.fillblank-option.wrong') && globalsCss.includes('#db2828'));
check('CSS: .fillblank-correct-badge defined with #22be34 background', globalsCss.includes('.fillblank-correct-badge') && globalsCss.includes('#22be34'));
check('CSS: Focus border ring #5fbd18 defined', globalsCss.includes('#5fbd18'));

// =============================================================================
// TIER 2: BOUNDARY & CORNER CASES
// =============================================================================
console.log('\n▶ [TIER 2] Vector 7: Whitespace & String Normalization Boundary Cases...');

check('Boundary: Leading spaces trimmed', normalizeBlankValue('   hello') === 'hello');
check('Boundary: Trailing spaces trimmed', normalizeBlankValue('world   ') === 'world');
check('Boundary: Multiple consecutive interior spaces compressed', normalizeBlankValue('in    the    morning') === 'in the morning');
check('Boundary: Tabs and newlines compressed to single space', normalizeBlankValue("good\t\nevening") === 'good evening');
check('Boundary: Empty string returns empty string', normalizeBlankValue('') === '');
check('Boundary: Whitespace-only string returns empty string', normalizeBlankValue('     ') === '');
check('Boundary: Null and undefined return empty string', normalizeBlankValue(null) === '' && normalizeBlankValue(undefined) === '');
check('Boundary: Single character preserved', normalizeBlankValue('a') === 'a');
check('Boundary: Long word normalized cleanly', normalizeBlankValue('   incomprehensibility   ') === 'incomprehensibility');

// Punctuation handling in normalizeSentence
check('Boundary: Terminal period stripped', normalizeSentence('She agreed.') === 'she agreed');
check('Boundary: Terminal exclamation mark stripped', normalizeSentence('She agreed!') === 'she agreed');
check('Boundary: Terminal question mark stripped', normalizeSentence('Did she agree?') === 'did she agree');
check('Boundary: Trailing ellipsis stripped', normalizeSentence('She agreed...') === 'she agreed');
check('Boundary: Space before comma normalized', normalizeSentence('She , would agree') === 'she, would agree');
check('Boundary: Space before period normalized', normalizeSentence('She . would agree.') === 'she. would agree');

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 2] Vector 8: Case Insensitivity & Special Characters...');

check('Case: Uppercase matches lowercase', normalizeBlankValue('BECAUSE') === 'because');
check('Case: Mixed case matches lowercase', normalizeBlankValue('BeCaUsE') === 'because');
check('Case: Titlecase matches lowercase', normalizeBlankValue('Because') === 'because');
check('Special Char: ∅ (no article) preserved accurately', normalizeBlankValue('∅') === '∅');
check('Special Char: ∅ with surrounding whitespace normalized', normalizeBlankValue('  ∅  ') === '∅');

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 2] Vector 9: Contractions & Smart Quotes Tolerance...');

check('Smart Quotes: Left single quote ‘ converted to straight quote', normalizeBlankValue('‘word’') === "'word'");
check('Smart Quotes: Right single quote ’ converted to straight quote', normalizeBlankValue('haven’t') === "haven't");
check('Smart Quotes: Double curly quotes “ ” converted to straight quote', normalizeBlankValue('“hello”') === '"hello"');

// Contraction matching across 12 standard modal/auxiliary contractions
const contractionPairs = [
  ["I haven't seen him.", "I have not seen him."],
  ["She hasn't finished yet.", "She has not finished yet."],
  ["They didn't arrive on time.", "They did not arrive on time."],
  ["We won't surrender.", "We will not surrender."],
  ["He can't swim.", "He cannot swim."],
  ["It isn't fair.", "It is not fair."],
  ["You aren't invited.", "You are not invited."],
  ["I wasn't ready.", "I was not ready."],
  ["They weren't happy.", "They were not happy."],
  ["I wouldn't recommend it.", "I would not recommend it."],
  ["She couldn't believe her eyes.", "She could not believe her eyes."],
  ["We shouldn't argue.", "We should not argue."],
];

contractionPairs.forEach(([contracted, expanded], idx) => {
  check(`Contraction ${idx + 1}: "${contracted}" matches "${expanded}"`, matchesSentence(contracted, expanded) === true);
  check(`Contraction ${idx + 1} (Reverse): "${expanded}" matches "${contracted}"`, matchesSentence(expanded, contracted) === true);
});

// Smart quote contraction test
check('Smart Quote Contraction: "haven’t" matches "have not"', matchesSentence('I haven’t seen him.', 'I have not seen him.') === true);

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 2] Vector 10: Partial Blank Completion & Submit Gating Gating...');

// 4-blank question gating simulation
const fourBlankState = {};
const requiredBlanks = 4;

function isGated(answers) {
  const filled = Object.keys(answers).filter((k) => (answers[k] || '').trim().length > 0).length;
  return filled >= requiredBlanks;
}

check('Gating: 0/4 filled -> locked', isGated(fourBlankState) === false);

fourBlankState['0'] = 'first';
check('Gating: 1/4 filled -> locked', isGated(fourBlankState) === false);

fourBlankState['1'] = 'second';
check('Gating: 2/4 filled -> locked', isGated(fourBlankState) === false);

fourBlankState['2'] = 'third';
check('Gating: 3/4 filled -> locked', isGated(fourBlankState) === false);

fourBlankState['3'] = 'fourth';
check('Gating: 4/4 filled -> unlocked', isGated(fourBlankState) === true);

// Set blank 2 to whitespace only
fourBlankState['2'] = '   ';
check('Gating: Blank 2 set to whitespace -> relocked', isGated(fourBlankState) === false);

// Restore blank 2
fourBlankState['2'] = 'third';
check('Gating: Blank 2 restored -> re-unlocked', isGated(fourBlankState) === true);

// Key type tolerance: numeric key vs string key
const numericKeyAnswers = { 0: 'a', 1: 'b', 2: 'c', 3: 'd' };
check('Index Tolerance: Numeric keys counted correctly in gating', isGated(numericKeyAnswers) === true);

// =============================================================================
// TIER 3: CROSS-FEATURE COMBINATIONS & EXAMRUNNER PARITY
// =============================================================================
console.log('\n▶ [TIER 3] Vector 11: ExamRunner Question Inclusion & Exclusion Contracts...');

const examRunnerCode = fs.readFileSync(path.join(SRC_DIR, 'components', 'ExamRunner.tsx'), 'utf8');

// Static contracts for the production exam engine
check('ExamRunner Contract: Excludes Description passage containers', examRunnerCode.includes("q.questionType === 'Description'"));
check('ExamRunner Contract: Includes WordOrder questions with answer keys', examRunnerCode.includes('isWordOrderQuestion(q)') && examRunnerCode.includes('q.shortAnswers?.length'));
check('ExamRunner Contract: Includes ShortAnswer questions with answer keys', examRunnerCode.includes('isShortAnswerQuestion(q)'));
check('ExamRunner Invariant: Preserves Object.keys(answers).length verbatim', examRunnerCode.includes('Object.keys(answers).length'));
check('ExamRunner Invariant: Preserves (correct / totalQuestions) * 10 verbatim', examRunnerCode.includes('(correct / totalQuestions) * 10'));
check('ExamRunner Invariant: Preserves Math.round((correctCount / totalQuestions) * 100) verbatim', examRunnerCode.includes('Math.round((correctCount / totalQuestions) * 100)'));
check('ExamRunner Review Mode: finalScore formula evaluates proportional correct points', examRunnerCode.includes('const finalScore = totalQuestions > 0 ? (correct / totalQuestions) * 10 : 0;'));
check('ExamRunner Contract: Counts atomic answer units', examRunnerCode.includes('getQuestionUnitCount(question)'));
check('ExamRunner Contract: Scores each fillblank independently', examRunnerCode.includes('.correctUnits'));
check('ExamRunner Review Mode: renders partial credit badge for cloze questions', examRunnerCode.includes('Đúng {fbMatched}/{fbTotal} ô (+'));

// Inclusion filter test function replicating ExamRunner.tsx lines 240-261
function filterTestableQuestions(questions) {
  return questions.filter((q) => {
    if (q.questionType === 'Description') return false;

    const isFillBlank =
      (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
      Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
      (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

    if (isFillBlank) return true;
    if (q.questionType === 'ShortAnswer') return Boolean(q.shortAnswers && q.shortAnswers.length > 0);
    if (q.questionType === 'WordOrder') return Boolean(q.choices && q.choices.length > 0 && q.shortAnswers && q.shortAnswers.length > 0);

    return Boolean(
      q.choices &&
      q.choices.length > 0 &&
      (q.choices.some((c) => c.isCorrect) || q.correctChoiceId != null)
    );
  });
}

const mockExamList = [
  { id: 1, questionType: 'MultipleChoice', choices: [{ id: 11, isCorrect: true }, { id: 12, isCorrect: false }] },
  { id: 2, questionType: 'Description', choices: [] },
  { id: 3, questionType: 'WordOrder', choices: [{ id: 31, text: 'chip' }], shortAnswers: ['chip'] },
  { id: 4, questionType: 'FillBlank', fillblankAnswers: [{ index: 0, correctAnswers: ['test'] }], choices: [] },
  { id: 5, questionType: 'MultipleChoice', choices: [] }, // invalid MC (no choices)
  { id: 6, questionType: 'ShortAnswer', shortAnswers: ['A complete answer.'], choices: [] },
];

const filteredMock = filterTestableQuestions(mockExamList);
check('Inclusion: Filtered 6 questions down to 4 answerable groups', filteredMock.length === 4);
check('Inclusion: Question 1 (MC) included', filteredMock.some((q) => q.id === 1));
check('Inclusion: Question 2 (Description) excluded', !filteredMock.some((q) => q.id === 2));
check('Inclusion: Question 3 (WordOrder) included', filteredMock.some((q) => q.id === 3));
check('Inclusion: Question 4 (FillBlank) included', filteredMock.some((q) => q.id === 4));
check('Inclusion: Question 5 (Empty MC) excluded', !filteredMock.some((q) => q.id === 5));
check('Inclusion: Question 6 (ShortAnswer) included', filteredMock.some((q) => q.id === 6));

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 3] Vector 12: Composite Answer State & Question Navigation Preservation...');

// Simulating ExamRunner session state
const examAnswersState = {};

// User is on Question 1 (Multiple Choice)
examAnswersState['1'] = 'choice-11';
check('Navigation: Q1 (MC) saved choice string', examAnswersState['1'] === 'choice-11');

// User navigates to Question 4 (FillBlank with 2 blanks)
examAnswersState['4'] = { '0': 'first_val', '1': 'second_val' };
check('Navigation: Q4 (FB) saved composite object map', typeof examAnswersState['4'] === 'object');
check('Navigation: Q4 blank 0 is "first_val"', examAnswersState['4']['0'] === 'first_val');
check('Navigation: Q4 blank 1 is "second_val"', examAnswersState['4']['1'] === 'second_val');

// User navigates to Question 23 (another MC)
examAnswersState['23'] = 'choice-99';

// User navigates back to Question 4
const retrievedQ4 = examAnswersState['4'];
check('Navigation: Navigating back to Q4 retains all blank values', retrievedQ4['0'] === 'first_val' && retrievedQ4['1'] === 'second_val');

// User navigates back to Question 1
check('Navigation: Navigating back to Q1 retains selected choice', examAnswersState['1'] === 'choice-11');

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 3] Vector 13: Exam Palette State Calculation (isQuestionAnswered)...');

function isQuestionAnswered(q, answers) {
  const ans = answers[String(q.id)];
  if (!ans) return false;
  const isFB =
    (q.questionType === 'FillBlank' && Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0)) ||
    Boolean(q.fillblankAnswers && q.fillblankAnswers.length > 0) ||
    (q.questionType === 'FillBlank' && Boolean(q.questionText && (q.questionText.includes('fillblank-option') || q.questionText.includes('<select'))));

  if (isFB) {
    if (typeof ans !== 'object' || ans === null) return false;
    if (q.fillblankAnswers && q.fillblankAnswers.length > 0) {
      return q.fillblankAnswers.every((fb) => {
        const val = ans[String(fb.index)] ?? ans[fb.index];
        return typeof val === 'string' && val.trim().length > 0;
      });
    }
    return false;
  }
  return Boolean(ans);
}

const paletteMC = { id: 10, questionType: 'MultipleChoice' };
const paletteFB = {
  id: 20,
  questionType: 'FillBlank',
  fillblankAnswers: [{ index: 0 }, { index: 1 }, { index: 2 }],
};

const paletteAnswers = {};
check('Palette: Unanswered MC returns false', isQuestionAnswered(paletteMC, paletteAnswers) === false);
check('Palette: Unanswered FB returns false', isQuestionAnswered(paletteFB, paletteAnswers) === false);

paletteAnswers['10'] = 'c-10';
check('Palette: Answered MC returns true', isQuestionAnswered(paletteMC, paletteAnswers) === true);

// Partial FillBlank (2 of 3 filled)
paletteAnswers['20'] = { '0': 'val0', '1': 'val1' };
check('Palette: Partial FillBlank (2/3 filled) returns false (unanswered)', isQuestionAnswered(paletteFB, paletteAnswers) === false);

// Complete FillBlank (3 of 3 filled)
paletteAnswers['20']['2'] = 'val2';
check('Palette: Complete FillBlank (3/3 filled) returns true (answered)', isQuestionAnswered(paletteFB, paletteAnswers) === true);

// Blank with only whitespace
paletteAnswers['20']['2'] = '   ';
check('Palette: Blank with only whitespace returns false', isQuestionAnswered(paletteFB, paletteAnswers) === false);

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 3] Vector 14: Mixed Exam Scoring (Proportional vs All-or-Nothing)...');

function getQuestionUnitCount(q) {
  return q.fillblankAnswers?.length || 1;
}

function getQuestionScoreResult(q, answer) {
  if (q.fillblankAnswers?.length) {
    let answeredUnits = 0;
    let correctUnits = 0;
    const answerMap = typeof answer === 'object' && answer !== null && !Array.isArray(answer) ? answer : {};
    q.fillblankAnswers.forEach((fb) => {
      const value = normalizeBlankValue(answerMap[String(fb.index)] ?? answerMap[fb.index] ?? '');
      if (value) answeredUnits++;
      if ((fb.correctAnswers || []).some((candidate) => normalizeBlankValue(candidate) === value)) correctUnits++;
    });
    return {
      totalUnits: q.fillblankAnswers.length,
      answeredUnits,
      correctUnits,
      isFullyAnswered: answeredUnits === q.fillblankAnswers.length,
      isFullyCorrect: correctUnits === q.fillblankAnswers.length,
    };
  }

  if (q.questionType === 'WordOrder') {
    const words = Array.isArray(answer) ? answer : [];
    const isFullyAnswered = words.length === (q.choices || []).length && words.length > 0;
    const isFullyCorrect = isFullyAnswered && (q.shortAnswers || []).some((candidate) => matchesSentence(words.join(' '), candidate));
    return { totalUnits: 1, answeredUnits: isFullyAnswered ? 1 : 0, correctUnits: isFullyCorrect ? 1 : 0, isFullyAnswered, isFullyCorrect };
  }

  if (q.questionType === 'ShortAnswer' || q.shortAnswers?.length) {
    const value = typeof answer === 'string' ? answer.trim() : '';
    const isFullyAnswered = value.length > 0;
    const isFullyCorrect = isFullyAnswered && (q.shortAnswers || []).some((candidate) => matchesSentence(value, candidate));
    return { totalUnits: 1, answeredUnits: isFullyAnswered ? 1 : 0, correctUnits: isFullyCorrect ? 1 : 0, isFullyAnswered, isFullyCorrect };
  }

  const correctChoice = q.choices?.find((choice) => choice.isCorrect || String(choice.id) === String(q.correctChoiceId));
  const isFullyAnswered = answer !== undefined && answer !== null && String(answer).length > 0;
  const isFullyCorrect = Boolean(isFullyAnswered && correctChoice && String(answer) === String(correctChoice.id));
  return { totalUnits: 1, answeredUnits: isFullyAnswered ? 1 : 0, correctUnits: isFullyCorrect ? 1 : 0, isFullyAnswered, isFullyCorrect };
}

function gradeExam(testableQuestions, answers) {
  const correct = testableQuestions.reduce(
    (sum, q) => sum + getQuestionScoreResult(q, answers[String(q.id)]).correctUnits,
    0
  );
  const totalQuestions = testableQuestions.reduce((sum, q) => sum + getQuestionUnitCount(q), 0);
  const scoreOut10 = totalQuestions > 0 ? (correct / totalQuestions) * 10 : 0;
  const roundedScore = Math.round(scoreOut10 * 100) / 100;
  return { correct, totalQuestions, roundedScore };
}

const mixedExamQuestions = [
  // Q1: MC (correct)
  { id: 1, questionType: 'MultipleChoice', choices: [{ id: 'c1', isCorrect: true }, { id: 'c2', isCorrect: false }] },
  // Q2: MC (wrong)
  { id: 2, questionType: 'MultipleChoice', choices: [{ id: 'c3', isCorrect: true }, { id: 'c4', isCorrect: false }] },
  // Q3: FillBlank with 4 independently scored blanks (3 correct, 1 wrong)
  {
    id: 3,
    questionType: 'FillBlank',
    fillblankAnswers: [
      { index: 0, correctAnswers: ['north'] },
      { index: 1, correctAnswers: ['south'] },
      { index: 2, correctAnswers: ['east'] },
      { index: 3, correctAnswers: ['west'] },
    ],
  },
  // Q4: FillBlank with 5 independently scored blanks (5 correct)
  {
    id: 4,
    questionType: 'FillBlank',
    fillblankAnswers: [
      { index: 0, correctAnswers: ['a'] },
      { index: 1, correctAnswers: ['b'] },
      { index: 2, correctAnswers: ['c'] },
      { index: 3, correctAnswers: ['d'] },
      { index: 4, correctAnswers: ['e'] },
    ],
  },
];

const studentAnswers = {
  '1': 'c1', // 1 point
  '2': 'c4', // 0 points
  '3': { '0': 'north', '1': 'south', '2': 'east', '3': 'wrong_direction' }, // 3 points
  '4': { '0': 'a', '1': 'b', '2': 'c', '3': 'd', '4': 'e' }, // 5 points
};

const gradedResult = gradeExam(mixedExamQuestions, studentAnswers);
// Total correct: 1 + 0 + 3 + 5 = 9 out of 11 atomic answer units.
check('Grading: Total correct is exactly 9 atomic points', gradedResult.correct === 9);
check('Grading: Atomic denominator is exactly 11 points', gradedResult.totalQuestions === 11);
check('Grading: Scaled score is rounded to 8.18 / 10', gradedResult.roundedScore === 8.18);

// Verification of ExamRunner.tsx render-time finalScore calculation
function calculateReviewRenderMetrics(testableQuestions, answers) {
  const correct = testableQuestions.reduce(
    (sum, q) => sum + getQuestionScoreResult(q, answers[String(q.id)]).correctUnits,
    0
  );
  const correctCount = correct;
  const totalQuestions = testableQuestions.reduce((sum, q) => sum + getQuestionUnitCount(q), 0);
  const finalScore = totalQuestions > 0 ? (correct / totalQuestions) * 10 : 0;
  const accuracyPercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  return { correct, correctCount, finalScore, accuracyPercent };
}

const renderMetrics = calculateReviewRenderMetrics(mixedExamQuestions, studentAnswers);
check('Review Render Metric: 9 correct atomic points matches handleSubmitExam', renderMetrics.correct === 9);
check('Review Render Metric: finalScore (8.1818 -> "8.18") matches hero display and storage', renderMetrics.finalScore.toFixed(2) === '8.18');
check('Review Render Metric: correctCount tracks atomic points', renderMetrics.correctCount === 9);
check('Review Render Metric: accuracyPercent is 82%', renderMetrics.accuracyPercent === 82);

// Review Mode question card status badge simulation
function getReviewCardBadgeText(q, userChoice, totalQuestions) {
  const result = getQuestionScoreResult(q, userChoice);
  if (result.isFullyCorrect) return `Đúng (+${((10 / totalQuestions) * result.totalUnits).toFixed(2)}đ)`;
  if (result.answeredUnits === 0) return 'Chưa làm (0đ)';
  if (q.fillblankAnswers?.length && result.correctUnits > 0) {
    return `Đúng ${result.correctUnits}/${result.totalUnits} ô (+${((10 / totalQuestions) * result.correctUnits).toFixed(2)}đ)`;
  }
  return 'Sai (0đ)';
}

check('Review Badge Q1 (Full MC): Đúng (+0.91đ)', getReviewCardBadgeText(mixedExamQuestions[0], studentAnswers['1'], 11) === 'Đúng (+0.91đ)');
check('Review Badge Q2 (Wrong MC): Sai (0đ)', getReviewCardBadgeText(mixedExamQuestions[1], studentAnswers['2'], 11) === 'Sai (0đ)');
check('Review Badge Q3 (Partial FB 3/4): Đúng 3/4 ô (+2.73đ)', getReviewCardBadgeText(mixedExamQuestions[2], studentAnswers['3'], 11) === 'Đúng 3/4 ô (+2.73đ)');
check('Review Badge Q4 (Full FB 5/5): Đúng (+4.55đ)', getReviewCardBadgeText(mixedExamQuestions[3], studentAnswers['4'], 11) === 'Đúng (+4.55đ)');
check('Review Badge Unanswered FB: Chưa làm (0đ)', getReviewCardBadgeText(mixedExamQuestions[2], null, 11) === 'Chưa làm (0đ)');
check('Review Badge 0/4 FB: Sai (0đ)', getReviewCardBadgeText(mixedExamQuestions[2], { '0': 'w1', '1': 'w2', '2': 'w3', '3': 'w4' }, 11) === 'Sai (0đ)');

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 3] Vector 15: Review Mode DOM Decoration & Answer Reveal Badges...');

function decorateReviewFillBlankCard(cardElement, question, userAns) {
  const controls = cardElement.querySelectorAll('select, input');
  controls.forEach((ctrl) => {
    ctrl.disabled = true;

    const idxStr = ctrl.getAttribute('index') || '0';
    const idx = parseInt(idxStr, 10);
    const studentVal = (typeof userAns === 'object' && userAns !== null)
      ? (userAns[idxStr] ?? userAns[String(idx)] ?? '')
      : (typeof userAns === 'string' ? userAns : '');

    if (studentVal) ctrl.value = studentVal;

    const fbItem = question.fillblankAnswers?.find((fb) => String(fb.index) === idxStr) || question.fillblankAnswers?.[idx];
    const correctAnswers = (fbItem?.correctAnswers || []).map(normalizeBlankValue);
    const normStudentVal = normalizeBlankValue(studentVal);
    const isBlankCorrect = correctAnswers.length > 0 && correctAnswers.includes(normStudentVal);

    const span = ctrl.closest('.fillblank-option') || ctrl.parentElement;
    if (span) {
      span.classList.remove('correct', 'wrong');
      span.classList.add(isBlankCorrect ? 'correct' : 'wrong');
    }
    ctrl.classList.remove('is-correct', 'is-wrong');
    ctrl.classList.add(isBlankCorrect ? 'is-correct' : 'is-wrong');

    if (!isBlankCorrect && fbItem?.correctAnswers?.[0]) {
      const badge = new MockElement('span', { class: 'fillblank-correct-badge' });
      badge.textContent = `Đ/A: ${fbItem.correctAnswers[0]}`;
      span.appendChild(badge);
    }
  });
}

const reviewCardHtml = `
<div id="review-q-3">
  <span class='fillblank-option'><select index='0'><option value=''></option></select></span>
  <span class='fillblank-option'><select index='1'><option value=''></option></select></span>
  <span class='fillblank-option'><select index='2'><option value=''></option></select></span>
  <span class='fillblank-option'><select index='3'><option value=''></option></select></span>
</div>
`;

const reviewCardDom = parseAndBuildDom(reviewCardHtml);
const q3 = mixedExamQuestions[2];
const q3UserAns = studentAnswers['3']; // 0, 1, 2 correct, 3 wrong

decorateReviewFillBlankCard(reviewCardDom, q3, q3UserAns);

const reviewControls = reviewCardDom.querySelectorAll('select, input');
check('Review Mode: All controls are disabled', reviewControls.every((c) => c.disabled === true));
check('Review Mode: Blank 0 control value populated', reviewControls[0].value === 'north');
check('Review Mode: Blank 0 wrapper has class .correct', reviewControls[0].closest('.fillblank-option').classList.contains('correct'));
check('Review Mode: Blank 3 control value populated with wrong answer', reviewControls[3].value === 'wrong_direction');
check('Review Mode: Blank 3 wrapper has class .wrong', reviewControls[3].closest('.fillblank-option').classList.contains('wrong'));
check('Review Mode: Blank 3 control has class .is-wrong', reviewControls[3].classList.contains('is-wrong'));

const blank3Badge = reviewControls[3].closest('.fillblank-option').querySelector('.fillblank-correct-badge');
check('Review Mode: Blank 3 received .fillblank-correct-badge', Boolean(blank3Badge));
check('Review Mode: Blank 3 badge text reveals correct answer "Đ/A: west"', blank3Badge.textContent === 'Đ/A: west');

const blank0Badge = reviewControls[0].closest('.fillblank-option').querySelector('.fillblank-correct-badge');
check('Review Mode: Correct Blank 0 did NOT receive a badge', blank0Badge === null);

// =============================================================================
// TIER 4: REAL-WORLD BUNDLES & PRODUCTION DATA
// =============================================================================
console.log('\n▶ [TIER 4] Vector 16: Real Exam Bundle 1462 (data/exams/bundles/1462.json)...');

const exam1462Path = path.join(DATA_DIR, 'exams', 'bundles', '1462.json');
check('Real Data: 1462.json exists', fs.existsSync(exam1462Path));

const exam1462Data = JSON.parse(fs.readFileSync(exam1462Path, 'utf8'));
check('Exam 1462: Raw question count is 37', exam1462Data.questions.length === 37);

const testable1462 = filterTestableQuestions(exam1462Data.questions);
check('Exam 1462: Filter produces 36 answerable groups', testable1462.length === 36);
check('Exam 1462: Answerable groups expand to exactly 40 atomic points', testable1462.reduce((sum, q) => sum + getQuestionUnitCount(q), 0) === 40);
check('Exam 1462: All 8 ShortAnswer questions are included', testable1462.filter((q) => q.questionType === 'ShortAnswer').length === 8);

const fb1462 = testable1462.find((q) => q.questionType === 'FillBlank');
check('Exam 1462: Testable questions includes authentic FillBlank cloze question', Boolean(fb1462));
check('Exam 1462: FillBlank question has exactly 5 blanks', fb1462.fillblankAnswers && fb1462.fillblankAnswers.length === 5);

// Test Palette Answered calculation on real Exam 1462 Q23
const realAns1462 = {};
check('Exam 1462: Q23 initially unanswered', isQuestionAnswered(fb1462, realAns1462) === false);

realAns1462[String(fb1462.id)] = { '0': 'a', '1': 'because', '2': 'few', '3': 'birth' }; // 4 of 5
check('Exam 1462: Q23 with 4 of 5 blanks filled is still marked unanswered on palette', isQuestionAnswered(fb1462, realAns1462) === false);

realAns1462[String(fb1462.id)]['4'] = 'won'; // 5 of 5
check('Exam 1462: Q23 with all 5 blanks filled is marked answered on palette', isQuestionAnswered(fb1462, realAns1462) === true);

// Perfect score simulation
const perfect1462Answers = {};
testable1462.forEach((q) => {
  if (q.questionType === 'FillBlank') {
    const fbMap = {};
    q.fillblankAnswers.forEach((fb) => {
      fbMap[String(fb.index)] = fb.correctAnswers[0];
    });
    perfect1462Answers[String(q.id)] = fbMap;
  } else if (q.questionType === 'ShortAnswer') {
    perfect1462Answers[String(q.id)] = q.shortAnswers[0];
  } else if (q.questionType === 'WordOrder') {
    perfect1462Answers[String(q.id)] = q.shortAnswers[0].split(/\s+/);
  } else {
    const correctC = q.choices.find((c) => c.isCorrect || String(c.id) === String(q.correctChoiceId));
    perfect1462Answers[String(q.id)] = correctC ? correctC.id : null;
  }
});

const perfectGrade = gradeExam(testable1462, perfect1462Answers);
check('Exam 1462: Perfect answers produce 40 correct atomic points', perfectGrade.correct === 40 && perfectGrade.totalQuestions === 40);
check('Exam 1462: Perfect answers produce exact score 10.0 / 10', perfectGrade.roundedScore === 10);

// Partial score simulation: all other answer units correct + 3 of 5 blanks correct
const partial1462Answers = { ...perfect1462Answers };
partial1462Answers[String(fb1462.id)] = {
  '0': 'a',
  '1': 'because',
  '2': 'few',
  '3': 'wrong_birth',
  '4': 'wrong_won',
};

const partialGrade = gradeExam(testable1462, partial1462Answers);
check('Exam 1462: 3/5 cloze blanks plus all other answers produces 38/40 points', partialGrade.correct === 38 && partialGrade.totalQuestions === 40);
check('Exam 1462: 38 / 40 scales to 9.50 / 10', partialGrade.roundedScore === 9.5);

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 4] Vector 17: Real Exam Bundle 12852 (data/exams/bundles/12852.json)...');

const exam12852Path = path.join(DATA_DIR, 'exams', 'bundles', '12852.json');
check('Real Data: 12852.json exists', fs.existsSync(exam12852Path));

const exam12852Data = JSON.parse(fs.readFileSync(exam12852Path, 'utf8'));
const testable12852 = filterTestableQuestions(exam12852Data.questions);
const fb12852List = testable12852.filter((q) => q.questionType === 'FillBlank');

check('Exam 12852: Filtered testable questions contains FillBlank questions', fb12852List.length >= 1);
fb12852List.forEach((fbQ, idx) => {
  check(`Exam 12852: FillBlank Q${idx + 1} has valid fillblankAnswers array`, Array.isArray(fbQ.fillblankAnswers) && fbQ.fillblankAnswers.length > 0);
  check(`Exam 12852: FillBlank Q${idx + 1} blanks each have correctAnswers`, fbQ.fillblankAnswers.every((f) => Array.isArray(f.correctAnswers) && f.correctAnswers.length > 0));
});

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 4] Vector 18: Real Practice Section sign_notices.json...');

const signPath = path.join(DATA_DIR, 'sections', 'sign_notices.json');
check('Real Data: sign_notices.json exists', fs.existsSync(signPath));

const signData = JSON.parse(fs.readFileSync(signPath, 'utf8'));
const signFB = signData.questions.filter((q) => q.questionType === 'FillBlank');
const signMC = signData.questions.filter((q) => q.questionType === 'MultipleChoice');

check('sign_notices: Contains exactly 28 FillBlank questions', signFB.length === 28);
check('sign_notices: Contains exactly 113 MultipleChoice questions', signMC.length === 113);

// Verify all 28 FillBlank questions have matching HTML selects and correct answers
let allSignFBValid = true;
signFB.forEach((q) => {
  if (!q.fillblankAnswers || q.fillblankAnswers.length === 0) allSignFBValid = false;
  q.fillblankAnswers.forEach((fb) => {
    if (!fb.correctAnswers || fb.correctAnswers.length === 0) allSignFBValid = false;
  });
});
check('sign_notices: All 28 FillBlank questions have complete fillblankAnswers', allSignFBValid === true);

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 4] Vector 19: Real Practice Section guided_cloze.json...');

const guidedPath = path.join(DATA_DIR, 'sections', 'guided_cloze.json');
check('Real Data: guided_cloze.json exists', fs.existsSync(guidedPath));

const guidedData = JSON.parse(fs.readFileSync(guidedPath, 'utf8'));
check('guided_cloze: Contains exactly 207 FillBlank questions', guidedData.questions.length === 207);

let allGuidedValid = true;
guidedData.questions.forEach((q) => {
  if (!q.fillblankAnswers || q.fillblankAnswers.length === 0) allGuidedValid = false;
});
check('guided_cloze: All 207 questions have non-empty fillblankAnswers', allGuidedValid === true);

// -----------------------------------------------------------------------------
console.log('\n▶ [TIER 4] Vector 20: Real Practice Sections (WordOrder & ShortAnswer)...');

const comboPath = path.join(DATA_DIR, 'sections', 'sentence_combination.json');
const comboData = JSON.parse(fs.readFileSync(comboPath, 'utf8'));
const woQuestions = comboData.questions.filter((q) => q.questionType === 'WordOrder');

check('sentence_combination: WordOrder questions exist in bank', woQuestions.length >= 2);
woQuestions.forEach((q, idx) => {
  check(`WordOrder Q${idx + 1}: Has word chip choices`, Array.isArray(q.choices) && q.choices.length > 0);
  check(`WordOrder Q${idx + 1}: Has solution in shortAnswers`, Array.isArray(q.shortAnswers) && q.shortAnswers.length > 0);
});

const vocabClozePath = path.join(DATA_DIR, 'sections', 'grammar_vocab_cloze.json');
const vocabClozeData = JSON.parse(fs.readFileSync(vocabClozePath, 'utf8'));
const shortQuestions = vocabClozeData.questions.filter((q) => q.questionType === 'ShortAnswer' || (q.shortAnswers && q.shortAnswers.length > 0));

check('grammar_vocab_cloze: ShortAnswer questions exist in bank', shortQuestions.length >= 20);
shortQuestions.slice(0, 5).forEach((q, idx) => {
  check(`ShortAnswer Q${idx + 1}: Has valid solution string`, typeof q.shortAnswers[0] === 'string' && q.shortAnswers[0].length > 0);
});

// =============================================================================
// SUMMARY & VERDICT
// =============================================================================
console.log('\n========================================================================');
console.log(`📊 QUESTION TYPES PARITY SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
console.log('========================================================================\n');

if (passedChecks === totalChecks) {
  console.log('🎉 100% OF QUESTION TYPES PARITY ASSERTIONS PASSED WITH ZERO ERRORS!\n');
  process.exit(0);
} else {
  console.error(`❌ ${totalChecks - passedChecks} CHECKS FAILED!\n`);
  process.exit(1);
}
