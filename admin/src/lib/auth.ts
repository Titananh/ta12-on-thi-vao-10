import crypto from 'crypto';
import { cookies } from 'next/headers';

export const SUPERADMIN_EMAIL = 'dot71714@gmail.com';
export const ADMIN_SESSION_COOKIE = 'ta12_admin_session';
const AUTH_SECRET = process.env.AUTH_SECRET || 'ta12_admin_super_secret_portal_2026';

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

export function verifyAdminToken(token: string): string | null {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 3) return null;
    const [email, ts, sig] = parts;
    if (!email || !ts || !sig) return null;

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
      role: 'superadmin'
    };
  } catch {
    return null;
  }
}
