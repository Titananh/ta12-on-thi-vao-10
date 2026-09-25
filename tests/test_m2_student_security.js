/**
 * TA12 Automated Test Suite: Milestone 2 (M2)
 * Student Web Security, Google OAuth Verification & Access Guard Hardening
 *
 * Vectors:
 *  1. Public UI Backdoor Removal in LoginModal.tsx (Zero email form, Zero persona buttons)
 *  2. Student Google OAuth Initiation Route (/api/auth/google) with HMAC State
 *  3. Student Google OAuth Callback Route (/api/auth/callback/google) with Cryptographic Verification
 *  4. SQLite Upsert Status Enforcement (pending for new users, approved for pre-whitelist)
 *  5. Server-side Protection on /exam/[examId]/page.tsx (Gated against unauth, pending, rejected)
 *  6. Client-side Protection & Invariant Preservation on /practice/[topicId]/page.tsx
 *  7. Strict Progress API Protection (/api/progress) with HTTP 401/403 status enforcement
 *  8. Documentation & Environment Configuration Audit (GOOGLE_OAUTH_SETUP.md, .env.example)
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
global.__mockCookies = {};

Module.prototype.require = function (request) {
  if (request === 'next/headers') {
    return {
      cookies: () => ({
        get: (name) => (global.__mockCookies?.[name] ? { name, value: global.__mockCookies[name] } : undefined),
        set: (name, val) => {
          if (!global.__mockCookies) global.__mockCookies = {};
          global.__mockCookies[name] = val;
        },
      }),
    };
  }

  if (request === 'next/server') {
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
            this._map.set(k, { name: k, value: typeof v === 'object' ? v.value : String(v), options: typeof v === 'object' ? v.options : {} });
          }
        }
      }
      get(name) {
        return this._map.get(name) || undefined;
      }
      set(name, value, options) {
        const entry = { name, value, options };
        this._map.set(name, entry);
        return entry;
      }
    }
    class MockNextResponse {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
        this.headers = new MockHeaders(init.headers || {});
        this.cookies = new MockCookies();
      }
      static json(body, init = {}) {
        const res = new MockNextResponse(JSON.stringify(body), init);
        res._json = body;
        return res;
      }
      static redirect(url, init = {}) {
        const res = new MockNextResponse('', { status: typeof init === 'number' ? init : init?.status || 307 });
        res.headers.set('location', typeof url === 'string' ? url : url.toString());
        return res;
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
        this.headers = new MockHeaders(init.headers || {});
        this.cookies = new MockCookies(init.cookies || {});
      }
      async json() {
        return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
      }
    }
    return { NextResponse: MockNextResponse, NextRequest: MockNextRequest };
  }

  if (request === 'next/navigation') {
    return {
      notFound: () => {
        const err = new Error('NEXT_NOT_FOUND');
        err.digest = 'NEXT_NOT_FOUND';
        throw err;
      },
      useParams: () => ({ topicId: '15244' }),
      useRouter: () => ({ push: () => {}, replace: () => {} }),
      useSearchParams: () => new URLSearchParams(),
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

// -----------------------------------------------------------------------------
// Crypto RSA Key Generator for Offline JWKS Testing
// -----------------------------------------------------------------------------
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const exportedJwk = publicKey.export({ format: 'jwk' });
const TEST_KID = 'ta12-student-m2-test-key-id';
exportedJwk.kid = TEST_KID;
exportedJwk.alg = 'RS256';
exportedJwk.use = 'sig';

function makeJwt(payloadOverrides = {}, customKid = TEST_KID, signerKey = privateKey) {
  const header = { alg: 'RS256', typ: 'JWT', kid: customKid };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: 'https://accounts.google.com',
    aud: process.env.GOOGLE_CLIENT_ID || 'ta12-test-client-id.apps.googleusercontent.com',
    sub: 'google_sub_' + Math.random().toString(36).substring(2, 10),
    email: 'student_m2_test@gmail.com',
    email_verified: true,
    name: 'Student M2 Tester',
    picture: 'https://lh3.googleusercontent.com/a/student-avatar.jpg',
    iat: now,
    exp: now + 3600,
    ...payloadOverrides,
  };

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.sign('RSA-SHA256', Buffer.from(`${headerB64}.${payloadB64}`), signerKey);
  const signatureB64 = signature.toString('base64url');

  return `${headerB64}.${payloadB64}.${signatureB64}`;
}

async function runM2TestSuite() {
  console.log('========================================================================');
  console.log('🛡️ TA12 AUTOMATED TEST SUITE: MILESTONE M2');
  console.log('   Student Web Security, Google OAuth Verification & Access Control');
  console.log('========================================================================\n');

  const { NextRequest } = require('next/server');
  const googleAuth = require('@/lib/google-auth');
  const dbModule = require('@/lib/db');
  const authModule = require('@/lib/auth');
  const googleAuthRoute = require('@/app/api/auth/google/route');
  const callbackRoute = require('@/app/api/auth/callback/google/route');
  const progressRoute = require('@/app/api/progress/route');
  const examPageRoute = require('@/app/exam/[examId]/page');
  const React = require('react');
  const ReactDOMServer = require('react-dom/server');

  // Inject local JWKS mock for offline self-containment
  googleAuth.setCachedJWKSForTesting({ keys: [exportedJwk] });

  // ---------------------------------------------------------------------------
  // VECTOR 1: Public UI Backdoor Removal in LoginModal.tsx
  // ---------------------------------------------------------------------------
  console.log('▶ Vector 1: Public UI Backdoor Removal in LoginModal.tsx...');
  const loginModalPath = path.join(ROOT_DIR, 'src', 'components', 'LoginModal.tsx');
  check('LoginModal.tsx exists', fs.existsSync(loginModalPath));

  const modalSource = fs.readFileSync(loginModalPath, 'utf8');

  // Invariant 1: No open email input form
  check('LoginModal has zero input type="email"', !modalSource.includes('type="email"'));
  check('LoginModal has zero input type="password"', !modalSource.includes('type="password"'));
  check('LoginModal has zero "Hoặc đăng nhập bằng Email"', !modalSource.includes('Hoặc đăng nhập bằng Email'));

  // Invariant 2: No persona selection or mock login submission
  check('LoginModal has zero fetch to /api/auth/mock-login', !modalSource.includes('/api/auth/mock-login'));
  check('LoginModal has zero persona selection buttons', !modalSource.includes('persona'));

  // Invariant 3: Single primary login button is Google OAuth
  check('LoginModal contains Google login link with href="/api/auth/google"',
    modalSource.includes('href="/api/auth/google"'));
  check('LoginModal displays "Đăng nhập bằng Google"',
    modalSource.includes('Đăng nhập bằng Google') || modalSource.includes('Đăng nhập bằng tài khoản Google'));

  // Invariant 4: Explanatory text regarding admin approval
  check('LoginModal mentions admin approval for new accounts',
    modalSource.includes('dot71714@gmail.com') && modalSource.includes('chờ duyệt'));

  // ---------------------------------------------------------------------------
  // VECTOR 2: Student Google OAuth Route (/api/auth/google)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 2: Student Google OAuth Initiation Route (/api/auth/google)...');
  const origClientId = process.env.GOOGLE_CLIENT_ID;
  const origClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const origNodeEnv = process.env.NODE_ENV;

  // 2.1 Credentials unconfigured in dev/offline environment -> fallback mock
  delete process.env.GOOGLE_CLIENT_ID;
  delete process.env.GOOGLE_CLIENT_SECRET;
  process.env.NODE_ENV = 'development';

  const reqUnconfDev = new NextRequest('http://localhost:3000/api/auth/google?returnUrl=/exam/19142');
  const resUnconfDev = await googleAuthRoute.GET(reqUnconfDev);
  const unconfDevLocation = resUnconfDev.headers.get('location');
  check('Dev fallback without credentials redirects to mock-login with returnUrl',
    Boolean(unconfDevLocation && unconfDevLocation.includes('/api/auth/mock-login') && decodeURIComponent(unconfDevLocation).includes('/exam/19142')));

  // 2.2 Credentials unconfigured in production environment -> error flag
  process.env.NODE_ENV = 'production';
  const reqUnconfProd = new NextRequest('http://localhost:3000/api/auth/google');
  const resUnconfProd = await googleAuthRoute.GET(reqUnconfProd);
  const unconfProdLocation = resUnconfProd.headers.get('location');
  check('Prod without credentials redirects to error=oauth_unconfigured',
    Boolean(unconfProdLocation && unconfProdLocation.includes('auth_error=oauth_unconfigured')));

  // 2.3 Credentials configured -> generates HMAC CSRF state & redirects to Google
  process.env.GOOGLE_CLIENT_ID = 'test-client-id-123.apps.googleusercontent.com';
  process.env.GOOGLE_CLIENT_SECRET = 'test-client-secret-xyz';

  const reqConf = new NextRequest('http://localhost:3000/api/auth/google?returnUrl=/practice/15244');
  const resConf = await googleAuthRoute.GET(reqConf);
  const confLocation = resConf.headers.get('location');

  check('Redirects to Google OAuth authorization endpoint',
    Boolean(confLocation && confLocation.includes('accounts.google.com/o/oauth2/v2/auth')));
  check('Includes configured client_id in URL params',
    Boolean(confLocation && confLocation.includes('test-client-id-123')));
  check('Includes response_type=code',
    Boolean(confLocation && confLocation.includes('response_type=code')));
  check('Includes scope=openid',
    Boolean(confLocation && confLocation.includes('scope=openid')));

  // Extract state param from redirect URL
  const stateUrl = new URL(confLocation);
  const stateParam = stateUrl.searchParams.get('state');
  check('State param is present in authorization URL', Boolean(stateParam));

  const stateVerification = googleAuth.verifyOAuthState(stateParam);
  check('State param is validly HMAC signed', stateVerification.valid === true);
  check('State preserves original returnUrl /practice/15244', stateVerification.data?.returnUrl === '/practice/15244');
  check('State metadata indicates portal="student"', stateVerification.data?.portal === 'student');

  // Verify CSRF state cookie is set
  const stateCookie = resConf.cookies.get('ta12_oauth_state');
  check('Sets HTTP-only ta12_oauth_state cookie', Boolean(stateCookie));
  check('ta12_oauth_state cookie matches state param', stateCookie?.value === stateParam);

  // ---------------------------------------------------------------------------
  // VECTOR 3: Student Google OAuth Callback Route (/api/auth/callback/google)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 3: Student Google OAuth Callback Route (/api/auth/callback/google)...');

  // 3.1 Missing code or state
  const reqCbMissing = new NextRequest('http://localhost:3000/api/auth/callback/google');
  const resCbMissing = await callbackRoute.GET(reqCbMissing);
  check('Missing code/state redirects with auth_error=missing_code_or_state',
    resCbMissing.headers.get('location')?.includes('auth_error=missing_code_or_state'));

  // 3.2 Invalid or tampered state
  const reqCbTampered = new NextRequest('http://localhost:3000/api/auth/callback/google?code=fake_code&state=bad_tampered_state');
  const resCbTampered = await callbackRoute.GET(reqCbTampered);
  check('Tampered state redirects with auth_error=invalid_state',
    resCbTampered.headers.get('location')?.includes('auth_error=invalid_state'));

  // 3.3 State cookie mismatch
  const legitState = googleAuth.generateOAuthState({ returnUrl: '/exam/19142' });
  const reqCbMismatch = new NextRequest(
    `http://localhost:3000/api/auth/callback/google?code=fake_code&state=${legitState}`,
    { cookies: { ta12_oauth_state: 'different_cookie_value' } }
  );
  const resCbMismatch = await callbackRoute.GET(reqCbMismatch);
  check('State cookie mismatch redirects with auth_error=state_mismatch',
    resCbMismatch.headers.get('location')?.includes('auth_error=state_mismatch'));

  // Mock global.fetch for Google token exchange
  const originalFetch = global.fetch;
  try {
    // 3.4 Token exchange failure
    global.fetch = async (url) => {
      if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
        return { ok: false, status: 400, text: async () => 'invalid_grant' };
      }
      return originalFetch(url);
    };

    const reqCbFailedEx = new NextRequest(
      `http://localhost:3000/api/auth/callback/google?code=bad_code&state=${legitState}`,
      { cookies: { ta12_oauth_state: legitState } }
    );
    const resCbFailedEx = await callbackRoute.GET(reqCbFailedEx);
    check('Failed token exchange redirects with auth_error=token_exchange_failed',
      resCbFailedEx.headers.get('location')?.includes('auth_error=token_exchange_failed'));

    // 3.5 Unverified email in id_token
    const unverifiedIdToken = makeJwt({ email: 'unverified_student@gmail.com', email_verified: false });
    global.fetch = async (url) => {
      if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ id_token: unverifiedIdToken, access_token: 'acc_token' }),
        };
      }
      return originalFetch(url);
    };

    const reqCbUnverified = new NextRequest(
      `http://localhost:3000/api/auth/callback/google?code=code_1&state=${legitState}`,
      { cookies: { ta12_oauth_state: legitState } }
    );
    const resCbUnverified = await callbackRoute.GET(reqCbUnverified);
    check('id_token with email_verified=false is rejected (auth_error=auth_failed)',
      resCbUnverified.headers.get('location')?.includes('auth_error=auth_failed'));

    // 3.6 Expired id_token
    const expiredIdToken = makeJwt({ exp: Math.floor(Date.now() / 1000) - 300 });
    global.fetch = async (url) => {
      if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ id_token: expiredIdToken, access_token: 'acc_token' }),
        };
      }
      return originalFetch(url);
    };

    const reqCbExpired = new NextRequest(
      `http://localhost:3000/api/auth/callback/google?code=code_2&state=${legitState}`,
      { cookies: { ta12_oauth_state: legitState } }
    );
    const resCbExpired = await callbackRoute.GET(reqCbExpired);
    check('Expired id_token is rejected',
      resCbExpired.headers.get('location')?.includes('auth_error=auth_failed'));

    // 3.7 Valid Google login for NEW regular student -> Status MUST BE PENDING!
    const newStudentEmail = `new_student_${Date.now()}@gmail.com`;
    const legitNewIdToken = makeJwt({
      email: newStudentEmail,
      name: 'Học sinh Mới Tham gia',
      picture: 'https://lh3.googleusercontent.com/avatar.jpg',
    });

    global.fetch = async (url) => {
      if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ id_token: legitNewIdToken, access_token: 'valid_acc' }),
        };
      }
      return originalFetch(url);
    };

    const reqCbNew = new NextRequest(
      `http://localhost:3000/api/auth/callback/google?code=code_new&state=${legitState}`,
      { cookies: { ta12_oauth_state: legitState } }
    );
    const resCbNew = await callbackRoute.GET(reqCbNew);

    check('Valid Google login redirects to destination returnUrl',
      resCbNew.headers.get('location')?.includes('/exam/19142'));

    const sessionCookie = resCbNew.cookies.get(authModule.SESSION_COOKIE_NAME);
    check('Issues ta12_session cookie', Boolean(sessionCookie?.value));

    // Verify user record in SQLite
    const createdUserId = authModule.verifySessionToken(sessionCookie.value);
    check('Session cookie is genuinely verifiable', Boolean(createdUserId));

    const userInDb = dbModule.getUserById(createdUserId);
    check('User was successfully upserted into SQLite', Boolean(userInDb));
    check('New user email matches verified token email', userInDb.email === newStudentEmail);
    check('NEW USER STATUS IS STRICTLY PENDING!', userInDb.status === 'pending');
    check('New user approved_at is null', userInDb.approved_at === null);

    // Verify state cookie was cleared
    const clearedStateCookie = resCbNew.cookies.get('ta12_oauth_state');
    check('Clears ta12_oauth_state cookie on completion', clearedStateCookie?.options?.maxAge === 0);

    // 3.8 Valid Google login for PRE-WHITELISTED student -> Status MUST BE APPROVED!
    const whitelistedEmail = `whitelisted_${Date.now()}@ta12.edu.vn`;
    const db = dbModule.getDb();
    db.prepare('INSERT INTO pre_whitelist (email, notes) VALUES (?, ?)').run(whitelistedEmail, 'Pre-whitelisted VIP');

    const legitVipIdToken = makeJwt({
      email: whitelistedEmail,
      name: 'Học sinh VIP Tự Động Duyệt',
    });

    global.fetch = async (url) => {
      if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ id_token: legitVipIdToken, access_token: 'valid_acc' }),
        };
      }
      return originalFetch(url);
    };

    const reqCbVip = new NextRequest(
      `http://localhost:3000/api/auth/callback/google?code=code_vip&state=${legitState}`,
      { cookies: { ta12_oauth_state: legitState } }
    );
    const resCbVip = await callbackRoute.GET(reqCbVip);
    const vipSessionCookie = resCbVip.cookies.get(authModule.SESSION_COOKIE_NAME);
    const vipUserId = authModule.verifySessionToken(vipSessionCookie.value);
    const vipUserInDb = dbModule.getUserById(vipUserId);

    check('PRE-WHITELISTED USER STATUS IS AUTOMATICALLY APPROVED!', vipUserInDb.status === 'approved');
    check('Pre-whitelisted user has valid approved_at timestamp', Boolean(vipUserInDb.approved_at));

    // Clean up transient test users from DB
    if (createdUserId) {
      db.prepare('DELETE FROM users WHERE id = ?').run(createdUserId);
      db.prepare('DELETE FROM user_progress WHERE user_id = ?').run(createdUserId);
    }
    if (vipUserId) {
      db.prepare('DELETE FROM users WHERE id = ?').run(vipUserId);
      db.prepare('DELETE FROM user_progress WHERE user_id = ?').run(vipUserId);
      db.prepare('DELETE FROM pre_whitelist WHERE email = ?').run(whitelistedEmail);
    }
  } finally {
    global.fetch = originalFetch;
    if (origClientId) process.env.GOOGLE_CLIENT_ID = origClientId; else delete process.env.GOOGLE_CLIENT_ID;
    if (origClientSecret) process.env.GOOGLE_CLIENT_SECRET = origClientSecret; else delete process.env.GOOGLE_CLIENT_SECRET;
    if (origNodeEnv) process.env.NODE_ENV = origNodeEnv; else delete process.env.NODE_ENV;
  }

  // ---------------------------------------------------------------------------
  // VECTOR 4: Protected Progress API (/api/progress)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 4: Protected Progress API (/api/progress) Status Enforcement...');

  // 4.1 Unauthenticated requests
  global.__mockCookies = {};
  const resUnauthGet = await progressRoute.GET();
  check('GET /api/progress rejects unauthenticated with HTTP 401', resUnauthGet.status === 401);

  const reqUnauthPost = new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: 5 },
  });
  const resUnauthPost = await progressRoute.POST(reqUnauthPost);
  check('POST /api/progress rejects unauthenticated with HTTP 401', resUnauthPost.status === 401);

  // 4.2 Pending user requests
  const pendingToken = authModule.signSessionToken('usr_pending_demo');
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: pendingToken };

  const resPendingGet = await progressRoute.GET();
  check('GET /api/progress rejects pending user with HTTP 403 Forbidden', resPendingGet.status === 403);
  const jsonPendingGet = await resPendingGet.json();
  check('Error message states "Access denied: Account pending admin approval"',
    jsonPendingGet.error === 'Access denied: Account pending admin approval');

  const reqPendingPost = new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: 5 },
  });
  const resPendingPost = await progressRoute.POST(reqPendingPost);
  check('POST /api/progress rejects pending user with HTTP 403 Forbidden', resPendingPost.status === 403);
  const jsonPendingPost = await resPendingPost.json();
  check('POST error message states "Access denied: Account pending admin approval"',
    jsonPendingPost.error === 'Access denied: Account pending admin approval');

  // 4.3 Rejected user requests
  const rejectedUserId = 'usr_test_rejected_' + Date.now();
  const db = dbModule.getDb();
  db.prepare(`
    INSERT INTO users (id, google_id, email, name, status, created_at, last_login_at)
    VALUES (?, ?, ?, ?, 'rejected', datetime('now'), datetime('now'))
  `).run(rejectedUserId, 'gid_rej_' + Date.now(), `rej_${Date.now()}@ta12.edu.vn`, 'Rejected User');

  const rejectedToken = authModule.signSessionToken(rejectedUserId);
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: rejectedToken };

  const resRejectedGet = await progressRoute.GET();
  check('GET /api/progress rejects rejected user with HTTP 403 Forbidden', resRejectedGet.status === 403);

  const reqRejectedPost = new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: 5 },
  });
  const resRejectedPost = await progressRoute.POST(reqRejectedPost);
  check('POST /api/progress rejects rejected user with HTTP 403 Forbidden', resRejectedPost.status === 403);

  // 4.4 Approved user requests
  const approvedToken = authModule.signSessionToken('usr_dotuan_demo');
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: approvedToken };

  const resApprovedGet = await progressRoute.GET();
  check('GET /api/progress allows approved user (HTTP 200)', resApprovedGet.status === 200);

  const reqApprovedPost = new NextRequest('http://localhost:3000/api/progress', {
    method: 'POST',
    body: { streak_flame: 3, diamonds: 50 },
  });
  const resApprovedPost = await progressRoute.POST(reqApprovedPost);
  check('POST /api/progress allows approved user (HTTP 200)', resApprovedPost.status === 200);

  // ---------------------------------------------------------------------------
  // VECTOR 5: Route Protection on /exam/[examId]/page.tsx
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 5: Route Protection on /exam/[examId]/page.tsx...');

  // 5.1 Unauthenticated visitor to /exam/19142
  global.__mockCookies = {};
  const unauthExamComponent = await examPageRoute.default({ params: { examId: '19142' } });
  const unauthExamHtml = ReactDOMServer.renderToStaticMarkup(unauthExamComponent);

  check('Unauthenticated /exam/19142 does NOT render ExamRunner',
    !unauthExamHtml.includes('Rời phòng thi') && !unauthExamHtml.includes('Nộp bài'));
  check('Unauthenticated /exam/19142 renders locked access notice',
    unauthExamHtml.includes('Yêu cầu đăng nhập &amp; Phê duyệt') || unauthExamHtml.includes('Yêu cầu đăng nhập & Phê duyệt'));
  check('Unauthenticated /exam/19142 provides "Đăng nhập bằng Google" link',
    unauthExamHtml.includes('href="/api/auth/google"') && unauthExamHtml.includes('Đăng nhập bằng Google'));

  // 5.2 Pending student accessing /exam/19142
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: pendingToken };
  const pendingExamComponent = await examPageRoute.default({ params: { examId: '19142' } });
  const pendingExamHtml = ReactDOMServer.renderToStaticMarkup(pendingExamComponent);

  check('Pending user /exam/19142 does NOT render ExamRunner',
    !pendingExamHtml.includes('Rời phòng thi') && !pendingExamHtml.includes('Nộp bài'));
  check('Pending user /exam/19142 renders ApprovalWaitingScreen',
    pendingExamHtml.includes('ĐANG CHỜ PHÊ DUYỆT TÀI KHOẢN'));
  check('Pending user /exam/19142 renders student name "Nguyễn Văn An"',
    pendingExamHtml.includes('Nguyễn Văn An'));

  // 5.3 Rejected student accessing /exam/19142
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: rejectedToken };
  const rejectedExamComponent = await examPageRoute.default({ params: { examId: '19142' } });
  const rejectedExamHtml = ReactDOMServer.renderToStaticMarkup(rejectedExamComponent);

  check('Rejected user /exam/19142 does NOT render ExamRunner',
    !rejectedExamHtml.includes('Rời phòng thi'));
  check('Rejected user /exam/19142 renders "Quyền truy cập bị từ chối"',
    rejectedExamHtml.includes('Quyền truy cập bị từ chối'));

  // 5.4 Approved student accessing /exam/19142
  global.__mockCookies = { [authModule.SESSION_COOKIE_NAME]: approvedToken };
  const approvedExamComponent = await examPageRoute.default({ params: { examId: '19142' } });
  const approvedExamHtml = ReactDOMServer.renderToStaticMarkup(approvedExamComponent);

  check('Approved student /exam/19142 successfully renders ExamRunner',
    approvedExamHtml.includes('Rời phòng thi') && approvedExamHtml.includes('Nộp bài'));

  // Clean up transient rejected test user so database remains pristine
  db.prepare('DELETE FROM users WHERE id = ?').run(rejectedUserId);
  db.prepare('DELETE FROM user_progress WHERE user_id = ?').run(rejectedUserId);

  // ---------------------------------------------------------------------------
  // VECTOR 6: Route Protection on /practice/[topicId]/page.tsx
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 6: Route Protection & Invariant Preservation on Practice Page...');
  const practiceFilePath = path.join(ROOT_DIR, 'src', 'app', 'practice', '[topicId]', 'page.tsx');
  const practiceContent = fs.readFileSync(practiceFilePath, 'utf8');

  // Static checks on access guard structure
  check('Practice page imports useAuthProgress from ProgressSyncProvider',
    practiceContent.includes('useAuthProgress'));
  check('Practice page imports ApprovalWaitingScreen',
    practiceContent.includes('ApprovalWaitingScreen'));
  check('Practice page checks user.status !== "approved"',
    practiceContent.includes('user.status !== \'approved\'') || practiceContent.includes('user.status !== "approved"'));
  check('Practice page renders ApprovalWaitingScreen when pending',
    practiceContent.includes('<ApprovalWaitingScreen user={user}'));
  check('Practice page renders locked notice when unauthenticated or rejected',
    practiceContent.includes('Chủ điểm ôn luyện bị khóa') || practiceContent.includes('Quyền truy cập bị từ chối'));

  // Invariant preservation from original requirements
  check('Practice page preserves #22be34 green correct border', practiceContent.includes('border-[#22be34]'));
  check('Practice page preserves #db2828 red wrong border', practiceContent.includes('border-[#db2828]'));
  check('Practice page preserves Amber 1-retry warning banner', practiceContent.includes('border-t-amber-500'));
  check('Practice page preserves Sliding Translation Drawer "文 Xem bản dịch"',
    practiceContent.includes('text-emerald-300 font-serif text-sm">文</span>'));
  check('Practice page preserves Zero TAK12 branding violations', !practiceContent.includes('TAK12'));

  // ---------------------------------------------------------------------------
  // VECTOR 7: Documentation & Environment Variable Audit
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 7: Documentation & Environment Variable Audit...');
  const oauthDocPath = path.join(ROOT_DIR, 'docs', 'GOOGLE_OAUTH_SETUP.md');
  check('docs/GOOGLE_OAUTH_SETUP.md exists', fs.existsSync(oauthDocPath));

  const docContent = fs.readFileSync(oauthDocPath, 'utf8');
  check('Doc contains Google Cloud Console setup instructions',
    docContent.includes('Google Cloud Console') && docContent.includes('OAuth consent screen'));
  check('Doc documents redirect URI for Port 3000 (Student Web)',
    docContent.includes('http://localhost:3000/api/auth/callback/google'));
  check('Doc documents redirect URI for Port 3001 (Admin Portal)',
    docContent.includes('http://localhost:3001/api/auth/callback/google'));
  check('Doc documents GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET',
    docContent.includes('GOOGLE_CLIENT_ID') && docContent.includes('GOOGLE_CLIENT_SECRET'));
  check('Doc explains RS256 JWKS cryptographic token verification',
    docContent.includes('RS256') && docContent.includes('JWKS'));
  check('Doc explains Admin zero-bypass and student approval flow',
    docContent.includes('dot71714@gmail.com') && docContent.includes('pending'));

  // Environment file audits
  const rootEnvExample = fs.readFileSync(path.join(ROOT_DIR, '.env.example'), 'utf8');
  check('Root .env.example contains GOOGLE_CLIENT_ID', rootEnvExample.includes('GOOGLE_CLIENT_ID'));
  check('Root .env.example contains GOOGLE_CLIENT_SECRET', rootEnvExample.includes('GOOGLE_CLIENT_SECRET'));
  check('Root .env.example contains AUTH_SECRET', rootEnvExample.includes('AUTH_SECRET'));
  check('Root .env.example contains SUPERADMIN_EMAIL', rootEnvExample.includes('SUPERADMIN_EMAIL'));

  const adminEnvExamplePath = path.join(ADMIN_DIR, '.env.example');
  check('admin/.env.example exists', fs.existsSync(adminEnvExamplePath));
  const adminEnvExample = fs.readFileSync(adminEnvExamplePath, 'utf8');
  check('admin/.env.example contains GOOGLE_CLIENT_ID', adminEnvExample.includes('GOOGLE_CLIENT_ID'));
  check('admin/.env.example contains GOOGLE_CLIENT_SECRET', adminEnvExample.includes('GOOGLE_CLIENT_SECRET'));
  check('admin/.env.example contains AUTH_SECRET', adminEnvExample.includes('AUTH_SECRET'));
  check('admin/.env.example contains SUPERADMIN_EMAIL', adminEnvExample.includes('SUPERADMIN_EMAIL'));

  // ===========================================================================
  // SUMMARY REPORT
  // ===========================================================================
  console.log('\n========================================================================');
  console.log(`📊 MILESTONE M2 TEST SUMMARY: ${passedTests} / ${totalTests} CHECKS PASSED`);
  console.log('========================================================================\n');

  if (failures.length > 0) {
    console.error(`❌ ${failures.length} FAILURE(S) ENCOUNTERED:`);
    failures.forEach((f, i) => console.error(`  ${i + 1}. ${f.desc} ${f.details}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL MILESTONE M2 STUDENT SECURITY TESTS PASSED WITH 100% SUCCESS!');
    console.log('EMPIRICAL VERDICT: APPROVE');
    process.exit(0);
  }
}

runM2TestSuite().catch((err) => {
  console.error('Fatal test error in M2 suite:', err);
  process.exit(1);
});
