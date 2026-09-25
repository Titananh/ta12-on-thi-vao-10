/**
 * Production-data contract for the 138 Tak12 exam bundles.
 *
 * A visible exam "point" is an atomic answer unit. A multi-blank FillBlank
 * group therefore contributes one point per blank, while MC, ShortAnswer and
 * WordOrder groups contribute one point each. Description rows are passages.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BUNDLE_DIR = path.join(ROOT, 'data', 'exams', 'bundles');

let checks = 0;
function check(label, condition) {
  checks++;
  if (!condition) throw new Error(`Assertion failed: ${label}`);
  console.log(`  ✓ ${label}`);
}

function isAnswerable(question) {
  if (question.questionType === 'Description') return false;
  if (question.fillblankAnswers?.length) return true;
  if (question.questionType === 'ShortAnswer') return Boolean(question.shortAnswers?.length);
  if (question.questionType === 'WordOrder') return Boolean(question.choices?.length && question.shortAnswers?.length);
  return Boolean(
    question.choices?.length &&
    (question.choices.some((choice) => choice.isCorrect) || question.correctChoiceId != null)
  );
}

function unitCount(question) {
  return question.fillblankAnswers?.length || 1;
}

console.log('========================================================================');
console.log('🧮 TEST SUITE: ALL 138 EXAM BUNDLES — ATOMIC POINT PARITY');
console.log('========================================================================\n');

const files = fs.readdirSync(BUNDLE_DIR).filter((file) => file.endsWith('.json'));
check('Exactly 138 exam bundles are present', files.length === 138);

const typeCounts = {};
const unitDistribution = {};
const metadataMismatches = [];
const unanswerable = [];
let totalGroups = 0;
let totalUnits = 0;

for (const file of files) {
  const exam = JSON.parse(fs.readFileSync(path.join(BUNDLE_DIR, file), 'utf8'));
  let examGroups = 0;
  let examUnits = 0;

  for (const question of exam.questions) {
    typeCounts[question.questionType] = (typeCounts[question.questionType] || 0) + 1;
    if (question.questionType === 'Description') continue;
    if (!isAnswerable(question)) {
      unanswerable.push(`${exam.id}:${question.id}:${question.questionType}`);
      continue;
    }
    examGroups++;
    examUnits += unitCount(question);
  }

  totalGroups += examGroups;
  totalUnits += examUnits;
  unitDistribution[examUnits] = (unitDistribution[examUnits] || 0) + 1;
  if (exam.totalPoint !== examUnits) {
    metadataMismatches.push({ id: Number(exam.id), declared: exam.totalPoint, computed: examUnits });
  }
}

check('Every non-passage question has the data needed for interaction and scoring', unanswerable.length === 0);
check('All bundles contain 4,560 answerable UI groups', totalGroups === 4560);
check('All bundles contain 5,492 atomic answer units', totalUnits === 5492);
check('Corpus contains 4,289 MultipleChoice questions', typeCounts.MultipleChoice === 4289);
check('Corpus contains 247 FillBlank groups', typeCounts.FillBlank === 247);
check('Corpus contains 22 ShortAnswer questions', typeCounts.ShortAnswer === 22);
check('Corpus contains 2 keyed WordOrder questions', typeCounts.WordOrder === 2);
check('116 bundles contain exactly 40 atomic points', unitDistribution[40] === 116);
check('136/138 bundle point declarations match computed atomic units', metadataMismatches.length === 2);
check(
  'Only the two known source metadata anomalies remain (5021 and 6101)',
  JSON.stringify(metadataMismatches.sort((a, b) => a.id - b.id)) ===
    JSON.stringify([
      { id: 5021, declared: 36, computed: 40 },
      { id: 6101, declared: 40, computed: 39 },
    ])
);

const exam18177 = JSON.parse(fs.readFileSync(path.join(BUNDLE_DIR, '18177.json'), 'utf8'));
const wordOrders = exam18177.questions.filter((question) => question.questionType === 'WordOrder');
check('Exam 18177 retains both WordOrder groups', wordOrders.length === 2);
check('Both WordOrder groups have a canonical answer for deterministic scoring', wordOrders.every((question) => question.shortAnswers?.length));

console.log(`\n✅ ${checks}/${checks} all-bundle atomic-point checks passed.`);

