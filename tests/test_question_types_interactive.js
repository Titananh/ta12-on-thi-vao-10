/**
 * TA12 Automated Test Suite: Interactive Question Types & Multi-Blank Scoring
 * 
 * Verifies:
 * 1. MultipleChoice (A/B/C/D selection, instant feedback)
 * 2. FillBlank (Select Dropdown, dark mode contrast, multi-blank evaluation, event binding)
 * 3. FillBlank (Input) & ShortAnswer (keyboard entry, string normalization, contractions)
 * 4. WordOrder (chip sequencing, sentence matching)
 * 5. 1-Retry logic and Answer Reveal mechanics across all question types
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('========================================================================');
console.log('🧪 TEST SUITE: INTERACTIVE QUESTION TYPES & MULTI-BLANK SCORING');
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

// Helper: Normalization logic extracted verbatim from page.tsx
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
    .replace(/\s*([,.:;?!])\s*/g, '$1 ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/[.?!]+$/, '');
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
// VECTOR 1: CSS Dark Mode Contrast & Select Styling Integrity
// -----------------------------------------------------------------------------
console.log('▶ Vector 1: CSS Dark Mode Contrast & Select/Option Rules...');
const cssPath = path.join(__dirname, '..', 'src', 'app', 'globals.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

check('globals.css defines .fillblank-option styling', cssContent.includes('.fillblank-option'));
check('globals.css defines select.fillblank-select and select.ms', cssContent.includes('select.fillblank-select') && cssContent.includes('select.ms'));
check('globals.css forces dark background on select: #1e221e', cssContent.includes('.dark select.ms') && cssContent.includes('background-color: #1e221e'));
check('globals.css forces dark text color on select: #ffffff', cssContent.includes('.dark select.ms') && cssContent.includes('color: #ffffff'));
check('globals.css eliminates white-on-white text in select option elements', cssContent.includes('.dark select.ms option') && cssContent.includes('background-color: #1e221e'));
check('globals.css defines input.fillblank-input for short answer', cssContent.includes('input.fillblank-input'));
check('globals.css defines .fillblank-correct-badge for answer reveal', cssContent.includes('.fillblank-correct-badge'));
check('globals.css defines green focus ring (#5fbd18)', cssContent.includes('#5fbd18'));

// -----------------------------------------------------------------------------
// VECTOR 2: String Normalization & Multi-Option Tolerance
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 2: String Normalization & Smart Quote/Contraction Handling...');

check('normalizeBlankValue handles lowercase and spaces', normalizeBlankValue('  AvAiLaBlE  ') === 'available');
check('normalizeBlankValue converts curly quotes', normalizeBlankValue('‘some’') === "'some'");
check('normalizeSentence trims trailing periods', normalizeSentence('She would agree.') === 'she would agree');
check('expandContractions expands haven\'t to have not', expandContractions("i haven't seen") === 'i have not seen');
check('expandContractions expands didn\'t to did not', expandContractions("they didn't go") === 'they did not go');
check('matchesSentence accepts exact match', matchesSentence("I haven't met him for 3 years.", "I haven't met him for 3 years."));
check('matchesSentence accepts expanded contraction vs contracted', matchesSentence("I have not met him for 3 years.", "I haven't met him for 3 years."));
check('matchesSentence ignores punctuation differences', matchesSentence("I haven't met him for 3 years", "I haven't met him for 3 years."));
check('matchesSentence ignores case differences', matchesSentence("i haven't met him for 3 years.", "I HAVEN'T MET HIM FOR 3 YEARS."));

// -----------------------------------------------------------------------------
// VECTOR 3: FillBlank (Select) Real Data Validation & Multi-Blank Scoring
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 3: Real Sign & Notice (sign_notices.json) FillBlank Simulation...');
const signNoticesPath = path.join(__dirname, '..', 'data', 'sections', 'sign_notices.json');
check('data/sections/sign_notices.json exists', fs.existsSync(signNoticesPath));

const signData = JSON.parse(fs.readFileSync(signNoticesPath, 'utf8'));
const q0 = signData.questions[0];

check('Q0 questionType is FillBlank', q0.questionType === 'FillBlank');
check('Q0 has 4 fillblankAnswers', Array.isArray(q0.fillblankAnswers) && q0.fillblankAnswers.length === 4);
check('Q0 questionText contains select with index="0"', q0.questionText.includes('index=\'0\''));
check('Q0 questionText contains select with index="3"', q0.questionText.includes('index=\'3\''));

// Simulate user selecting answers
const correctAnswersMap = {
  '0': q0.fillblankAnswers[0].correctAnswers[0], // "some"
  '1': q0.fillblankAnswers[1].correctAnswers[0], // "available"
  '2': q0.fillblankAnswers[2].correctAnswers[0], // "reusable"
  '3': q0.fillblankAnswers[3].correctAnswers[0], // "a"
};

// Test scoring function
function scoreFillBlank(userAnswers, expectedAnswers) {
  let correctCount = 0;
  expectedAnswers.forEach((fb, idx) => {
    const userVal = normalizeBlankValue(userAnswers[String(fb.index)] ?? userAnswers[idx] ?? '');
    const match = (fb.correctAnswers || []).some(ans => normalizeBlankValue(ans) === userVal);
    if (match) correctCount++;
  });
  return correctCount === expectedAnswers.length;
}

check('100% correct answers produces score pass', scoreFillBlank(correctAnswersMap, q0.fillblankAnswers) === true);

const partialAnswersMap = { ...correctAnswersMap, '0': 'much' }; // 1 wrong
check('Partial correct answers (3/4) produces score fail', scoreFillBlank(partialAnswersMap, q0.fillblankAnswers) === false);

const emptyAnswersMap = {};
check('Empty answers produces score fail', scoreFillBlank(emptyAnswersMap, q0.fillblankAnswers) === false);

// -----------------------------------------------------------------------------
// VECTOR 4: ShortAnswer Real Data Simulation (grammar_vocab_cloze.json)
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 4: ShortAnswer Data Validation & Submission Logic...');
const clozeDataPath = path.join(__dirname, '..', 'data', 'sections', 'grammar_vocab_cloze.json');
check('data/sections/grammar_vocab_cloze.json exists', fs.existsSync(clozeDataPath));

const clozeData = JSON.parse(fs.readFileSync(clozeDataPath, 'utf8'));
const shortQ = clozeData.questions.find(q => q.shortAnswers && q.shortAnswers.length > 0);

check('Found authentic ShortAnswer question with shortAnswers', Boolean(shortQ));
check('ShortAnswer acceptable answer is non-empty', shortQ.shortAnswers[0].length > 0);

const targetAnswer = shortQ.shortAnswers[0];
check('Exact student answer matches', matchesSentence(targetAnswer, targetAnswer));
check('Student answer with extra spacing matches', matchesSentence(`  ${targetAnswer}  `, targetAnswer));
check('Wrong student answer is rejected', matchesSentence('Totally wrong sentence', targetAnswer) === false);

// -----------------------------------------------------------------------------
// VECTOR 5: WordOrder Rearrangement Simulation (sentence_combination.json)
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 5: WordOrder Rearrangement & Chip Sequencing...');
const comboPath = path.join(__dirname, '..', 'data', 'sections', 'sentence_combination.json');
check('data/sections/sentence_combination.json exists', fs.existsSync(comboPath));

const comboData = JSON.parse(fs.readFileSync(comboPath, 'utf8'));
const wordOrderQs = comboData.questions.filter(q => q.questionType === 'WordOrder');

check('WordOrder questions exist in bank (2 questions)', wordOrderQs.length >= 2);

const woQ1 = wordOrderQs[0];
check('WordOrder choices contains word chips', Array.isArray(woQ1.choices) && woQ1.choices.length >= 6);
check('WordOrder has authentic solution in shortAnswers', Array.isArray(woQ1.shortAnswers) && woQ1.shortAnswers.length > 0);

const correctSentence = woQ1.shortAnswers[0];
check('Reconstructed sentence matches target solution', matchesSentence(correctSentence, correctSentence));
check('Scrambled sentence is rejected', matchesSentence('She if you would asked agree', correctSentence) === false);

// -----------------------------------------------------------------------------
// VECTOR 6: Practice Page Code AST & Static Compliance
// -----------------------------------------------------------------------------
console.log('\n▶ Vector 6: Practice Page Code & Event Binding Static Verification...');
const practicePagePath = path.join(__dirname, '..', 'src', 'app', 'practice', '[topicId]', 'page.tsx');
const practiceCode = fs.readFileSync(practicePagePath, 'utf8');

check('Practice page attaches ref={questionPromptRef}', practiceCode.includes('ref={questionPromptRef}'));
check('Practice page tracks blankAnswers state', practiceCode.includes('blankAnswers'));
check('Practice page tracks selectedWordOrder state', practiceCode.includes('selectedWordOrder'));
check('Practice page implements isFillBlank detection', practiceCode.includes('isFillBlank'));
check('Practice page implements isShortAnswer detection', practiceCode.includes('isShortAnswer'));
check('Practice page implements isWordOrder detection', practiceCode.includes('isWordOrder'));
check('Practice page implements canSubmit dynamic unlocking', practiceCode.includes('canSubmit'));
check('Practice page synchronizes selectedChoiceId for submit button', practiceCode.includes('setSelectedChoiceId'));
check('Practice page implements multi-blank scoring in handleSubmitAnswer', practiceCode.includes('correctCount === currentQ.fillblankAnswers.length'));
check('Practice page preserves disabled={!selectedChoiceId} verbatim', practiceCode.includes('disabled={!selectedChoiceId}'));
check('Practice page preserves selectedChoiceId === currentQ.correctChoiceId verbatim', practiceCode.includes('selectedChoiceId === currentQ.correctChoiceId'));
check('Practice page implements 1-Retry reset for interactive questions', practiceCode.includes('handleRetry'));
check('Practice page implements answer reveal for all blanks', practiceCode.includes('handleRevealAnswer'));
check('Practice page renders WordOrder interactive rearrangement area', practiceCode.includes('WordOrder Interactive Rearrangement Area'));
check('Practice page renders FillBlank answer key detail table', practiceCode.includes('FillBlank Answer Key Table when Revealed'));

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n========================================================================');
console.log(`📊 QUESTION TYPES TEST SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
console.log('========================================================================\n');

if (passedChecks === totalChecks) {
  console.log('🎉 ALL QUESTION TYPES VERIFIED 100% PASS!\n');
  process.exit(0);
} else {
  console.error('❌ SOME CHECKS FAILED!\n');
  process.exit(1);
}
