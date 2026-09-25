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

export function verifySessionToken(token: string): string | null {
  try {
    const cleanToken = decodeURIComponent(token);
    const raw = Buffer.from(cleanToken, 'base64').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 3) return null;
    const [userId, ts, sig] = parts;
    if (!userId || !ts || !sig) return null;
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
