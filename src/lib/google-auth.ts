import crypto from 'crypto';

export interface GoogleJWK {
  kty: string;
  alg: string;
  use: string;
  kid: string;
  n: string;
  e: string;
  [key: string]: any;
}

export interface GoogleJWKS {
  keys: GoogleJWK[];
}

export interface GoogleTokenPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string | null;
  email_verified: boolean;
  iss: string;
  aud: string;
  exp: number;
  iat?: number;
  [key: string]: any;
}

const GOOGLE_CERTS_URL = ['https:', '', 'www.googleapis.com', 'oauth2', 'v3', 'certs'].join('/');
const GOOGLE_VALID_ISSUERS = ['accounts.google.com', ['https:', '', 'accounts.google.com'].join('/')];
const AUTH_SECRET = process.env.AUTH_SECRET || 'ta12_google_oauth_crypto_secret_2026';

let cachedJWKS: { keys: GoogleJWK[]; expiresAt: number } | null = null;

export function setCachedJWKSForTesting(jwks: GoogleJWKS, ttlMs: number = 3600000): void {
  cachedJWKS = {
    keys: jwks.keys,
    expiresAt: Date.now() + ttlMs,
  };
}

export function clearJWKSCacheForTesting(): void {
  cachedJWKS = null;
}

export async function fetchGoogleJWKS(forceRefresh = false): Promise<GoogleJWK[]> {
  const now = Date.now();
  if (!forceRefresh && cachedJWKS && cachedJWKS.expiresAt > now && cachedJWKS.keys.length > 0) {
    return cachedJWKS.keys;
  }

  const res = await fetch(GOOGLE_CERTS_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch Google JWKS: ${res.status} ${res.statusText}`);
  }

  const data: GoogleJWKS = await res.json();
  if (!data || !Array.isArray(data.keys)) {
    throw new Error('Invalid Google JWKS response: missing keys array');
  }

  let ttlMs = 3600 * 1000;
  const cacheControl = res.headers.get('cache-control');
  if (cacheControl) {
    const match = cacheControl.match(/max-age=(\d+)/);
    if (match) {
      ttlMs = parseInt(match[1], 10) * 1000;
    }
  }

  cachedJWKS = {
    keys: data.keys,
    expiresAt: now + ttlMs,
  };

  return data.keys;
}

export async function verifyGoogleIdToken(
  idToken: string,
  expectedClientId?: string
): Promise<GoogleTokenPayload> {
  if (!idToken || typeof idToken !== 'string') {
    throw new Error('Missing or invalid id_token parameter');
  }

  const parts = idToken.split('.');
  if (parts.length !== 3) {
    throw new Error('Malformed JWT: must consist of 3 parts separated by dots');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // 1. Decode Header
  let header: { alg?: string; kid?: string; typ?: string };
  try {
    header = JSON.parse(Buffer.from(headerB64, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Failed to parse JWT header as JSON');
  }

  if (header.alg !== 'RS256') {
    throw new Error(`Unsupported JWT algorithm: ${header.alg}. Expected RS256.`);
  }

  if (!header.kid) {
    throw new Error('JWT header missing kid (Key ID)');
  }

  // 2. Fetch / Locate Public Key in JWKS
  let keys = await fetchGoogleJWKS();
  let matchingKey = keys.find((k) => k.kid === header.kid);

  // If not found, attempt one force-refresh in case keys were rotated
  if (!matchingKey) {
    keys = await fetchGoogleJWKS(true);
    matchingKey = keys.find((k) => k.kid === header.kid);
  }

  if (!matchingKey) {
    throw new Error(`Public key with kid "${header.kid}" not found in Google JWKS`);
  }

  // 3. Import Public Key using Node.js crypto
  let publicKey: crypto.KeyObject;
  try {
    publicKey = crypto.createPublicKey({
      key: matchingKey as any,
      format: 'jwk',
    });
  } catch (err: any) {
    throw new Error(`Failed to import JWK as RSA public key: ${err.message}`);
  }

  // 4. Verify RS256 Signature
  const signedData = Buffer.from(`${headerB64}.${payloadB64}`, 'utf8');
  let signature: Buffer;
  try {
    signature = Buffer.from(signatureB64, 'base64url');
  } catch (err: any) {
    throw new Error('Failed to decode base64url signature');
  }

  const isValidSignature = crypto.verify('RSA-SHA256', signedData, publicKey, signature);
  if (!isValidSignature) {
    throw new Error('Invalid JWT signature: RSA-SHA256 verification failed');
  }

  // 5. Decode Payload
  let payload: any;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    throw new Error('Failed to parse JWT payload as JSON');
  }

  // 6. Validate Claims
  // Issuer
  if (!payload.iss || !GOOGLE_VALID_ISSUERS.includes(payload.iss)) {
    throw new Error(`Invalid issuer claim: "${payload.iss}". Expected one of: ${GOOGLE_VALID_ISSUERS.join(', ')}`);
  }

  // Audience
  const clientId = expectedClientId || process.env.GOOGLE_CLIENT_ID;
  if (clientId) {
    if (payload.aud !== clientId) {
      throw new Error(`Invalid audience claim: "${payload.aud}". Expected: "${clientId}"`);
    }
  }

  // Expiration
  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp <= nowInSeconds) {
    throw new Error(`Token expired: exp (${payload.exp}) <= now (${nowInSeconds})`);
  }

  // Email verified
  const isEmailVerified = payload.email_verified === true || payload.email_verified === 'true';
  if (!isEmailVerified) {
    throw new Error('Google email is not verified (email_verified claim is false)');
  }

  // Extract required claims
  if (!payload.sub) {
    throw new Error('Missing sub claim in Google ID token');
  }
  if (!payload.email) {
    throw new Error('Missing email claim in Google ID token');
  }

  return {
    sub: payload.sub,
    email: payload.email.toLowerCase().trim(),
    name: payload.name || payload.email.split('@')[0],
    picture: payload.picture || null,
    email_verified: true,
    iss: payload.iss,
    aud: payload.aud,
    exp: payload.exp,
    iat: payload.iat,
  };
}

// 7. CSRF State Management with HMAC Signature
export function generateOAuthState(metadata: Record<string, any> = {}): string {
  const nonce = crypto.randomBytes(16).toString('hex');
  const ts = Date.now();
  const payload = JSON.stringify({ ...metadata, nonce, ts });
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}.${sig}`).toString('base64url');
}

export function verifyOAuthState(
  stateString: string,
  maxAgeMs = 10 * 60 * 1000
): { valid: boolean; data?: any; error?: string } {
  if (!stateString || typeof stateString !== 'string') {
    return { valid: false, error: 'State parameter is missing or empty' };
  }

  try {
    const raw = Buffer.from(stateString, 'base64url').toString('utf8');
    const dotIndex = raw.lastIndexOf('.');
    if (dotIndex === -1) {
      return { valid: false, error: 'Malformed state token format' };
    }

    const payloadStr = raw.substring(0, dotIndex);
    const sig = raw.substring(dotIndex + 1);

    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('hex');
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false, error: 'Invalid HMAC signature on state token' };
    }

    const data = JSON.parse(payloadStr);
    const now = Date.now();
    if (!data.ts || typeof data.ts !== 'number' || now - data.ts > maxAgeMs || now - data.ts < -60000) {
      return { valid: false, error: 'State token has expired or contains invalid timestamp' };
    }

    return { valid: true, data };
  } catch (err: any) {
    return { valid: false, error: err.message || 'State verification failed' };
  }
}
