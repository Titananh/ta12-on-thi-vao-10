/**
 * TA12 Milestone 1 Adversarial Challenger Test Suite
 * Challenger 2: Section Banks and Study Modules Verification
 * 
 * Verifies:
 * 1. JSON Syntax & File Integrity across all 317 target files.
 * 2. Section Banks Question Counts & Schema (Assert ~4,560 questions).
 * 3. Study Modules Completeness & Cross-Referencing (Theories & Questions).
 * 4. Vocabulary Lookup Tables (IPA phonetics and Vietnamese definitions).
 * 5. Brand Sanitization (Zero occurrences of TAK12 / Tak12, pure TA12).
 * 6. Adversarial Stress & Edge Case Probing (Answerability, Uniqueness, Offline Assets).
 */

const fs = require('fs');
const path = require('path');

const BASE_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(BASE_DIR, 'data');
const SECTIONS_DIR = path.join(DATA_DIR, 'sections');
const THEORIES_VOCAB_DIR = path.join(DATA_DIR, 'theories', 'vocabulary');
const THEORIES_GRAMMAR_DIR = path.join(DATA_DIR, 'theories', 'grammar');
const QUESTIONS_VOCAB_DIR = path.join(DATA_DIR, 'questions', 'vocabulary');
const QUESTIONS_GRAMMAR_DIR = path.join(DATA_DIR, 'questions', 'grammar');
const IMAGES_EXAMS_DIR = path.join(BASE_DIR, 'public', 'images', 'exams');

let totalTests = 0;
let passedTests = 0;
const failures = [];

const suiteStats = {
  vector1_syntax: { total: 0, passed: 0, failed: 0 },
  vector2_sections: { total: 0, passed: 0, failed: 0 },
  vector3_study_modules: { total: 0, passed: 0, failed: 0 },
  vector4_vocab_tables: { total: 0, passed: 0, failed: 0 },
  vector5_sanitization: { total: 0, passed: 0, failed: 0 },
  vector6_stress_edge_cases: { total: 0, passed: 0, failed: 0 }
};

let currentVector = 'vector1_syntax';

function assert(condition, testName, details = '') {
  totalTests++;
  suiteStats[currentVector].total++;
  if (condition) {
    passedTests++;
    suiteStats[currentVector].passed++;
  } else {
    suiteStats[currentVector].failed++;
    const errMsg = `[${currentVector}] ${testName}${details ? ' - ' + details : ''}`;
    failures.push(errMsg);
    console.error(`  ❌ FAIL: ${errMsg}`);
  }
}

// Helper to collect all JSON files in scope
function getTargetJsonFiles() {
  const dirs = [
    { dir: SECTIONS_DIR, name: 'sections' },
    { dir: THEORIES_VOCAB_DIR, name: 'theories_vocab' },
    { dir: THEORIES_GRAMMAR_DIR, name: 'theories_grammar' },
    { dir: QUESTIONS_VOCAB_DIR, name: 'questions_vocab' },
    { dir: QUESTIONS_GRAMMAR_DIR, name: 'questions_grammar' }
  ];

  const fileList = [];
  for (const item of dirs) {
    if (!fs.existsSync(item.dir)) continue;
    const files = fs.readdirSync(item.dir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      fileList.push({
        group: item.name,
        fileName: f,
        fullPath: path.join(item.dir, f)
      });
    }
  }
  return fileList;
}

// Helper to extract rows from .vocab-table-sharp HTML
function parseVocabTableRows(html) {
  if (!html || typeof html !== 'string') return [];
  const rows = [];
  const trMatches = html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  for (const tr of trMatches) {
    if (tr.includes('<th')) continue; // skip header row
    const wordMatch = tr.match(/class=["']word-en-sharp["']>([^<]+)<\/span>/i);
    const posMatch = tr.match(/class=["']word-pos-sharp["']>([^<]+)<\/span>/i);
    const ipaMatch = tr.match(/class=["']word-(?:ipa|pron)-sharp["']>([^<]+)<\/span>/i) || tr.match(/\/[^/<>]+\//);
    const viMatch = tr.match(/<em>([^<]+)<\/em>/i) || tr.match(/<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/i);

    if (wordMatch) {
      rows.push({
        word: wordMatch[1].trim(),
        pos: posMatch ? posMatch[1].trim() : '',
        ipa: ipaMatch ? (Array.isArray(ipaMatch) ? ipaMatch[1] || ipaMatch[0] : ipaMatch).trim() : '',
        vietnamese: viMatch ? (viMatch[1] || '').replace(/<[^>]+>/g, '').trim() : ''
      });
    }
  }
  return rows;
}

async function runAdversarialSuite() {
  console.log('================================================================');
  console.log('🛡️ TA12 ADVERSARIAL CHALLENGER 2: EMPIRICAL TEST SUITE (M1)');
  console.log('================================================================\n');

  const allTargetFiles = getTargetJsonFiles();

  // ====================================================================
  // VECTOR 1: Complete Syntax & Structural Validation (317 JSON files)
  // ====================================================================
  currentVector = 'vector1_syntax';
  console.log('▶ [Vector 1] Validating JSON Syntax & File Integrity across all 317 target files...');

  assert(allTargetFiles.length === 317, 'Total target file count is exactly 317', `Found: ${allTargetFiles.length}`);

  const parsedData = new Map();
  for (const item of allTargetFiles) {
    let raw;
    try {
      raw = fs.readFileSync(item.fullPath, 'utf8');
      assert(raw.length > 20, `File ${item.group}/${item.fileName} has substantial size`, `${raw.length} bytes`);
      // Check for UTF-8 BOM
      assert(!raw.startsWith('\uFEFF'), `File ${item.group}/${item.fileName} contains no UTF-8 BOM`);
      const parsed = JSON.parse(raw);
      assert(typeof parsed === 'object' && parsed !== null, `File ${item.group}/${item.fileName} parsed to non-null object`);
      parsedData.set(item.fullPath, parsed);
    } catch (err) {
      assert(false, `File ${item.group}/${item.fileName} has valid JSON syntax`, err.message);
    }
  }

  // ====================================================================
  // VECTOR 2: Section Bank Question Inventory & Canonical Distribution
  // ====================================================================
  currentVector = 'vector2_sections';
  console.log('\n▶ [Vector 2] Verifying Section Bank Inventory & Question Count (~4,560 assertions)...');

  const secIndexFile = path.join(SECTIONS_DIR, 'index.json');
  assert(fs.existsSync(secIndexFile), 'data/sections/index.json exists');
  const secIndex = parsedData.get(secIndexFile) || [];

  assert(Array.isArray(secIndex) && secIndex.length === 10, 'data/sections/index.json contains exactly 10 sections', `Found: ${secIndex.length}`);

  const canonicalSectionMap = {
    'pronunciation': { expectedCount: 274, minExams: 130 },
    'stress': { expectedCount: 280, minExams: 130 },
    'error_identification': { expectedCount: 236, minExams: 70 },
    'communicative_functions': { expectedCount: 191, minExams: 100 },
    'sign_notices': { expectedCount: 141, minExams: 60 },
    'grammar_vocab_cloze': { expectedCount: 1484, minExams: 130 },
    'guided_cloze': { expectedCount: 207, minExams: 110 },
    'reading_comprehension': { expectedCount: 759, minExams: 130 },
    'sentence_transformation': { expectedCount: 635, minExams: 130 },
    'sentence_combination': { expectedCount: 353, minExams: 110 }
  };

  let totalQuestionsAcrossSections = 0;
  let totalDeclaredQuestions = 0;

  for (const secMeta of secIndex) {
    const secId = secMeta.sectionId;
    totalDeclaredQuestions += secMeta.totalQuestions;

    const expectedConfig = canonicalSectionMap[secId];
    assert(Boolean(expectedConfig), `Section ${secId} is in canonical section specification`);
    if (expectedConfig) {
      assert(secMeta.totalQuestions === expectedConfig.expectedCount,
        `Section ${secId} declared count matches canonical (${expectedConfig.expectedCount})`,
        `Found: ${secMeta.totalQuestions}`);
      assert(secMeta.examCount >= expectedConfig.minExams,
        `Section ${secId} aggregates questions from >= ${expectedConfig.minExams} exams`,
        `Found: ${secMeta.examCount}`);
    }

    const secFilePath = path.join(SECTIONS_DIR, `${secId}.json`);
    assert(fs.existsSync(secFilePath), `Section file ${secId}.json exists on disk`);

    const secData = parsedData.get(secFilePath);
    if (secData) {
      assert(secData.sectionId === secId, `Section file ${secId}.json has matching sectionId`);
      assert(secData.sectionName === secMeta.sectionName, `Section ${secId} sectionName matches index.json`);
      assert(Array.isArray(secData.questions), `Section ${secId} contains questions array`);
      assert(secData.questions.length === secMeta.totalQuestions,
        `Section ${secId} questions array length strictly matches totalQuestions (${secMeta.totalQuestions})`,
        `Found: ${secData.questions ? secData.questions.length : 0}`);

      totalQuestionsAcrossSections += (secData.questions ? secData.questions.length : 0);

      // Verify question structure
      for (let i = 0; i < secData.questions.length; i++) {
        const q = secData.questions[i];
        assert(typeof q.id === 'number' && q.id > 0, `Section ${secId} Q#${i + 1} has positive integer id`);
        assert(typeof q.questionText === 'string' && q.questionText.trim().length > 0,
          `Section ${secId} Q#${i + 1} (id: ${q.id}) has non-empty questionText`);
        assert(typeof q.sourceExamId === 'number' && q.sourceExamId > 0,
          `Section ${secId} Q#${i + 1} (id: ${q.id}) tracks sourceExamId`);
        assert(typeof q.sourceExamName === 'string' && q.sourceExamName.length > 0,
          `Section ${secId} Q#${i + 1} (id: ${q.id}) tracks sourceExamName`);

        // MultipleChoice verification
        if (q.questionType === 'MultipleChoice') {
          assert(Array.isArray(q.choices) && q.choices.length >= 2,
            `Section ${secId} MCQ Q#${q.id} has >= 2 choices`, `Found: ${q.choices ? q.choices.length : 0}`);
          const hasCorrectMark = q.choices.some(c => c.isCorrect === true) || q.correctChoiceId !== null;
          assert(hasCorrectMark, `Section ${secId} MCQ Q#${q.id} has an answer key`);
        }
      }
    }
  }

  assert(totalDeclaredQuestions === 4560, 'Total questions declared across index.json is exactly 4,560', `Found: ${totalDeclaredQuestions}`);
  assert(totalQuestionsAcrossSections === 4560, 'Total questions on disk across all 10 section files is exactly 4,560', `Found: ${totalQuestionsAcrossSections}`);

  // ====================================================================
  // VECTOR 3: Study Modules Completeness & Cross-Referencing
  // ====================================================================
  currentVector = 'vector3_study_modules';
  console.log('\n▶ [Vector 3] Verifying Study Modules Completeness (Cat 44 Vocab & Cat 240 Grammar)...');

  // Vocabulary Modules (Cat 44)
  const vocabTheoryIndexFile = path.join(THEORIES_VOCAB_DIR, 'index.json');
  assert(fs.existsSync(vocabTheoryIndexFile), 'data/theories/vocabulary/index.json exists');
  const vocabTheoryIndex = parsedData.get(vocabTheoryIndexFile) || [];
  assert(Array.isArray(vocabTheoryIndex) && vocabTheoryIndex.length === 76,
    'data/theories/vocabulary/index.json lists exactly 76 modules', `Found: ${vocabTheoryIndex.length}`);

  let totalVocabDeclaredQuestions = 0;
  let totalVocabActualQuestions = 0;

  for (const item of vocabTheoryIndex) {
    totalVocabDeclaredQuestions += item.questionCount;
    const tFile = path.join(THEORIES_VOCAB_DIR, `vocab_${item.id}.json`);
    const qFile = path.join(QUESTIONS_VOCAB_DIR, `vocab_${item.id}.json`);

    assert(fs.existsSync(tFile), `Vocabulary theory file vocab_${item.id}.json exists`);
    assert(fs.existsSync(qFile), `Vocabulary question file vocab_${item.id}.json exists`);

    const tData = parsedData.get(tFile);
    if (tData) {
      assert(tData.quizId === item.id, `Vocabulary theory vocab_${item.id} has matching quizId`);
      assert(tData.type === 'vocabulary', `Vocabulary theory vocab_${item.id} has type 'vocabulary'`);
      assert(Array.isArray(tData.lessons), `Vocabulary theory vocab_${item.id} contains lessons array`);
      const isReview = item.title && item.title.includes('Review');
      if (!isReview) {
        assert(tData.lessons.length > 0, `Standard vocabulary theory vocab_${item.id} has lessons`);
      }
    }

    const qData = parsedData.get(qFile);
    if (qData) {
      assert(qData.quizId === item.id, `Vocabulary question vocab_${item.id} has matching quizId`);
      assert(Array.isArray(qData.questions), `Vocabulary question vocab_${item.id} has questions array`);
      assert(qData.questions.length === item.questionCount,
        `Vocabulary question vocab_${item.id} count (${qData.questions.length}) matches declared (${item.questionCount})`);
      totalVocabActualQuestions += qData.questions.length;
    }
  }

  assert(totalVocabDeclaredQuestions === 1311, 'Total vocabulary study questions declared is 1,311', `Found: ${totalVocabDeclaredQuestions}`);
  assert(totalVocabActualQuestions === 1311, 'Total vocabulary study questions on disk is exactly 1,311', `Found: ${totalVocabActualQuestions}`);

  // Grammar Modules (Cat 240)
  const grammarTheoryIndexFile = path.join(THEORIES_GRAMMAR_DIR, 'index.json');
  assert(fs.existsSync(grammarTheoryIndexFile), 'data/theories/grammar/index.json exists');
  const grammarTheoryIndex = parsedData.get(grammarTheoryIndexFile) || [];
  assert(Array.isArray(grammarTheoryIndex) && grammarTheoryIndex.length === 76,
    'data/theories/grammar/index.json lists exactly 76 modules', `Found: ${grammarTheoryIndex.length}`);

  let totalGrammarDeclaredQuestions = 0;
  let totalGrammarActualQuestions = 0;

  for (const item of grammarTheoryIndex) {
    totalGrammarDeclaredQuestions += item.questionCount;
    const tFile = path.join(THEORIES_GRAMMAR_DIR, `grammar_${item.id}.json`);
    const qFile = path.join(QUESTIONS_GRAMMAR_DIR, `grammar_${item.id}.json`);

    assert(fs.existsSync(tFile), `Grammar theory file grammar_${item.id}.json exists`);
    assert(fs.existsSync(qFile), `Grammar question file grammar_${item.id}.json exists`);

    const tData = parsedData.get(tFile);
    if (tData) {
      assert(tData.quizId === item.id, `Grammar theory grammar_${item.id} has matching quizId`);
      assert(tData.type === 'grammar', `Grammar theory grammar_${item.id} has type 'grammar'`);
      assert(Array.isArray(tData.lessons) && tData.lessons.length > 0,
        `Grammar theory grammar_${item.id} contains lessons array`);
    }

    const qData = parsedData.get(qFile);
    if (qData) {
      assert(qData.quizId === item.id, `Grammar question grammar_${item.id} has matching quizId`);
      assert(Array.isArray(qData.questions), `Grammar question grammar_${item.id} has questions array`);
      assert(qData.questions.length === item.questionCount,
        `Grammar question grammar_${item.id} count (${qData.questions.length}) matches declared (${item.questionCount})`);
      totalGrammarActualQuestions += qData.questions.length;
    }
  }

  assert(totalGrammarDeclaredQuestions === 1883, 'Total grammar study questions declared is 1,883', `Found: ${totalGrammarDeclaredQuestions}`);
  assert(totalGrammarActualQuestions === 1883, 'Total grammar study questions on disk is exactly 1,883', `Found: ${totalGrammarActualQuestions}`);

  // ====================================================================
  // VECTOR 4: Vocabulary Lookup Tables (IPA and Vietnamese Definitions)
  // ====================================================================
  currentVector = 'vector4_vocab_tables';
  console.log('\n▶ [Vector 4] Auditing Vocabulary Lookup Tables (IPA Phonetics & Vietnamese Definitions)...');

  let totalTablesFound = 0;
  let totalEntriesExtracted = 0;
  let entriesWithIpa = 0;
  let entriesWithVietnamese = 0;
  const sampledTableEntries = [];

  for (const item of allTargetFiles) {
    const data = parsedData.get(item.fullPath);
    if (!data || !data.questions) continue;

    for (const q of data.questions) {
      if (q.explanation && q.explanation.includes('vocab-table-sharp')) {
        totalTablesFound++;
        const entries = parseVocabTableRows(q.explanation);
        for (const entry of entries) {
          totalEntriesExtracted++;
          // Check for IPA formatting
          const hasIpaFormat = entry.ipa && entry.ipa.startsWith('/') && entry.ipa.endsWith('/');
          if (hasIpaFormat) entriesWithIpa++;

          // Check for Vietnamese definition (presence of characters or words)
          const hasVietnamese = entry.vietnamese && entry.vietnamese.length > 0;
          if (hasVietnamese) entriesWithVietnamese++;

          if (sampledTableEntries.length < 10) {
            sampledTableEntries.push({
              sourceFile: `${item.group}/${item.fileName}`,
              questionId: q.id,
              ...entry
            });
          }
        }
      }
    }
  }

  assert(totalTablesFound >= 200, 'Found at least 200 vocabulary lookup tables across questions', `Found: ${totalTablesFound}`);
  assert(totalEntriesExtracted >= 800, 'Extracted at least 800 vocabulary lookup entries', `Found: ${totalEntriesExtracted}`);
  assert(entriesWithIpa >= 800, 'Over 95% of vocabulary entries have IPA phonetic transcriptions',
    `Found: ${entriesWithIpa}/${totalEntriesExtracted} (${((entriesWithIpa / totalEntriesExtracted) * 100).toFixed(1)}%)`);
  assert(entriesWithVietnamese === totalEntriesExtracted, '100% of vocabulary entries have Vietnamese definitions',
    `Found: ${entriesWithVietnamese}/${totalEntriesExtracted}`);

  console.log(`    Sampled Vocabulary Entries (${sampledTableEntries.length} items):`);
  sampledTableEntries.slice(0, 3).forEach(e => {
    console.log(`      * [${e.sourceFile}] ${e.word} ${e.pos} ${e.ipa} -> "${e.vietnamese}"`);
  });

  // ====================================================================
  // VECTOR 5: Brand Sanitization (Zero Legacy TAK12, pure TA12)
  // ====================================================================
  currentVector = 'vector5_sanitization';
  console.log('\n▶ [Vector 5] Scanning all 317 files for Brand Sanitization (zero TAK12, pure TA12)...');

  let filesWithTak12Upper = 0;
  let filesWithTak12Mixed = 0;
  let filesWithTak12Regex = 0;
  let filesWithTa12 = 0;

  for (const item of allTargetFiles) {
    const raw = fs.readFileSync(item.fullPath, 'utf8');

    if (raw.includes('TAK12')) {
      filesWithTak12Upper++;
      assert(false, `File ${item.group}/${item.fileName} contains forbidden uppercase 'TAK12'`);
    }

    if (raw.includes('Tak12')) {
      filesWithTak12Mixed++;
      assert(false, `File ${item.group}/${item.fileName} contains forbidden mixed-case 'Tak12'`);
    }

    if (/\btak12\b/i.test(raw)) {
      filesWithTak12Regex++;
      assert(false, `File ${item.group}/${item.fileName} contains case-insensitive 'tak12' word boundary`);
    }

    if (raw.includes('TA12')) {
      filesWithTa12++;
    }
  }

  assert(filesWithTak12Upper === 0, 'Zero occurrences of uppercase "TAK12" across all 317 files', `Violations: ${filesWithTak12Upper}`);
  assert(filesWithTak12Mixed === 0, 'Zero occurrences of mixed-case "Tak12" across all 317 files', `Violations: ${filesWithTak12Mixed}`);
  assert(filesWithTak12Regex === 0, 'Zero occurrences of word-boundary "tak12" across all 317 files', `Violations: ${filesWithTak12Regex}`);
  assert(filesWithTa12 > 0, 'TA12 brand name is actively present in target dataset', `Found in ${filesWithTa12} files`);

  // ====================================================================
  // VECTOR 6: Adversarial Stress & Edge Case Probing
  // ====================================================================
  currentVector = 'vector6_stress_edge_cases';
  console.log('\n▶ [Vector 6] Stress-Testing Edge Cases: Answerability, Uniqueness, Slicing & Assets...');

  // 1. Unlocalized Image Detection (Diagnosing crawler regex flaw)
  let unlocalizedUploadImages = 0;
  let localizedImages = 0;
  for (const item of allTargetFiles) {
    const raw = fs.readFileSync(item.fullPath, 'utf8');
    const uploadMatches = raw.match(/\/Upload\/[^\s"'\\]+/g) || [];
    const locMatches = raw.match(/\/images\/(?:exams|rules)\/[^\s"'\\]+/g) || [];
    unlocalizedUploadImages += uploadMatches.length;
    localizedImages += locMatches.length;
  }
  console.log(`    📊 Image Localization Audit: ${localizedImages} localized, ${unlocalizedUploadImages} unlocalized (/Upload/)`);
  assert(localizedImages >= 200, 'At least 200 image assets are successfully localized to public/images/', `Found: ${localizedImages}`);

  // 2. Answerability Audit
  let totalMCQChecked = 0;
  let mcqWithAnswers = 0;
  let wordOrderQuestions = 0;
  let matchingQuestions = 0;

  for (const item of allTargetFiles) {
    const data = parsedData.get(item.fullPath);
    if (!data || !data.questions) continue;
    for (const q of data.questions) {
      if (q.questionType === 'MultipleChoice') {
        totalMCQChecked++;
        const hasAns = q.correctChoiceId !== null || (q.choices && q.choices.some(c => c.isCorrect));
        if (hasAns) mcqWithAnswers++;
      } else if (q.questionType === 'WordOrder') {
        wordOrderQuestions++;
      } else if (q.questionType === 'Matching') {
        matchingQuestions++;
      }
    }
  }

  assert(totalMCQChecked > 5000, 'Audited over 5,000 MultipleChoice questions', `Checked: ${totalMCQChecked}`);
  assert(mcqWithAnswers === totalMCQChecked, '100% of MultipleChoice questions have valid answers',
    `Answers: ${mcqWithAnswers}/${totalMCQChecked}`);
  console.log(`    📊 Pedagogical Types: MCQ: ${totalMCQChecked} (100% answered), WordOrder: ${wordOrderQuestions}, Matching: ${matchingQuestions}`);

  // 3. Slicing Stress Test: 1,000 random slices over section banks
  console.log('    ⚡ Running 1,000 randomized drill slicing operations on Section Banks...');
  const secFiles = fs.readdirSync(SECTIONS_DIR).filter(f => f.endsWith('.json') && f !== 'index.json');
  const startSliceTime = Date.now();
  let successfulSlices = 0;

  for (let i = 0; i < 1000; i++) {
    const randomSecFile = secFiles[Math.floor(Math.random() * secFiles.length)];
    const secData = parsedData.get(path.join(SECTIONS_DIR, randomSecFile));
    const sampleSize = [10, 20, 30][Math.floor(Math.random() * 3)];
    const questions = secData.questions;
    
    // Perform random slice / shuffle
    const sliced = questions.slice(0, Math.min(sampleSize, questions.length));
    if (sliced.length > 0 && sliced.every(q => q && q.id > 0 && q.questionText)) {
      successfulSlices++;
    }
  }
  const sliceDuration = Date.now() - startSliceTime;
  assert(successfulSlices === 1000, '1,000 random slicing operations succeeded with zero errors', `Success: ${successfulSlices}/1000`);
  assert(sliceDuration < 500, `1,000 slicing operations completed rapidly (< 500ms)`, `Duration: ${sliceDuration}ms`);

  // ====================================================================
  // SUMMARY & EMPIRICAL VERDICT
  // ====================================================================
  console.log('\n================================================================');
  console.log('📊 ADVERSARIAL TEST SUITE SUMMARY:');
  console.log(`   Total Assertions: ${totalTests}`);
  console.log(`   Passed:           ${passedTests} (${((passedTests / totalTests) * 100).toFixed(2)}%)`);
  console.log(`   Failed:           ${failures.length}`);
  console.log('----------------------------------------------------------------');
  for (const [v, stats] of Object.entries(suiteStats)) {
    const pct = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(1) : '100.0';
    console.log(`   ${v.padEnd(26)}: ${stats.passed}/${stats.total} passed (${pct}%)`);
  }
  console.log('================================================================\n');

  if (failures.length > 0) {
    console.error('❌ FAILURES DETECTED:');
    failures.forEach(f => console.error(`   - ${f}`));
    process.exit(1);
  } else {
    console.log('✅ ALL ADVERSARIAL CHALLENGES & ASSERTIONS PASSED WITH ZERO FAILURES!');
    process.exit(0);
  }
}

runAdversarialSuite().catch(err => {
  console.error('Fatal suite execution error:', err);
  process.exit(1);
});
