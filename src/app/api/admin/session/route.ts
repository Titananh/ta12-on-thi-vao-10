import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession, getCurrentAdmin, SUPERADMIN_EMAIL } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  let admin = await requireAdminSession(request);
  if (!admin) {
    admin = await getCurrentAdmin();
  }

  if (!admin) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      required_email: SUPERADMIN_EMAIL
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: admin,
    required_email: SUPERADMIN_EMAIL
  });
}
