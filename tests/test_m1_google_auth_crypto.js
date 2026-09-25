/**
 * TA12 Automated Test Suite: Milestone 1 (M1)
 * Google OAuth Crypto & Admin Zero-Bypass Security Hardening
 *
 * Vectors:
 *  1. Genuine RS256 JWKS & ID Token Cryptographic Verification (admin & student lib)
 *  2. HMAC-SHA256 CSRF State Generation, Verification & Expiry
 *  3. Admin Session Token TTL Expiry (7-day window) & HMAC Tamper Resistance
 *  4. Superadmin Master Key Login Protection (Timing-Safe Comparison, Zero-Bypass)
 *  5. Admin API Route Protection (stats, users, whitelist 401 Enforcement)
 *  6. Admin Google OAuth Routes (CSRF Cookie, Code Exchange, Zero-Bypass Gate)
 *  7. Admin UI Static & Structural Integrity Verification
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');
const ts = require('typescript');
const Module = require('module');

const ROOT_DIR = path.resolve(__dirname, '..');
const ADMIN_DIR = path.join(ROOT_DIR, 'admin');

// -----------------------------------------------------------------------------
// Module Mocking & TypeScript Transpile Hook
// -----------------------------------------------------------------------------
const originalRequire = Module.prototype.require;
Module.prototype.require = function (request) {
  if (request === 'next/server') {
    class MockNextResponse {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.headers = new Map();
        this.cookies = new Map();
      }
      static json(body, init = {}) {
        const res = new MockNextResponse(JSON.stringify(body), init);
        res._json = body;
        return res;
      }
      static redirect(url, init = {}) {
        const res = new MockNextResponse('', { status: typeof init === 'number' ? init : (init?.status || 307) });
        res.headers.set('location', typeof url === 'string' ? url : url.toString());
        return res;
      }
      async json() {
        return this._json !== undefined ? this._json : JSON.parse(this.body);
      }
    }
    class MockHeaders {
      constructor(init = {}) {
        this._map = new Map();
        if (init) {
          if (init instanceof MockHeaders || init.entries) {
            for (const [k, v] of Object.entries(init)) {
              this._map.set(k.toLowerCase(), v);
            }
          } else {
            for (const [k, v] of Object.entries(init)) {
              this._map.set(k.toLowerCase(), String(v));
            }
          }
        }
      }
      get(name) {
        return this._map.get(name.toLowerCase()) || null;
      }
      set(name, value) {
        this._map.set(name.toLowerCase(), String(value));
      }
    }
    class MockCookies {
      constructor(init = {}) {
        this._map = new Map();
        if (init) {
          for (const [k, v] of Object.entries(init)) {
            this._map.set(k, { name: k, value: String(v) });
          }
        }
      }
      get(name) {
        return this._map.get(name) || undefined;
      }
      set(name, value, options) {
        this._map.set(name, { name, value, options });
      }
    }
    class MockNextRequest {
      constructor(input, init = {}) {
        this.url = typeof input === 'string' ? input : input.url;
        this.nextUrl = new URL(this.url);
        this.method = init.method || 'GET';
        this.body = init.body;
        this.headers = new MockHeaders(init.headers || {});
        this.cookies = new MockCookies(init.cookies || {});
      }
      async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }
    }
    return { NextResponse: MockNextResponse, NextRequest: MockNextRequest };
  }
  if (request.startsWith('@/')) {
    const rel = request.replace('@/', 'admin/src/');
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

// -----------------------------------------------------------------------------
// Test Harness
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

async function runM1TestSuite() {
  console.log('========================================================================');
  console.log('🛡️ TA12 AUTOMATED TEST SUITE: MILESTONE M1');
  console.log('   Google OAuth Crypto & Admin Zero-Bypass Gate');
  console.log('========================================================================\n');

  const adminGoogleAuth = require(path.join(ADMIN_DIR, 'src', 'lib', 'google-auth.ts'));
  const studentGoogleAuth = require(path.join(ROOT_DIR, 'src', 'lib', 'google-auth.ts'));
  const adminAuth = require(path.join(ADMIN_DIR, 'src', 'lib', 'auth.ts'));
  const loginApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'login', 'route.ts'));
  const statsApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'stats', 'route.ts'));
  const usersApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'users', 'route.ts'));
  const whitelistApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'whitelist', 'route.ts'));
  const googleAuthRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'google', 'route.ts'));
  const callbackRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'callback', 'google', 'route.ts'));
  const { NextRequest } = require('next/server');

  // ---------------------------------------------------------------------------
  // Vector 1: Genuine RS256 JWKS & ID Token Cryptographic Verification
  // ---------------------------------------------------------------------------
  console.log('▶ Vector 1: Genuine RS256 JWKS & ID Token Cryptographic Verification...');

  // Generate real 2048-bit RSA keypair
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const jwk = publicKey.export({ format: 'jwk' });
  const testKid = 'ta12-test-key-2026';
  const testJwk = { ...jwk, kid: testKid, alg: 'RS256', use: 'sig' };
  const testClientId = 'ta12-google-client-id-test.apps.googleusercontent.com';

  // Inject into cached JWKS for both modules
  adminGoogleAuth.setCachedJWKSForTesting({ keys: [testJwk] });
  studentGoogleAuth.setCachedJWKSForTesting({ keys: [testJwk] });

  // Function to create valid test token
  function createTestJwt(payloadOverrides = {}, headerOverrides = {}, keyToSign = privateKey) {
    const header = { alg: 'RS256', kid: testKid, typ: 'JWT', ...headerOverrides };
    const payload = {
      iss: 'https://accounts.google.com',
      aud: testClientId,
      sub: 'google_user_sub_123456789',
      email: 'dot71714@gmail.com',
      email_verified: true,
      name: 'Nguyễn Văn Admin',
      picture: 'https://example.com/avatar.jpg',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      ...payloadOverrides,
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.sign('RSA-SHA256', Buffer.from(`${headerB64}.${payloadB64}`), keyToSign).toString('base64url');

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  // 1.1 Valid Token Verification
  const validToken = createTestJwt();
  const verifiedAdmin = await adminGoogleAuth.verifyGoogleIdToken(validToken, testClientId);
  check('admin verifyGoogleIdToken verifies genuine RS256 signature', Boolean(verifiedAdmin));
  check('admin verifyGoogleIdToken returns correct sub claim', verifiedAdmin.sub === 'google_user_sub_123456789');
  check('admin verifyGoogleIdToken extracts normalized email', verifiedAdmin.email === 'dot71714@gmail.com');
  check('admin verifyGoogleIdToken extracts email_verified=true', verifiedAdmin.email_verified === true);
  check('admin verifyGoogleIdToken extracts profile name', verifiedAdmin.name === 'Nguyễn Văn Admin');

  const verifiedStudent = await studentGoogleAuth.verifyGoogleIdToken(validToken, testClientId);
  check('student verifyGoogleIdToken verifies genuine RS256 signature', Boolean(verifiedStudent));
  check('student verifyGoogleIdToken returns correct email', verifiedStudent.email === 'dot71714@gmail.com');

  // 1.2 Tampered Signature Attack
  const parts = validToken.split('.');
  const tamperedSigToken = `${parts[0]}.${parts[1]}.${parts[2].slice(0, -4)}XXXX`;
  let tamperedSigRejected = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(tamperedSigToken, testClientId);
  } catch (err) {
    tamperedSigRejected = true;
  }
  check('Rejects token with tampered signature (crypto.verify fails)', tamperedSigRejected);

  // 1.3 Forged Payload Attack
  const forgedPayload = Buffer.from(JSON.stringify({
    iss: 'https://accounts.google.com',
    aud: testClientId,
    sub: 'hacker_123',
    email: 'dot71714@gmail.com',
    email_verified: true,
    exp: Math.floor(Date.now() / 1000) + 3600,
  })).toString('base64url');
  const forgedToken = `${parts[0]}.${forgedPayload}.${parts[2]}`;
  let forgedPayloadRejected = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(forgedToken, testClientId);
  } catch {
    forgedPayloadRejected = true;
  }
  check('Rejects forged payload with genuine signature of different payload', forgedPayloadRejected);

  // 1.4 Token with unverified email
  const unverifiedEmailToken = createTestJwt({ email_verified: false });
  let unverifiedRejected = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(unverifiedEmailToken, testClientId);
  } catch (err) {
    unverifiedRejected = err.message.includes('email_verified');
  }
  check('Rejects token with email_verified=false', unverifiedRejected);

  // 1.5 Expired Token Attack
  const expiredToken = createTestJwt({ exp: Math.floor(Date.now() / 1000) - 100 });
  let expiredRejected = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(expiredToken, testClientId);
  } catch (err) {
    expiredRejected = err.message.includes('expired');
  }
  check('Rejects expired token (exp <= now)', expiredRejected);

  // 1.6 Audience Mismatch Attack
  const wrongAudToken = createTestJwt({ aud: 'wrong-client-id.apps.googleusercontent.com' });
  let wrongAudRejected = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(wrongAudToken, testClientId);
  } catch (err) {
    wrongAudRejected = err.message.includes('audience');
  }
  check('Rejects token with mismatched audience', wrongAudRejected);

  // 1.7 Untrusted Issuer Attack
  const wrongIssToken = createTestJwt({ iss: 'https://evil-auth.attacker.com' });
  let wrongIssRejected = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(wrongIssToken, testClientId);
  } catch (err) {
    wrongIssRejected = err.message.includes('issuer');
  }
  check('Rejects token with unauthorized issuer claim', wrongIssRejected);

  // 1.8 Unknown Key ID (kid) Attack
  const { privateKey: rogueKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const rogueKeyToken = createTestJwt({}, { kid: 'rogue-key-id-999' }, rogueKey);
  let rogueKeyRejected = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(rogueKeyToken, testClientId);
  } catch (err) {
    rogueKeyRejected = err.message.includes('kid') || err.message.includes('not found');
  }
  check('Rejects token signed by key not present in JWKS', rogueKeyRejected);

  // ---------------------------------------------------------------------------
  // Vector 2: HMAC-SHA256 CSRF State Token
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 2: HMAC-SHA256 CSRF State Generation, Verification & Expiry...');

  const stateToken = adminGoogleAuth.generateOAuthState({ returnUrl: '/admin', portal: 'admin' });
  check('generateOAuthState returns non-empty base64url string', Boolean(stateToken && typeof stateToken === 'string'));

  const stateVerification = adminGoogleAuth.verifyOAuthState(stateToken);
  check('verifyOAuthState returns valid=true for genuine state', stateVerification.valid === true);
  check('verifyOAuthState extracts original metadata (returnUrl)', stateVerification.data?.returnUrl === '/admin');
  check('verifyOAuthState extracts original metadata (portal)', stateVerification.data?.portal === 'admin');
  check('verifyOAuthState includes random nonce in state payload', Boolean(stateVerification.data?.nonce));

  // Tampered state signature
  const tamperedState = stateToken.slice(0, -5) + 'AAAAA';
  const tamperedStateResult = adminGoogleAuth.verifyOAuthState(tamperedState);
  check('Rejects CSRF state with tampered HMAC signature', tamperedStateResult.valid === false);

  // Expired state (> 10 minutes)
  const expiredStateResult = adminGoogleAuth.verifyOAuthState(stateToken, -1);
  check('Rejects expired CSRF state', expiredStateResult.valid === false);

  // ---------------------------------------------------------------------------
  // Vector 3: Admin Session Token TTL Expiry & Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 3: Admin Session Token TTL Expiry (7-day window) & Verification...');

  const adminToken = adminAuth.signAdminToken('dot71714@gmail.com');
  const verifiedEmail = adminAuth.verifyAdminToken(adminToken);
  check('verifyAdminToken validates genuine fresh token', verifiedEmail === 'dot71714@gmail.com');

  // Tampered admin session token
  const tamperedAdminToken = adminToken.slice(0, -6) + 'ZZZZZZ';
  check('verifyAdminToken rejects tampered signature', adminAuth.verifyAdminToken(tamperedAdminToken) === null);

  // Expired admin token (simulated 8-day-old timestamp)
  const eightDaysAgoTs = Date.now() - (8 * 24 * 60 * 60 * 1000);
  const expiredPayload = `dot71714@gmail.com:${eightDaysAgoTs}`;
  const AUTH_SECRET = process.env.AUTH_SECRET || 'ta12_admin_super_secret_portal_2026';
  const expiredSig = crypto.createHmac('sha256', AUTH_SECRET).update(expiredPayload).digest('hex');
  const expiredAdminToken = Buffer.from(`${expiredPayload}:${expiredSig}`).toString('base64');

  check('verifyAdminToken strictly rejects token older than 7 days (TTL enforced)', adminAuth.verifyAdminToken(expiredAdminToken) === null);

  // ---------------------------------------------------------------------------
  // Vector 4: Superadmin Master Key Login Protection
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 4: Superadmin Master Key Login Protection (Timing-Safe Comparison)...');

  const EXPECTED_KEY = process.env.ADMIN_MASTER_KEY || process.env.ADMIN_PASSWORD || 'ta12_superadmin_secret_key_2026';

  // 4.1 Success with valid Master Key
  const reqValidMaster = new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { masterKey: EXPECTED_KEY },
  });
  const resValidMaster = await loginApi.POST(reqValidMaster);
  const dataValidMaster = await resValidMaster.json();
  check('POST /api/auth/login with valid masterKey returns HTTP 200', resValidMaster.status === 200);
  check('Response success is true', dataValidMaster.success === true);
  check('Response user email is dot71714@gmail.com', dataValidMaster.user?.email === 'dot71714@gmail.com');
  check('Issues secure ta12_admin_session cookie', Boolean(resValidMaster.cookies.get('ta12_admin_session')));

  // 4.2 Rejection with wrong Master Key
  const reqWrongMaster = new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { masterKey: 'incorrect_attacker_password_123' },
  });
  const resWrongMaster = await loginApi.POST(reqWrongMaster);
  check('POST /api/auth/login with incorrect masterKey returns HTTP 401', resWrongMaster.status === 401);

  // 4.3 ZERO-BYPASS: Rejection of unauthenticated email login (old backdoor)
  const reqBackdoor = new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { email: 'dot71714@gmail.com' }, // NO PASSWORD
  });
  const resBackdoor = await loginApi.POST(reqBackdoor);
  check('ZERO-BYPASS: Old email-only login attempt is 100% BLOCKED with HTTP 401', resBackdoor.status === 401);

  // 4.4 Empty body rejection
  const reqEmpty = new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: {},
  });
  const resEmpty = await loginApi.POST(reqEmpty);
  check('Empty request body rejected with HTTP 401', resEmpty.status === 401);

  // ---------------------------------------------------------------------------
  // Vector 5: Admin API Route Protection (stats, users, whitelist)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 5: Admin API Route Protection (HTTP 401 Enforcement)...');

  // Unauthenticated requests (simulating real HTTP request with headers but no session)
  const unauthHeaders = { 'user-agent': 'Mozilla/5.0 Security Scanner' };

  // 5.1 Stats API
  const reqUnauthStats = new NextRequest('http://localhost:3001/api/admin/stats', { headers: unauthHeaders });
  const resUnauthStats = await statsApi.GET(reqUnauthStats);
  check('GET /api/admin/stats without session returns HTTP 401', resUnauthStats.status === 401);

  // 5.2 Users API GET
  const reqUnauthUsers = new NextRequest('http://localhost:3001/api/admin/users', { headers: unauthHeaders });
  const resUnauthUsers = await usersApi.GET(reqUnauthUsers);
  check('GET /api/admin/users without session returns HTTP 401', resUnauthUsers.status === 401);

  // 5.3 Users API PATCH
  const reqUnauthPatch = new NextRequest('http://localhost:3001/api/admin/users', {
    method: 'PATCH',
    headers: unauthHeaders,
    body: { userId: 'usr_dotuan_demo', action: 'approve' },
  });
  const resUnauthPatch = await usersApi.PATCH(reqUnauthPatch);
  check('PATCH /api/admin/users without session returns HTTP 401', resUnauthPatch.status === 401);

  // 5.4 Whitelist API GET
  const reqUnauthWl = new NextRequest('http://localhost:3001/api/admin/whitelist', { headers: unauthHeaders });
  const resUnauthWl = await whitelistApi.GET(reqUnauthWl);
  check('GET /api/admin/whitelist without session returns HTTP 401', resUnauthWl.status === 401);

  // 5.5 Whitelist API POST
  const reqUnauthWlPost = new NextRequest('http://localhost:3001/api/admin/whitelist', {
    method: 'POST',
    headers: unauthHeaders,
    body: { email: 'attacker@evil.com' },
  });
  const resUnauthWlPost = await whitelistApi.POST(reqUnauthWlPost);
  check('POST /api/admin/whitelist without session returns HTTP 401', resUnauthWlPost.status === 401);

  // 5.6 Request with valid Admin Session Cookie succeeds
  const authHeaders = {
    'user-agent': 'Mozilla/5.0 Browser',
    'cookie': `ta12_admin_session=${adminToken}`,
  };
  const reqAuthStats = new NextRequest('http://localhost:3001/api/admin/stats', {
    headers: authHeaders,
    cookies: { ta12_admin_session: adminToken },
  });
  const resAuthStats = await statsApi.GET(reqAuthStats);
  check('GET /api/admin/stats with valid admin cookie returns HTTP 200', resAuthStats.status === 200);

  // ---------------------------------------------------------------------------
  // Vector 6: Admin Google OAuth Routes (Initiation & Callback)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 6: Admin Google OAuth Routes (Consent URL & Callback Gate)...');

  // Test initiation with unconfigured OAuth
  const origClientId = process.env.GOOGLE_CLIENT_ID;
  const origClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  delete process.env.GOOGLE_CLIENT_ID;
  delete process.env.GOOGLE_CLIENT_SECRET;

  const reqInitUnconf = new NextRequest('http://localhost:3001/api/auth/google');
  const resInitUnconf = await googleAuthRoute.GET(reqInitUnconf);
  const unconfRedirect = resInitUnconf.headers.get('location');
  check('/api/auth/google redirects to ?error=oauth_unconfigured when credentials absent',
    Boolean(unconfRedirect && unconfRedirect.includes('error=oauth_unconfigured')));

  // Test initiation with configured OAuth
  process.env.GOOGLE_CLIENT_ID = 'test-client-id-123';
  process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret-123';

  const reqInitConf = new NextRequest('http://localhost:3001/api/auth/google');
  const resInitConf = await googleAuthRoute.GET(reqInitConf);
  const confRedirect = resInitConf.headers.get('location');
  check('/api/auth/google redirects to accounts.google.com consent screen',
    Boolean(confRedirect && confRedirect.includes('accounts.google.com')));
  check('/api/auth/google sets CSRF state cookie',
    Boolean(resInitConf.cookies.get('ta12_admin_oauth_state')));

  // Callback missing code or state
  const reqCbMissing = new NextRequest('http://localhost:3001/api/auth/callback/google');
  const resCbMissing = await callbackRoute.GET(reqCbMissing);
  const missingRedirect = resCbMissing.headers.get('location');
  check('/api/auth/callback/google with missing code/state redirects with error',
    Boolean(missingRedirect && missingRedirect.includes('error=missing_code_or_state')));

  // Callback with tampered state
  const reqCbBadState = new NextRequest('http://localhost:3001/api/auth/callback/google?code=fake_code&state=tampered_state_123');
  const resCbBadState = await callbackRoute.GET(reqCbBadState);
  const badStateRedirect = resCbBadState.headers.get('location');
  check('/api/auth/callback/google with invalid state redirects with error=invalid_state',
    Boolean(badStateRedirect && badStateRedirect.includes('error=invalid_state')));

  // Restore env
  if (origClientId) process.env.GOOGLE_CLIENT_ID = origClientId; else delete process.env.GOOGLE_CLIENT_ID;
  if (origClientSecret) process.env.GOOGLE_CLIENT_SECRET = origClientSecret; else delete process.env.GOOGLE_CLIENT_SECRET;

  // ---------------------------------------------------------------------------
  // Vector 7: Admin UI Static & Structural Integrity Verification
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 7: Admin UI Static & Structural Integrity Verification (page.tsx)...');

  const pageContent = fs.readFileSync(path.join(ADMIN_DIR, 'src', 'app', 'page.tsx'), 'utf8');

  // 1-Click mock login button must NOT exist
  check('No 1-click mock admin button in page.tsx', !pageContent.includes('handleAdminLogin(SUPERADMIN_EMAIL)'));

  // Open email test form must NOT exist
  check('No open email test form in page.tsx', !pageContent.includes('testEmail'));

  // Prominent Google OAuth login button must exist
  check('Prominent "Đăng nhập bằng Google" link to /api/auth/google present',
    pageContent.includes('href="/api/auth/google"') && pageContent.includes('Đăng nhập bằng Google'));

  // Superadmin Master Key password form must exist
  check('Superadmin Master Key password input present',
    pageContent.includes('type="password"') && pageContent.includes('Superadmin Master Key'));

  // 403 Forbidden Security Alert Banner must exist with exact required text
  check('403 Forbidden Security Alert banner present',
    pageContent.includes('403 Forbidden') &&
    pageContent.includes('không có quyền Quản trị viên! Chỉ tài khoản dot71714@gmail.com mới được phép truy cập.'));

  // Preserves existing dashboard elements
  check('Preserves 1-click Approve button', pageContent.includes('Duyệt (Approve)'));
  check('Preserves 1-click Revoke button', pageContent.includes('Thu hồi (Revoke)'));
  check('Preserves Pre-Whitelist section', pageContent.includes('Pre-Whitelist'));
  check('Preserves Metric Cards', pageContent.includes('Đã Phê Duyệt') && pageContent.includes('Chờ Phê Duyệt'));

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 MILESTONE M1 TEST SUMMARY: ${passedTests} / ${totalTests} CHECKS PASSED`);
  console.log('========================================================================\n');

  if (failures.length > 0) {
    console.error(`❌ ${failures.length} ASSERTION(S) FAILED:`);
    failures.forEach((f) => console.error(`  - ${f.desc} (${f.details})`));
    process.exit(1);
  } else {
    console.log('🎉 ALL MILESTONE M1 ZERO-BYPASS & CRYPTO TESTS PASSED WITH 100% SUCCESS!');
    console.log('EMPIRICAL VERDICT: APPROVE\n');
  }
}

runM1TestSuite().catch((err) => {
  console.error('Fatal error running Milestone M1 test suite:', err);
  process.exit(1);
});
