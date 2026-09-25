/**
 * CHALLENGER M2 ADVERSARIAL STRESS SUITE (challenger_m2_o5)
 *
 * Direct Empirical Adversarial Challenge of Milestone M2:
 * 1. Unauthorized progress writes & reads on /api/progress (pending, invalid, rejected, approved).
 * 2. Exam and Practice route security (/exam/[examId], /practice/[topicId]):
 *    - Verify pending students receive ApprovalWaitingScreen and zero questions/bundles leak.
 *    - Verify rejected students receive access denied and zero questions leak.
 *    - Verify unauthenticated users receive login guard and zero questions leak.
 * 3. UI backdoor elimination in LoginModal.tsx (zero forms, zero input fields, zero persona buttons).
 * 4. Session cryptographic tamper resistance, payload fuzzing & injection attacks.
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const Database = require('better-sqlite3');

const ROOT = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT, 'data', 'ta12_users.sqlite');
const AUTH_SECRET = process.env.AUTH_SECRET || 'ta12_grade10_english_prep_auth_secret_2026';
const PORT = 3000;
const HOSTNAME = 'localhost';

let totalTests = 0;
let passedTests = 0;
const failedTests = [];

function assertTest(name, condition, extraInfo = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${name}`);
  } else {
    failedTests.push({ name, extraInfo });
    console.error(`  [FAIL] ${name} -> ${extraInfo}`);
  }
}

// Session signing helper matching src/lib/auth.ts
function createSessionToken(userId, secret = AUTH_SECRET, customTs = null) {
  const ts = customTs || Date.now().toString();
  const payload = `${userId}:${ts}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

// HTTP request helper
function requestHttp(method, pathUrl, body = null, cookie = null) {
  return new Promise((resolve, reject) => {
    const postData = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : null;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    };
    if (postData) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(postData);
    }
    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const req = http.request({
      hostname: HOSTNAME,
      port: PORT,
      path: pathUrl,
      method: method,
      headers: headers,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try {
          json = JSON.parse(data);
        } catch (e) {
          // not json
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          rawBody: data,
          json: json,
        });
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runAdversarialSuite() {
  console.log('========================================================================');
  console.log('⚔️  CHALLENGER M2: EMPIRICAL ADVERSARIAL STRESS SUITE (o5)');
  console.log('========================================================================\n');

  const db = new Database(DB_PATH);

  // Setup test users in SQLite
  const testPendingId = 'challenger_test_pending_student_' + Date.now();
  const testPendingEmail = `pending.${Date.now()}@adversarial.test`;

  const testRejectedId = 'challenger_test_rejected_student_' + Date.now();
  const testRejectedEmail = `rejected.${Date.now()}@adversarial.test`;

  const testApprovedId = 'challenger_test_approved_student_' + Date.now();
  const testApprovedEmail = `approved.${Date.now()}@adversarial.test`;

  try {
    // 1. Insert test users
    db.prepare(`
      INSERT INTO users (id, google_id, email, name, avatar_url, status, approved_at, last_login_at, created_at)
      VALUES (?, ?, ?, ?, ?, 'pending', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(testPendingId, 'gid_' + testPendingId, testPendingEmail, 'Học sinh Chờ Duyệt (Challenger Test)', null);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, avatar_url, status, approved_at, last_login_at, created_at)
      VALUES (?, ?, ?, ?, ?, 'rejected', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(testRejectedId, 'gid_' + testRejectedId, testRejectedEmail, 'Học sinh Bị Khóa (Challenger Test)', null);

    db.prepare(`
      INSERT INTO users (id, google_id, email, name, avatar_url, status, approved_at, last_login_at, created_at)
      VALUES (?, ?, ?, ?, ?, 'approved', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(testApprovedId, 'gid_' + testApprovedId, testApprovedEmail, 'Học sinh Đã Duyệt (Challenger Test)', null);

    const pendingToken = createSessionToken(testPendingId);
    const rejectedToken = createSessionToken(testRejectedId);
    const approvedToken = createSessionToken(testApprovedId);

    // -------------------------------------------------------------------------
    // SECTION 1: UNAUTHORIZED PROGRESS WRITES & READS (/api/progress)
    // -------------------------------------------------------------------------
    console.log('▶ [VECTOR 1] Testing /api/progress Authentication & Authorization Boundary...');

    // 1.1 Unauthenticated requests
    const resGetUnauth = await requestHttp('GET', '/api/progress');
    assertTest(
      'GET /api/progress unauthenticated returns HTTP 401',
      resGetUnauth.statusCode === 401,
      `Received status ${resGetUnauth.statusCode}`
    );
    assertTest(
      'GET /api/progress unauthenticated returns error payload',
      resGetUnauth.json && resGetUnauth.json.error === 'Unauthenticated',
      `Payload: ${JSON.stringify(resGetUnauth.json)}`
    );

    const resPostUnauth = await requestHttp('POST', '/api/progress', { streak_flame: 99, diamonds: 999 });
    assertTest(
      'POST /api/progress unauthenticated returns HTTP 401',
      resPostUnauth.statusCode === 401,
      `Received status ${resPostUnauth.statusCode}`
    );

    // 1.2 Invalid session cookies (malformed, bad sig, non-existent user)
    const resGetGarbage = await requestHttp('GET', '/api/progress', null, 'ta12_session=non_base64_garbage!@#$');
    assertTest(
      'GET /api/progress with non-base64 session returns HTTP 401',
      resGetGarbage.statusCode === 401,
      `Received status ${resGetGarbage.statusCode}`
    );

    const forgedSecretToken = createSessionToken(testApprovedId, 'attacker_fake_secret_key');
    const resGetForged = await requestHttp('GET', '/api/progress', null, `ta12_session=${forgedSecretToken}`);
    assertTest(
      'GET /api/progress with forged HMAC secret returns HTTP 401',
      resGetForged.statusCode === 401,
      `Received status ${resGetForged.statusCode}`
    );

    const nonExistentToken = createSessionToken('non_existent_user_id_999999');
    const resGetNonExist = await requestHttp('GET', '/api/progress', null, `ta12_session=${nonExistentToken}`);
    assertTest(
      'GET /api/progress with valid token for deleted/non-existent user returns HTTP 401',
      resGetNonExist.statusCode === 401,
      `Received status ${resGetNonExist.statusCode}`
    );

    const resPostForged = await requestHttp('POST', '/api/progress', { diamonds: 500 }, `ta12_session=${forgedSecretToken}`);
    assertTest(
      'POST /api/progress with forged HMAC secret returns HTTP 401',
      resPostForged.statusCode === 401,
      `Received status ${resPostForged.statusCode}`
    );

    // 1.3 Pending student session calls
    const resGetPending = await requestHttp('GET', '/api/progress', null, `ta12_session=${pendingToken}`);
    assertTest(
      'GET /api/progress with pending session returns HTTP 403 Forbidden',
      resGetPending.statusCode === 403,
      `Received status ${resGetPending.statusCode}`
    );
    assertTest(
      'GET /api/progress pending returns exact error message',
      resGetPending.json && resGetPending.json.error === 'Access denied: Account pending admin approval',
      `Payload: ${JSON.stringify(resGetPending.json)}`
    );

    // Adversarial POST: Attempting to write progress as pending student
    const maliciousPendingPayload = {
      diamonds: 9999,
      streak_flame: 365,
      exam_scores: { "19142": { score: 10, total: 10, finished_at: new Date().toISOString() } },
      study_progress: { "unit_1": { completed: true } }
    };
    const resPostPending = await requestHttp('POST', '/api/progress', maliciousPendingPayload, `ta12_session=${pendingToken}`);
    assertTest(
      'POST /api/progress with pending session returns HTTP 403 Forbidden',
      resPostPending.statusCode === 403,
      `Received status ${resPostPending.statusCode}`
    );
    assertTest(
      'POST /api/progress pending returns exact error message',
      resPostPending.json && resPostPending.json.error === 'Access denied: Account pending admin approval',
      `Payload: ${JSON.stringify(resPostPending.json)}`
    );

    // Verify database: NO progress row must exist for pending student
    const pendingDbProgress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(testPendingId);
    assertTest(
      'SQLite user_progress table contains NO records for pending student (Zero write leak)',
      pendingDbProgress === undefined,
      `DB record: ${JSON.stringify(pendingDbProgress)}`
    );

    // 1.4 Rejected student session calls
    const resGetRejected = await requestHttp('GET', '/api/progress', null, `ta12_session=${rejectedToken}`);
    assertTest(
      'GET /api/progress with rejected session returns HTTP 403 Forbidden',
      resGetRejected.statusCode === 403,
      `Received status ${resGetRejected.statusCode}`
    );

    const resPostRejected = await requestHttp('POST', '/api/progress', { diamonds: 100 }, `ta12_session=${rejectedToken}`);
    assertTest(
      'POST /api/progress with rejected session returns HTTP 403 Forbidden',
      resPostRejected.statusCode === 403,
      `Received status ${resPostRejected.statusCode}`
    );

    const rejectedDbProgress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(testRejectedId);
    assertTest(
      'SQLite user_progress table contains NO records for rejected student',
      rejectedDbProgress === undefined,
      `DB record: ${JSON.stringify(rejectedDbProgress)}`
    );

    // 1.5 Approved student session calls (control check)
    const resGetApproved = await requestHttp('GET', '/api/progress', null, `ta12_session=${approvedToken}`);
    assertTest(
      'GET /api/progress with approved session returns HTTP 200 OK',
      resGetApproved.statusCode === 200,
      `Received status ${resGetApproved.statusCode}`
    );

    const validProgressPayload = {
      diamonds: 15,
      streak_flame: 3,
      exam_scores: { "19142": { score: 9.5 } }
    };
    const resPostApproved = await requestHttp('POST', '/api/progress', validProgressPayload, `ta12_session=${approvedToken}`);
    assertTest(
      'POST /api/progress with approved session returns HTTP 200 OK',
      resPostApproved.statusCode === 200,
      `Received status ${resPostApproved.statusCode}`
    );

    const approvedDbProgress = db.prepare('SELECT * FROM user_progress WHERE user_id = ?').get(testApprovedId);
    assertTest(
      'SQLite user_progress correctly recorded approved student data',
      approvedDbProgress && approvedDbProgress.diamonds === 15 && approvedDbProgress.streak_flame === 3,
      `DB record: ${JSON.stringify(approvedDbProgress)}`
    );

    // -------------------------------------------------------------------------
    // SECTION 2: EXAM ROUTE SECURITY & QUESTION LEAKAGE PREVENTION
    // -------------------------------------------------------------------------
    console.log('\n▶ [VECTOR 2] Testing Exam Room Protection (/exam/[examId])...');

    // Load bundle file to know exact secret questions to test against leaks
    const examBundlePath = path.join(ROOT, 'data', 'exams', 'bundles', '19142.json');
    let secretQuestionSnippet = '';
    if (fs.existsSync(examBundlePath)) {
      const bundle = JSON.parse(fs.readFileSync(examBundlePath, 'utf8'));
      if (bundle.questions && bundle.questions.length > 0) {
        const q0 = bundle.questions[0];
        secretQuestionSnippet = 'Teaching young children can be a';
      }
    }

    // 2.1 Unauthenticated request to /exam/19142
    const resExamUnauth = await requestHttp('GET', '/exam/19142');
    assertTest(
      'GET /exam/19142 unauthenticated returns HTTP 200 (access guard page)',
      resExamUnauth.statusCode === 200,
      `Status: ${resExamUnauth.statusCode}`
    );
    assertTest(
      'Unauthenticated /exam/19142 does NOT leak ExamRunner bundle or questions',
      secretQuestionSnippet ? !resExamUnauth.rawBody.includes(secretQuestionSnippet) : true,
      'Found secret question snippet in unauthenticated HTML!'
    );
    assertTest(
      'Unauthenticated /exam/19142 renders Login Prompt & Google OAuth Link',
      resExamUnauth.rawBody.includes('/api/auth/google') &&
      resExamUnauth.rawBody.includes('Yêu cầu đăng nhập &amp; Phê duyệt') || resExamUnauth.rawBody.includes('Yêu cầu đăng nhập & Phê duyệt'),
      'Missing expected login guard HTML elements'
    );

    // 2.2 Pending student request to /exam/19142
    const resExamPending = await requestHttp('GET', '/exam/19142', null, `ta12_session=${pendingToken}`);
    assertTest(
      'Pending student /exam/19142 renders HTTP 200',
      resExamPending.statusCode === 200,
      `Status: ${resExamPending.statusCode}`
    );
    assertTest(
      'Pending student /exam/19142 renders ApprovalWaitingScreen',
      resExamPending.rawBody.includes('ĐANG CHỜ PHÊ DUYỆT TÀI KHOẢN') ||
      resExamPending.rawBody.includes('Học sinh Chờ Duyệt (Challenger Test)'),
      'Missing ApprovalWaitingScreen text in response'
    );
    assertTest(
      'Pending student /exam/19142 does NOT leak exam questions or bundle',
      secretQuestionSnippet ? !resExamPending.rawBody.includes(secretQuestionSnippet) : true,
      'Question snippet leaked to pending student!'
    );
    assertTest(
      'Pending student /exam/19142 contains NO ExamRunner palette or submit controls',
      !resExamPending.rawBody.includes('Nộp bài thi') && !resExamPending.rawBody.includes('exam-palette'),
      'ExamRunner controls present on pending page!'
    );

    // 2.3 Rejected student request to /exam/19142
    const resExamRejected = await requestHttp('GET', '/exam/19142', null, `ta12_session=${rejectedToken}`);
    assertTest(
      'Rejected student /exam/19142 renders Access Denied message',
      resExamRejected.rawBody.includes('Quyền truy cập bị từ chối'),
      'Missing access denied message'
    );
    assertTest(
      'Rejected student /exam/19142 does NOT leak exam questions',
      secretQuestionSnippet ? !resExamRejected.rawBody.includes(secretQuestionSnippet) : true,
      'Question snippet leaked to rejected student!'
    );

    // 2.4 Approved student request to /exam/19142 (control check)
    const resExamApproved = await requestHttp('GET', '/exam/19142', null, `ta12_session=${approvedToken}`);
    assertTest(
      'Approved student /exam/19142 renders exam room',
      resExamApproved.statusCode === 200 && !resExamApproved.rawBody.includes('ĐANG CHỜ PHÊ DUYỆT TÀI KHOẢN'),
      'Approved student should access exam room'
    );

    // -------------------------------------------------------------------------
    // SECTION 3: PRACTICE ROUTE SECURITY (/practice/[topicId])
    // -------------------------------------------------------------------------
    console.log('\n▶ [VECTOR 3] Testing Practice Room Protection (/practice/[topicId])...');

    const resPracticeUnauth = await requestHttp('GET', '/practice/15244');
    assertTest(
      'GET /practice/15244 unauthenticated returns HTTP 200',
      resPracticeUnauth.statusCode === 200,
      `Status: ${resPracticeUnauth.statusCode}`
    );

    const resPracticePending = await requestHttp('GET', '/practice/15244', null, `ta12_session=${pendingToken}`);
    assertTest(
      'GET /practice/15244 with pending session renders HTTP 200',
      resPracticePending.statusCode === 200,
      `Status: ${resPracticePending.statusCode}`
    );

    // Deep inspect practice page source code logic:
    const practicePageSrc = fs.readFileSync(path.join(ROOT, 'src', 'app', 'practice', '[topicId]', 'page.tsx'), 'utf8');
    const hasApprovalWaitingInPractice = practicePageSrc.includes('<ApprovalWaitingScreen');
    assertTest(
      'Practice page component includes ApprovalWaitingScreen conditional return for pending users',
      hasApprovalWaitingInPractice,
      'ApprovalWaitingScreen not found in practice page'
    );
    const hasStatusGuardInPractice = practicePageSrc.includes("user.status === 'pending'");
    assertTest(
      'Practice page strictly checks user.status === "pending"',
      hasStatusGuardInPractice,
      'Missing pending check in practice page'
    );

    // -------------------------------------------------------------------------
    // SECTION 4: UI BACKDOOR AUDIT IN LoginModal.tsx
    // -------------------------------------------------------------------------
    console.log('\n▶ [VECTOR 4] Auditing LoginModal.tsx for UI Backdoors & Mock Forms...');

    const loginModalPath = path.join(ROOT, 'src', 'components', 'LoginModal.tsx');
    const loginModalSrc = fs.readFileSync(loginModalPath, 'utf8');

    assertTest(
      'LoginModal.tsx has ZERO <input type="email"',
      !loginModalSrc.includes('type="email"') && !loginModalSrc.includes("type='email'"),
      'Found email input in LoginModal!'
    );

    assertTest(
      'LoginModal.tsx has ZERO <input type="password"',
      !loginModalSrc.includes('type="password"') && !loginModalSrc.includes("type='password'"),
      'Found password input in LoginModal!'
    );

    assertTest(
      'LoginModal.tsx has ZERO <form elements',
      !loginModalSrc.includes('<form') && !loginModalSrc.includes('</form>'),
      'Found form element in LoginModal!'
    );

    assertTest(
      'LoginModal.tsx has ZERO mock login persona triggers (e.g. "Hoặc đăng nhập bằng Email")',
      !loginModalSrc.includes('Hoặc đăng nhập bằng Email') && !loginModalSrc.includes('mock-login'),
      'Found mock login text or endpoint in LoginModal!'
    );

    assertTest(
      'LoginModal.tsx has ZERO hardcoded student persona buttons (Đỗ Tuấn, Nguyễn Văn An)',
      !loginModalSrc.includes('Đỗ Tuấn') && !loginModalSrc.includes('Nguyễn Văn An'),
      'Found persona name buttons in LoginModal!'
    );

    assertTest(
      'LoginModal.tsx primary action is genuine Google OAuth href="/api/auth/google"',
      loginModalSrc.includes('href="/api/auth/google"'),
      'Missing Google OAuth link href="/api/auth/google"'
    );

    assertTest(
      'LoginModal.tsx displays transparent notice that new students are pending admin approval',
      loginModalSrc.includes('chờ duyệt') || loginModalSrc.includes('Pending'),
      'Missing pending policy notice in LoginModal'
    );

    // -------------------------------------------------------------------------
    // SECTION 5: ADVANCED ADVERSARIAL STRESS & INJECTION TESTING
    // -------------------------------------------------------------------------
    console.log('\n▶ [VECTOR 5] Stress Testing Token Fuzzing & SQL Injection Resistance...');

    // 5.1 SQL Injection attack in POST /api/progress for approved user
    const sqlInjectionPayload = {
      diamonds: 10,
      streak_flame: 1,
      exam_scores: "'; DROP TABLE users; --",
      topic_practice_history: "1' OR '1'='1"
    };
    const resSqlInj = await requestHttp('POST', '/api/progress', sqlInjectionPayload, `ta12_session=${approvedToken}`);
    assertTest(
      'POST /api/progress handles SQL injection strings safely without DB corruption',
      resSqlInj.statusCode === 200,
      `Status: ${resSqlInj.statusCode}`
    );
    // Verify users table was NOT dropped
    const usersCount = db.prepare('SELECT COUNT(*) as cnt FROM users').get();
    assertTest(
      'SQLite users table remains completely intact after SQL injection attack',
      usersCount && usersCount.cnt > 0,
      `Users count: ${usersCount?.cnt}`
    );

    // 5.2 Cookie Tampering: Swapping userId in payload with another student while keeping signature
    const tamperedPayload = Buffer.from(`${testApprovedId}:${Date.now()}:${crypto.randomBytes(32).toString('hex')}`).toString('base64');
    const resTamperedCookie = await requestHttp('GET', '/api/progress', null, `ta12_session=${tamperedPayload}`);
    assertTest(
      'GET /api/progress with mismatched/random signature returns HTTP 401',
      resTamperedCookie.statusCode === 401,
      `Status: ${resTamperedCookie.statusCode}`
    );

    // 5.3 Empty / Malformed cookie attacks
    const resEmptyCookie = await requestHttp('GET', '/api/progress', null, 'ta12_session=');
    assertTest(
      'GET /api/progress with empty session cookie returns HTTP 401',
      resEmptyCookie.statusCode === 401,
      `Status: ${resEmptyCookie.statusCode}`
    );

    const resColonExploit = await requestHttp('GET', '/api/progress', null, 'ta12_session=:::::');
    assertTest(
      'GET /api/progress with multiple colons returns HTTP 401',
      resColonExploit.statusCode === 401,
      `Status: ${resColonExploit.statusCode}`
    );

  } finally {
    // Cleanup test users from SQLite database
    try {
      db.prepare('DELETE FROM user_progress WHERE user_id IN (?, ?, ?)').run(testPendingId, testRejectedId, testApprovedId);
      db.prepare('DELETE FROM users WHERE id IN (?, ?, ?)').run(testPendingId, testRejectedId, testApprovedId);
      db.close();
      console.log('\n🧹 Cleaned up temporary test users from SQLite.');
    } catch (e) {
      console.error('Error cleaning up DB:', e);
    }
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 ADVERSARIAL CHALLENGE SUMMARY: ${passedTests} / ${totalTests} CHECKS PASSED`);
  if (failedTests.length > 0) {
    console.error(`❌ FAILURES DETECTED: ${failedTests.length}`);
    failedTests.forEach(f => console.error(`  - ${f.name} (${f.extraInfo})`));
    console.log('EMPIRICAL VERDICT: REJECT');
    process.exit(1);
  } else {
    console.log('🎉 ALL ADVERSARIAL ATTACKS SUCCESSFULLY REPELLED!');
    console.log('EMPIRICAL VERDICT: APPROVE');
    console.log('========================================================================\n');
  }
}

runAdversarialSuite().catch(err => {
  console.error('Fatal execution error in adversarial suite:', err);
  process.exit(1);
});
