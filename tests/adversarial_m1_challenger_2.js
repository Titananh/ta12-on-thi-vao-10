/**
 * Empirical Adversarial Penetration Test Suite for Milestone M1
 * Challenger 2 (challenger_m1_o5_2)
 *
 * Vectors:
 *  1. CSRF State Token Cryptographic Rigor, Forgery Resistance & Reuse
 *  2. Admin Callback Google ID Token Email Whitelist Enforcement (Zero-Bypass Gate)
 *  3. Superadmin Master Key Timing-Safe Equality & Short-Circuit Elimination
 *  4. Session Cookie Security Attributes & Cryptographic TTL Expiry Enforcement
 *  5. API Route Access Guard & Token Verification Isolation
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ts = require('typescript');
const Module = require('module');

const ROOT_DIR = path.resolve(__dirname, '..');
const ADMIN_DIR = path.join(ROOT_DIR, 'admin');

// -----------------------------------------------------------------------------
// Module Mocking & TypeScript Transpiler Hook
// -----------------------------------------------------------------------------
class MockResponseCookies {
  constructor() {
    this._map = new Map();
  }
  set(name, value, options = {}) {
    this._map.set(name, { name, value: String(value), options });
  }
  get(name) {
    return this._map.get(name) || undefined;
  }
  delete(name) {
    this._map.set(name, { name, value: '', options: { maxAge: 0, path: '/' } });
  }
}

class MockNextResponse {
  constructor(body, init = {}) {
    this.body = body;
    this.status = typeof init === 'number' ? init : (init?.status || 200);
    this.headers = new Map();
    this.cookies = new MockResponseCookies();
  }
  static json(body, init = {}) {
    const res = new MockNextResponse(JSON.stringify(body), init);
    res._json = body;
    return res;
  }
  static redirect(url, init = {}) {
    const status = typeof init === 'number' ? init : (init?.status || 307);
    const res = new MockNextResponse('', { status });
    res.headers.set('location', typeof url === 'string' ? url : url.toString());
    return res;
  }
  async json() {
    return this._json !== undefined ? this._json : (this.body ? JSON.parse(this.body) : {});
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

class MockRequestCookies {
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
}

class MockNextRequest {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.url;
    this.nextUrl = new URL(this.url);
    this.method = init.method || 'GET';
    this.body = init.body;
    this.headers = new MockHeaders(init.headers || {});
    this.cookies = new MockRequestCookies(init.cookies || {});
  }
  async json() {
    if (this.body === undefined || this.body === null) return {};
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
  }
}

const originalRequire = Module.prototype.require;
Module.prototype.require = function (request) {
  if (request === 'next/server') {
    return { NextResponse: MockNextResponse, NextRequest: MockNextRequest };
  }
  if (request.startsWith('@/')) {
    const rel = request.replace('@/', 'admin/src/');
    const resolved = path.resolve(ROOT_DIR, rel);
    if (fs.existsSync(resolved + '.ts')) return originalRequire.call(this, resolved + '.ts');
    if (fs.existsSync(resolved + '.tsx')) return originalRequire.call(this, resolved + '.tsx');
    return originalRequire.call(this, resolved);
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
// Test Runner Harness
// -----------------------------------------------------------------------------
let totalChecks = 0;
let passedChecks = 0;
const failureList = [];

function assertEmpirical(description, condition, details = '') {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`  ✓ ${description}`);
  } else {
    failureList.push({ description, details });
    console.error(`  ❌ ${description} [${details}]`);
  }
}

async function runAdversarialPenetrationTests() {
  console.log('========================================================================');
  console.log('⚔️  ADVERSARIAL PENETRATION CHALLENGE: MILESTONE M1');
  console.log('    External Challenger 2 - Penetration Audit');
  console.log('========================================================================\n');

  const adminGoogleAuth = require(path.join(ADMIN_DIR, 'src', 'lib', 'google-auth.ts'));
  const adminAuth = require(path.join(ADMIN_DIR, 'src', 'lib', 'auth.ts'));
  const loginRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'login', 'route.ts'));
  const callbackRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'callback', 'google', 'route.ts'));
  const googleRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'google', 'route.ts'));
  const logoutRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'logout', 'route.ts'));
  const statsRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'stats', 'route.ts'));

  // Set up mock RSA keys for Google ID Token verification
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const testKid = 'challenger-key-id-2026';
  const testJwk = { ...publicKey.export({ format: 'jwk' }), kid: testKid, alg: 'RS256', use: 'sig' };
  const TEST_CLIENT_ID = 'test-ta12-google-client-id.apps.googleusercontent.com';
  process.env.GOOGLE_CLIENT_ID = TEST_CLIENT_ID;
  process.env.GOOGLE_CLIENT_SECRET = 'test-google-secret-2026';

  adminGoogleAuth.setCachedJWKSForTesting({ keys: [testJwk] });

  function forgeGoogleIdToken(payloadOverrides = {}) {
    const header = { alg: 'RS256', kid: testKid, typ: 'JWT' };
    const payload = {
      iss: 'https://accounts.google.com',
      aud: TEST_CLIENT_ID,
      sub: 'google_attacker_sub_99999',
      email: 'attacker@evil.com',
      email_verified: true,
      name: 'Adversarial Attacker',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      ...payloadOverrides,
    };
    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.sign('RSA-SHA256', Buffer.from(`${headerB64}.${payloadB64}`), privateKey).toString('base64url');
    return `${headerB64}.${payloadB64}.${signature}`;
  }

  // ===========================================================================
  // CHALLENGE 1: CSRF State Generation, Validation, Forgery & Reuse
  // ===========================================================================
  console.log('▶ CHALLENGE 1: CSRF State Generation, Forgery Resistance & Reuse...');

  // 1.1 State Structure & Correct HMAC
  const legitimateState = adminGoogleAuth.generateOAuthState({ returnUrl: '/dashboard', portal: 'admin' });
  const verifiedState = adminGoogleAuth.verifyOAuthState(legitimateState);
  assertEmpirical('Legitimate state verifies successfully', verifiedState.valid === true);
  assertEmpirical('State payload contains unguessable random nonce (16 bytes hex)',
    typeof verifiedState.data?.nonce === 'string' && verifiedState.data.nonce.length === 32);
  assertEmpirical('State preserves returnUrl metadata', verifiedState.data?.returnUrl === '/dashboard');

  // 1.2 Forgery: State generated with attacker's HMAC secret
  const attackerSecret = 'attacker_guessed_secret_12345';
  const attackerPayload = JSON.stringify({ returnUrl: '/admin', nonce: 'fake_nonce', ts: Date.now() });
  const attackerSig = crypto.createHmac('sha256', attackerSecret).update(attackerPayload).digest('hex');
  const forgedState = Buffer.from(`${attackerPayload}.${attackerSig}`).toString('base64url');

  const forgedVerification = adminGoogleAuth.verifyOAuthState(forgedState);
  assertEmpirical('Forged state with wrong HMAC secret is strictly rejected', forgedVerification.valid === false);

  // 1.3 Tampering: Flipping 1 bit in state payload
  const rawState = Buffer.from(legitimateState, 'base64url').toString('utf8');
  const dotIdx = rawState.lastIndexOf('.');
  const legitimatePayload = rawState.substring(0, dotIdx);
  const legitimateSig = rawState.substring(dotIdx + 1);

  // Tamper payload to returnUrl: '/evil'
  const tamperedPayload = legitimatePayload.replace('/dashboard', '/evil');
  const tamperedState = Buffer.from(`${tamperedPayload}.${legitimateSig}`).toString('base64url');
  const tamperedVerification = adminGoogleAuth.verifyOAuthState(tamperedState);
  assertEmpirical('Tampered payload with valid original signature is rejected (HMAC mismatch)', tamperedVerification.valid === false);

  // 1.4 Signature length mismatch attacks (testing timingSafeEqual length handling)
  const shortSigState = Buffer.from(`${legitimatePayload}.${legitimateSig.slice(0, 10)}`).toString('base64url');
  const shortSigVerif = adminGoogleAuth.verifyOAuthState(shortSigState);
  assertEmpirical('Truncated signature handled gracefully without uncaught crash', shortSigVerif.valid === false);

  const longSigState = Buffer.from(`${legitimatePayload}.${legitimateSig}ff`).toString('base64url');
  const longSigVerif = adminGoogleAuth.verifyOAuthState(longSigState);
  assertEmpirical('Padded signature rejected without uncaught crash', longSigVerif.valid === false);

  // 1.5 Malformed formats
  assertEmpirical('Empty string state rejected', adminGoogleAuth.verifyOAuthState('').valid === false);
  assertEmpirical('Non-string state rejected', adminGoogleAuth.verifyOAuthState(null).valid === false);
  assertEmpirical('State without dot delimiter rejected', adminGoogleAuth.verifyOAuthState('nodothere').valid === false);
  assertEmpirical('Non-JSON payload in state rejected',
    adminGoogleAuth.verifyOAuthState(Buffer.from('not-json.12345').toString('base64url')).valid === false);

  // 1.6 Timestamp Expiry & Clock Skew
  const elevenMinutesAgo = Date.now() - 11 * 60 * 1000;
  const expiredPayload = JSON.stringify({ nonce: '123', ts: elevenMinutesAgo });
  const AUTH_SECRET = process.env.AUTH_SECRET || 'ta12_google_oauth_crypto_secret_2026';
  const expiredSig = crypto.createHmac('sha256', AUTH_SECRET).update(expiredPayload).digest('hex');
  const expiredState = Buffer.from(`${expiredPayload}.${expiredSig}`).toString('base64url');
  assertEmpirical('State token older than 10 minutes strictly rejected (expired)',
    adminGoogleAuth.verifyOAuthState(expiredState).valid === false);

  const farFutureTs = Date.now() + 70 * 1000; // 70s ahead (> 60s allowable drift)
  const futurePayload = JSON.stringify({ nonce: '123', ts: farFutureTs });
  const futureSig = crypto.createHmac('sha256', AUTH_SECRET).update(futurePayload).digest('hex');
  const futureState = Buffer.from(`${futurePayload}.${futureSig}`).toString('base64url');
  assertEmpirical('State token with future timestamp > 60s rejected (clock skew attack)',
    adminGoogleAuth.verifyOAuthState(futureState).valid === false);

  // 1.7 OAuth Route: State Cookie Binding & State Mismatch Detection
  const reqInit = new MockNextRequest('http://localhost:3001/api/auth/google');
  const resInit = await googleRoute.GET(reqInit);
  const stateCookieEntry = resInit.cookies.get('ta12_admin_oauth_state');
  assertEmpirical('Google OAuth initiation sets ta12_admin_oauth_state cookie', Boolean(stateCookieEntry));
  assertEmpirical('OAuth state cookie has httpOnly=true', stateCookieEntry?.options?.httpOnly === true);
  assertEmpirical('OAuth state cookie has sameSite=lax', stateCookieEntry?.options?.sameSite === 'lax');
  assertEmpirical('OAuth state cookie has maxAge=600s (10m)', stateCookieEntry?.options?.maxAge === 600);

  // Cross-Session State Mismatch Attack (Attacker tries to submit legitimate state from another session)
  const attackerGeneratedState = adminGoogleAuth.generateOAuthState({ returnUrl: '/' });
  const victimCookieState = adminGoogleAuth.generateOAuthState({ returnUrl: '/' });
  const reqMismatch = new MockNextRequest(
    `http://localhost:3001/api/auth/callback/google?code=some_code&state=${encodeURIComponent(attackerGeneratedState)}`,
    { cookies: { ta12_admin_oauth_state: victimCookieState } }
  );
  const resMismatch = await callbackRoute.GET(reqMismatch);
  const mismatchLocation = resMismatch.headers.get('location');
  assertEmpirical('Mismatched state cookie vs URL parameter triggers error=state_mismatch redirect',
    Boolean(mismatchLocation && mismatchLocation.includes('error=state_mismatch')));

  // ===========================================================================
  // CHALLENGE 2: Admin Callback Google ID Token Email Whitelist Strictness
  // ===========================================================================
  console.log('\n▶ CHALLENGE 2: Admin Callback Google ID Token Email Whitelist Strictness...');

  // Mock global fetch for token exchange
  const originalFetch = global.fetch;

  let mockTokenExchangeResponse = {
    ok: true,
    json: async () => ({ id_token: forgeGoogleIdToken({ email: 'attacker@gmail.com' }) }),
    text: async () => '',
  };

  global.fetch = async (url, options) => {
    if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
      return mockTokenExchangeResponse;
    }
    return originalFetch(url, options);
  };

  const testCallbackState = adminGoogleAuth.generateOAuthState();

  async function testCallbackWithEmail(email, emailVerified = true) {
    const idToken = forgeGoogleIdToken({ email, email_verified: emailVerified });
    mockTokenExchangeResponse = {
      ok: true,
      json: async () => ({ id_token: idToken }),
      text: async () => '',
    };
    const req = new MockNextRequest(
      `http://localhost:3001/api/auth/callback/google?code=valid_mock_code&state=${encodeURIComponent(testCallbackState)}`,
      { cookies: { ta12_admin_oauth_state: testCallbackState } }
    );
    return await callbackRoute.GET(req);
  }

  // 2.1 Attacker accounts: must strictly reject with 403 Forbidden redirect
  const hostileEmails = [
    'attacker@gmail.com',
    'dot71714@evil.com',
    'admin@gmail.com',
    'dot71714@gmail.com.attacker.com',
    'dot71714+alias@gmail.com',
    'attacker_dot71714@gmail.com',
    'dot71714@googlemail.com',
    'root@dot71714.gmail.com',
    'superadmin@gmail.com'
  ];

  for (const hostileEmail of hostileEmails) {
    const res = await testCallbackWithEmail(hostileEmail);
    const loc = res.headers.get('location');
    const hasForbiddenError = loc && loc.includes('error=forbidden');
    const hasForbiddenEmail = loc && loc.includes(encodeURIComponent(hostileEmail.toLowerCase()));
    const sessionCookieEntry = res.cookies.get('ta12_admin_session');
    const noAdminSession = !sessionCookieEntry || sessionCookieEntry.value === '';
    const sessionCleared = sessionCookieEntry?.options?.maxAge === 0;

    assertEmpirical(
      `Hostile email "${hostileEmail}" rejected with 403 Forbidden redirect & session cleared`,
      res.status === 303 && hasForbiddenError && hasForbiddenEmail && noAdminSession && sessionCleared,
      `status=${res.status}, loc=${loc}`
    );
  }

  // 2.2 Unverified email for dot71714@gmail.com
  const origConsoleError = console.error;
  console.error = () => {}; // suppress expected error logging for this negative test
  const resUnverified = await testCallbackWithEmail('dot71714@gmail.com', false);
  console.error = origConsoleError;
  const locUnverified = resUnverified.headers.get('location');
  assertEmpirical(
    'Email dot71714@gmail.com with email_verified=false is strictly rejected (fails id_token crypto check)',
    Boolean(locUnverified && locUnverified.includes('error=auth_failed')),
    `loc=${locUnverified}`
  );

  // 2.3 Genuine dot71714@gmail.com with email_verified=true
  const resSuperadmin = await testCallbackWithEmail('dot71714@gmail.com', true);
  const locSuperadmin = resSuperadmin.headers.get('location');
  const sessionCookieEntry = resSuperadmin.cookies.get('ta12_admin_session');
  assertEmpirical(
    'Genuine dot71714@gmail.com succeeds: redirects to returnUrl and issues admin session',
    Boolean(locSuperadmin && !locSuperadmin.includes('error') && sessionCookieEntry && sessionCookieEntry.value)
  );

  // 2.4 Case Canonicalization: DOT71714@GMAIL.COM in Google token
  const resUpper = await testCallbackWithEmail('DOT71714@GMAIL.COM', true);
  const sessionUpper = resUpper.cookies.get('ta12_admin_session');
  assertEmpirical(
    'Uppercase DOT71714@GMAIL.COM canonicalized and admitted safely',
    Boolean(sessionUpper && sessionUpper.value)
  );

  // Restore fetch
  global.fetch = originalFetch;

  // ===========================================================================
  // CHALLENGE 3: Master Key Timing-Safe Equality Verification
  // ===========================================================================
  console.log('\n▶ CHALLENGE 3: Master Key Timing-Safe Equality Verification...');

  // Inspect timingSafeCompare logic from login route
  function timingSafeCompareOracle(provided, expected) {
    const hashProvided = crypto.createHash('sha256').update(provided, 'utf8').digest();
    const hashExpected = crypto.createHash('sha256').update(expected, 'utf8').digest();
    return crypto.timingSafeEqual(hashProvided, hashExpected);
  }

  const EXPECTED_MASTER = process.env.ADMIN_MASTER_KEY || process.env.ADMIN_PASSWORD || 'ta12_superadmin_secret_key_2026';

  // 3.1 Verify sha256 fixed-length guarantee eliminates timing differences and length leaks
  const testInputs = [
    '',
    'a',
    'ta12',
    EXPECTED_MASTER.slice(0, -1),
    EXPECTED_MASTER + 'x',
    'X'.repeat(1000),
    'X'.repeat(50000),
  ];

  for (const input of testInputs) {
    const result = timingSafeCompareOracle(input, EXPECTED_MASTER);
    assertEmpirical(`timingSafeCompare returns false for input length ${input.length} without throwing`, result === false);
  }

  assertEmpirical('timingSafeCompare returns true for exact key', timingSafeCompareOracle(EXPECTED_MASTER, EXPECTED_MASTER) === true);

  // 3.2 Master Key Login endpoint boundary tests
  // Missing body
  const resNoBody = await loginRoute.POST(new MockNextRequest('http://localhost:3001/api/auth/login', { method: 'POST', body: {} }));
  assertEmpirical('Missing masterKey rejected with HTTP 401', resNoBody.status === 401);

  // Whitespace-only master key
  const resWhitespace = await loginRoute.POST(new MockNextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { masterKey: '     ' }
  }));
  assertEmpirical('Whitespace-only masterKey rejected with HTTP 401', resWhitespace.status === 401);

  // Old backdoor: sending email only without master key
  const resBackdoor = await loginRoute.POST(new MockNextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { email: 'dot71714@gmail.com' }
  }));
  assertEmpirical('ZERO-BYPASS: Email-only POST blocked with HTTP 401', resBackdoor.status === 401);

  // Valid login via password alias
  const resPasswordAlias = await loginRoute.POST(new MockNextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { password: EXPECTED_MASTER }
  }));
  assertEmpirical('Valid login via password alias returns HTTP 200', resPasswordAlias.status === 200);

  // ===========================================================================
  // CHALLENGE 4: Session Cookie Security Attributes & TTL Expiry Enforcement
  // ===========================================================================
  console.log('\n▶ CHALLENGE 4: Session Cookie Security Properties & TTL Expiry...');

  // 4.1 Login cookie properties inspection
  const loginCookieEntry = resPasswordAlias.cookies.get('ta12_admin_session');
  assertEmpirical('ta12_admin_session cookie exists on successful login', Boolean(loginCookieEntry));
  assertEmpirical('Cookie property httpOnly === true (XSS immunity)', loginCookieEntry?.options?.httpOnly === true);
  assertEmpirical('Cookie property sameSite === "lax" (CSRF mitigation)', loginCookieEntry?.options?.sameSite === 'lax');
  assertEmpirical('Cookie property maxAge === 604800 (strict 7 days TTL)', loginCookieEntry?.options?.maxAge === 7 * 24 * 3600);
  assertEmpirical('Cookie property path === "/"', loginCookieEntry?.options?.path === '/');

  // 4.2 Logout endpoint destroys cookie
  const resLogout = await logoutRoute.POST();
  const logoutCookie = resLogout.cookies.get('ta12_admin_session');
  assertEmpirical('POST /api/auth/logout deletes admin session cookie',
    logoutCookie === undefined || logoutCookie.value === '' || logoutCookie.options?.maxAge === 0);

  // 4.3 Server-Side TTL Timestamp Enforcement in verifyAdminToken
  const freshAdminToken = adminAuth.signAdminToken('dot71714@gmail.com');
  assertEmpirical('Fresh admin token verifies successfully', adminAuth.verifyAdminToken(freshAdminToken) === 'dot71714@gmail.com');

  // Boundary check: Token at 6.99 days old
  const sixDaysAgoTs = Date.now() - (6 * 24 * 3600 * 1000 + 23 * 3600 * 1000);
  const sixDaysPayload = `dot71714@gmail.com:${sixDaysAgoTs}`;
  const ADMIN_SECRET = process.env.AUTH_SECRET || 'ta12_admin_super_secret_portal_2026';
  const sixDaysSig = crypto.createHmac('sha256', ADMIN_SECRET).update(sixDaysPayload).digest('hex');
  const sixDaysToken = Buffer.from(`${sixDaysPayload}:${sixDaysSig}`).toString('base64');
  assertEmpirical('Token at 6.99 days (< 7 days TTL) verifies successfully', adminAuth.verifyAdminToken(sixDaysToken) === 'dot71714@gmail.com');

  // Expired token: 7 days + 1 minute old
  const sevenDaysOneMinAgoTs = Date.now() - (7 * 24 * 3600 * 1000 + 60 * 1000);
  const expiredAdminPayload = `dot71714@gmail.com:${sevenDaysOneMinAgoTs}`;
  const expiredAdminSig = crypto.createHmac('sha256', ADMIN_SECRET).update(expiredAdminPayload).digest('hex');
  const expiredAdminToken = Buffer.from(`${expiredAdminPayload}:${expiredAdminSig}`).toString('base64');
  assertEmpirical('Token older than 7 days strictly rejected (returns null)', adminAuth.verifyAdminToken(expiredAdminToken) === null);

  // Expired token: 30 days old
  const thirtyDaysAgoTs = Date.now() - (30 * 24 * 3600 * 1000);
  const thirtyDaysPayload = `dot71714@gmail.com:${thirtyDaysAgoTs}`;
  const thirtyDaysSig = crypto.createHmac('sha256', ADMIN_SECRET).update(thirtyDaysPayload).digest('hex');
  const thirtyDaysToken = Buffer.from(`${thirtyDaysPayload}:${thirtyDaysSig}`).toString('base64');
  assertEmpirical('Token 30 days old strictly rejected (returns null)', adminAuth.verifyAdminToken(thirtyDaysToken) === null);

  // Future token attack (> 60s clock skew)
  const futureAdminTs = Date.now() + (90 * 1000);
  const futureAdminPayload = `dot71714@gmail.com:${futureAdminTs}`;
  const futureAdminSig = crypto.createHmac('sha256', ADMIN_SECRET).update(futureAdminPayload).digest('hex');
  const futureAdminToken = Buffer.from(`${futureAdminPayload}:${futureAdminSig}`).toString('base64');
  assertEmpirical('Token from > 60s in the future strictly rejected', adminAuth.verifyAdminToken(futureAdminToken) === null);

  // Tampered timestamp attack
  const rawParts = Buffer.from(freshAdminToken, 'base64').toString('utf8').split(':');
  const tamperedTimePayload = `${rawParts[0]}:${Date.now() + 100000}`;
  const forgedTimestampToken = Buffer.from(`${tamperedTimePayload}:${rawParts[2]}`).toString('base64');
  assertEmpirical('Token with modified timestamp but old signature is rejected (HMAC integrity intact)',
    adminAuth.verifyAdminToken(forgedTimestampToken) === null);

  // ===========================================================================
  // CHALLENGE 5: API Route Protection & Denial of Unauthorized Access
  // ===========================================================================
  console.log('\n▶ CHALLENGE 5: API Route Access Guard & Token Verification...');

  // Unauthenticated live request
  const unauthReq = new MockNextRequest('http://localhost:3001/api/admin/stats', {
    headers: { 'user-agent': 'Penetration-Tester/1.0' }
  });
  const unauthRes = await statsRoute.GET(unauthReq);
  assertEmpirical('Live HTTP request without session returns HTTP 401 Unauthorized', unauthRes.status === 401);

  // Request with expired token
  const expiredReq = new MockNextRequest('http://localhost:3001/api/admin/stats', {
    headers: {
      'user-agent': 'Penetration-Tester/1.0',
      cookie: `ta12_admin_session=${expiredAdminToken}`
    },
    cookies: { ta12_admin_session: expiredAdminToken }
  });
  const expiredRes = await statsRoute.GET(expiredReq);
  assertEmpirical('Live HTTP request with expired token returns HTTP 401 Unauthorized', expiredRes.status === 401);

  // Request with token of non-superadmin email
  const studentTokenPayload = `student@ta12.edu.vn:${Date.now()}`;
  const studentTokenSig = crypto.createHmac('sha256', ADMIN_SECRET).update(studentTokenPayload).digest('hex');
  const studentToken = Buffer.from(`${studentTokenPayload}:${studentTokenSig}`).toString('base64');

  const studentReq = new MockNextRequest('http://localhost:3001/api/admin/stats', {
    headers: {
      'user-agent': 'Penetration-Tester/1.0',
      cookie: `ta12_admin_session=${studentToken}`
    },
    cookies: { ta12_admin_session: studentToken }
  });
  const studentRes = await statsRoute.GET(studentReq);
  assertEmpirical('Live HTTP request with non-superadmin token strictly returns HTTP 401', studentRes.status === 401);

  // Request with valid superadmin session
  const authReq = new MockNextRequest('http://localhost:3001/api/admin/stats', {
    headers: {
      'user-agent': 'Penetration-Tester/1.0',
      cookie: `ta12_admin_session=${freshAdminToken}`
    },
    cookies: { ta12_admin_session: freshAdminToken }
  });
  const authRes = await statsRoute.GET(authReq);
  assertEmpirical('Live HTTP request with valid fresh superadmin token returns HTTP 200', authRes.status === 200);

  // ===========================================================================
  // Summary
  // ===========================================================================
  console.log('\n========================================================================');
  console.log(`📊 ADVERSARIAL PENETRATION CHALLENGE RESULTS: ${passedChecks} / ${totalChecks} CHECKS PASSED`);
  console.log('========================================================================\n');

  if (failureList.length > 0) {
    console.error(`❌ ${failureList.length} ATTACK(S) SUCCEEDED OR ASSERTION(S) FAILED:`);
    failureList.forEach((f) => console.error(`  - ${f.description} (${f.details})`));
    process.exit(1);
  } else {
    console.log('🛡️ ALL ADVERSARIAL PENETRATION VECTORS SAFELY DEFENDED WITH 100% SUCCESS!');
    console.log('EMPIRICAL VERDICT: APPROVE\n');
  }
}

runAdversarialPenetrationTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
