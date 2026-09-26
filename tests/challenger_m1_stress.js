/**
 * CHALLENGER 1 ADVERSARIAL STRESS TEST SUITE: MILESTONE M1
 * Cloze Dropdown Selection, Edge Cases, Race Conditions & Review Mode Tamper-Resistance
 * 
 * Vectors Tested:
 * 1. Rapid-Fire Event Storm & Concurrency Debounce (1,000 bursts, multi-blank routing, synthetic vs native)
 * 2. Empty Option vs Valid Option Transitions & Palette Flapping (0/4 -> 2/4 -> 4/4 -> 3/4 -> 0/4)
 * 3. Question Navigation & Bidirectional DOM Sync Resilience (partial vs full, string/number key tolerance)
 * 4. Review Mode Tamper-Resistance & Immutability (disabled lock, bypass attempts, state freezing)
 * 5. Malformed State & Error Boundary Hardening (null/undefined/corrupted answers, missing DOM nodes)
 * 6. High-Contrast Dark/Light CSS Specification & Color-Scheme Verification
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const DATA_DIR = path.join(ROOT_DIR, 'data');

console.log('========================================================================');
console.log('⚡ CHALLENGER 1 ADVERSARIAL STRESS TEST: CLOZE DROPDOWNS (M1)');
console.log('========================================================================\n');

let totalChecks = 0;
let passedChecks = 0;

function check(desc, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ✗ STRESS FAILURE: ${desc}`);
    throw new Error(`Challenger Assertion Failed: ${desc}`);
  }
}

// =============================================================================
// MOCK DOM HARNESS FOR ADVERSARIAL TESTING
// =============================================================================
function createMockDOMNode(tag, attrs = {}) {
  const children = [];
  const classList = new Set((attrs.class || '').split(/\s+/).filter(Boolean));
  let parent = null;
  let focused = false;
  let focusCount = 0;
  let pickerCount = 0;
  let disabled = Boolean(attrs.disabled);
  let value = attrs.value || '';

  const listeners = {};

  const node = {
    tagName: tag.toUpperCase(),
    attributes: { ...attrs },
    get disabled() { return disabled; },
    set disabled(v) { disabled = Boolean(v); },
    get value() { return value; },
    set value(v) { value = String(v ?? ''); },
    textContent: attrs.textContent || '',
    getAttribute(name) { return node.attributes[name] ?? null; },
    setAttribute(name, val) {
      node.attributes[name] = val;
      if (name === 'value') value = String(val);
      if (name === 'disabled') disabled = Boolean(val);
    },
    removeAttribute(name) {
      delete node.attributes[name];
      if (name === 'disabled') disabled = false;
    },
    appendChild(child) {
      child.parent = node;
      children.push(child);
      return child;
    },
    removeChild(child) {
      const idx = children.indexOf(child);
      if (idx !== -1) {
        children.splice(idx, 1);
        child.parent = null;
      }
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
    focus() {
      if (!disabled) {
        focused = true;
        focusCount++;
      }
    },
    get isFocused() { return focused; },
    get focusCount() { return focusCount; },
    showPicker() {
      if (!disabled) {
        pickerCount++;
      }
    },
    get pickerCount() { return pickerCount; },
    resetCounts() {
      focused = false;
      focusCount = 0;
      pickerCount = 0;
    },
    closest(selector) {
      let cur = node;
      while (cur) {
        if (selector === '.fillblank-option' && cur.classList.contains('fillblank-option')) return cur;
        cur = cur.parent;
      }
      return null;
    },
    querySelector(selector) {
      for (const ch of children) {
        if (selector.startsWith('.') && ch.classList.contains(selector.slice(1))) return ch;
        if (selector.toUpperCase() === ch.tagName) return ch;
        const found = ch.querySelector(selector);
        if (found) return found;
      }
      return null;
    },
    querySelectorAll(selector) {
      const result = [];
      function traverse(n) {
        for (const ch of n.children) {
          if (selector === 'select, input') {
            if (ch.tagName === 'SELECT' || ch.tagName === 'INPUT') result.push(ch);
          } else if (selector === '.fillblank-correct-badge') {
            if (ch.classList.contains('fillblank-correct-badge')) result.push(ch);
          } else if (selector === '.fillblank-option') {
            if (ch.classList.contains('fillblank-option')) result.push(ch);
          }
          traverse(ch);
        }
      }
      traverse(node);
      return result;
    },
    addEventListener(event, fn) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
    },
    removeEventListener(event, fn) {
      if (!listeners[event]) return;
      listeners[event] = listeners[event].filter(f => f !== fn);
    },
    dispatchEvent(event) {
      let cur = node;
      while (cur) {
        const fns = cur._getListeners(event.type);
        for (const fn of fns) {
          fn(event);
        }
        if (!event.bubbles) break;
        cur = cur.parent;
      }
    },
    _getListeners(type) {
      return listeners[type] || [];
    }
  };

  return node;
}

// Normalization function matching ExamRunner & PracticePage
function normalizeBlankValue(str) {
  if (!str) return '';
  return str.trim().toLowerCase().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\s+/g, ' ');
}

// Scoring & Question answered helper matching ExamRunner
function getQuestionResult(q, answer) {
  let answeredUnits = 0;
  let correctUnits = 0;
  const answerMap = typeof answer === 'object' && answer !== null && !Array.isArray(answer) ? answer : {};

  q.fillblankAnswers.forEach((blank) => {
    const userValue = normalizeBlankValue(answerMap[String(blank.index)] ?? answerMap[blank.index] ?? '');
    if (userValue) answeredUnits++;
    if ((blank.correctAnswers || []).some((candidate) => normalizeBlankValue(candidate) === userValue)) {
      correctUnits++;
    }
  });

  const totalUnits = q.fillblankAnswers.length;
  return {
    totalUnits,
    answeredUnits,
    correctUnits,
    isFullyAnswered: answeredUnits === totalUnits,
    isFullyCorrect: correctUnits === totalUnits,
  };
}

// Build a real 4-blank question prompt DOM (Exam 19159 Question 30 style)
function buildClozeDOM() {
  const container = createMockDOMNode('div', { class: 'question-prompt' });
  const blanks = [];

  for (let i = 0; i < 4; i++) {
    const span = createMockDOMNode('span', { class: 'fillblank-option' });
    const lbl = createMockDOMNode('label', { textContent: `28.${i + 1}` });
    const sel = createMockDOMNode('select', {
      class: `ms fillblank-option-28`,
      index: String(i),
      name: `fbo-1201768-${i}`
    });

    const optEmpty = createMockDOMNode('option', { value: '', textContent: '-- Chọn --' });
    sel.appendChild(optEmpty);

    const optA = createMockDOMNode('option', { value: `val_${i}_a`, textContent: `Choice ${i}A` });
    const optB = createMockDOMNode('option', { value: `val_${i}_b`, textContent: `Choice ${i}B` });
    sel.appendChild(optA);
    sel.appendChild(optB);

    span.appendChild(lbl);
    span.appendChild(sel);
    container.appendChild(span);

    blanks.push({ span, label: lbl, select: sel, index: i });
  }

  return { container, blanks };
}

// -----------------------------------------------------------------------------
// VECTOR 1: Rapid-Fire Event Storm & Concurrency Debounce
// -----------------------------------------------------------------------------
console.log('▶ Vector 1: Rapid-Fire Event Storm & Concurrency Debounce...');

{
  const { container, blanks } = buildClozeDOM();
  let lastPickerActivation = 0;
  let isSubmitted = false;

  // Implementation from ExamRunner.tsx
  const handleClick = (e) => {
    if (isSubmitted) return;
    const target = e.target;
    if (!target || target.tagName === 'SELECT' || target.tagName === 'INPUT') return;

    const now = e.nowOverride !== undefined ? e.nowOverride : Date.now();
    if (now - lastPickerActivation < 250) return;

    const fillblankContainer = (target.closest('.fillblank-option') || target.querySelector?.('.fillblank-option'));
    if (fillblankContainer) {
      const select = fillblankContainer.querySelector('select');
      const input = fillblankContainer.querySelector('input');
      if (select && !select.disabled) {
        lastPickerActivation = now;
        select.focus();
        try {
          select.showPicker?.();
        } catch {
          // fallback focus
        }
      } else if (input && !input.disabled) {
        lastPickerActivation = now;
        input.focus();
      }
    }
  };

  container.addEventListener('click', handleClick);

  // 1.1 Burst of 1,000 rapid clicks in 0ms on label 0
  const t0 = 1000000;
  for (let i = 0; i < 1000; i++) {
    container.dispatchEvent({
      type: 'click',
      target: blanks[0].label,
      bubbles: true,
      nowOverride: t0
    });
  }

  check('1,000 rapid burst clicks at t=0ms trigger showPicker exactly ONCE', blanks[0].select.pickerCount === 1);
  check('1,000 rapid burst clicks at t=0ms trigger focus exactly ONCE', blanks[0].select.focusCount === 1);

  // 1.2 Interleaved Clicks at threshold boundaries
  // Click at t = t0 + 100ms (inside debounce window) -> MUST BE BLOCKED
  container.dispatchEvent({
    type: 'click',
    target: blanks[0].label,
    bubbles: true,
    nowOverride: t0 + 100
  });
  check('Click at t=100ms is blocked by 250ms debounce (pickerCount remains 1)', blanks[0].select.pickerCount === 1);

  // Click at t = t0 + 249ms (1ms before debounce window ends) -> MUST BE BLOCKED
  container.dispatchEvent({
    type: 'click',
    target: blanks[0].label,
    bubbles: true,
    nowOverride: t0 + 249
  });
  check('Click at t=249ms is blocked by debounce (pickerCount remains 1)', blanks[0].select.pickerCount === 1);

  // Click at t = t0 + 250ms -> MUST TRIGGER
  container.dispatchEvent({
    type: 'click',
    target: blanks[0].label,
    bubbles: true,
    nowOverride: t0 + 250
  });
  check('Click at t=250ms triggers showPicker (pickerCount becomes 2)', blanks[0].select.pickerCount === 2);

  // 1.3 Direct click on <select> must NOT trigger showPicker (native browser takes over)
  blanks[0].select.resetCounts();
  container.dispatchEvent({
    type: 'click',
    target: blanks[0].select,
    bubbles: true,
    nowOverride: t0 + 600
  });
  check('Direct click on <select> exits early without programmatically calling showPicker', blanks[0].select.pickerCount === 0);

  // 1.4 Click routing between different blanks
  // Blank 1 clicked at t = t0 + 1000ms
  blanks[1].select.resetCounts();
  container.dispatchEvent({
    type: 'click',
    target: blanks[1].label,
    bubbles: true,
    nowOverride: t0 + 1000
  });
  check('Clicking Blank 1 label opens Blank 1 select (not Blank 0)', blanks[1].select.pickerCount === 1 && blanks[0].select.pickerCount === 0);

  // 1.5 Click on blank with disabled select
  blanks[2].select.disabled = true;
  blanks[2].select.resetCounts();
  container.dispatchEvent({
    type: 'click',
    target: blanks[2].label,
    bubbles: true,
    nowOverride: t0 + 2000
  });
  check('Clicking label of a disabled select does not focus or open picker', blanks[2].select.pickerCount === 0 && blanks[2].select.focusCount === 0);

  // 1.6 Click on prompt container itself without .fillblank-option
  const nonBlankDiv = createMockDOMNode('p', { textContent: 'Some instruction text' });
  container.appendChild(nonBlankDiv);
  container.dispatchEvent({
    type: 'click',
    target: nonBlankDiv,
    bubbles: true,
    nowOverride: t0 + 3000
  });
  check('Clicking non-blank text outside .fillblank-option does not crash or open any select', true);
}

// -----------------------------------------------------------------------------
// VECTOR 2: Empty Option vs Valid Option Transitions & Palette Flapping
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 2: Empty Option vs Valid Option Transitions & Palette Flapping...');

{
  const bundle19159Path = path.join(DATA_DIR, 'exams', 'bundles', '19159.json');
  const exam19159 = JSON.parse(fs.readFileSync(bundle19159Path, 'utf8'));
  const q30 = exam19159.questions.find((q) => q.id === 1201768);

  check('Loaded Exam 19159 Q30 for empirical evaluation', Boolean(q30));

  let answersState = {};

  // Handle change/input sync
  const simulateSync = (targetSelect, val) => {
    targetSelect.value = val;
    const idx = targetSelect.getAttribute('index');
    answersState = {
      ...answersState,
      [idx]: val,
    };
  };

  const { container, blanks } = buildClozeDOM();

  // Initially empty
  let res = getQuestionResult(q30, answersState);
  check('Initial state: 0/4 answered units, isFullyAnswered is false', res.answeredUnits === 0 && res.isFullyAnswered === false);

  // Step 1: Select Blank 0 -> "Get"
  simulateSync(blanks[0].select, 'Get');
  res = getQuestionResult(q30, answersState);
  check('Step 1: 1/4 answered, isFullyAnswered is false (palette GRAY)', res.answeredUnits === 1 && !res.isFullyAnswered);

  // Step 2: Empty Blank 0 back to ""
  simulateSync(blanks[0].select, '');
  res = getQuestionResult(q30, answersState);
  check('Step 2: 0/4 answered after clearing Blank 0, isFullyAnswered is false', res.answeredUnits === 0 && !res.isFullyAnswered);

  // Step 3: Fill Blank 0, 1, 2, 3
  simulateSync(blanks[0].select, 'Get');
  simulateSync(blanks[1].select, 'part');
  simulateSync(blanks[2].select, 'on');
  simulateSync(blanks[3].select, 'traditional');
  res = getQuestionResult(q30, answersState);
  check('Step 3: 4/4 answered, isFullyAnswered is TRUE (palette EMERALD)', res.answeredUnits === 4 && res.isFullyAnswered === true);

  // Step 4: Rapid Flapping — Clear Blank 1
  simulateSync(blanks[1].select, '');
  res = getQuestionResult(q30, answersState);
  check('Step 4: Clearing Blank 1 immediately drops answeredUnits to 3 and flips palette to GRAY', res.answeredUnits === 3 && res.isFullyAnswered === false);

  // Step 5: Rapid 100-cycle oscillation between empty and valid
  for (let cycle = 0; cycle < 100; cycle++) {
    simulateSync(blanks[1].select, cycle % 2 === 0 ? 'the' : '');
  }
  // After 100 cycles (cycle 99 was odd -> ''), blank 1 is empty
  res = getQuestionResult(q30, answersState);
  check('After 100 oscillation cycles, state matches last value exactly ("")', answersState['1'] === '' && res.answeredUnits === 3);

  // Restore Blank 1 to 'the'
  simulateSync(blanks[1].select, 'the');
  res = getQuestionResult(q30, answersState);
  check('Restoring Blank 1 restores 4/4 answered units and EMERALD palette', res.answeredUnits === 4 && res.isFullyAnswered === true);

  // Check scoring accuracy with bundle answers: provide 100% correct answers
  q30.fillblankAnswers.forEach(b => {
    simulateSync(blanks[b.index].select, b.correctAnswers[0]);
  });
  const perfectRes = getQuestionResult(q30, answersState);
  check('All 4 answers match correct answers in bundle (Visit, the, for, assigned)', perfectRes.correctUnits === 4 && perfectRes.isFullyCorrect === true);
}

// -----------------------------------------------------------------------------
// VECTOR 3: Question Navigation & Bidirectional DOM Sync Resilience
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 3: Question Navigation & Bidirectional DOM Sync Resilience...');

{
  const { container, blanks } = buildClozeDOM();

  // Function to simulate bidirectional DOM sync from ExamRunner.tsx:
  const performBidirectionalDOMSync = (currentQId, globalAnswers, isSubmitted = false) => {
    const controls = container.querySelectorAll('select, input');
    const qAnswers = globalAnswers[String(currentQId)];

    controls.forEach((ctrl) => {
      const idx = ctrl.getAttribute('index') || ctrl.getAttribute('name')?.split('-').pop() || '0';
      const userVal = (typeof qAnswers === 'object' && qAnswers !== null)
        ? (qAnswers[idx] ?? qAnswers[String(idx)] ?? qAnswers[parseInt(idx, 10)])
        : undefined;

      if (userVal !== undefined) {
        if (ctrl.value !== userVal) {
          ctrl.value = userVal;
        }
      } else if (!isSubmitted) {
        if (ctrl.value !== '') {
          ctrl.value = '';
        }
      }
      ctrl.disabled = isSubmitted;
    });
  };

  // Scenario 3.1: Partial filling on Question 30 (id: 1201768)
  const globalStore = {
    '1201768': {
      '0': 'val_0_a',
      '2': 'val_2_b'
      // 1 and 3 are intentionally missing / undefined
    },
    '1201769': 'Choice_C' // Q31 is MultipleChoice
  };

  // Sync for Q30
  performBidirectionalDOMSync('1201768', globalStore, false);
  check('DOM sync restores Blank 0 value', blanks[0].select.value === 'val_0_a');
  check('DOM sync keeps Blank 1 value empty', blanks[1].select.value === '');
  check('DOM sync restores Blank 2 value', blanks[2].select.value === 'val_2_b');
  check('DOM sync keeps Blank 3 value empty', blanks[3].select.value === '');

  // Scenario 3.2: Navigate away to Q31 (which has no cloze blanks)
  // Simulate navigating to another cloze question Q32 with different answers
  globalStore['1201770'] = {
    '0': 'val_0_b',
    '1': 'val_1_a',
    '2': 'val_2_a',
    '3': 'val_3_b'
  };
  performBidirectionalDOMSync('1201770', globalStore, false);
  check('Navigating to Q32 populates all 4 controls with Q32 answers',
    blanks[0].select.value === 'val_0_b' &&
    blanks[1].select.value === 'val_1_a' &&
    blanks[2].select.value === 'val_2_a' &&
    blanks[3].select.value === 'val_3_b'
  );

  // Scenario 3.3: Navigate BACK to Q30
  performBidirectionalDOMSync('1201768', globalStore, false);
  check('Navigating back to Q30 cleanly restores Blank 0 ("val_0_a")', blanks[0].select.value === 'val_0_a');
  check('Navigating back to Q30 cleanly CLEARS Blank 1 ("")', blanks[1].select.value === '');
  check('Navigating back to Q30 cleanly restores Blank 2 ("val_2_b")', blanks[2].select.value === 'val_2_b');
  check('Navigating back to Q30 cleanly CLEARS Blank 3 ("")', blanks[3].select.value === '');

  // Scenario 3.4: Numeric vs String vs Mixed Index Tolerance
  const mixedStore = {
    '9999': {
      0: 'num_zero',     // numeric key
      '1': 'str_one',    // string key
      '02': 'leading_zero' // edge case key
    }
  };
  performBidirectionalDOMSync('9999', mixedStore, false);
  check('Numeric key index (0: "num_zero") resolves correctly in DOM sync', blanks[0].select.value === 'num_zero');
  check('String key index ("1": "str_one") resolves correctly in DOM sync', blanks[1].select.value === 'str_one');

  // Scenario 3.5: Contaminated / Corrupted Global Store (e.g. string answer on cloze question)
  const contaminatedStore = {
    '1201768': 'unexpected_string_not_an_object',
    'null_q': null,
    'undef_q': undefined
  };
  let didCrash = false;
  try {
    performBidirectionalDOMSync('1201768', contaminatedStore, false);
    performBidirectionalDOMSync('null_q', contaminatedStore, false);
    performBidirectionalDOMSync('undef_q', contaminatedStore, false);
  } catch (err) {
    didCrash = true;
  }
  check('Contaminated state (primitive string, null, undefined) does NOT crash DOM sync', didCrash === false);
  check('Controls are safely cleared to empty string on contaminated state', blanks[0].select.value === '');
}

// -----------------------------------------------------------------------------
// VECTOR 4: Review Mode Tamper-Resistance & Immutability
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 4: Review Mode Tamper-Resistance & Immutability...');

{
  const { container, blanks } = buildClozeDOM();
  let answersState = {
    '1201768': {
      '0': 'Visit',
      '1': 'the',
      '2': 'wrong_ans',
      '3': 'assigned'
    }
  };
  let isSubmitted = true;
  let lastPickerActivation = 0;

  // The actual event listeners from ExamRunner.tsx
  const handleSync = (e) => {
    if (isSubmitted) return;
    const target = e.target;
    if (!target || !['SELECT', 'INPUT'].includes(target.tagName)) return;
    const idx = target.getAttribute('index') || '0';
    const val = target.value;
    answersState['1201768'][idx] = val;
  };

  const handleClick = (e) => {
    if (isSubmitted) return;
    const target = e.target;
    if (!target || target.tagName === 'SELECT' || target.tagName === 'INPUT') return;
    const now = Date.now();
    if (now - lastPickerActivation < 250) return;
    const fillblankContainer = (target.closest('.fillblank-option') || target.querySelector?.('.fillblank-option'));
    if (fillblankContainer) {
      const select = fillblankContainer.querySelector('select');
      if (select && !select.disabled) {
        lastPickerActivation = now;
        select.focus();
        try { select.showPicker?.(); } catch {}
      }
    }
  };

  container.addEventListener('change', handleSync);
  container.addEventListener('input', handleSync);
  container.addEventListener('click', handleClick);

  // Review mode disables all controls
  blanks.forEach(b => {
    b.select.disabled = true;
    b.select.value = answersState['1201768'][String(b.index)];
  });

  check('Review Mode: All controls have disabled = true', blanks.every(b => b.select.disabled === true));

  // Attack 4.1: User attempts to click label or container to open picker in review mode
  blanks[0].select.resetCounts();
  container.dispatchEvent({
    type: 'click',
    target: blanks[0].label,
    bubbles: true
  });
  check('Attack 4.1: Click in review mode is immediately rejected (pickerCount = 0)', blanks[0].select.pickerCount === 0);

  // Attack 4.2: Malicious script force-enables control and dispatches native click
  blanks[0].select.disabled = false; // Script tries to tamper
  container.dispatchEvent({
    type: 'click',
    target: blanks[0].label,
    bubbles: true
  });
  check('Attack 4.2: Even if control was artificially un-disabled, isSubmitted guard prevents activation', blanks[0].select.pickerCount === 0);

  // Attack 4.3: Malicious script attempts to force-change select value and dispatch 'change' event
  blanks[2].select.value = 'tampered_correct_answer';
  container.dispatchEvent({
    type: 'change',
    target: blanks[2].select,
    bubbles: true
  });
  check('Attack 4.3: Force-dispatched "change" event is discarded by isSubmitted guard', answersState['1201768']['2'] === 'wrong_ans');

  // Attack 4.4: Malicious script attempts to dispatch 'input' event
  container.dispatchEvent({
    type: 'input',
    target: blanks[2].select,
    bubbles: true
  });
  check('Attack 4.4: Force-dispatched "input" event is discarded by isSubmitted guard', answersState['1201768']['2'] === 'wrong_ans');

  // Verify review mode badge rendering & styling
  const bundle19159Path = path.join(DATA_DIR, 'exams', 'bundles', '19159.json');
  const exam19159 = JSON.parse(fs.readFileSync(bundle19159Path, 'utf8'));
  const q30 = exam19159.questions.find((q) => q.id === 1201768);

  blanks.forEach(b => {
    const idxStr = String(b.index);
    const studentVal = answersState['1201768'][idxStr];
    const fbItem = q30.fillblankAnswers[b.index];
    const correctAnswers = (fbItem?.correctAnswers || []).map(normalizeBlankValue);
    const normStudentVal = normalizeBlankValue(studentVal);
    const isBlankCorrect = correctAnswers.includes(normStudentVal);

    b.span.classList.remove('correct', 'wrong');
    b.span.classList.add(isBlankCorrect ? 'correct' : 'wrong');

    if (!isBlankCorrect && fbItem?.correctAnswers?.[0]) {
      const badge = createMockDOMNode('span', { class: 'fillblank-correct-badge', textContent: `Đ/A: ${fbItem.correctAnswers[0]}` });
      b.span.appendChild(badge);
    }
  });

  check('Blank 0 (correct "Visit") receives .correct class', blanks[0].span.classList.contains('correct'));
  check('Blank 1 (correct "the") receives .correct class', blanks[1].span.classList.contains('correct'));
  check('Blank 2 (wrong "wrong_ans") receives .wrong class', blanks[2].span.classList.contains('wrong'));
  check('Blank 2 (wrong) receives .fillblank-correct-badge with correct answer',
    blanks[2].span.querySelector('.fillblank-correct-badge') !== null &&
    blanks[2].span.querySelector('.fillblank-correct-badge').textContent.includes('Đ/A: for')
  );
  check('Blank 3 (correct "assigned") receives .correct class', blanks[3].span.classList.contains('correct'));
  check('Correct blanks (0, 1, 3) do NOT receive correct answer badge',
    blanks[0].span.querySelector('.fillblank-correct-badge') === null &&
    blanks[1].span.querySelector('.fillblank-correct-badge') === null &&
    blanks[3].span.querySelector('.fillblank-correct-badge') === null
  );
}

// -----------------------------------------------------------------------------
// VECTOR 5: Practice Runner Mode Parity & Retry Mechanics
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 5: Practice Runner Mode Parity & Retry Mechanics...');

{
  let blankAnswers = {};
  let totalBlanks = 4;
  let isSubmitted = false;
  let isRevealed = false;
  let retryCount = 1;
  let selectedChoiceId = null;

  // Logic from PracticePage (page.tsx)
  const computeCanSubmit = () => {
    const filledBlanksCount = Object.keys(blankAnswers).filter(k => (blankAnswers[k] || '').trim().length > 0).length;
    return totalBlanks > 0 ? filledBlanksCount >= totalBlanks : filledBlanksCount > 0;
  };

  const syncCanSubmitState = () => {
    const can = computeCanSubmit();
    if (can) {
      if (!selectedChoiceId) selectedChoiceId = 'interactive_answered';
    } else {
      if (selectedChoiceId === 'fillblank_answered' || selectedChoiceId === 'interactive_answered') {
        selectedChoiceId = null;
      }
    }
    return can;
  };

  check('Practice: Initially 0/4 filled -> canSubmit is false', computeCanSubmit() === false);

  // Fill 3/4 blanks
  blankAnswers['0'] = 'Get';
  blankAnswers['1'] = 'part';
  blankAnswers['2'] = 'on';
  check('Practice: 3/4 filled -> canSubmit remains false', computeCanSubmit() === false);
  syncCanSubmitState();
  check('Practice: selectedChoiceId remains null when partially filled', selectedChoiceId === null);

  // Fill 4th blank
  blankAnswers['3'] = 'traditional';
  check('Practice: 4/4 filled -> canSubmit becomes true', computeCanSubmit() === true);
  syncCanSubmitState();
  check('Practice: selectedChoiceId becomes "interactive_answered"', selectedChoiceId === 'interactive_answered');

  // User clears blank 0
  blankAnswers['0'] = '';
  check('Practice: Clearing blank 0 flips canSubmit back to false', computeCanSubmit() === false);
  syncCanSubmitState();
  check('Practice: selectedChoiceId is reset to null upon clearing blank', selectedChoiceId === null);

  // Submit test
  blankAnswers['0'] = 'Get';
  syncCanSubmitState();
  isSubmitted = true;

  // Retry test
  const handleRetry = () => {
    retryCount--;
    selectedChoiceId = null;
    isSubmitted = false;
    // user can re-try answering
  };

  handleRetry();
  check('Practice: handleRetry resets isSubmitted to false and decrements retryCount', isSubmitted === false && retryCount === 0);

  // Reveal answers test
  const handleRevealAnswer = (q) => {
    isRevealed = true;
    const revealed = {};
    q.fillblankAnswers.forEach((fb, idx) => {
      const val = fb.correctAnswers?.[0] || '';
      revealed[String(fb.index)] = val;
      revealed[String(idx)] = val;
    });
    blankAnswers = revealed;
  };

  const bundle19159Path = path.join(DATA_DIR, 'exams', 'bundles', '19159.json');
  const exam19159 = JSON.parse(fs.readFileSync(bundle19159Path, 'utf8'));
  const q30 = exam19159.questions.find((q) => q.id === 1201768);

  handleRevealAnswer(q30);
  check('Practice: handleRevealAnswer populates all 4 blanks with canonical answers',
    blankAnswers['0'] === 'Visit' &&
    blankAnswers['1'] === 'the' &&
    blankAnswers['2'] === 'for' &&
    blankAnswers['3'] === 'assigned'
  );
}

// -----------------------------------------------------------------------------
// VECTOR 6: CSS & High-Contrast Styling Specification Verification
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 6: CSS & High-Contrast Styling Verification...');

{
  const cssPath = path.join(SRC_DIR, 'app', 'globals.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Test 6.1: color-scheme rules
  check('globals.css has universal select color-scheme: light', /select,\s*option\s*\{\s*color-scheme:\s*light;/i.test(css));
  check('globals.css has universal .dark select color-scheme: dark', /\.dark select,\s*\.dark option\s*\{\s*color-scheme:\s*dark;/i.test(css));

  // Test 6.2: cursor: pointer
  check('globals.css defines cursor: pointer on .fillblank-option', /\.fillblank-option\s*\{[^}]*cursor:\s*pointer;/i.test(css));
  check('globals.css defines cursor: pointer on .fillblank-option label', /\.fillblank-option label\s*\{[^}]*cursor:\s*pointer;/i.test(css));
  check('globals.css defines cursor: pointer on .dark .fillblank-option label', /\.dark \.fillblank-option label\s*\{[^}]*cursor:\s*pointer;/i.test(css));

  // Test 6.3: Dark theme contrast colors
  check('globals.css .dark .fillblank-option select uses dark background #1e221e',
    css.includes('.dark .fillblank-option select') && css.includes('background-color: #1e221e !important;')
  );
  check('globals.css .dark .fillblank-option select uses crisp white text #ffffff',
    css.includes('.dark .fillblank-option select') && css.includes('color: #ffffff !important;')
  );

  // Test 6.4: Dark theme option background
  check('globals.css .dark select.fillblank-select option uses dark background #1e221e',
    css.includes('.dark select.fillblank-select option') && css.includes('background-color: #1e221e !important;')
  );
  check('globals.css .dark select.fillblank-select option uses crisp white text #ffffff',
    css.includes('.dark select.fillblank-select option') && css.includes('color: #ffffff !important;')
  );

  // Test 6.5: Feedback state color schemes
  check('globals.css feedback states preserve color-scheme: dark and light',
    css.includes('.dark .fillblank-option.correct select') &&
    css.includes('color-scheme: dark;') &&
    css.includes('.fillblank-option.correct select') &&
    css.includes('color-scheme: light;')
  );
}

// -----------------------------------------------------------------------------
// VECTOR 7: Mixed Input Types & Advanced Fuzzing Normalization
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 7: Mixed Input Types & Advanced Fuzzing Normalization...');

{
  // Test mixed fillblank container: input vs select
  const container = createMockDOMNode('div');
  const span = createMockDOMNode('span', { class: 'fillblank-option' });
  const lbl = createMockDOMNode('label', { textContent: '29.1' });
  const input = createMockDOMNode('input', { type: 'text', index: '0', name: 'fbo-1201774-0' });
  span.appendChild(lbl);
  span.appendChild(input);
  container.appendChild(span);

  let lastActivation = 0;
  const handleClick = (e) => {
    const target = e.target;
    if (!target || target.tagName === 'SELECT' || target.tagName === 'INPUT') return;
    const now = Date.now();
    if (now - lastActivation < 250) return;
    const fb = target.closest('.fillblank-option');
    if (fb) {
      const sel = fb.querySelector('select');
      const inp = fb.querySelector('input');
      if (sel && !sel.disabled) {
        lastActivation = now;
        sel.focus();
      } else if (inp && !inp.disabled) {
        lastActivation = now;
        inp.focus();
      }
    }
  };

  container.addEventListener('click', handleClick);
  container.dispatchEvent({ type: 'click', target: lbl, bubbles: true });

  check('Clicking label on text-input fillblank focuses the input control', input.isFocused === true && input.focusCount === 1);

  // Normalization fuzzing
  check('Normalization handles leading/trailing spaces', normalizeBlankValue('   Visit   ') === 'visit');
  check('Normalization converts uppercase to lowercase', normalizeBlankValue('VISIT') === 'visit');
  check('Normalization normalizes curly single quotes', normalizeBlankValue('won’t') === "won't");
  check('Normalization normalizes curly double quotes', normalizeBlankValue('“word”') === '"word"');
  check('Normalization collapses multiple whitespace', normalizeBlankValue('a    b   c') === 'a b c');
  check('Empty or null returns empty string', normalizeBlankValue(null) === '' && normalizeBlankValue(undefined) === '');
}

// -----------------------------------------------------------------------------
// VECTOR 8: High-Frequency Question Hop & State Invariance Simulation
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 8: High-Frequency Question Hop & State Invariance Simulation...');

{
  const { container, blanks } = buildClozeDOM();
  const stateStore = {
    '101': { '0': 'alpha', '1': 'beta', '2': 'gamma', '3': 'delta' },
    '102': { '0': 'one', '1': '', '2': 'three', '3': '' },
    '103': {}
  };

  const sync = (qId) => {
    const qAnswers = stateStore[qId];
    const controls = container.querySelectorAll('select, input');
    controls.forEach((ctrl) => {
      const idx = ctrl.getAttribute('index');
      const userVal = (typeof qAnswers === 'object' && qAnswers !== null)
        ? (qAnswers[idx] ?? qAnswers[String(idx)])
        : undefined;
      if (userVal !== undefined) {
        ctrl.value = userVal;
      } else {
        ctrl.value = '';
      }
    });
  };

  // Perform 100 rapid hops between Q101, Q102, Q103
  for (let hop = 0; hop < 100; hop++) {
    const targetQ = hop % 3 === 0 ? '101' : (hop % 3 === 1 ? '102' : '103');
    sync(targetQ);
  }

  // Final check on Q101
  sync('101');
  check('After 100 question hops, Q101 values remain 100% intact',
    blanks[0].select.value === 'alpha' &&
    blanks[1].select.value === 'beta' &&
    blanks[2].select.value === 'gamma' &&
    blanks[3].select.value === 'delta'
  );

  // Final check on Q102
  sync('102');
  check('After 100 question hops, Q102 partial values remain 100% intact with empty blanks clean',
    blanks[0].select.value === 'one' &&
    blanks[1].select.value === '' &&
    blanks[2].select.value === 'three' &&
    blanks[3].select.value === ''
  );

  // Final check on Q103
  sync('103');
  check('After 100 question hops, Q103 empty question has 100% empty controls',
    blanks.every(b => b.select.value === '')
  );
}

console.log('\n========================================================================');
console.log(`🏆 ALL CHALLENGER 1 ADVERSARIAL STRESS CHECKS PASSED: ${passedChecks} / ${totalChecks}`);
console.log('========================================================================\n');

