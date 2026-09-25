import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Đăng xuất thành công'
  });

  response.cookies.delete(ADMIN_SESSION_COOKIE);
  return response;
}
