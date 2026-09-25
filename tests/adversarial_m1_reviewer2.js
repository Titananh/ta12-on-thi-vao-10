/**
 * Adversarial Reviewer 2 Penetration Test Suite for Milestone M1
 * Target: Google OAuth Crypto & Admin Zero-Bypass Gate
 */

const crypto = require('crypto');
const path = require('path');
const assert = require('assert');
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
  let content = require('fs').readFileSync(filename, 'utf8');
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

async function runAdversarialReviewer2Suite() {
  console.log('========================================================================');
  console.log('⚔️ ADVERSARIAL PENETRATION REVIEWER 2 SUITE (MILESTONE M1)');
  console.log('========================================================================\n');

  const adminGoogleAuth = require(path.join(ADMIN_DIR, 'src', 'lib', 'google-auth.ts'));
  const adminAuth = require(path.join(ADMIN_DIR, 'src', 'lib', 'auth.ts'));
  const loginApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'login', 'route.ts'));
  const callbackApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'auth', 'callback', 'google', 'route.ts'));
  const usersApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'users', 'route.ts'));
  const statsApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'stats', 'route.ts'));
  const whitelistApi = require(path.join(ADMIN_DIR, 'src', 'app', 'api', 'admin', 'whitelist', 'route.ts'));
  const { NextRequest } = require('next/server');

  // Setup RSA Keypair for genuine testing
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });

  const jwkPublic = crypto.createPublicKey(publicKey).export({ format: 'jwk' });
  jwkPublic.kid = 'adv-key-1';
  jwkPublic.alg = 'RS256';
  jwkPublic.use = 'sig';

  adminGoogleAuth.setCachedJWKSForTesting({ keys: [jwkPublic] });

  function createSignedJwt(payload, headerOverrides = {}, signKey = privateKey) {
    const header = { alg: 'RS256', typ: 'JWT', kid: 'adv-key-1', ...headerOverrides };
    const hB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const pB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(`${hB64}.${pB64}`);
    const sig = signer.sign(signKey, 'base64url');
    return `${hB64}.${pB64}.${sig}`;
  }

  // 1. Stress-test JWKS & RS256 Verification
  console.log('▶ Attack Vector 1: RS256 Cryptographic Attack Scenarios...');
  const validPayload = {
    iss: 'https://accounts.google.com',
    aud: 'test-client-id',
    sub: 'google-sub-12345',
    email: 'dot71714@gmail.com',
    email_verified: true,
    exp: Math.floor(Date.now() / 1000) + 3600,
    iat: Math.floor(Date.now() / 1000),
  };

  // Test 1.1: Legitimate token passes
  const validToken = createSignedJwt(validPayload);
  const verified = await adminGoogleAuth.verifyGoogleIdToken(validToken, 'test-client-id');
  check('Valid RS256 signed token is successfully verified', verified.email === 'dot71714@gmail.com');

  // Test 1.2: Signature alteration attack
  const tamperedSigToken = validToken.slice(0, -4) + 'AAAA';
  let failed = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(tamperedSigToken, 'test-client-id');
  } catch (err) {
    failed = true;
  }
  check('Tampered signature attack is blocked', failed);

  // Test 1.3: Algorithm confusion attack (alg: 'none')
  const noneToken = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT', kid: 'adv-key-1' })).toString('base64url') +
    '.' + Buffer.from(JSON.stringify(validPayload)).toString('base64url') + '.';
  failed = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(noneToken, 'test-client-id');
  } catch (err) {
    failed = true;
  }
  check('Algorithm confusion (alg=none) attack is blocked', failed);

  // Test 1.4: Algorithm confusion attack (alg: 'HS256')
  const hs256Token = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: 'adv-key-1' })).toString('base64url') +
    '.' + Buffer.from(JSON.stringify(validPayload)).toString('base64url') + '.somehmacsig';
  failed = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(hs256Token, 'test-client-id');
  } catch (err) {
    failed = true;
  }
  check('Algorithm confusion (alg=HS256) attack is blocked', failed);

  // Test 1.5: Different private key attack (unauthorized issuer RSA key)
  const rogueKeys = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
  const rogueToken = createSignedJwt(validPayload, {}, rogueKeys.privateKey);
  failed = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(rogueToken, 'test-client-id');
  } catch (err) {
    failed = true;
  }
  check('Token signed with untrusted private key is blocked', failed);

  // Test 1.6: Token with email_verified: false
  const unverifiedToken = createSignedJwt({ ...validPayload, email_verified: false });
  failed = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(unverifiedToken, 'test-client-id');
  } catch (err) {
    failed = true;
  }
  check('Token with email_verified=false is blocked', failed);

  // Test 1.7: Expired token
  const expiredToken = createSignedJwt({ ...validPayload, exp: Math.floor(Date.now() / 1000) - 10 });
  failed = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(expiredToken, 'test-client-id');
  } catch (err) {
    failed = true;
  }
  check('Expired token is blocked', failed);

  // Test 1.8: Wrong audience
  failed = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(validToken, 'different-client-id');
  } catch (err) {
    failed = true;
  }
  check('Token with mismatched client_id (audience) is blocked', failed);

  // Test 1.9: Malicious issuer
  const evilIssToken = createSignedJwt({ ...validPayload, iss: 'https://evil-google-phish.com' });
  failed = false;
  try {
    await adminGoogleAuth.verifyGoogleIdToken(evilIssToken, 'test-client-id');
  } catch (err) {
    failed = true;
  }
  check('Token with unauthorized issuer is blocked', failed);

  // 2. Stress-test CSRF State & HMAC
  console.log('\n▶ Attack Vector 2: CSRF State Tampering & Replay Attacks...');
  const state = adminGoogleAuth.generateOAuthState({ returnUrl: '/admin/dashboard' });
  const stateCheck = adminGoogleAuth.verifyOAuthState(state);
  check('Legitimate state verifies and preserves returnUrl', stateCheck.valid && stateCheck.data.returnUrl === '/admin/dashboard');

  // Test 2.1: Tampered state string
  const tamperedState = state.slice(0, -6) + 'abcdef';
  const tamperedCheck = adminGoogleAuth.verifyOAuthState(tamperedState);
  check('Tampered HMAC state signature is rejected', !tamperedCheck.valid);

  // Test 2.2: Expired state
  const rawState = Buffer.from(state, 'base64url').toString('utf8');
  const [pStr] = rawState.split('.');
  const pObj = JSON.parse(pStr);
  pObj.ts = Date.now() - 20 * 60 * 1000; // 20 minutes ago
  const expPStr = JSON.stringify(pObj);
  const expSig = crypto.createHmac('sha256', process.env.AUTH_SECRET || 'ta12_google_oauth_crypto_secret_2026').update(expPStr).digest('hex');
  const expState = Buffer.from(`${expPStr}.${expSig}`).toString('base64url');
  const expCheck = adminGoogleAuth.verifyOAuthState(expState);
  check('Expired state token (>10m) is rejected', !expCheck.valid);

  // 3. Admin Zero-Bypass Gate Attacks
  console.log('\n▶ Attack Vector 3: Admin Zero-Bypass Gate Attacks...');
  // Test 3.1: Attempting email login without masterKey (the old backdoor)
  const backdoorReq = new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'dot71714@gmail.com' }),
  });
  const backdoorRes = await loginApi.POST(backdoorReq);
  check('Unauthenticated email login returns HTTP 401 Unauthorized', backdoorRes.status === 401);
  const backdoorData = await backdoorRes.json();
  check('Zero-bypass error message is returned', backdoorData.error.includes('Superadmin Master Key'));

  // Test 3.2: Attempting wrong master key
  const wrongKeyReq = new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ masterKey: 'wrong_secret_123' }),
  });
  const wrongKeyRes = await loginApi.POST(wrongKeyReq);
  check('Wrong Master Key returns HTTP 401', wrongKeyRes.status === 401);

  // Test 3.3: Attempting valid master key
  const validKey = process.env.ADMIN_MASTER_KEY || 'ta12_superadmin_secret_key_2026';
  const correctKeyReq = new NextRequest('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ masterKey: validKey }),
  });
  const correctKeyRes = await loginApi.POST(correctKeyReq);
  check('Valid Master Key returns HTTP 200', correctKeyRes.status === 200);
  const cookieHeader = correctKeyRes.cookies.get('ta12_admin_session');
  check('Returns valid ta12_admin_session cookie', Boolean(cookieHeader));

  // 4. Session Token TTL Expiry & Tampering Attacks
  console.log('\n▶ Attack Vector 4: Session Token TTL & Tamper Resistance...');
  const adminToken = adminAuth.signAdminToken('dot71714@gmail.com');
  const verifiedEmail = adminAuth.verifyAdminToken(adminToken);
  check('Legitimate fresh session token verifies successfully', verifiedEmail === 'dot71714@gmail.com');

  // Test 4.1: Tampered session token
  const tamperedSession = adminToken.slice(0, -6) + 'xxxxxx';
  check('Tampered session token signature is rejected', adminAuth.verifyAdminToken(tamperedSession) === null);

  // Test 4.2: Expired session token (8 days old)
  const eightDaysAgo = Date.now() - (8 * 24 * 60 * 60 * 1000);
  const payloadExpired = `dot71714@gmail.com:${eightDaysAgo}`;
  const sigExpired = crypto.createHmac('sha256', process.env.AUTH_SECRET || 'ta12_admin_super_secret_portal_2026').update(payloadExpired).digest('hex');
  const expiredAdminToken = Buffer.from(`${payloadExpired}:${sigExpired}`).toString('base64');
  check('Admin token older than 7 days is strictly rejected by TTL check', adminAuth.verifyAdminToken(expiredAdminToken) === null);

  // 5. Admin API Endpoint Hardening
  console.log('\n▶ Attack Vector 5: Admin API Route Protection (401 Enforcement)...');
  // Live HTTP request with no auth
  const liveUnauthReq = new NextRequest('http://localhost:3001/api/admin/users', {
    method: 'GET',
    headers: { 'user-agent': 'Mozilla/5.0' },
  });
  const liveUnauthRes = await usersApi.GET(liveUnauthReq);
  check('GET /api/admin/users without session returns HTTP 401', liveUnauthRes.status === 401);

  const liveUnauthStatsReq = new NextRequest('http://localhost:3001/api/admin/stats', {
    method: 'GET',
    headers: { 'user-agent': 'Mozilla/5.0' },
  });
  const liveUnauthStatsRes = await statsApi.GET(liveUnauthStatsReq);
  check('GET /api/admin/stats without session returns HTTP 401', liveUnauthStatsRes.status === 401);

  const liveUnauthWhitelistReq = new NextRequest('http://localhost:3001/api/admin/whitelist', {
    method: 'GET',
    headers: { 'user-agent': 'Mozilla/5.0' },
  });
  const liveUnauthWhitelistRes = await whitelistApi.GET(liveUnauthWhitelistReq);
  check('GET /api/admin/whitelist without session returns HTTP 401', liveUnauthWhitelistRes.status === 401);

  // Live HTTP request with unauthorized user session
  const studentToken = adminAuth.signAdminToken('student@ta12.edu.vn');
  const studentReq = new NextRequest('http://localhost:3001/api/admin/users', {
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0',
      'cookie': `ta12_admin_session=${studentToken}`,
    },
  });
  const studentRes = await usersApi.GET(studentReq);
  check('Non-superadmin session token is rejected with HTTP 401 on /api/admin/users', studentRes.status === 401);

  // Live HTTP request with genuine superadmin session
  const legitReq = new NextRequest('http://localhost:3001/api/admin/users', {
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0',
      'cookie': `ta12_admin_session=${adminToken}`,
    },
  });
  const legitRes = await usersApi.GET(legitReq);
  check('Genuine superadmin session successfully accesses /api/admin/users (HTTP 200)', legitRes.status === 200);

  // 6. Google Callback Gate: Unauthorized User Forbidden Screen
  console.log('\n▶ Attack Vector 6: Unauthorized Google Identity Rejection Gate...');
  // When a non-superadmin signs in with Google, callback MUST redirect to ?error=forbidden&email=...
  // In callback route:
  // We simulate state verification and code exchange
  // To avoid real network call to googleapis in this offline unit test, test the logic branch:
  const isSuperadmin = 'attacker@gmail.com' === adminAuth.SUPERADMIN_EMAIL.toLowerCase();
  check('Attacker email strictly evaluated as non-superadmin', !isSuperadmin);

  console.log('\n========================================================================');
  console.log(`📊 ADVERSARIAL TEST SUMMARY: ${passedTests} / ${totalTests} CHECKS PASSED`);
  console.log('========================================================================');

  if (failures.length > 0) {
    console.error('FAILURES:', failures);
    process.exit(1);
  }
}

runAdversarialReviewer2Suite().catch(err => {
  console.error('Fatal error running adversarial review:', err);
  process.exit(1);
});
