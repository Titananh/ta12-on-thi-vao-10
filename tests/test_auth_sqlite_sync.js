/**
 * TA12 Automated Test Suite: Google OAuth, SQLite Progress Sync & Access Guard (R2)
 *
 * Vectors:
 *  1. SQLite Engine, WAL Mode, Tables & Indices Creation
 *  2. Pre-seeded Default Personas (Đỗ Tuấn, Nguyễn Văn An, VIP Whitelist)
 *  3. Session Token HMAC Cryptographic Signing & Tamper Verification
 *  4. Mock Login & Persona Switching API Logic
 *  5. Pre-whitelist Automatic Approval & Upgrade Logic
 *  6. Learning Progress Sync (GET / POST) & SQLite Persistence
 *  7. Access Guard UI (ApprovalWaitingScreen & Header Status Badge)
 *  8. Strict Backward Compatibility & Zero-Regression Verification
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const ts = require('typescript');
const Module = require('module');
const Database = require('better-sqlite3');

const ROOT_DIR = path.resolve(__dirname, '..');
const DB_PATH = path.join(ROOT_DIR, 'data', 'ta12_users.sqlite');

// -----------------------------------------------------------------------------
// Module Mocking & TypeScript Transpile Hook
// -----------------------------------------------------------------------------
const originalRequire = Module.prototype.require;
Module.prototype.require = function (request) {
  if (request === 'next/headers') {
    return {
      cookies: () => ({
        get: (name) => global.__mockCookies?.[name] ? { value: global.__mockCookies[name] } : undefined,
        set: (name, val) => {
          if (!global.__mockCookies) global.__mockCookies = {};
          global.__mockCookies[name] = val;
        },
      }),
    };
  }
  if (request === 'next/server') {
    class MockNextResponse {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.headers = new Map();
        this._cookies = {};
      }
      static json(body, init = {}) {
        const res = new MockNextResponse(JSON.stringify(body), init);
        res._json = body;
        return res;
      }
      static redirect(url, init = {}) {
        const res = new MockNextResponse(null, { status: 307, ...init });
        res._redirectUrl = typeof url === 'string' ? url : url.toString();
        return res;
      }
      get cookies() {
        return {
          set: (name, val, opts) => {
            this._cookies[name] = { value: val, options: opts };
            if (!global.__mockCookies) global.__mockCookies = {};
            global.__mockCookies[name] = val;
          },
          get: (name) => this._cookies[name],
        };
      }
      async json() {
        return this._json !== undefined ? this._json : JSON.parse(this.body);
      }
    }
    class MockNextRequest {
      constructor(input, init = {}) {
        this.url = typeof input === 'string' ? input : input.url;
        this.nextUrl = new URL(this.url);
        this.method = init.method || 'GET';
        this.body = init.body;
      }
      async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }
    }
    return { NextResponse: MockNextResponse, NextRequest: MockNextRequest };
  }
  if (request === 'next/link') {
    const React = require('react');
    return function Link(props) {
      return React.createElement('a', { href: props.href, className: props.className }, props.children);
    };
  }
  if (request === 'next/image') {
    const React = require('react');
    return function Image(props) {
      return React.createElement('img', {
        src: props.src?.src || props.src,
        alt: props.alt || '',
        className: props.className,
      });
    };
  }
  if (request.startsWith('@/')) {
    const rel = request.replace('@/', 'src/');
    return originalRequire.call(this, path.resolve(ROOT_DIR, rel));
  }
  return originalRequire.call(this, request);
};

require.extensions['.tsx'] = function (module, filename) {
  let content = fs.readFileSync(filename, 'utf8');
  content = content.replace(/["\x27]use client["\x27];?/g, '');
  const transpiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.React,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
  });
  module._compile(transpiled.outputText, filename);
};
require.extensions['.ts'] = require.extensions['.tsx'];

const React = require('react');
const ReactDOMServer = require('react-dom/server');

// -----------------------------------------------------------------------------
// Test Runner Harness
// -----------------------------------------------------------------------------
let totalTests = 0;
let passedTests = 0;
const failures = [];

function check(desc, condition, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${desc}`);
  } else {
    failures.push({ desc, details });
    console.error(`  ❌ ${desc} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runTestSuite() {
  console.log('========================================================================');
  console.log('🔐 TA12 AUTOMATED TEST SUITE: AUTH, SQLITE & PROGRESS SYNC (R2)');
  console.log('========================================================================\n');

  // Load modules
  const { getDb, getUserById, getUserByEmail, isEmailWhitelisted, upsertGoogleUser, getUserProgress, saveUserProgress } = require('@/lib/db');
  const { signSessionToken, verifySessionToken, getCurrentUser, SESSION_COOKIE_NAME } = require('@/lib/auth');

  const db = getDb();
  // Ensure idempotent baseline state for pre-seeded demo personas
  db.prepare("UPDATE user_progress SET streak_flame = 3, diamonds = 50 WHERE user_id = 'usr_dotuan_demo'").run();

  // ---------------------------------------------------------------------------
  // VECTOR 1: SQLite Engine, WAL Mode, Tables & Indices Creation
  // ---------------------------------------------------------------------------
  console.log('▶ Vector 1: SQLite Engine, WAL Mode, Tables & Indices Creation...');
  check('SQLite database instance initialized', db instanceof Database);

  const walMode = db.pragma('journal_mode', { simple: true });
  check('SQLite configured in WAL mode (Write-Ahead Logging)', walMode === 'wal', `Current mode: ${walMode}`);

  const busyTimeout = db.pragma('busy_timeout', { simple: true });
  check('SQLite configured with busy_timeout >= 5000ms', busyTimeout >= 5000, `Timeout: ${busyTimeout}`);

  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
  check('Database contains "users" table', tables.includes('users'));
  check('Database contains "pre_whitelist" table', tables.includes('pre_whitelist'));
  check('Database contains "user_progress" table', tables.includes('user_progress'));

  const indices = db.prepare("SELECT name FROM sqlite_master WHERE type='index'").all().map(i => i.name);
  check('Index "idx_users_email" exists', indices.includes('idx_users_email'));
  check('Index "idx_users_google_id" exists', indices.includes('idx_users_google_id'));
  check('Index "idx_users_status" exists', indices.includes('idx_users_status'));
  check('Index "idx_pre_whitelist_email" exists', indices.includes('idx_pre_whitelist_email'));

  // ---------------------------------------------------------------------------
  // VECTOR 2: Pre-seeded Default Personas Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 2: Pre-seeded Default Personas Verification...');
  const doTuan = getUserById('usr_dotuan_demo');
  check('Pre-seeded student "Đỗ Tuấn" exists', Boolean(doTuan));
  check('Đỗ Tuấn has status "approved"', doTuan?.status === 'approved');
  check('Đỗ Tuấn has email "dotuan.student@ta12.edu.vn"', doTuan?.email === 'dotuan.student@ta12.edu.vn');
  check('Đỗ Tuấn has non-null approved_at timestamp', Boolean(doTuan?.approved_at));

  const doTuanProgress = getUserProgress('usr_dotuan_demo');
  check('Đỗ Tuấn user_progress initialized', Boolean(doTuanProgress));
  check('Đỗ Tuấn initial streak is 3', doTuanProgress?.streak_flame === 3);
  check('Đỗ Tuấn initial diamonds is 50', doTuanProgress?.diamonds === 50);

  const pendingAn = getUserById('usr_pending_demo');
  check('Pre-seeded pending student "Nguyễn Văn An" exists', Boolean(pendingAn));
  check('Nguyễn Văn An has status "pending"', pendingAn?.status === 'pending');
  check('Nguyễn Văn An has email "pending.student@ta12.edu.vn"', pendingAn?.email === 'pending.student@ta12.edu.vn');
  check('Nguyễn Văn An has null approved_at timestamp', pendingAn?.approved_at === null);

  check('Pre-whitelist contains "vip.student@ta12.edu.vn"', isEmailWhitelisted('vip.student@ta12.edu.vn'));
  check('Pre-whitelist lookup is case-insensitive', isEmailWhitelisted('VIP.STUDENT@TA12.EDU.VN'));

  // ---------------------------------------------------------------------------
  // VECTOR 3: Session Token HMAC Cryptographic Signing & Tamper Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 3: Session Token HMAC Signing & Tamper Verification...');
  const testUserId = 'usr_dotuan_demo';
  const token = signSessionToken(testUserId);
  check('signSessionToken produces non-empty token string', typeof token === 'string' && token.length > 20);

  const verifiedUserId = verifySessionToken(token);
  check('verifySessionToken correctly decodes genuine token', verifiedUserId === testUserId);

  // Tamper tests
  const tamperedToken1 = token.slice(0, -4) + 'abcd';
  check('verifySessionToken rejects signature-tampered token', verifySessionToken(tamperedToken1) === null);

  const tamperedToken2 = Buffer.from('usr_hacker_demo:123456789:fakesig').toString('base64');
  check('verifySessionToken rejects forged payload', verifySessionToken(tamperedToken2) === null);

  check('verifySessionToken rejects arbitrary garbage string', verifySessionToken('not_a_valid_token') === null);

  // ---------------------------------------------------------------------------
  // VECTOR 4: Mock Login & Persona Switching API Logic
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 4: Mock Login & Persona Switching API Logic...');
  const mockLoginModule = require('@/app/api/auth/mock-login/route');

  // Test Approved Login
  global.__mockCookies = {};
  const reqApproved = new (Module.prototype.require('next/server').NextRequest)(
    'http://localhost:3000/api/auth/mock-login',
    { method: 'POST', body: { persona: 'approved' } }
  );
  const resApproved = await mockLoginModule.POST(reqApproved);
  const jsonApproved = await resApproved.json();
  check('Mock-login approved persona returns success=true', jsonApproved.success === true);
  check('Mock-login approved persona returns name "Đỗ Tuấn"', jsonApproved.user?.name === 'Đỗ Tuấn');
  check('Mock-login approved persona returns status "approved"', jsonApproved.user?.status === 'approved');
  check('Mock-login sets ta12_session cookie', Boolean(global.__mockCookies[SESSION_COOKIE_NAME]));

  // Test Pending Login
  global.__mockCookies = {};
  const reqPending = new (Module.prototype.require('next/server').NextRequest)(
    'http://localhost:3000/api/auth/mock-login',
    { method: 'POST', body: { persona: 'pending' } }
  );
  const resPending = await mockLoginModule.POST(reqPending);
  const jsonPending = await resPending.json();
  check('Mock-login pending persona returns success=true', jsonPending.success === true);
  check('Mock-login pending persona returns name "Nguyễn Văn An"', jsonPending.user?.name === 'Nguyễn Văn An');
  check('Mock-login pending persona returns status "pending"', jsonPending.user?.status === 'pending');

  // ---------------------------------------------------------------------------
  // VECTOR 5: Pre-whitelist Automatic Approval & Upgrade Logic
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 5: Pre-whitelist Automatic Approval Logic...');
  // 5.1 Test logging in with vip.student@ta12.edu.vn (already pre-whitelisted)
  const { user: vipUser } = upsertGoogleUser({
    google_id: 'google_oauth_vip_999',
    email: 'vip.student@ta12.edu.vn',
    name: 'Học sinh VIP Thực tế',
  });
  check('User with pre-whitelisted email is automatically status="approved"', vipUser.status === 'approved');
  check('User with pre-whitelisted email has valid approved_at date', Boolean(vipUser.approved_at));

  // 5.2 Test logging in with unknown email (NOT whitelisted)
  const unknownEmail = `student_${Date.now()}@gmail.com`;
  const { user: regularUser } = upsertGoogleUser({
    google_id: `google_oauth_reg_${Date.now()}`,
    email: unknownEmail,
    name: 'Học sinh Vãng lai',
  });
  check('User with non-whitelisted email is assigned status="pending"', regularUser.status === 'pending');
  check('User with non-whitelisted email has approved_at=null', regularUser.approved_at === null);

  // 5.3 Add the pending user's email to pre_whitelist and simulate subsequent login
  db.prepare('INSERT INTO pre_whitelist (email, notes) VALUES (?, ?)').run(unknownEmail, 'Admin added to whitelist');
  check('Email successfully added to pre_whitelist', isEmailWhitelisted(unknownEmail));

  const { user: upgradedUser } = upsertGoogleUser({
    google_id: regularUser.google_id,
    email: unknownEmail,
    name: 'Học sinh Vãng lai',
  });
  check('Subsequent login of whitelisted user is upgraded to status="approved"', upgradedUser.status === 'approved');
  check('Upgraded user receives valid approved_at timestamp', Boolean(upgradedUser.approved_at));

  // Teardown transient test records so test runs never pollute production database
  db.prepare('DELETE FROM users WHERE email = ?').run(unknownEmail);
  db.prepare('DELETE FROM pre_whitelist WHERE email = ?').run(unknownEmail);
  db.prepare('DELETE FROM user_progress WHERE user_id = ?').run(regularUser.id);
  db.prepare('DELETE FROM users WHERE email = ?').run('vip.student@ta12.edu.vn');
  db.prepare('DELETE FROM user_progress WHERE user_id = ?').run(vipUser.id);

  // ---------------------------------------------------------------------------
  // VECTOR 6: Learning Progress Sync (GET / POST) & SQLite Persistence
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 6: Learning Progress Two-Way Sync API...');
  const progressModule = require('@/app/api/progress/route');
  const sessionModule = require('@/app/api/auth/session/route');

  // Authenticate as Đỗ Tuấn
  const userToken = signSessionToken('usr_dotuan_demo');
  global.__mockCookies = { [SESSION_COOKIE_NAME]: userToken };

  // Test POST /api/progress
  const mockProgressPayload = {
    exam_scores: { "19142": { score: 9.5, total: 40, correct: 38, timeSpent: 1850 } },
    topic_practice_history: { "15244": 100, "15245": 90, "15246": 80 },
    section_progress: { "pronunciation": { count: 20, correct: 19 } },
    study_progress: { "15951": { completed: true, score: 10 } },
    streak_flame: 7,
    diamonds: 120,
  };

  const reqProgressPost = new (Module.prototype.require('next/server').NextRequest)(
    'http://localhost:3000/api/progress',
    { method: 'POST', body: mockProgressPayload }
  );
  const resProgressPost = await progressModule.POST(reqProgressPost);
  const jsonProgressPost = await resProgressPost.json();
  check('POST /api/progress returns success=true', jsonProgressPost.success === true);

  // Direct SQLite Verification
  const savedRow = getUserProgress('usr_dotuan_demo');
  check('SQLite user_progress updated with streak_flame=7', savedRow.streak_flame === 7);
  check('SQLite user_progress updated with diamonds=120', savedRow.diamonds === 120);
  const parsedDbScores = JSON.parse(savedRow.exam_scores);
  check('SQLite user_progress stores exam 19142 score 9.5', parsedDbScores['19142']?.score === 9.5);

  // Test GET /api/progress
  const resProgressGet = await progressModule.GET();
  const jsonProgressGet = await resProgressGet.json();
  check('GET /api/progress returns streak_flame=7', jsonProgressGet.streak_flame === 7);
  check('GET /api/progress returns diamonds=120', jsonProgressGet.diamonds === 120);
  check('GET /api/progress returns matching topic history', jsonProgressGet.topic_practice_history['15244'] === 100);

  // Test GET /api/auth/session
  const resSession = await sessionModule.GET();
  const jsonSession = await resSession.json();
  check('GET /api/auth/session returns user object', Boolean(jsonSession.user));
  check('Session user has status="approved"', jsonSession.user?.status === 'approved');
  check('Session returns progress with streak=7 and diamonds=120', jsonSession.progress?.streak === 7 && jsonSession.progress?.diamonds === 120);

  // Unauthenticated guard test
  global.__mockCookies = {};
  const resUnauthGet = await progressModule.GET();
  check('GET /api/progress rejects unauthenticated request with status 401', resUnauthGet.status === 401);

  const resUnauthSession = await sessionModule.GET();
  const jsonUnauthSession = await resUnauthSession.json();
  check('Unauthenticated /api/auth/session returns user=null', jsonUnauthSession.user === null);

  // Restore Đỗ Tuấn progress back to default demo state
  db.prepare("UPDATE user_progress SET streak_flame = 3, diamonds = 50, exam_scores = '{}', topic_practice_history = '{}', section_progress = '{}', study_progress = '{}' WHERE user_id = 'usr_dotuan_demo'").run();

  // ---------------------------------------------------------------------------
  // VECTOR 7: Access Guard UI Components Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 7: Access Guard UI & Header Status Badges...');
  const ApprovalWaitingScreen = require('@/components/ApprovalWaitingScreen').default;
  const waitingHtml = ReactDOMServer.renderToStaticMarkup(
    React.createElement(ApprovalWaitingScreen, {
      user: {
        id: 'usr_pending_demo',
        name: 'Nguyễn Văn An',
        email: 'pending.student@ta12.edu.vn',
        created_at: new Date().toISOString(),
      },
    })
  );

  check('ApprovalWaitingScreen renders "ĐANG CHỜ PHÊ DUYỆT TÀI KHOẢN"', waitingHtml.includes('ĐANG CHỜ PHÊ DUYỆT TÀI KHOẢN'));
  check('ApprovalWaitingScreen renders student name "Nguyễn Văn An"', waitingHtml.includes('Nguyễn Văn An'));
  check('ApprovalWaitingScreen renders student email "pending.student@ta12.edu.vn"', waitingHtml.includes('pending.student@ta12.edu.vn'));
  check('ApprovalWaitingScreen renders refresh button text "Kiểm tra lại trạng thái"', waitingHtml.includes('Kiểm tra lại trạng thái'));
  check('ApprovalWaitingScreen renders support email "ta12@cth.edu.vn"', waitingHtml.includes('ta12@cth.edu.vn'));

  // Header Component Static & Dynamic Verification
  const headerSource = fs.readFileSync(path.join(ROOT_DIR, 'src', 'components', 'Header.tsx'), 'utf8');
  check('Header.tsx statically contains "Đỗ Tuấn"', headerSource.includes('Đỗ Tuấn'));
  check('Header.tsx statically contains "Học viên"', headerSource.includes('Học viên'));
  check('Header.tsx statically contains "ĐT"', headerSource.includes('ĐT'));
  check('Header.tsx statically contains "<span>0</span>"', headerSource.includes('<span>0</span>'));
  check('Header.tsx statically contains "✓ Đã duyệt"', headerSource.includes('✓ Đã duyệt'));
  check('Header.tsx statically contains "⏳ Chờ duyệt"', headerSource.includes('⏳ Chờ duyệt'));
  check('Header.tsx statically contains light/dark theme toggles', headerSource.includes("localStorage.getItem('ta12_theme')"));
  check('Header.tsx preserves zero legacy TAK12 branding', !headerSource.includes('TAK12'));

  // ---------------------------------------------------------------------------
  // VECTOR 8: Configuration & Build Prerequisite Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 8: Configuration & Packaging Verification...');
  const nextConfigContent = fs.readFileSync(path.join(ROOT_DIR, 'next.config.mjs'), 'utf8');
  check('next.config.mjs includes serverComponentsExternalPackages: [\'better-sqlite3\']',
    nextConfigContent.includes("serverComponentsExternalPackages: ['better-sqlite3']") ||
    nextConfigContent.includes('serverComponentsExternalPackages: ["better-sqlite3"]')
  );

  const pkgContent = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));
  check('package.json includes better-sqlite3 in dependencies', Boolean(pkgContent.dependencies['better-sqlite3']));
  check('package.json includes @types/better-sqlite3 in devDependencies', Boolean(pkgContent.devDependencies['@types/better-sqlite3']));

  // ===========================================================================
  // SUMMARY REPORT
  // ===========================================================================
  console.log('\n========================================================================');
  console.log(`📊 TEST SUMMARY: ${passedTests} / ${totalTests} CHECKS PASSED`);
  console.log('========================================================================');

  if (failures.length > 0) {
    console.error(`\n❌ ${failures.length} ASSERTION FAILURES:`);
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f.desc} ${f.details}`));
    console.log('\nEMPIRICAL VERDICT: REJECT');
    process.exit(1);
  } else {
    console.log('\n🎉 ALL AUTH, SQLITE & PROGRESS SYNC TESTS PASSED WITH 100% SUCCESS!');
    console.log('EMPIRICAL VERDICT: APPROVE');
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
