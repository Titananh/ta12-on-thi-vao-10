/**
 * TA12 Master Test Suite Runner
 * Executes the complete regression suite:
 * 1. Comprehensive E2E Verification Suite (run_e2e_tests.js - 3,762 assertions)
 * 2. Full UI/UX & Exam Engine Test Suite (test_milestone2_ui_exam.js - 68 checks)
 * 3. Challenger 1 Adversarial Suite (test_milestone2_challenger_adversarial.js - 222 assertions)
 * 4. Challenger 2 Full Adversarial Suite (adversarial_challenger2_m2.js - 511 assertions)
 */

const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const suites = [
  { name: 'Tier 1-4 E2E Automated Verification', file: 'tests/run_e2e_tests.js' },
  { name: 'Milestone 2 Full UI/UX & Exam Engine Checks', file: 'tests/test_milestone2_ui_exam.js' },
  { name: 'Challenger 1 Adversarial Fuzzing Suite', file: 'tests/test_milestone2_challenger_adversarial.js' },
  { name: 'Challenger 2 Full Adversarial Stress Suite', file: 'tests/adversarial_challenger2_m2.js' },
  { name: 'Kiến thức liên quan 1:1 Tak12 Replica Suite', file: 'tests/verify_kienthuc_modal.js' },
  { name: 'Challenger 2 ExamRunner, Themes & Offline Resilience Suite', file: 'tests/test_examrunner_theme_offline_challenger.js' },
  { name: 'Challenger Practice Player & Modals Stress Suite', file: 'tests/challenger_practice_modals_stress.js' },
  { name: 'Auth, SQLite & Progress Sync Suite (R2)', file: 'tests/test_auth_sqlite_sync.js' },
  { name: 'Milestone 1 Google OAuth Crypto & Admin Zero-Bypass', file: 'tests/test_m1_google_auth_crypto.js' },
  { name: 'Milestone 2 Student Web Security & Pending Gate', file: 'tests/test_m2_student_security.js' },
  { name: 'Milestone 3 Comprehensive Security Penetration Suite', file: 'tests/test_m3_penetration_suite.js' },
  { name: 'Student Password Auth & Admin Masking Suite', file: 'tests/test_student_password_auth.js' },
  { name: 'Deep Penetration & Zero-Leak Security Audit Suite', file: 'tests/test_penetration_deep_audit.js' },
  { name: 'Interactive Question Types & Multi-Blank Scoring Suite', file: 'tests/test_question_types_interactive.js' },
  { name: 'Question Types Parity & Cross-Feature Comprehensive Suite', file: 'tests/test_question_types_parity.js' },
  { name: 'All 138 Exam Bundles Atomic-Point Parity Suite', file: 'tests/test_exam_bundle_atomic_parity.js' }
];

console.log('========================================================================');
console.log('🏆 TA12 MASTER TEST RUNNER — EXECUTING ALL TEST SUITES');
console.log('========================================================================\n');

let allPassed = true;

for (const suite of suites) {
  console.log(`▶ Running: ${suite.name} (${suite.file})...`);
  try {
    const out = execSync(`node ${suite.file}`, { cwd: ROOT, encoding: 'utf8' });
    console.log(out.trim());
    console.log(`\n✅ ${suite.name}: PASSED\n------------------------------------------------------------------------\n`);
  } catch (err) {
    console.error(`\n❌ ${suite.name}: FAILED`);
    if (err.stdout) console.error(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    allPassed = false;
    process.exit(1);
  }
}

console.log('========================================================================');
console.log('🎉 ALL TA12 TEST SUITES PASSED PERFECTLY WITH 100% SUCCESS!');
console.log('   Over 4,760 assertions verified across all modes, 138 exams, and engine.');
console.log('========================================================================');
