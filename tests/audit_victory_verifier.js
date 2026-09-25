const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');
const QUESTIONS_DIR = path.join(ROOT_DIR, 'data', 'questions');
const THEORIES_DIR = path.join(ROOT_DIR, 'data', 'theories');
const TAXONOMY_PATH = path.join(ROOT_DIR, 'data', 'taxonomy.json');

const checks = [];
let passCount = 0;
let failCount = 0;

function audit(name, condition, details = '') {
  if (condition) {
    passCount++;
    checks.push({ name, status: 'PASS', details });
  } else {
    failCount++;
    checks.push({ name, status: 'FAIL', details });
    console.error(`❌ AUDIT FAILED: ${name} - ${details}`);
  }
}

async function runAudit() {
  console.log('=== STARTING INDEPENDENT VICTORY AUDIT VERIFICATION ===\n');

  // 1. DATA REPOSITORY & TAXONOMY (R1)
  audit('Taxonomy File Exists', fs.existsSync(TAXONOMY_PATH));
  const taxonomy = JSON.parse(fs.readFileSync(TAXONOMY_PATH, 'utf8'));
  const skillNames = (taxonomy.skills || []).map(s => s.skillName);
  const requiredSkills = ['Phonetics', 'Vocabulary', 'Grammar', 'Reading', 'Speaking'];
  const allSkillsPresent = requiredSkills.every(s => skillNames.includes(s));
  audit('All 5 Required Skills in Taxonomy', allSkillsPresent, `Found: ${skillNames.join(', ')}`);

  const questionFiles = fs.readdirSync(QUESTIONS_DIR).filter(f => f.endsWith('.json'));
  audit('Question Files Count >= 38', questionFiles.length >= 38, `Count: ${questionFiles.length}`);

  const theoryFiles = fs.readdirSync(THEORIES_DIR).filter(f => f.endsWith('.json'));
  audit('Theory Files Count >= 38', theoryFiles.length >= 38, `Count: ${theoryFiles.length}`);

  let totalQuestions = 0;
  const choicePositionCounts = { 0: 0, 1: 0, 2: 0, 3: 0 };
  const allQuestionTexts = new Set();
  let duplicateQuestions = 0;
  let missingFields = 0;
  let invalidChoiceCount = 0;
  let invalidCorrectChoice = 0;
  let emptyExplanations = 0;

  for (const qf of questionFiles) {
    const raw = fs.readFileSync(path.join(QUESTIONS_DIR, qf), 'utf8');
    const qs = JSON.parse(raw);
    audit(`Topic ${qf} has 15 questions`, qs.length === 15, `Length: ${qs.length}`);
    totalQuestions += qs.length;

    for (const q of qs) {
      if (!q.id || !q.questionText || !q.choices || !q.correctChoiceId || !q.explanation) {
        missingFields++;
      }
      if (!Array.isArray(q.choices) || q.choices.length !== 4) {
        invalidChoiceCount++;
      } else {
        const correctIdx = q.choices.findIndex(c => c.id === q.correctChoiceId);
        if (correctIdx === -1) {
          invalidCorrectChoice++;
        } else {
          choicePositionCounts[correctIdx] = (choicePositionCounts[correctIdx] || 0) + 1;
        }
      }
      if (!q.explanation || q.explanation.trim().length < 10) {
        emptyExplanations++;
      }
      const strippedText = q.questionText.replace(/<[^>]*>/g, '').trim();
      if (allQuestionTexts.has(strippedText)) {
        duplicateQuestions++;
      } else {
        allQuestionTexts.add(strippedText);
      }
    }
  }

  audit('Total Questions Exactly 570', totalQuestions === 570, `Count: ${totalQuestions}`);
  audit('Zero Missing Essential Fields', missingFields === 0, `Missing: ${missingFields}`);
  audit('All Questions Have Exactly 4 Choices', invalidChoiceCount === 0, `Invalid: ${invalidChoiceCount}`);
  audit('All CorrectChoiceIds Match a Valid Choice', invalidCorrectChoice === 0, `Invalid: ${invalidCorrectChoice}`);
  audit('All Explanations Non-Empty & Detailed (>10 chars)', emptyExplanations === 0, `Empty: ${emptyExplanations}`);

  // Answer distribution check
  console.log('Answer distribution (A/B/C/D):', choicePositionCounts);
  const minPos = Math.min(...Object.values(choicePositionCounts));
  const maxPos = Math.max(...Object.values(choicePositionCounts));
  audit('Balanced Answer Distribution (No position > 45% or < 10%)', minPos > 57 && maxPos < 256,
    `Min: ${minPos} (${((minPos/570)*100).toFixed(1)}%), Max: ${maxPos} (${((maxPos/570)*100).toFixed(1)}%)`);

  // Theory validation
  let invalidTheories = 0;
  for (const tf of theoryFiles) {
    const raw = fs.readFileSync(path.join(THEORIES_DIR, tf), 'utf8');
    const t = JSON.parse(raw);
    if (!t.topicName || !Array.isArray(t.rules) || t.rules.length === 0) {
      invalidTheories++;
    }
  }
  audit('All 38 Theories Have Rules and TopicName', invalidTheories === 0, `Invalid: ${invalidTheories}`);

  // 2. WEB UI & QUIZ MECHANICS (R2)
  const headerTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/components/Header.tsx'), 'utf8');
  audit('Header: Brand Logo SVG present', headerTsx.includes('/images/logo.svg'));
  audit('Header: Brand Alt is TA12', headerTsx.includes('alt="TA12"'));
  audit('Header: Navigation items present',
    headerTsx.includes('Tổng quan') && headerTsx.includes('TA vào 10 HN') && headerTsx.includes('Chương trình ôn luyện'));
  audit('Header: Gamification badges (Flame & Gem)', headerTsx.includes('Flame') && headerTsx.includes('Gem'));
  audit('Header: User Profile badge (Đỗ Tuấn / Học viên)', headerTsx.includes('Đỗ Tuấn') && headerTsx.includes('Học viên'));

  const navCardsTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/components/NavCards.tsx'), 'utf8');
  audit('NavCards: 4 big cards (HỌC ÔN, LUYỆN ĐỀ THI, LUYỆN TỪNG PHẦN, LUYỆN CHỦ ĐIỂM)',
    ['HỌC ÔN', 'LUYỆN ĐỀ THI', 'LUYỆN TỪNG PHẦN', 'LUYỆN CHỦ ĐIỂM'].every(card => navCardsTsx.includes(card)));

  const filterPillsTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/components/FilterPills.tsx'), 'utf8');
  audit('FilterPills: 5 skill pills present',
    requiredSkills.every(s => filterPillsTsx.includes(s)));
  audit('FilterPills: "+ Tạo phiên ôn luyện" button present', filterPillsTsx.includes('Tạo phiên ôn luyện'));

  const topicListTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/components/TopicList.tsx'), 'utf8');
  audit('TopicList: 2-column layout & progress bar',
    topicListTsx.includes('md:grid-cols-2') && topicListTsx.includes('topicScore'));

  const practiceTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/app/practice/[topicId]/page.tsx'), 'utf8');
  audit('Practice: "Kiểm tra ngay" instant check button', practiceTsx.includes('Kiểm tra ngay'));
  audit('Practice: Retry mechanism ("Bạn có 01 lượt làm lại...")', practiceTsx.includes('Bạn có 01 lượt làm lại'));
  audit('Practice: "Xem đáp án" button', practiceTsx.includes('Xem đáp án'));
  audit('Practice: Detailed explanation drawer', practiceTsx.includes('Giải thích chi tiết'));
  audit('Practice: Audio pronunciation TTS button', practiceTsx.includes('Volume2') && practiceTsx.includes('speechSynthesis'));
  audit('Practice: Trophy summary screen', practiceTsx.includes('Hoàn thành phiên ôn luyện') && practiceTsx.includes('Trophy'));

  const modalTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/components/PracticeSessionModal.tsx'), 'utf8');
  audit('SessionModal: Multi-skill and question count picker',
    modalTsx.includes('toggleSkill') && modalTsx.includes('questionCount'));

  // 3. OFFLINE CAPABILITY & ZERO EXTERNAL LEAKS
  const layoutTsx = fs.readFileSync(path.join(ROOT_DIR, 'src/app/layout.tsx'), 'utf8');
  audit('No Google Fonts or external CDN links in layout.tsx',
    !layoutTsx.includes('fonts.googleapis.com') && !layoutTsx.includes('http://') && !layoutTsx.includes('https://cdn'));

  // 4. BRAND INTEGRITY (Zero "TAK12")
  const allSourceFiles = [
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/app/practice/[topicId]/page.tsx',
    'src/components/Header.tsx',
    'src/components/NavCards.tsx',
    'src/components/FilterPills.tsx',
    'src/components/TopicList.tsx',
    'src/components/PracticeSessionModal.tsx',
    'src/components/TheoryModal.tsx',
  ];
  let brandViolations = 0;
  for (const sf of allSourceFiles) {
    const content = fs.readFileSync(path.join(ROOT_DIR, sf), 'utf8');
    if (content.includes('TAK12')) {
      brandViolations++;
      console.error(`Brand violation in ${sf}`);
    }
  }
  audit('Zero TAK12 brand violations across source files', brandViolations === 0);

  // 5. LIVE API TEST
  const apiProbe = await new Promise((resolve) => {
    http.get('http://127.0.0.1:3000/api/questions?topicId=68', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, error: e.message });
        }
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });

  audit('Live API /api/questions?topicId=68 HTTP 200', apiProbe.status === 200);
  audit('Live API returns 15 authentic questions for topic 68',
    apiProbe.data && Array.isArray(apiProbe.data.questions) && apiProbe.data.questions.length === 15);
  audit('Live API returns theory for topic 68',
    apiProbe.data && apiProbe.data.theory && apiProbe.data.theory.rules && apiProbe.data.theory.rules.length > 0);

  // 6. CUSTOM SESSION API TEST
  const customProbe = await new Promise((resolve) => {
    http.get('http://127.0.0.1:3000/api/questions?topicId=custom&topics=68,69,81&count=10', (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, error: e.message });
        }
      });
    }).on('error', (err) => resolve({ error: err.message }));
  });

  audit('Custom Session API HTTP 200', customProbe.status === 200);
  audit('Custom Session API returns requested count (10)',
    customProbe.data && Array.isArray(customProbe.data.questions) && customProbe.data.questions.length === 10);

  // SUMMARY
  console.log(`\n====================================================`);
  console.log(`AUDIT RESULTS: ${passCount} PASSED, ${failCount} FAILED out of ${checks.length} checks`);
  console.log(`====================================================\n`);

  if (failCount > 0) {
    console.error('FAILED CHECKS:');
    checks.filter(c => c.status === 'FAIL').forEach(c => console.error(` - ${c.name}: ${c.details}`));
    process.exit(1);
  } else {
    console.log('✅ ALL INDEPENDENT CHECKS PASSED PERFECTLY!');
    process.exit(0);
  }
}

runAudit();
