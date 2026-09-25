/**
 * TA12 Adversarial Challenger Test Suite: Milestone 1 (M1)
 * Rigorous Security & Penetration Verification:
 *  Vector 1: verifyGoogleIdToken Cryptographic Verification & Claim Forgery Attacks
 *  Vector 2: /api/auth/login Master Key Bypass, SQLi & Object Injection Attacks
 *  Vector 3: admin/src/app/page.tsx Zero-Bypass UI Audit (No mock/bypass/open email)
 *  Vector 4: /api/admin/* Route Guards against Missing, Forged, and Expired Cookies
 *  Vector 5: /api/auth/callback/google Zero-Bypass Gate against Non-Admin Google Accounts
 */

const fs = require('fs');
const path = require('path');
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
    class MockResponseCookies {
      constructor() {
        this._map = new Map();
      }
      get(name) {
        return this._map.get(name);
      }
      set(name, value, options) {
        this._map.set(name, { name, value, options });
      }
    }
    class MockNextResponse {
      constructor(body, init = {}) {
        this.body = body;
        this.status = init.status || 200;
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
// Challenger Test Runner
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
    console.error(`  ❌ FAIL: ${desc} ${details ? '(' + details + ')' : ''}`);
  }
}

async function runAdversarialChallenger() {
  console.log('========================================================================');
  console.log('⚔️ EMPIRICAL CHALLENGER: ADVERSARIAL SECURITY VERIFICATION (MILESTONE M1)');
  console.log('========================================================================\n');

  const adminGoogleAuth = require(path.join(ADMIN_DIR, 'src', 'lib', 'google-auth.ts'));
  const studentGoogleAuth = require(path.join(ROOT_DIR, 'src', 'lib', 'google-auth.ts'));
  const adminAuth = require(path.join(ADMIN_DIR, 'src', 'lib', 'auth.ts'));
  const loginRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'login', 'route.ts'));
  const statsRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'stats', 'route.ts'));
  const usersRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'users', 'route.ts'));
  const whitelistRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'whitelist', 'route.ts'));
  const callbackRoute = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'callback', 'google', 'route.ts'));
  const { NextRequest } = require('next/server');

  // Keypairs for testing
  const legitimate = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const legitimateJwk = legitimate.publicKey.export({ format: 'jwk' });
  const legitimateKid = 'legit-google-key-id-2026';
  const legitimateClientId = 'ta12-real-app.apps.googleusercontent.com';

  const attacker = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const attackerJwk = attacker.publicKey.export({ format: 'jwk' });
  const attackerKid = 'attacker-rogue-key-id-666';

  // Helper to re-inject test JWKS into cache
  function resetJwksCache() {
    adminGoogleAuth.setCachedJWKSForTesting({
      keys: [{ ...legitimateJwk, kid: legitimateKid, alg: 'RS256', use: 'sig' }],
    });
    studentGoogleAuth.setCachedJWKSForTesting({
      keys: [{ ...legitimateJwk, kid: legitimateKid, alg: 'RS256', use: 'sig' }],
    });
  }
  resetJwksCache();

  function makeJwt(payloadOverrides = {}, headerOverrides = {}, privateKey = legitimate.privateKey) {
    const header = { alg: 'RS256', kid: legitimateKid, typ: 'JWT', ...headerOverrides };
    const payload = {
      iss: 'https://accounts.google.com',
      aud: legitimateClientId,
      sub: 'google_user_sub_99887766',
      email: 'dot71714@gmail.com',
      email_verified: true,
      name: 'Super Admin',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
      ...payloadOverrides,
    };
    const hB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const pB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    let sig;
    if (header.alg === 'none') {
      sig = '';
    } else {
      sig = crypto.sign('RSA-SHA256', Buffer.from(`${hB64}.${pB64}`), privateKey).toString('base64url');
    }
    return `${hB64}.${pB64}.${sig}`;
  }

  // ---------------------------------------------------------------------------
  // VECTOR 1: Forged ID Tokens against verifyGoogleIdToken
  // ---------------------------------------------------------------------------
  console.log('▶ Vector 1: Testing Forged ID Tokens against verifyGoogleIdToken...');

  // 1.1 alg: "none" unsigned token attack
  const noneToken = makeJwt({}, { alg: 'none' });
  let noneError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(noneToken, legitimateClientId);
  } catch (e) {
    noneError = e.message;
  }
  check('Rejects alg: "none" unsigned token attack', noneError && noneError.includes('RS256'));

  // 1.2 alg: "HS256" symmetric confusion attack
  const hsToken = makeJwt({}, { alg: 'HS256' });
  let hsError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(hsToken, legitimateClientId);
  } catch (e) {
    hsError = e.message;
  }
  check('Rejects alg: "HS256" algorithm confusion attack', hsError && hsError.includes('RS256'));

  // 1.3 Missing kid in header
  const noKidHeader = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const validPayload = Buffer.from(JSON.stringify({
    iss: 'https://accounts.google.com',
    aud: legitimateClientId,
    sub: '123',
    email: 'dot71714@gmail.com',
    email_verified: true,
    exp: Math.floor(Date.now() / 1000) + 3600,
  })).toString('base64url');
  const dummySig = crypto.sign('RSA-SHA256', Buffer.from(`${noKidHeader}.${validPayload}`), legitimate.privateKey).toString('base64url');
  let noKidError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(`${noKidHeader}.${validPayload}.${dummySig}`, legitimateClientId);
  } catch (e) {
    noKidError = e.message;
  }
  check('Rejects token with missing kid in header', noKidError && noKidError.includes('missing kid'));

  // 1.4 Tampered signature bytes (1-byte flip)
  const validJwt = makeJwt();
  const validParts = validJwt.split('.');
  const sigBuf = Buffer.from(validParts[2], 'base64url');
  sigBuf[sigBuf.length - 2] ^= 0x55; // flip bits
  const tamperedSigToken = `${validParts[0]}.${validParts[1]}.${sigBuf.toString('base64url')}`;
  let tamperedSigError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(tamperedSigToken, legitimateClientId);
  } catch (e) {
    tamperedSigError = e.message;
  }
  check('Rejects 1-bit corrupted signature (RS256 verification fails)', tamperedSigError && tamperedSigError.includes('Invalid JWT signature'));

  // 1.5 Forged token signed with attacker RSA private key claiming legit kid
  const attackerSignedToken = makeJwt({}, { kid: legitimateKid }, attacker.privateKey);
  let attackerSigError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(attackerSignedToken, legitimateClientId);
  } catch (e) {
    attackerSigError = e.message;
  }
  check('Rejects forged token signed by rogue private key claiming legit kid', attackerSigError && attackerSigError.includes('Invalid JWT signature'));

  // 1.6 Forged token claiming non-existent attacker kid
  const rogueKidToken = makeJwt({}, { kid: attackerKid }, attacker.privateKey);
  let rogueKidError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(rogueKidToken, legitimateClientId);
  } catch (e) {
    rogueKidError = e.message;
  }
  check('Rejects token referencing key ID not present in JWKS', rogueKidError && rogueKidError.includes('not found'));

  // Reset JWKS cache because unknown kid triggers force-refresh against Google certs
  resetJwksCache();

  // 1.7 Expired timestamp (exp 1 hour ago)
  const expiredToken = makeJwt({ exp: Math.floor(Date.now() / 1000) - 3600 });
  let expiredError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(expiredToken, legitimateClientId);
  } catch (e) {
    expiredError = e.message;
  }
  check('Rejects token expired 1 hour ago', expiredError && expiredError.includes('expired'));

  // 1.8 Edge timestamp: exp == current second
  const currentSecToken = makeJwt({ exp: Math.floor(Date.now() / 1000) });
  let currentSecError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(currentSecToken, legitimateClientId);
  } catch (e) {
    currentSecError = e.message;
  }
  check('Rejects token expiring right at current second (exp <= now boundary)', currentSecError && currentSecError.includes('expired'));

  // 1.9 Non-numeric exp ("never", null, NaN)
  const stringExpToken = makeJwt({ exp: 'never' });
  let stringExpError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(stringExpToken, legitimateClientId);
  } catch (e) {
    stringExpError = e.message;
  }
  check('Rejects token with non-numeric exp string ("never")', stringExpError && stringExpError.includes('expired'));

  // 1.10 Untrusted issuer: "https://evil.attacker.com"
  const evilIssToken = makeJwt({ iss: 'https://evil.attacker.com' });
  let evilIssError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(evilIssToken, legitimateClientId);
  } catch (e) {
    evilIssError = e.message;
  }
  check('Rejects untrusted external issuer', evilIssError && evilIssError.includes('issuer'));

  // 1.11 Untrusted subdomain spoof: "https://accounts.google.com.attacker.com"
  const spoofIssToken = makeJwt({ iss: 'https://accounts.google.com.attacker.com' });
  let spoofIssError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(spoofIssToken, legitimateClientId);
  } catch (e) {
    spoofIssError = e.message;
  }
  check('Rejects issuer subdomain spoof attempt', spoofIssError && spoofIssError.includes('issuer'));

  // 1.12 Insecure HTTP issuer: "http://accounts.google.com"
  const httpIssToken = makeJwt({ iss: 'http://accounts.google.com' });
  let httpIssError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(httpIssToken, legitimateClientId);
  } catch (e) {
    httpIssError = e.message;
  }
  check('Rejects unencrypted http:// issuer', httpIssError && httpIssError.includes('issuer'));

  // 1.13 Audience mismatch attack
  const wrongAudToken = makeJwt({ aud: 'different-app-id.apps.googleusercontent.com' });
  let wrongAudError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(wrongAudToken, legitimateClientId);
  } catch (e) {
    wrongAudError = e.message;
  }
  check('Rejects audience intended for another application', wrongAudError && wrongAudError.includes('audience'));

  // 1.14 email_verified: false attack
  const unverifiedToken = makeJwt({ email_verified: false });
  let unverifiedError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(unverifiedToken, legitimateClientId);
  } catch (e) {
    unverifiedError = e.message;
  }
  check('Rejects token where email_verified is explicitly false', unverifiedError && unverifiedError.includes('email_verified'));

  // 1.15 email_verified missing / null / "false"
  const nullVerifiedToken = makeJwt({ email_verified: null });
  let nullVerifiedError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(nullVerifiedToken, legitimateClientId);
  } catch (e) {
    nullVerifiedError = e.message;
  }
  check('Rejects token where email_verified is null', nullVerifiedError && nullVerifiedError.includes('email_verified'));

  // 1.16 Forged claims: missing sub
  const noSubToken = makeJwt({ sub: '' });
  let noSubError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(noSubToken, legitimateClientId);
  } catch (e) {
    noSubError = e.message;
  }
  check('Rejects token with empty sub claim', noSubError && noSubError.includes('sub'));

  // 1.17 Forged claims: missing email
  const noEmailToken = makeJwt({ email: '' });
  let noEmailError = null;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(noEmailToken, legitimateClientId);
  } catch (e) {
    noEmailError = e.message;
  }
  check('Rejects token with empty email claim', noEmailError && noEmailError.includes('email'));

  // 1.18 Email sanitization / normalization
  const messyEmailToken = makeJwt({ email: '   DoT71714@Gmail.COM   ' });
  const messyResult = await adminGoogleAuth.verifyGoogleIdToken(messyEmailToken, legitimateClientId);
  check('Correctly normalizes and trims email to lowercase', messyResult.email === 'dot71714@gmail.com');

  // 1.19 Student library parity: ensure src/lib/google-auth behaves identically
  let studentParityError = null;
  try {
    await studentGoogleAuth.verifyGoogleIdToken(tamperedSigToken, legitimateClientId);
  } catch (e) {
    studentParityError = e.message;
  }
  check('Student google-auth.ts rejects tampered signatures identically', Boolean(studentParityError));

  // 1.20 Malformed JWT format (empty string, 1 part, 4 parts, non-base64)
  let malformedCount = 0;
  for (const badJwt of ['', 'just-a-string', 'part1.part2', 'part1.part2.part3.part4', '{}.{}.{}']) {
    try {
      await adminGoogleAuth.verifyGoogleIdToken(badJwt, legitimateClientId);
    } catch {
      malformedCount++;
    }
  }
  check('Rejects all 5 malformed/non-JWT structures', malformedCount === 5);

  // ---------------------------------------------------------------------------
  // VECTOR 2: Attacks against /api/auth/login
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 2: Testing Attacks against /api/auth/login (Zero-Bypass)...');

  const EXPECTED_KEY = process.env.ADMIN_MASTER_KEY || process.env.ADMIN_PASSWORD || 'ta12_superadmin_secret_key_2026';

  // 2.1 Missing masterKey
  const resMissing = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: {},
  }));
  check('Missing masterKey rejected with HTTP 401', resMissing.status === 401);

  // 2.2 Empty string masterKey
  const resEmptyStr = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { masterKey: '' },
  }));
  check('Empty masterKey rejected with HTTP 401', resEmptyStr.status === 401);

  // 2.3 Whitespace-only masterKey
  const resWhitespace = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { masterKey: '     \t\n  ' },
  }));
  check('Whitespace-only masterKey rejected with HTTP 401', resWhitespace.status === 401);

  // 2.4 Incorrect passwords
  for (const wrongPass of ['admin', 'password', '123456', 'superadmin', 'ta12_superadmin', 'TA12_SUPERADMIN_SECRET_KEY_2026']) {
    const resWrong = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: { masterKey: wrongPass },
    }));
    check(`Incorrect password "${wrongPass}" rejected with HTTP 401`, resWrong.status === 401);
  }

  // 2.5 Empty body / null body / invalid JSON
  const resNullBody = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: null,
  }));
  const nullBodyJson = await resNullBody.json();
  check('Null body handled safely and access strictly denied (status 401/500, success=false)',
    (resNullBody.status === 401 || resNullBody.status === 500) && nullBodyJson.success === false);

  const resMalformedBody = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: 'not a valid json{{{{',
  }));
  check('Malformed non-JSON body handled safely and rejected with HTTP 401', resMalformedBody.status === 401);

  // 2.6 SQL Injection payloads
  const sqliPayloads = [
    "' OR '1'='1",
    "' OR 1=1 --",
    "admin' --",
    "'; DROP TABLE users; --",
    "' UNION SELECT 1, 'dot71714@gmail.com', 'admin' --",
    "1' AND SLEEP(1) --",
    "' OR ''='",
  ];
  let sqliBlocked = 0;
  for (const sqli of sqliPayloads) {
    const resSqli = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: { masterKey: sqli },
    }));
    if (resSqli.status === 401) sqliBlocked++;
  }
  check(`All ${sqliPayloads.length} SQL Injection payloads blocked with HTTP 401`, sqliBlocked === sqliPayloads.length);

  // 2.7 Prototype Pollution & Object Injection payloads
  const protoPayload = JSON.parse('{"__proto__":{"masterKey":"ta12_superadmin_secret_key_2026"}}');
  const resProto = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: protoPayload,
  }));
  check('Prototype pollution payload without direct masterKey property rejected with HTTP 401', resProto.status === 401);

  // 2.8 Type confusion: Array as masterKey
  const resArray = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { masterKey: [EXPECTED_KEY] },
  }));
  // Arrays won't have .trim() if not string or timingSafeCompare might error or reject
  check('Array payload handled safely without granting admin access', resArray.status === 401 || resArray.status === 500);

  // 2.9 Type confusion: Object as masterKey
  const resObject = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { masterKey: { key: EXPECTED_KEY } },
  }));
  check('Nested object payload handled safely without granting admin access', resObject.status === 401 || resObject.status === 500);

  // 2.10 Old backdoor payloads (unauthenticated email logins)
  const oldBackdoors = [
    { email: 'dot71714@gmail.com' },
    { email: 'dot71714@gmail.com', bypass: true },
    { email: 'dot71714@gmail.com', role: 'superadmin' },
    { email: 'dot71714@gmail.com', autoLogin: true },
    { email: 'admin@ta12.com' },
  ];
  let backdoorsBlocked = 0;
  for (const bd of oldBackdoors) {
    const resBd = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
      method: 'POST',
      body: bd,
    }));
    if (resBd.status === 401) backdoorsBlocked++;
  }
  check(`All ${oldBackdoors.length} legacy unauthenticated email login payloads strictly blocked with HTTP 401`, backdoorsBlocked === oldBackdoors.length);

  // 2.11 Legitimate Master Key Login
  const resValid = await loginRoute.POST(new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: { masterKey: `  ${EXPECTED_KEY}  ` }, // trimmed
  }));
  check('Valid masterKey returns HTTP 200', resValid.status === 200);
  const validData = await resValid.json();
  check('Valid masterKey returns success=true', validData.success === true);
  check('Valid masterKey assigns superadmin email', validData.user?.email === 'dot71714@gmail.com');
  const sessionCookie = resValid.cookies.get('ta12_admin_session');
  check('Sets HTTP-only ta12_admin_session cookie', Boolean(sessionCookie?.value));
  check('Session cookie maxAge is 7 days (604800s)', sessionCookie?.options?.maxAge === 60 * 60 * 24 * 7);

  // ---------------------------------------------------------------------------
  // VECTOR 3: UI Zero-Bypass Audit in admin/src/app/page.tsx
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 3: Auditing admin/src/app/page.tsx for Zero-Bypass Compliance...');

  const pagePath = path.join(ADMIN_DIR, 'src', 'app', 'page.tsx');
  const pageSource = fs.readFileSync(pagePath, 'utf8');

  // 3.1 No 1-click mock admin button or function
  check('Zero occurrences of "handleAdminLogin"', !pageSource.includes('handleAdminLogin'));
  check('Zero occurrences of "testEmail"', !pageSource.includes('testEmail'));
  check('Zero occurrences of "mockLogin"', !pageSource.toLowerCase().includes('mocklogin'));
  check('Zero occurrences of "autologin"', !pageSource.toLowerCase().includes('autologin'));
  check('Zero occurrences of "bypassLogin"', !pageSource.toLowerCase().includes('bypasslogin'));

  // 3.2 Prominent Google OAuth button
  check('Prominent Google OAuth button present', pageSource.includes('href="/api/auth/google"') && pageSource.includes('Đăng nhập bằng Google'));

  // 3.3 Dev/Local fallback password input
  check('Superadmin Master Key input has type="password"', pageSource.includes('type="password"'));
  check('Superadmin Master Key input has descriptive placeholder', pageSource.includes('placeholder="Nhập Superadmin Master Key..."'));

  // 3.4 403 Forbidden Security Alert Banner
  check('403 Forbidden banner contains exact rejection text', pageSource.includes('không có quyền Quản trị viên! Chỉ tài khoản dot71714@gmail.com mới được phép truy cập.'));

  // 3.5 Check that unauthenticated view gates the dashboard
  check('Unauthenticated view hides the dashboard main content', pageSource.includes('!adminUser ?') && pageSource.includes('Cổng Quản Trị Viên TA12'));

  // ---------------------------------------------------------------------------
  // VECTOR 4: Unauthorized Access against /api/admin/users, whitelist, stats
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 4: Testing Unauthorized Access against /api/admin/* Routes...');

  const endpoints = [
    { name: 'GET /api/admin/stats', handler: (req) => statsRoute.GET(req) },
    { name: 'GET /api/admin/users', handler: (req) => usersRoute.GET(req) },
    { name: 'PATCH /api/admin/users', handler: (req) => usersRoute.PATCH(req) },
    { name: 'GET /api/admin/whitelist', handler: (req) => whitelistRoute.GET(req) },
    { name: 'POST /api/admin/whitelist', handler: (req) => whitelistRoute.POST(req) },
    { name: 'DELETE /api/admin/whitelist', handler: (req) => whitelistRoute.DELETE(req) },
  ];

  const standardBrowserHeaders = {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    'host': 'localhost:3001',
    'accept': 'application/json',
  };

  // 4.1 Case A: No cookie / no Authorization header at all
  console.log('  Sub-vector 4.1: No cookie / no Authorization header...');
  for (const ep of endpoints) {
    const req = new NextRequest('http://localhost:3001/api/admin/test', {
      headers: standardBrowserHeaders,
      body: {},
    });
    const res = await ep.handler(req);
    check(`${ep.name} with NO credentials returns HTTP 401`, res.status === 401);
  }

  // 4.2 Case B: Forged HMAC cookie (tampered signature)
  console.log('  Sub-vector 4.2: Forged HMAC signature in cookie...');
  const legitToken = adminAuth.signAdminToken('dot71714@gmail.com');
  const forgedSigToken = legitToken.slice(0, -6) + 'BOGUS9';

  for (const ep of endpoints) {
    const req = new NextRequest('http://localhost:3001/api/admin/test', {
      headers: {
        ...standardBrowserHeaders,
        cookie: `ta12_admin_session=${forgedSigToken}`,
      },
      cookies: { ta12_admin_session: forgedSigToken },
      body: {},
    });
    const res = await ep.handler(req);
    check(`${ep.name} with FORGED HMAC signature returns HTTP 401`, res.status === 401);
  }

  // 4.3 Case C: Expired cookie (older than 7 days)
  console.log('  Sub-vector 4.3: Expired cookie (timestamp older than 7 days)...');
  const tenDaysAgoTs = Date.now() - (10 * 24 * 60 * 60 * 1000);
  const expiredPayload = `dot71714@gmail.com:${tenDaysAgoTs}`;
  const AUTH_SECRET = process.env.AUTH_SECRET || 'ta12_admin_super_secret_portal_2026';
  const expiredSig = crypto.createHmac('sha256', AUTH_SECRET).update(expiredPayload).digest('hex');
  const expiredCookie = Buffer.from(`${expiredPayload}:${expiredSig}`).toString('base64');

  for (const ep of endpoints) {
    const req = new NextRequest('http://localhost:3001/api/admin/test', {
      headers: {
        ...standardBrowserHeaders,
        cookie: `ta12_admin_session=${expiredCookie}`,
      },
      cookies: { ta12_admin_session: expiredCookie },
      body: {},
    });
    const res = await ep.handler(req);
    check(`${ep.name} with EXPIRED cookie (10 days old) returns HTTP 401`, res.status === 401);
  }

  // 4.4 Case D: Far-future cookie (clock drift > 60s)
  console.log('  Sub-vector 4.4: Future clock drift attack...');
  const futureTs = Date.now() + (3600 * 1000); // 1 hour in future
  const futurePayload = `dot71714@gmail.com:${futureTs}`;
  const futureSig = crypto.createHmac('sha256', AUTH_SECRET).update(futurePayload).digest('hex');
  const futureCookie = Buffer.from(`${futurePayload}:${futureSig}`).toString('base64');

  const reqFuture = new NextRequest('http://localhost:3001/api/admin/stats', {
    headers: { ...standardBrowserHeaders, cookie: `ta12_admin_session=${futureCookie}` },
    cookies: { ta12_admin_session: futureCookie },
  });
  const resFuture = await statsRoute.GET(reqFuture);
  check('Future timestamp (>60s clock skew) returns HTTP 401', resFuture.status === 401);

  // 4.5 Case E: Valid signature for a non-admin email
  console.log('  Sub-vector 4.5: Non-superadmin email signed with legitimate secret...');
  const nonAdminToken = adminAuth.signAdminToken('attacker@evil.com');
  for (const ep of endpoints) {
    const req = new NextRequest('http://localhost:3001/api/admin/test', {
      headers: {
        ...standardBrowserHeaders,
        cookie: `ta12_admin_session=${nonAdminToken}`,
      },
      cookies: { ta12_admin_session: nonAdminToken },
      body: {},
    });
    const res = await ep.handler(req);
    check(`${ep.name} with non-superadmin email (${nonAdminToken.slice(0, 15)}...) returns HTTP 401`, res.status === 401);
  }

  // 4.6 Case F: Garbage cookie value
  const reqGarbage = new NextRequest('http://localhost:3001/api/admin/stats', {
    headers: { ...standardBrowserHeaders, cookie: 'ta12_admin_session=invalid.token.structure' },
    cookies: { ta12_admin_session: 'invalid.token.structure' },
  });
  const resGarbage = await statsRoute.GET(reqGarbage);
  check('Garbage session cookie returns HTTP 401', resGarbage.status === 401);

  // 4.7 Case G: Legitimate Superadmin Cookie SUCCEEDS
  console.log('  Sub-vector 4.7: Valid superadmin session cookie...');
  const reqLegit = new NextRequest('http://localhost:3001/api/admin/stats', {
    headers: { ...standardBrowserHeaders, cookie: `ta12_admin_session=${legitToken}` },
    cookies: { ta12_admin_session: legitToken },
  });
  const resLegit = await statsRoute.GET(reqLegit);
  check('Valid superadmin session cookie succeeds with HTTP 200', resLegit.status === 200);

  // ---------------------------------------------------------------------------
  // VECTOR 5: Google OAuth Callback Gate Zero-Bypass (/api/auth/callback/google)
  // ---------------------------------------------------------------------------
  console.log('\n▶ Vector 5: Testing /api/auth/callback/google Zero-Bypass Gate...');

  // Set mock Google client env
  process.env.GOOGLE_CLIENT_ID = legitimateClientId;
  process.env.GOOGLE_CLIENT_SECRET = 'secret-test-client-key';

  // 5.1 Callback with state mismatch
  const legitState = adminGoogleAuth.generateOAuthState({ returnUrl: '/' });
  const reqMismatchState = new NextRequest(`http://localhost:3001/api/auth/callback/google?code=fake_code&state=${legitState}`, {
    cookies: { ta12_admin_oauth_state: 'different_state_value' },
  });
  const resMismatchState = await callbackRoute.GET(reqMismatchState);
  const mismatchLoc = resMismatchState.headers.get('location');
  check('State cookie mismatch redirects with error=state_mismatch', mismatchLoc && mismatchLoc.includes('error=state_mismatch'));

  // 5.2 Callback with expired CSRF state
  const expiredStateToken = adminGoogleAuth.generateOAuthState();
  // Artificially test verifyOAuthState with negative maxAge
  const expiredStateCheck = adminGoogleAuth.verifyOAuthState(expiredStateToken, -1);
  check('Expired OAuth state rejected by verifyOAuthState', expiredStateCheck.valid === false);

  // Mock global.fetch to simulate Google Token Endpoint responses
  const originalFetch = global.fetch;

  try {
    // 5.3 Non-admin Google login attempt: student@gmail.com
    const nonAdminIdToken = makeJwt({ email: 'student@gmail.com', email_verified: true, name: 'Student Hacker' });
    const studentState = adminGoogleAuth.generateOAuthState({ returnUrl: '/' });

    global.fetch = async (url, opts) => {
      if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ id_token: nonAdminIdToken, access_token: 'fake_acc' }),
          text: async () => JSON.stringify({ id_token: nonAdminIdToken }),
        };
      }
      return originalFetch(url, opts);
    };

    resetJwksCache();
    const reqNonAdminCb = new NextRequest(`http://localhost:3001/api/auth/callback/google?code=valid_code&state=${studentState}`, {
      cookies: { ta12_admin_oauth_state: studentState },
    });
    const resNonAdminCb = await callbackRoute.GET(reqNonAdminCb);
    check('Non-admin Google account strictly rejected with HTTP 303 redirect', resNonAdminCb.status === 303);
    const nonAdminLoc = resNonAdminCb.headers.get('location');
    check('Redirects to /?error=forbidden&email=student%40gmail.com',
      nonAdminLoc && nonAdminLoc.includes('error=forbidden') && nonAdminLoc.includes('student%40gmail.com'));
    const clearedCookie = resNonAdminCb.cookies.get('ta12_admin_session');
    check('Immediately clears any existing admin session cookie (maxAge=0)',
      clearedCookie?.options?.maxAge === 0);

    // 5.4 Google login attempt for dot71714@gmail.com with email_verified: false
    const unverifiedIdToken = makeJwt({ email: 'dot71714@gmail.com', email_verified: false });
    const unverifiedState = adminGoogleAuth.generateOAuthState({ returnUrl: '/' });

    global.fetch = async (url, opts) => {
      if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ id_token: unverifiedIdToken, access_token: 'fake_acc' }),
          text: async () => JSON.stringify({ id_token: unverifiedIdToken }),
        };
      }
      return originalFetch(url, opts);
    };

    resetJwksCache();
    const reqUnverifiedCb = new NextRequest(`http://localhost:3001/api/auth/callback/google?code=valid_code&state=${unverifiedState}`, {
      cookies: { ta12_admin_oauth_state: unverifiedState },
    });
    const resUnverifiedCb = await callbackRoute.GET(reqUnverifiedCb);
    const unverifiedLoc = resUnverifiedCb.headers.get('location');
    check('Unverified Google email rejected and redirects to error',
      unverifiedLoc && (unverifiedLoc.includes('error=auth_failed') || unverifiedLoc.includes('error=forbidden')));

    // 5.5 Legitimate Google OAuth login for dot71714@gmail.com with email_verified: true
    const legitIdToken = makeJwt({ email: 'dot71714@gmail.com', email_verified: true, name: 'Legit Superadmin' });
    const legitAuthState = adminGoogleAuth.generateOAuthState({ returnUrl: '/?tab=users' });

    global.fetch = async (url, opts) => {
      if (typeof url === 'string' && url.includes('oauth2.googleapis.com/token')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ id_token: legitIdToken, access_token: 'fake_acc' }),
          text: async () => JSON.stringify({ id_token: legitIdToken }),
        };
      }
      return originalFetch(url, opts);
    };

    resetJwksCache();
    const reqLegitCb = new NextRequest(`http://localhost:3001/api/auth/callback/google?code=legit_code&state=${legitAuthState}`, {
      cookies: { ta12_admin_oauth_state: legitAuthState },
    });
    const resLegitCb = await callbackRoute.GET(reqLegitCb);
    check('Legitimate superadmin Google login redirects to destination URL',
      resLegitCb.headers.get('location')?.includes('tab=users'));
    const legitSessionCookie = resLegitCb.cookies.get('ta12_admin_session');
    check('Sets valid ta12_admin_session cookie for superadmin', Boolean(legitSessionCookie?.value));
    check('Admin session cookie maxAge is 7 days', legitSessionCookie?.options?.maxAge === 60 * 60 * 24 * 7);
  } finally {
    global.fetch = originalFetch;
  }

  // ---------------------------------------------------------------------------
  // SUMMARY & VERDICT
  // ---------------------------------------------------------------------------
  console.log('\n========================================================================');
  console.log(`📊 CHALLENGER SUMMARY: ${passedTests} / ${totalTests} ASSERTIONS PASSED`);
  console.log('========================================================================\n');

  if (failures.length > 0) {
    console.error(`❌ ${failures.length} FAILURE(S) ENCOUNTERED:`);
    failures.forEach((f) => console.error(`  - ${f.desc} (${f.details})`));
    console.error('\nEMPIRICAL VERDICT: REJECT');
    process.exit(1);
  } else {
    console.log('🎉 ALL ADVERSARIAL PENETRATION CHALLENGES PASSED!');
    console.log('🛡️ ZERO VULNERABILITIES DETECTED IN MILESTONE M1 IMPLEMENTATION.');
    console.log('EMPIRICAL VERDICT: APPROVE\n');
  }
}

runAdversarialChallenger().catch((err) => {
  console.error('Fatal challenger execution error:', err);
  process.exit(1);
});
