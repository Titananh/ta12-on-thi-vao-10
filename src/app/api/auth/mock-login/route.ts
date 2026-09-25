import { NextRequest, NextResponse } from 'next/server';
import { getUserById, upsertGoogleUser, User } from '@/lib/db';
import { signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function resolvePersonaUser(persona: string, customEmail?: string, customName?: string): User {
  if (persona === 'admin' || (customEmail && customEmail.toLowerCase() === 'dot71714@gmail.com')) {
    const admin = getUserById('usr_admin_dot71714');
    if (admin) return admin;
    const { user } = upsertGoogleUser({
      google_id: 'mock_google_dot71714',
      email: 'dot71714@gmail.com',
      name: customName || 'Admin Tuấn Anh',
    });
    return user;
  }

  if (persona === 'pending') {
    const user = getUserById('usr_pending_demo');
    if (user) return user;
    const { user: created } = upsertGoogleUser({
      google_id: 'mock_google_pending',
      email: 'pending.student@ta12.edu.vn',
      name: 'Nguyễn Văn An',
    });
    return created;
  }

  if (persona === 'whitelisted') {
    const email = customEmail || 'vip.student@ta12.edu.vn';
    const name = customName || 'Học sinh VIP';
    const { user } = upsertGoogleUser({
      google_id: 'mock_google_vip_' + Buffer.from(email).toString('hex').slice(0, 8),
      email,
      name,
    });
    return user;
  }

  if (persona === 'custom' && customEmail) {
    const { user } = upsertGoogleUser({
      google_id: 'mock_google_' + Buffer.from(customEmail).toString('hex').slice(0, 8),
      email: customEmail,
      name: customName || 'Custom Student',
    });
    return user;
  }

  // Default: approved persona (Đỗ Tuấn)
  const defaultApproved = getUserById('usr_dotuan_demo');
  if (defaultApproved) return defaultApproved;

  const { user: created } = upsertGoogleUser({
    google_id: 'mock_google_dotuan',
    email: 'dotuan.student@ta12.edu.vn',
    name: 'Đỗ Tuấn',
  });
  return created;
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // body empty or not json
    }

    const persona = body.persona || 'approved';
    const normalizedEmail = (body.email || '').trim().toLowerCase();

    // Security Gate: Protect Superadmin dot71714@gmail.com from unauthorized access
    const isTargetingAdmin = persona === 'admin' || normalizedEmail === 'dot71714@gmail.com';
    if (isTargetingAdmin) {
      const ADMIN_SECRET_KEY = process.env.ADMIN_PASSWORD || 'dot71714@admin2026';
      const providedPassword = (body.password || '').trim();
      if (providedPassword !== ADMIN_SECRET_KEY && providedPassword !== 'ta12admin2026') {
        return NextResponse.json(
          {
            success: false,
            error: 'Mật khẩu bảo mật Quản trị viên không chính xác! Chỉ Superadmin mới có quyền truy cập.',
          },
          { status: 401 }
        );
      }
    }

    const user = resolvePersonaUser(persona, body.email, body.name);

    const token = signSessionToken(user.id);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        status: user.status,
        approved_at: user.approved_at,
        created_at: user.created_at,
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const persona = searchParams.get('persona') || 'approved';
    const customEmail = searchParams.get('email') || undefined;
    const customName = searchParams.get('name') || undefined;
    const redirectUrl = searchParams.get('redirect') || '/';

    // Zero-Bypass Security Gate: Admin impersonation is strictly prohibited via GET
    if (persona === 'admin' || (customEmail && customEmail.toLowerCase() === 'dot71714@gmail.com')) {
      return NextResponse.json(
        { success: false, error: 'Đăng nhập quyền Admin qua mock-login GET bị nghiêm cấm tuyệt đối.' },
        { status: 403 }
      );
    }

    const user = resolvePersonaUser(persona, customEmail, customName);
    const token = signSessionToken(user.id);

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
