import { NextRequest, NextResponse } from 'next/server';
import { SUPERADMIN_EMAIL, ADMIN_SESSION_COOKIE, signAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // empty body
    }

    const email = (body.email || '').trim().toLowerCase();

    // Strict validation: ONLY dot71714@gmail.com is allowed!
    if (email !== SUPERADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          error: `Quyền truy cập bị từ chối! Tài khoản '${email || 'Ẩn danh'}' không phải là Quản trị viên tối cao. Chỉ chấp nhận duy nhất: ${SUPERADMIN_EMAIL}`,
          allowed_admin: SUPERADMIN_EMAIL
        },
        { status: 403 }
      );
    }

    // Generate secure admin HMAC token
    const token = signAdminToken(SUPERADMIN_EMAIL);

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập Quản trị viên thành công!',
      user: {
        email: SUPERADMIN_EMAIL,
        name: body.name || 'Super Admin (dot71714)',
        role: 'superadmin'
      }
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Lỗi xử lý đăng nhập' },
      { status: 500 }
    );
  }
}
