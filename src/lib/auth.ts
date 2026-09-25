import crypto from 'crypto';
import { cookies } from 'next/headers';
import { getUserById, User, UserProgress, getUserProgress } from './db';

const AUTH_SECRET = process.env.AUTH_SECRET || 'ta12_grade10_english_prep_auth_secret_2026';
export const SESSION_COOKIE_NAME = 'ta12_session';

export function signSessionToken(userId: string): string {
  const ts = Date.now().toString();
  const payload = `${userId}:${ts}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

export function verifySessionToken(token: string, maxAgeMs = 30 * 24 * 60 * 60 * 1000): string | null {
  try {
    const cleanToken = decodeURIComponent(token);
    const raw = Buffer.from(cleanToken, 'base64').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 3) return null;
    const [userId, ts, sig] = parts;
    if (!userId || !ts || !sig) return null;

    const tokenTime = parseInt(ts, 10);
    const now = Date.now();
    if (isNaN(tokenTime) || now - tokenTime > maxAgeMs || now - tokenTime < -60000) {
      return null;
    }

    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(`${userId}:${ts}`).digest('hex');
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

export function isValidStudentEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim().toLowerCase();
  return /^[a-zA-Z0-9._%+-]+@gmail(\.com)?$/i.test(trimmed);
}

export function normalizeStudentEmail(email: string): string {
  let trimmed = (email || '').trim().toLowerCase();
  if (trimmed.endsWith('@gmail')) {
    trimmed = trimmed + '.com';
  }
  return trimmed;
}

export function hashPassword(password: string): string {
  return crypto.createHmac('sha256', AUTH_SECRET).update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  try {
    const computed = hashPassword(password);
    const bufA = Buffer.from(computed, 'hex');
    const bufB = Buffer.from(hash, 'hex');
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function getCurrentUser(): Promise<{ user: User | null; progress: UserProgress | null }> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return { user: null, progress: null };
    }

    const userId = verifySessionToken(sessionCookie.value);
    if (!userId) {
      return { user: null, progress: null };
    }

    const user = getUserById(userId) || null;
    const progress = user ? getUserProgress(user.id) || null : null;
    return { user, progress };
  } catch {
    return { user: null, progress: null };
  }
}

// -----------------------------------------------------------------------------
// Admin Portal Authentication & Session Management
// -----------------------------------------------------------------------------
export const SUPERADMIN_EMAIL = 'dot71714@gmail.com';
export const ADMIN_SESSION_COOKIE = 'ta12_admin_session';

export interface AdminUser {
  email: string;
  name: string;
  avatar_url?: string | null;
  role: 'superadmin';
}

export function signAdminToken(email: string): string {
  const ts = Date.now().toString();
  const payload = `${email.toLowerCase()}:${ts}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64');
}

export function verifyAdminToken(token: string, maxAgeMs = 7 * 24 * 60 * 60 * 1000): string | null {
  try {
    const cleanToken = decodeURIComponent(token);
    const raw = Buffer.from(cleanToken, 'base64').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 3) return null;
    const [email, ts, sig] = parts;
    if (!email || !ts || !sig) return null;

    const tokenTime = parseInt(ts, 10);
    const now = Date.now();
    if (isNaN(tokenTime) || now - tokenTime > maxAgeMs || now - tokenTime < -60000) {
      return null;
    }

    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(`${email}:${ts}`).digest('hex');
    const sigBuffer = Buffer.from(sig);
    const expectedBuffer = Buffer.from(expectedSig);
    if (sigBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      return email;
    }
  } catch {
    return null;
  }
  return null;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const email = verifyAdminToken(sessionCookie.value);
    if (!email || email.toLowerCase() !== SUPERADMIN_EMAIL.toLowerCase()) {
      return null;
    }

    return {
      email: SUPERADMIN_EMAIL,
      name: 'Super Admin',
      avatar_url: '/images/avatar_default.png',
      role: 'superadmin',
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession(request?: any): Promise<AdminUser | null> {
  try {
    let token: string | null = null;

    if (request && typeof request.headers?.get === 'function') {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.slice(7).trim();
      }
      if (!token) {
        token = request.headers.get('x-admin-token');
      }
      if (!token) {
        const cookieHeader = request.headers.get('cookie') || '';
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${ADMIN_SESSION_COOKIE}=([^;]+)`));
        if (match) {
          token = match[1];
        }
      }
    }

    if (!token && request && typeof request.cookies?.get === 'function') {
      const cookieObj = request.cookies.get(ADMIN_SESSION_COOKIE);
      if (cookieObj?.value) {
        token = cookieObj.value;
      }
    }

    if (!token) {
      try {
        const cookieStore = cookies();
        const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE);
        if (sessionCookie?.value) {
          token = sessionCookie.value;
        }
      } catch {
        // Outside server component / request context
      }
    }

    if (token) {
      const email = verifyAdminToken(token);
      if (email && email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
        return {
          email: SUPERADMIN_EMAIL,
          name: 'Super Admin',
          avatar_url: '/images/avatar_default.png',
          role: 'superadmin',
        };
      }
      return null;
    }

    if (process.env.NODE_ENV !== 'production' && (!request || (!request.headers && !request.cookies))) {
      return {
        email: SUPERADMIN_EMAIL,
        name: 'Super Admin (Test Mode)',
        avatar_url: '/images/avatar_default.png',
        role: 'superadmin',
      };
    }

    return null;
  } catch {
    return null;
  }
}

