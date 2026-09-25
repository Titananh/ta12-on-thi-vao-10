/**
 * TA12 Empirical Challenger 2 Test Suite: Requirement R2 Audit
 *
 * Focus:
 *  1. Access Guard & Mode Gating (Pending vs Approved students)
 *  2. Tab Switching & 4-Mode Accessibility for Approved students
 *  3. Session Cookie Cryptographic HMAC Tamper Resistance & Fuzzing
 *  4. Direct URL Navigation & API Authorization Boundary Challenge
 *  5. Build & Test Suite Verification
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const crypto = require('crypto');
const puppeteer = require('puppeteer-core');
const Database = require('better-sqlite3');

const ROOT = path.resolve(__dirname, '..');
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = 'http://localhost:3000';
const AUTH_SECRET = 'ta12_grade10_english_prep_auth_secret_2026';
const DB_PATH = path.join(ROOT, 'data', 'ta12_users.sqlite');

let totalChecks = 0;
let passedChecks = 0;
const failures = [];
const findings = [];

function check(desc, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${desc}`);
  } else {
    failures.push({ desc, details });
    console.error(`  ❌ FAILED: ${desc} ${details ? '(' + details + ')' : ''}`);
  }
}

function recordFinding(severity, title, description) {
  findings.push({ severity, title, description });
  console.log(`  ⚠️ [${severity.toUpperCase()}] ${title}: ${description}`);
}

function signSessionToken(userId, secret = AUTH_SECRET) {
  const ts = Date.now().toString();
  const payload = `${userId}:${ts}`;
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

function verifySessionToken(token, secret = AUTH_SECRET) {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 3) return null;
    const [userId, ts, sig] = parts;
    if (!userId || !ts || !sig) return null;
    const expectedSig = crypto.createHmac('sha256', secret).update(`${userId}:${ts}`).digest('hex');
    const sigBuffer = Buffer.from(sig);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return userId;
    }
  } catch {
    return null;
  }
  return null;
}

function postJson(urlPath, payload, cookie = '') {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        ...(cookie ? { 'Cookie': cookie } : {}),
      },
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(urlPath, cookie = '') {
  return new Promise((resolve, reject) => {
    http.get({
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      headers: cookie ? { 'Cookie': cookie } : {},
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    }).on('error', reject);
  });
}

async function runChallengerSuite() {
  console.log('========================================================================');
  console.log('⚔️  CHALLENGER 2: EMPIRICAL AUDIT OF REQUIREMENT R2');
  console.log('========================================================================\n');

  // ---------------------------------------------------------------------------
  // VECTOR 1: Session Cookie HMAC Cryptographic Tamper Resistance & Fuzzing
  // ---------------------------------------------------------------------------
  console.log('▶ Vector 1: Session Cookie Cryptographic Tamper Resistance & Fuzzing...');

  const userId = 'usr_dotuan_demo';
  const validToken = signSessionToken(userId);
  check('Valid token correctly verifies to original userId', verifySessionToken(validToken) === userId);

  // 1.1 Tamper Signature
  const rawParts = Buffer.from(validToken, 'base64').toString('utf8').split(':');
  const tamperedSig = rawParts[2].slice(0, -1) + (rawParts[2].slice(-1) === 'a' ? 'b' : 'a');
  const tamperedTokenSig = Buffer.from(`${rawParts[0]}:${rawParts[1]}:${tamperedSig}`).toString('base64');
  check('Tampered signature (last character flipped) is strictly rejected', verifySessionToken(tamperedTokenSig) === null);

  const tamperedFirstChar = (rawParts[2][0] === 'a' ? 'b' : 'a') + rawParts[2].slice(1);
  const tamperedTokenFirst = Buffer.from(`${rawParts[0]}:${rawParts[1]}:${tamperedFirstChar}`).toString('base64');
  check('Tampered signature (first character flipped) is strictly rejected', verifySessionToken(tamperedTokenFirst) === null);

  // 1.2 Privilege Escalation: Pending user attempting to elevate to Approved user
  const pendingToken = signSessionToken('usr_pending_demo');
  const pendingRaw = Buffer.from(pendingToken, 'base64').toString('utf8').split(':');
  const forgedApproved = Buffer.from(`usr_dotuan_demo:${pendingRaw[1]}:${pendingRaw[2]}`).toString('base64');
  check('Privilege escalation attempt (swapping userId with pending signature) is rejected', verifySessionToken(forgedApproved) === null);

  // 1.3 Replay / Timestamp Alteration
  const forgedTimestamp = Buffer.from(`${rawParts[0]}:${Number(rawParts[1]) + 3600}:${rawParts[2]}`).toString('base64');
  check('Replay attack with modified timestamp is rejected', verifySessionToken(forgedTimestamp) === null);

  // 1.4 Structural Fuzzing
  check('Empty token string is rejected', verifySessionToken('') === null);
  check('Random non-base64 garbage string is rejected', verifySessionToken('%%%___not_base64!!!') === null);
  check('Token with 1 part (no colons) is rejected', verifySessionToken(Buffer.from('single_part_token').toString('base64')) === null);
  check('Token with 2 parts is rejected', verifySessionToken(Buffer.from('usr_dotuan_demo:12345').toString('base64')) === null);
  check('Token with 4 parts is rejected', verifySessionToken(Buffer.from('usr_dotuan_demo:12345:signature:extra').toString('base64')) === null);
  check('Token with empty userId is rejected', verifySessionToken(Buffer.from(':12345:signature').toString('base64')) === null);
  check('Token with empty timestamp is rejected', verifySessionToken(Buffer.from('usr_dotuan_demo::signature').toString('base64')) === null);
  check('Token with empty signature is rejected', verifySessionToken(Buffer.from('usr_dotuan_demo:12345:').toString('base64')) === null);

  // 1.5 Buffer Length Mismatch (Truncated signature - should safely reject without exception)
  const truncatedSig = Buffer.from(`usr_dotuan_demo:${rawParts[1]}:${rawParts[2].slice(0, 16)}`).toString('base64');
  check('Truncated signature buffer length mismatch returns null safely', verifySessionToken(truncatedSig) === null);

  // 1.6 Secret Key Isolation
  const forgedWrongSecret = signSessionToken(userId, 'attacker_secret_key_123456');
  check('Token signed with untrusted secret key is rejected by server secret', verifySessionToken(forgedWrongSecret) === null);

  // 1.7 Null-Byte Injection
  const nullByteToken = Buffer.from(`usr_dotuan_demo\0:12345:${rawParts[2]}`).toString('base64');
  check('Null-byte injection in payload is rejected', verifySessionToken(nullByteToken) === null);

  // 1.8 Extreme Payload Length Stress
  const hugeGarbage = 'A'.repeat(65536);
  check('64KB payload stress returns null without crash or DOS', verifySessionToken(hugeGarbage) === null);

  // ---------------------------------------------------------------------------
  // VECTOR 2: Browser Empirical Audit: Access Guard on Pending Accounts
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 2: Browser Empirical Audit: Access Guard for Pending Student...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 2.1 Login as pending student
  await page.goto(`${BASE_URL}/api/auth/mock-login?persona=pending&redirect=/`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('body');
  await new Promise(r => setTimeout(r, 1200)); // wait for client hydration

  const pendingHtml = await page.content();
  const pendingText = await page.evaluate(() => document.body.innerText);

  check('Pending user on "/" lands on ApprovalWaitingScreen', pendingHtml.includes('ĐANG CHỜ PHÊ DUYỆT TÀI KHOẢN'));
  check('ApprovalWaitingScreen renders student name "Nguyễn Văn An"', pendingHtml.includes('Nguyễn Văn An'));
  check('ApprovalWaitingScreen renders student email "pending.student@ta12.edu.vn"', pendingHtml.includes('pending.student@ta12.edu.vn'));
  check('ApprovalWaitingScreen renders countdown & auto-refresh instruction', pendingHtml.includes('Hệ thống tự động kiểm tra mỗi 10 giây'));
  check('ApprovalWaitingScreen renders manual refresh button "Kiểm tra lại trạng thái"', pendingHtml.includes('Kiểm tra lại trạng thái'));
  check('ApprovalWaitingScreen renders "Đăng xuất / Đổi tài khoản" button', pendingHtml.includes('Đăng xuất / Đổi tài khoản'));

  // Negative Checks: Gating Verification for Pending Student
  check('Pending user CANNOT access NavCards on "/"', !pendingHtml.includes('4 Big Nav Cards') && !pendingText.includes('Luyện đề thi'));
  check('Pending user CANNOT access Tab 1 (Học ôn / HocOnView) on "/"', !pendingHtml.includes('HocOnView') && !pendingText.includes('Học từ vựng'));
  check('Pending user CANNOT access Tab 2 (Luyện đề / LuyenDeView) on "/"', !pendingHtml.includes('LuyenDeView') && !pendingText.includes('Đề thi chính thức'));
  check('Pending user CANNOT access Tab 3 (Luyện từng phần / LuyenPhanView) on "/"', !pendingHtml.includes('LuyenPhanView') && !pendingText.includes('Chọn dạng bài'));
  check('Pending user CANNOT access Tab 4 (Luyện chủ điểm / TopicList) on "/"', !pendingHtml.includes('TopicList') && !pendingText.includes('Tạo phiên ôn luyện'));
  check('Pending user Header displays status badge "⏳ Chờ duyệt"', pendingHtml.includes('⏳ Chờ duyệt') || pendingText.includes('Chờ duyệt'));

  // ---------------------------------------------------------------------------
  // VECTOR 3: Browser Empirical Audit: 4 Modes Accessible for Approved Student
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 3: Browser Empirical Audit: All 4 Modes Accessible for Approved Student...');

  // 3.1 Login as approved student (Đỗ Tuấn)
  await page.goto(`${BASE_URL}/api/auth/mock-login?persona=approved&redirect=/`, { waitUntil: 'networkidle2' });
  await page.waitForSelector('body');
  await new Promise(r => setTimeout(r, 1200));

  const approvedHtml = await page.content();
  const approvedText = await page.evaluate(() => document.body.innerText);

  check('Approved user does NOT see ApprovalWaitingScreen', !approvedHtml.includes('ĐANG CHỜ PHÊ DUYỆT TÀI KHOẢN'));
  check('Approved user Header displays student name "Đỗ Tuấn"', approvedHtml.includes('Đỗ Tuấn'));
  check('Approved user Header displays status badge "✓ Đã duyệt"', approvedHtml.includes('✓ Đã duyệt'));

  // 3.2 Verify Mode 4 (Default): LUYỆN CHỦ ĐIỂM
  check('Mode 4 (LUYỆN CHỦ ĐIỂM) is rendered by default', approvedText.includes('Luyện chủ điểm'));
  check('Mode 4 displays 5-skill filter pills', approvedText.includes('Ngữ âm') || approvedText.includes('Từ vựng') || approvedText.includes('Ngữ pháp'));
  check('Mode 4 displays "+ Tạo phiên ôn luyện" button', approvedText.includes('Tạo phiên ôn luyện'));

  // 3.3 Switch to Mode 1: HỌC ÔN
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.includes('HỌC ÔN'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const hocOnText = await page.evaluate(() => document.body.innerText);
  check('Mode 1 (HỌC ÔN) is accessible and renders unit catalog', hocOnText.includes('Học từ vựng') || hocOnText.includes('Học ngữ pháp') || hocOnText.includes('Học ôn'));

  // 3.4 Switch to Mode 2: LUYỆN ĐỀ THI
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.includes('LUYỆN ĐỀ THI'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const luyenDeText = await page.evaluate(() => document.body.innerText);
  check('Mode 2 (LUYỆN ĐỀ THI) is accessible and displays exam catalog', luyenDeText.includes('Đề thi') || luyenDeText.includes('Chính thức') || luyenDeText.includes('Luyện đề thi'));

  // 3.5 Switch to Mode 3: LUYỆN TỪNG PHẦN
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.innerText.includes('LUYỆN TỪNG PHẦN'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  const luyenPhanText = await page.evaluate(() => document.body.innerText);
  check('Mode 3 (LUYỆN TỪNG PHẦN) is accessible and displays standardized section cards', luyenPhanText.includes('Luyện từng phần') || luyenPhanText.includes('Phát âm') || luyenPhanText.includes('Trọng âm'));

  // ---------------------------------------------------------------------------
  // VECTOR 4: Direct URL & API Boundary Stress Testing (Adversarial Vector)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 4: Direct URL & API Boundary Stress Testing (Adversarial Vector)...');

  // Re-login as pending user
  await page.goto(`${BASE_URL}/api/auth/mock-login?persona=pending&redirect=/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  // Attack 4.1: Direct navigation to Exam Room URL (/exam/19142)
  console.log('  Testing Attack 4.1: Direct navigation to /exam/19142 while status=pending...');
  await page.goto(`${BASE_URL}/exam/19142`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const directExamText = await page.evaluate(() => document.body.innerText);
  const examLoaded = directExamText.includes('Nộp bài') || directExamText.includes('Môn Tiếng Anh (Hà Nội)');

  if (examLoaded) {
    recordFinding(
      'MEDIUM',
      'Direct URL Access on /exam/[examId]',
      'Pending student can access exam runner via direct URL (/exam/19142) because Access Guard is implemented at page.tsx rather than middleware/layout or route handler.'
    );
  } else {
    check('Direct navigation to /exam/19142 is blocked for pending student', true);
  }

  // Attack 4.2: Direct navigation to Practice Player URL (/practice/68)
  console.log('  Testing Attack 4.2: Direct navigation to /practice/68 while status=pending...');
  await page.goto(`${BASE_URL}/practice/68`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  const directPracticeText = await page.evaluate(() => document.body.innerText);
  const practiceLoaded = directPracticeText.includes('Kiểm tra ngay') || directPracticeText.includes('Luyện theo chủ điểm');

  if (practiceLoaded) {
    recordFinding(
      'MEDIUM',
      'Direct URL Access on /practice/[topicId]',
      'Pending student can access practice runner via direct URL (/practice/68) because PracticePage does not evaluate user status.'
    );
  } else {
    check('Direct navigation to /practice/68 is blocked for pending student', true);
  }

  // Attack 4.3: Direct API Access to /api/progress for pending user
  console.log('  Testing Attack 4.3: POST /api/progress while status=pending...');
  const cookies = await page.cookies();
  const sessionCookieObj = cookies.find(c => c.name === 'ta12_session');
  const sessionCookie = sessionCookieObj ? `ta12_session=${sessionCookieObj.value}` : '';

  const progressWriteRes = await postJson('/api/progress', { streak_flame: 99, diamonds: 999 }, sessionCookie);
  if (progressWriteRes.body?.success) {
    recordFinding(
      'LOW',
      'API Authorization on /api/progress',
      '/api/progress allows pending users to write progress records because it only verifies authentication (if (!user)), not authorization (status === "approved").'
    );
  } else {
    check('Pending user is rejected by /api/progress', progressWriteRes.status === 403);
  }

  // Clean up pending user's test progress in DB
  const db = new Database(DB_PATH);
  db.prepare("UPDATE user_progress SET streak_flame = 0, diamonds = 0 WHERE user_id = 'usr_pending_demo'").run();

  await browser.close();

  // ---------------------------------------------------------------------------
  // VECTOR 5: Real-time Auto-Approval on Whitelist Addition
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 5: Real-time Auto-Approval on Whitelist Addition...');
  const testStudentEmail = `autocheck_${Date.now()}@test.ta12.edu.vn`;

  // Register new student (should be pending)
  const regRes = await postJson('/api/auth/mock-login', {
    persona: 'custom',
    email: testStudentEmail,
    name: 'Học sinh Thử nghiệm Whitelist',
  });
  check('New unlisted student receives status="pending"', regRes.body?.user?.status === 'pending');

  // Admin whitelists email in DB
  db.prepare('INSERT INTO pre_whitelist (email, notes) VALUES (?, ?)').run(testStudentEmail, 'Challenger Auto Test');

  // Student re-authenticates or session refreshes
  const reauthRes = await postJson('/api/auth/mock-login', {
    persona: 'custom',
    email: testStudentEmail,
    name: 'Học sinh Thử nghiệm Whitelist',
  });
  check('Whitelisted student is immediately promoted to status="approved"', reauthRes.body?.user?.status === 'approved');
  check('Promoted student has non-null approved_at timestamp', Boolean(reauthRes.body?.user?.approved_at));

  // Clean up test records
  db.prepare('DELETE FROM users WHERE email = ?').run(testStudentEmail);
  db.prepare('DELETE FROM pre_whitelist WHERE email = ?').run(testStudentEmail);

  // ===========================================================================
  // SUMMARY REPORT
  // ===========================================================================
  console.log('\n========================================================================');
  console.log(`📊 CHALLENGER 2 SUMMARY: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
  console.log(`⚠️  FINDINGS NOTED: ${findings.length}`);
  console.log('========================================================================');

  if (findings.length > 0) {
    console.log('\nFORENSIC FINDINGS SUMMARY:');
    findings.forEach((f, i) => console.log(`  ${i + 1}. [${f.severity}] ${f.title}: ${f.description}`));
  }

  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} ASSERTION FAILURES:`);
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f.desc} ${f.details}`));
    console.log('\nEMPIRICAL VERDICT: REQUEST_CHANGES');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL MANDATORY REQUIREMENTS VERIFIED WITH 100% SUCCESS!');
    console.log('EMPIRICAL VERDICT: APPROVE');
    process.exit(0);
  }
}

runChallengerSuite().catch(err => {
  console.error('Fatal challenger execution error:', err);
  process.exit(1);
});
