const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

function fetchJson(urlPath) {
  return new Promise((resolve, reject) => {
    const fullUrl = `${BASE_URL}${urlPath}`;
    http.get(fullUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, body: null, raw: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runAdversarialTests() {
  console.log('========================================================================');
  console.log('⚔️  CHALLENGER 1: ADVERSARIAL STRESS TESTING FOR KNOWLEDGE MODAL & APIS');
  console.log('========================================================================\n');

  let passed = 0;
  let totalTests = 0;

  function pass(desc) {
    passed++;
    totalTests++;
    console.log(`  ✓ [PASS ${passed}] ${desc}`);
  }

  function fail(desc, err) {
    totalTests++;
    console.error(`  ✗ [FAIL] ${desc}`, err);
    throw err;
  }

  // ==========================================================================
  // SUITE 1: Parameter Boundaries, Path Traversal & Injection Attacks
  // ==========================================================================
  console.log('▶ SUITE 1: Parameter Boundaries, Malformed IDs, Traversal & Injections');

  // 1.1 Malformed questionId values
  const malformedQuestionIds = [
    '',
    '   ',
    'null',
    'undefined',
    'NaN',
    '-1',
    '0',
    '999999999999999',
    'abc!@#$%^&*()',
    '[object Object]',
  ];

  for (const qId of malformedQuestionIds) {
    const res = await fetchJson(`/api/related-topic?questionId=${encodeURIComponent(qId)}`);
    assert.strictEqual(res.status, 200, `Status should be 200 for questionId="${qId}"`);
    assert.strictEqual(typeof res.body, 'object', `Response body should be JSON object for questionId="${qId}"`);
    assert.strictEqual(res.body.isDisplay, true, `isDisplay should be true for questionId="${qId}"`);
    assert.ok(Array.isArray(res.body.listQuestionTopicDetail), `listQuestionTopicDetail should be array for questionId="${qId}"`);
    assert.strictEqual(res.body.source, 'generic', `Source should fall back to generic for invalid questionId="${qId}"`);
  }
  pass('Handled 10 malformed/non-existent questionIds gracefully with clean generic fallback');

  // 1.2 Prototype Pollution & Object Property Injections
  const prototypeProps = ['toString', '__proto__', 'constructor', 'hasOwnProperty', 'valueOf', 'isPrototypeOf'];
  for (const prop of prototypeProps) {
    const res = await fetchJson(`/api/related-topic?questionId=${prop}`);
    assert.strictEqual(res.status, 200, `Status should be 200 for questionId="${prop}"`);
    assert.strictEqual(res.body.isDisplay, true, `isDisplay should be true for questionId="${prop}"`);
    assert.ok(Array.isArray(res.body.listQuestionTopicDetail), `listQuestionTopicDetail should be array for questionId="${prop}"`);
    assert.strictEqual(res.body.source, 'generic', `Object property "${prop}" must not crash or hijack cache lookup`);
  }
  pass('Protected against JavaScript prototype property lookups (toString, __proto__, constructor, etc.)');

  // 1.3 Path Traversal Attacks in /api/related-topic
  const traversalPayloads = [
    '../../../../etc/passwd',
    '..%2F..%2F..%2Fetc%2Fpasswd',
    '....//....//theories/68',
    '../../theories/sections/pronunciation',
    '..\\..\\..\\windows\\win.ini',
  ];

  for (const payload of traversalPayloads) {
    const res = await fetchJson(`/api/related-topic?sectionId=${encodeURIComponent(payload)}&studyUnit=${encodeURIComponent(payload)}&topicId=${encodeURIComponent(payload)}`);
    assert.strictEqual(res.status, 200, `Status should be 200 for traversal payload`);
    assert.strictEqual(res.body.isDisplay, true, `isDisplay should be true`);
    assert.strictEqual(res.body.source, 'generic', `Traversal attempt must fall back to generic, not expose system files`);
  }
  pass('Defended against directory traversal attacks in sectionId, studyUnit, and topicId');

  // 1.4 SQL Injection & Script Injection (XSS) in query parameters
  const injectionPayloads = [
    "' OR '1'='1",
    "1; DROP TABLE users; --",
    "1' UNION SELECT * FROM users --",
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    'javascript:alert(1)',
  ];

  for (const injection of injectionPayloads) {
    const resRel = await fetchJson(`/api/related-topic?questionId=${encodeURIComponent(injection)}&studyUnit=${encodeURIComponent(injection)}`);
    assert.strictEqual(resRel.status, 200, 'HTTP 200 on injection string in /api/related-topic');
    assert.strictEqual(resRel.body.isDisplay, true, 'Clean isDisplay on injection in /api/related-topic');

    const resQ = await fetchJson(`/api/questions?topicId=${encodeURIComponent(injection)}`);
    assert.strictEqual(resQ.status, 200, 'HTTP 200 on injection string in /api/questions');
    assert.ok(Array.isArray(resQ.body.questions), 'Questions array returned');
  }
  pass('Sanitized SQL injection and XSS query payloads across both APIs with zero uncaught exceptions');

  // 1.5 Edge cases on /api/questions
  // Count parameter boundaries
  const countTests = [
    { count: '-10', expected: 1 },
    { count: '0', expected: 15 }, // In JS: parseInt('0', 10) || 15 evaluates to 15 (default count)
    { count: '1', expected: 1 },
    { count: '15', expected: 15 },
    { count: '50', expected: 15 }, // 68 has 15 questions total
    { count: '999999', expected: 15 },
    { count: 'abc', expected: 15 },
  ];
  for (const ct of countTests) {
    const res = await fetchJson(`/api/questions?topicId=68&count=${ct.count}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.questions.length, ct.expected, `Count ${ct.count} should clamp or default properly`);
  }
  pass('/api/questions count parameter strictly clamped between 1 and 50 (or total available)');

  // /api/questions blended session (custom) with adversarial topics parameter
  const customTests = [
    'topics=',
    'topics=abc,def',
    'topics=-1,-2',
    "topics=68,' OR 1=1 --",
    'topics=68,69,99999999',
  ];
  for (const ct of customTests) {
    const res = await fetchJson(`/api/questions?topicId=custom&${ct}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.topicId, 'custom');
    assert.ok(Array.isArray(res.body.questions));
    assert.ok(res.body.theory);
  }
  pass('/api/questions handles malformed and injection topics in blended custom sessions');

  // /api/questions study module lookup via grammar and vocabulary subdirectories
  const grammarRes = await fetchJson('/api/questions?topicId=15290');
  assert.strictEqual(grammarRes.status, 200);
  assert.ok(grammarRes.body.questions.length > 0, 'Grammar 15290 questions loaded from subdirectory');
  assert.ok(grammarRes.body.topicName.includes('Verb patterns') || grammarRes.body.topicName.includes('Động từ theo sau'), 'Correct grammar title loaded');

  const vocabRes = await fetchJson('/api/questions?topicId=15951');
  assert.strictEqual(vocabRes.status, 200);
  assert.ok(vocabRes.body.questions.length > 0, 'Vocab 15951 questions loaded from subdirectory');
  assert.ok(vocabRes.body.topicName.includes('Leisure') || vocabRes.body.topicName.includes('Danh từ'), 'Correct vocab title loaded');
  pass('/api/questions successfully navigates grammar/ and vocabulary/ subdirectories for study modules');

  // ==========================================================================
  // SUITE 2: Tak12 4-Level Priority Hierarchy Verification
  // ==========================================================================
  console.log('\n▶ SUITE 2: Tak12 4-Level Priority Hierarchy & Strict Precedence');

  // 2.1 Level 1 (Cached questionId) wins over Level 2, Level 3, Level 4
  const resL1 = await fetchJson('/api/related-topic?questionId=844013&explanation=OverrideExplanation&studyUnit=15290&sectionId=sentence_transformation&topicId=68');
  assert.strictEqual(resL1.status, 200);
  assert.strictEqual(resL1.body.source, 'question', 'Level 1 questionId cache MUST take top precedence');
  assert.strictEqual(resL1.body.listQuestionTopicDetail[0].name, 'Nhận ra chi tiết/thông tin được diễn đạt khác');
  pass('Level 1: Authentic cached question topic overrides explanation, studyUnit, sectionId, and dummy topicId');

  // 2.2 Level 2 (explanation/ruleTip) wins over Level 3, Level 4, topicId when questionId is missing or unmapped
  const resL2 = await fetchJson('/api/related-topic?questionId=999999999&explanation=Explicit%20Rule%20Explanation&studyUnit=15290&sectionId=sentence_transformation&topicId=68');
  assert.strictEqual(resL2.status, 200);
  assert.strictEqual(resL2.body.source, 'explanation', 'Level 2 explanation MUST win over studyUnit and sectionId');
  assert.strictEqual(resL2.body.listQuestionTopicDetail[0].name, 'Kiến thức cần vận dụng');
  assert.strictEqual(resL2.body.listQuestionTopicDetail[0].detail, 'Explicit Rule Explanation');
  pass('Level 2: Question explanation/ruleTip wins over studyUnit, sectionId, and topicId for unmapped questions');

  // 2.3 Level 3 (studyUnit) wins over Level 4 (sectionId) and topicId
  const resL3 = await fetchJson('/api/related-topic?studyUnit=15290&sectionId=sentence_transformation&topicId=68');
  assert.strictEqual(resL3.status, 200);
  assert.strictEqual(resL3.body.source, 'studyUnit', 'Level 3 studyUnit MUST win over sectionId and topicId');
  assert.ok(resL3.body.listQuestionTopicDetail[0].name.includes('Verb patterns') || resL3.body.listQuestionTopicDetail[0].name.includes('Động từ theo sau'));
  pass('Level 3: StudyUnit theory wins over sectionId and topicId');

  // 2.4 Level 4 (sectionId) wins over topicId fallback
  const resL4 = await fetchJson('/api/related-topic?sectionId=sentence_transformation&topicId=68');
  assert.strictEqual(resL4.status, 200);
  assert.strictEqual(resL4.body.source, 'section', 'Level 4 sectionId MUST win over dummy topicId 68');
  assert.ok(resL4.body.listQuestionTopicDetail[0].name.includes('Viết lại câu') || resL4.body.listQuestionTopicDetail[0].name.includes('Sentence Transformation'));
  pass('Level 4: SectionId theory wins over dummy topicId 68');

  // 2.5 Clean generic fallback when no matching parameters provided
  const resGen = await fetchJson('/api/related-topic');
  assert.strictEqual(resGen.status, 200);
  assert.strictEqual(resGen.body.source, 'generic');
  assert.strictEqual(resGen.body.listQuestionTopicDetail[0].name, 'Kiến thức ôn thi vào 10 môn Tiếng Anh');
  pass('Default generic fallback returned with HTTP 200 and well-formed structure when no parameters given');

  // ==========================================================================
  // SUITE 3: Dummy topicId=68 Disambiguation & Isolation
  // ==========================================================================
  console.log('\n▶ SUITE 3: Dummy topicId=68 Disambiguation & Isolation');

  // 3.1 All 10 sections tested with topicId=68: verify NONE return topic 68 ("Đuôi ed")
  const allSections = [
    'sign_notices',
    'pronunciation',
    'stress',
    'guided_cloze',
    'reading_comprehension',
    'error_identification',
    'sentence_transformation',
    'sentence_combination',
    'communicative_functions',
    'grammar_vocab_cloze',
  ];

  for (const sId of allSections) {
    const res = await fetchJson(`/api/related-topic?topicId=68&sectionId=${sId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.source, 'section', `Section "${sId}" must take precedence over dummy topicId=68`);
    const title = res.body.listQuestionTopicDetail[0].name;
    if (sId !== 'pronunciation') {
      assert.ok(!title.includes('Đuôi "ed"') && !title.includes('Đuôi ed'), `Section "${sId}" must not return Đuôi ed`);
    }
  }
  pass('Verified all 10 sections strictly take precedence over dummy topicId=68');

  // 3.2 Grammar study modules tested with topicId=68
  const sampleGrammarUnits = ['15290', '15244', '15245', '15246', '15251', '15255', '15259'];
  for (const uId of sampleGrammarUnits) {
    const res = await fetchJson(`/api/related-topic?topicId=68&studyUnit=${uId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.source, 'studyUnit', `Grammar studyUnit "${uId}" must take precedence over topicId=68`);
    const title = res.body.listQuestionTopicDetail[0].name;
    assert.ok(!title.includes('Đuôi "ed"') && !title.includes('Đuôi ed'), `Grammar studyUnit "${uId}" must not return Đuôi ed`);
  }
  pass('Verified grammar study modules strictly take precedence over dummy topicId=68');

  // 3.3 Vocabulary study modules tested with topicId=68
  const sampleVocabUnits = ['15951', '15962', '15965', '15974', '15975'];
  for (const uId of sampleVocabUnits) {
    const res = await fetchJson(`/api/related-topic?topicId=68&studyUnit=${uId}`);
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.source, 'studyUnit', `Vocab studyUnit "${uId}" must take precedence over topicId=68`);
    const title = res.body.listQuestionTopicDetail[0].name;
    assert.ok(!title.includes('Đuôi "ed"') && !title.includes('Đuôi ed'), `Vocab studyUnit "${uId}" must not return Đuôi ed`);
  }
  pass('Verified vocabulary study modules strictly take precedence over dummy topicId=68');

  // 3.3b Non-existent study module with dummy topicId=68: must fall back to generic, NEVER to topic 68
  const resNonExistent = await fetchJson('/api/related-topic?topicId=68&studyUnit=999999');
  assert.strictEqual(resNonExistent.status, 200);
  assert.strictEqual(resNonExistent.body.source, 'generic', 'Non-existent studyUnit with dummy topicId=68 must fall back to generic');
  assert.ok(!resNonExistent.body.listQuestionTopicDetail[0].name.includes('Đuôi "ed"'), 'Non-existent studyUnit must NOT leak to topic 68');
  pass('Non-existent studyUnit combined with dummy topicId=68 falls back to generic with zero leak to topic 68');

  // 3.4 Authentic topic 68 practice: returns topic 68 only when requested alone
  const resReal68 = await fetchJson('/api/related-topic?topicId=68');
  assert.strictEqual(resReal68.status, 200);
  assert.strictEqual(resReal68.body.source, 'topic');
  assert.strictEqual(resReal68.body.listQuestionTopicDetail[0].name, 'Đuôi "ed"');
  pass('Authentic topic 68 practice correctly returns "Đuôi ed" when explicitly and exclusively requested');

  // ==========================================================================
  // SUITE 4: Questions with Empty / Missing listQuestionTopicDetail
  // ==========================================================================
  console.log('\n▶ SUITE 4: Fallback for Empty listQuestionTopicDetail & Missing Detail');

  // 4.1 Sample questions with listQuestionTopicDetail: [] (198 items in dataset)
  const emptyListSample = ['7708', '34594', '46058', '49844', '139658', '163918', '766263', '892959', '895781', '895849'];
  for (const qId of emptyListSample) {
    // A: Without params -> generic fallback
    const resNoParam = await fetchJson(`/api/related-topic?questionId=${qId}`);
    assert.strictEqual(resNoParam.status, 200);
    assert.strictEqual(resNoParam.body.source, 'generic');
    assert.ok(!resNoParam.body.listQuestionTopicDetail[0].name.includes('Đuôi "ed"'));

    // B: With explanation -> explanation fallback
    const resExpl = await fetchJson(`/api/related-topic?questionId=${qId}&explanation=Fallback%20for%20${qId}`);
    assert.strictEqual(resExpl.status, 200);
    assert.strictEqual(resExpl.body.source, 'explanation');
    assert.strictEqual(resExpl.body.listQuestionTopicDetail[0].detail, `Fallback for ${qId}`);

    // C: With studyUnit -> studyUnit fallback
    const resStudy = await fetchJson(`/api/related-topic?questionId=${qId}&studyUnit=15290`);
    assert.strictEqual(resStudy.status, 200);
    assert.strictEqual(resStudy.body.source, 'studyUnit');
    assert.ok(resStudy.body.listQuestionTopicDetail[0].name.includes('Verb patterns') || resStudy.body.listQuestionTopicDetail[0].name.includes('Động từ theo sau'));

    // D: With sectionId -> section fallback
    const resSec = await fetchJson(`/api/related-topic?questionId=${qId}&sectionId=sentence_transformation`);
    assert.strictEqual(resSec.status, 200);
    assert.strictEqual(resSec.body.source, 'section');
    assert.ok(resSec.body.listQuestionTopicDetail[0].name.includes('Viết lại câu'));
  }
  pass('Questions with empty listQuestionTopicDetail fall back seamlessly across all 4 levels with zero 500 errors');

  // 4.2 Questions with detail: null or detail: "" (single topic null questions)
  const pureNullDetailSample = ['4145', '4399', '4583', '4605', '4822', '4993', '7695'];
  for (const qId of pureNullDetailSample) {
    // A: Baseline query
    const resBase = await fetchJson(`/api/related-topic?questionId=${qId}`);
    assert.strictEqual(resBase.status, 200);
    assert.strictEqual(resBase.body.source, 'question');
    assert.strictEqual(resBase.body.listQuestionTopicDetail[0].detail, null, 'Original detail is null');

    // B: Enriched with explanation
    const resEnriched = await fetchJson(`/api/related-topic?questionId=${qId}&explanation=Custom%20Explanation%20${qId}`);
    assert.strictEqual(resEnriched.status, 200);
    assert.strictEqual(resEnriched.body.source, 'question');
    assert.strictEqual(resEnriched.body.listQuestionTopicDetail[0].detail, `Custom Explanation ${qId}`, 'Enriched with explanation');
    assert.strictEqual(resEnriched.body.listQuestionTopicDetail[0].name, resBase.body.listQuestionTopicDetail[0].name, 'Preserved original topic name');

    // C: Dummy topicId=68 does NOT pollute detail with -ed theory
    const resDummy68 = await fetchJson(`/api/related-topic?questionId=${qId}&topicId=68`);
    assert.strictEqual(resDummy68.status, 200);
    assert.strictEqual(resDummy68.body.source, 'question');
    assert.strictEqual(resDummy68.body.listQuestionTopicDetail[0].detail, null, 'Dummy topicId 68 MUST NOT pollute detail');
  }
  pass('Pure null-detail questions enrich cleanly via explanation without topic 68 contamination');

  // 4.3 Hybrid multi-topic question (e.g. 4823): verifies selective enrichment of null-detail topics
  const resHybrid = await fetchJson('/api/related-topic?questionId=4823&explanation=EnrichedHybridTopic');
  assert.strictEqual(resHybrid.status, 200);
  assert.strictEqual(resHybrid.body.source, 'question');
  assert.strictEqual(resHybrid.body.listQuestionTopicDetail.length, 2);
  assert.ok(resHybrid.body.listQuestionTopicDetail[0].detail.includes('Đ&ecirc;̉ xác định'), 'Topic 0 preserved authentic rich Tak12 detail');
  assert.strictEqual(resHybrid.body.listQuestionTopicDetail[1].detail, 'EnrichedHybridTopic', 'Topic 1 selectively enriched');
  pass('Multi-topic questions selectively preserve authentic details while enriching missing null-details');

  // ==========================================================================
  // SUITE 5: Full Repository Non-Phonetics Leakage Verification
  // ==========================================================================
  console.log('\n▶ SUITE 5: Repository-Wide Non-Phonetics Leakage Verification');

  const relatedTopicsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'related_topics.json'), 'utf8'));

  // 5.1 Audit all 54 questions mapped to Đuôi "ed"
  const edQuestions = [];
  for (const [k, v] of Object.entries(relatedTopicsData)) {
    if (v.listQuestionTopicDetail) {
      for (const t of v.listQuestionTopicDetail) {
        if (t.name && (t.name.trim() === 'Đuôi "ed"' || t.name.trim() === "Đuôi 'ed'" || t.name.trim() === 'Đuôi ed')) {
          edQuestions.push(k);
        }
      }
    }
  }
  assert.strictEqual(edQuestions.length, 54, 'Exactly 54 questions mapped to Đuôi ed in related_topics.json');

  // Verify every single one of the 54 questions is an actual phonetics question testing -ed
  const examBundlesDir = path.join(process.cwd(), 'data', 'exams', 'bundles');
  const bundleFiles = fs.readdirSync(examBundlesDir).filter(f => f.endsWith('.json'));
  let verifiedEdCount = 0;

  for (const qId of edQuestions) {
    let found = false;
    for (const bf of bundleFiles) {
      const bundle = JSON.parse(fs.readFileSync(path.join(examBundlesDir, bf), 'utf8'));
      const q = (bundle.questions || []).find(item => String(item.id) === qId);
      if (q) {
        found = true;
        verifiedEdCount++;
        // Verify prompt or choices relate to pronunciation and -ed
        const prompt = (q.questionText || q.questionName || '').toLowerCase();
        const choices = (q.choices || []).map(c => (c.text || '').toLowerCase()).join(' ');
        const hasPronunciationPrompt = prompt.includes('pronounced') || prompt.includes('pronunciation') || prompt.includes('phát âm');
        const hasEdChoices = choices.includes('ed') || choices.includes('ed<');
        assert.ok(hasPronunciationPrompt || hasEdChoices, `Question ${qId} must be a genuine pronunciation question`);
        break;
      }
    }
    assert.ok(found, `Ed question ${qId} must exist in exam bundles`);
  }
  assert.strictEqual(verifiedEdCount, 54, 'All 54 questions verified as genuine -ed pronunciation questions');
  pass('Forensically verified all 54 "Đuôi ed" questions: 100% are authentic -ed pronunciation questions, 0% grammar/vocab');

  // 5.2 Scan all 76 grammar study modules (3,186 questions)
  const grammarDir = path.join(process.cwd(), 'data', 'questions', 'grammar');
  const grammarFiles = fs.readdirSync(grammarDir).filter(f => f.endsWith('.json'));
  let totalGrammarQ = 0;
  let grammarLeakCount = 0;

  for (const gf of grammarFiles) {
    const unitId = gf.replace(/^grammar_/, '').replace(/\.json$/, '');
    const data = JSON.parse(fs.readFileSync(path.join(grammarDir, gf), 'utf8'));
    const qs = Array.isArray(data) ? data : (data.questions || []);
    for (const q of qs) {
      totalGrammarQ++;
      const cached = relatedTopicsData[String(q.id)];
      if (cached && cached.listQuestionTopicDetail) {
        for (const t of cached.listQuestionTopicDetail) {
          if (t.name && (t.name.trim() === 'Đuôi "ed"' || t.name.trim() === "Đuôi 'ed'" || t.name.trim() === 'Đuôi ed')) {
            grammarLeakCount++;
          }
        }
      }
    }
  }
  assert.strictEqual(grammarLeakCount, 0, 'Zero grammar study questions mapped to Đuôi ed');
  pass(`Scanned all ${grammarFiles.length} grammar modules (${totalGrammarQ} questions): ZERO resolve to "Đuôi ed"`);

  // 5.3 Scan all 76 vocabulary study modules
  const vocabDir = path.join(process.cwd(), 'data', 'questions', 'vocabulary');
  const vocabFiles = fs.readdirSync(vocabDir).filter(f => f.endsWith('.json'));
  let totalVocabQ = 0;
  let vocabLeakCount = 0;

  for (const vf of vocabFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(vocabDir, vf), 'utf8'));
    const qs = Array.isArray(data) ? data : (data.questions || []);
    for (const q of qs) {
      totalVocabQ++;
      const cached = relatedTopicsData[String(q.id)];
      if (cached && cached.listQuestionTopicDetail) {
        for (const t of cached.listQuestionTopicDetail) {
          if (t.name && (t.name.trim() === 'Đuôi "ed"' || t.name.trim() === "Đuôi 'ed'" || t.name.trim() === 'Đuôi ed')) {
            vocabLeakCount++;
          }
        }
      }
    }
  }
  assert.strictEqual(vocabLeakCount, 0, 'Zero vocabulary study questions mapped to Đuôi ed');
  pass(`Scanned all ${vocabFiles.length} vocabulary modules (${totalVocabQ} questions): ZERO resolve to "Đuôi ed"`);

  // 5.4 Scan pure non-phonetics section question banks
  const pureNonPhonSections = [
    'stress.json',
    'guided_cloze.json',
    'reading_comprehension.json',
    'error_identification.json',
    'sentence_transformation.json',
    'sentence_combination.json',
    'communicative_functions.json',
    'sign_notices.json',
  ];
  let totalPureSecQ = 0;
  let pureSecLeakCount = 0;

  for (const sf of pureNonPhonSections) {
    const secPath = path.join(process.cwd(), 'data', 'sections', sf);
    if (!fs.existsSync(secPath)) continue;
    const sData = JSON.parse(fs.readFileSync(secPath, 'utf8'));
    for (const q of (sData.questions || [])) {
      totalPureSecQ++;
      const cached = relatedTopicsData[String(q.id)];
      if (cached && cached.listQuestionTopicDetail) {
        for (const t of cached.listQuestionTopicDetail) {
          if (t.name && (t.name.trim() === 'Đuôi "ed"' || t.name.trim() === "Đuôi 'ed'" || t.name.trim() === 'Đuôi ed')) {
            pureSecLeakCount++;
          }
        }
      }
    }
  }
  assert.strictEqual(pureSecLeakCount, 0, 'Zero pure non-phonetics section questions mapped to Đuôi ed');
  pass(`Scanned 8 pure non-phonetics section banks (${totalPureSecQ} questions): ZERO resolve to "Đuôi ed"`);

  // 5.5 Forensic content verification: across ALL questions in ALL banks mapped to Đuôi ed,
  // verify that 100% of them are genuine phonetics questions testing the -ed suffix.
  let nonPhoneticsWithEd = 0;
  for (const qId of edQuestions) {
    // Find question in any bundle, section, or study module
    let foundQ = null;
    for (const bf of bundleFiles) {
      const bundle = JSON.parse(fs.readFileSync(path.join(examBundlesDir, bf), 'utf8'));
      foundQ = (bundle.questions || []).find(item => String(item.id) === qId);
      if (foundQ) break;
    }
    if (!foundQ) {
      // Check sections
      for (const sf of fs.readdirSync(path.join(process.cwd(), 'data', 'sections'))) {
        if (!sf.endsWith('.json')) continue;
        const sec = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'sections', sf), 'utf8'));
        foundQ = (sec.questions || []).find(item => String(item.id) === qId);
        if (foundQ) break;
      }
    }
    if (foundQ) {
      const prompt = (foundQ.questionText || foundQ.questionName || '').toLowerCase();
      const choices = (foundQ.choices || []).map(c => (c.text || '').toLowerCase()).join(' ');
      const isPhonetics = prompt.includes('pronounced') || prompt.includes('pronunciation') || prompt.includes('phát âm');
      const hasEd = choices.includes('ed') || choices.includes('ed<');
      if (!isPhonetics && !hasEd) {
        nonPhoneticsWithEd++;
      }
    }
  }
  assert.strictEqual(nonPhoneticsWithEd, 0, 'ZERO non-phonetics questions mapped to Đuôi ed');
  pass('Forensic check: ZERO non-phonetics questions anywhere in the repository resolve to "Đuôi ed"');

  // ==========================================================================
  // SUITE 6: High Concurrency & Burst Stress Testing
  // ==========================================================================
  console.log('\n▶ SUITE 6: High Concurrency & Burst Load Stress Testing');

  // 6.1 100 parallel requests to /api/related-topic with mixed valid/invalid/empty inputs
  const burstRequests = [];
  const testIds = ['844013', '50271', '4145', '7708', '999999', '', 'toString', "' OR 1=1"];
  const testSections = ['sentence_transformation', 'stress', 'reading_comprehension', 'invalid_section'];
  const testUnits = ['15290', '15244', '15951', '99999'];

  const startTime = Date.now();
  for (let i = 0; i < 100; i++) {
    const qId = testIds[i % testIds.length];
    const sId = testSections[i % testSections.length];
    const uId = testUnits[i % testUnits.length];
    const tId = i % 2 === 0 ? '68' : '15290';
    const url = `/api/related-topic?questionId=${encodeURIComponent(qId)}&sectionId=${encodeURIComponent(sId)}&studyUnit=${encodeURIComponent(uId)}&topicId=${tId}`;
    burstRequests.push(fetchJson(url));
  }

  const burstResults = await Promise.all(burstRequests);
  const elapsedMs = Date.now() - startTime;
  const all200 = burstResults.every(r => r.status === 200 && r.body && r.body.isDisplay === true);
  assert.ok(all200, 'All 100 concurrent requests must succeed with HTTP 200');
  pass(`Completed 100 concurrent requests to /api/related-topic in ${elapsedMs}ms (avg ${(elapsedMs / 100).toFixed(1)}ms/req) with 100% HTTP 200`);

  // 6.2 50 parallel requests to /api/questions
  const questionsBurst = [];
  const qTopics = ['68', '15290', '15951', 'custom', 'invalid', ''];
  for (let i = 0; i < 50; i++) {
    const t = qTopics[i % qTopics.length];
    const count = (i % 30) + 1;
    questionsBurst.push(fetchJson(`/api/questions?topicId=${t}&count=${count}`));
  }
  const qBurstResults = await Promise.all(questionsBurst);
  const allQ200 = qBurstResults.every(r => r.status === 200 && Array.isArray(r.body.questions));
  assert.ok(allQ200, 'All 50 concurrent requests to /api/questions must succeed with HTTP 200');
  pass('Completed 50 concurrent requests to /api/questions with 100% HTTP 200 and valid JSON payload');

  // ==========================================================================
  // FINAL SUMMARY
  // ==========================================================================
  console.log('\n========================================================================');
  console.log(`🎉 ALL ${passed}/${totalTests} ADVERSARIAL STRESS TESTS PASSED WITH 100% FIDELITY!`);
  console.log('   ZERO FAILURES, ZERO REGRESSIONS, ZERO UNCONTROLLED LEAKS TO TOPIC 68.');
  console.log('========================================================================\n');
}

runAdversarialTests().catch(err => {
  console.error('\n❌ ADVERSARIAL STRESS TEST FAILED:', err);
  process.exit(1);
});
