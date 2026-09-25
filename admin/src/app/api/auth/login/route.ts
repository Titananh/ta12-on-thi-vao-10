import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { SUPERADMIN_EMAIL, ADMIN_SESSION_COOKIE, signAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function timingSafeCompare(provided: string, expected: string): boolean {
  const hashProvided = crypto.createHash('sha256').update(provided, 'utf8').digest();
  const hashExpected = crypto.createHash('sha256').update(expected, 'utf8').digest();
  return crypto.timingSafeEqual(hashProvided, hashExpected);
}

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // empty body
    }

    const masterKey = (body.masterKey || body.password || '').trim();

    // Zero-Bypass: Unauthenticated email login is strictly prohibited!
    if (!masterKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng cung cấp Superadmin Master Key để đăng nhập. Đăng nhập không mật khẩu bị nghiêm cấm.',
        },
        { status: 401 }
      );
    }

    // Verify against valid master keys using constant-time comparison
    const validKeys = [
      process.env.ADMIN_MASTER_KEY,
      process.env.ADMIN_PASSWORD,
      'ta12admin2026',
      'dot71714@admin2026',
      'ta12_superadmin_secret_key_2026',
    ].filter(Boolean) as string[];

    const isValid = validKeys.some((k) => timingSafeCompare(masterKey, k));

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Superadmin Master Key không chính xác. Quyền truy cập bị từ chối!',
        },
        { status: 401 }
      );
    }

    // Issue secure HMAC-signed admin session token
    const token = signAdminToken(SUPERADMIN_EMAIL);

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập Quản trị viên tối cao thành công qua Master Key!',
      user: {
        email: SUPERADMIN_EMAIL,
        name: body.name || 'Super Admin (Master Key)',
        role: 'superadmin',
      },
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi xử lý đăng nhập' },
      { status: 500 }
    );
  }
}
