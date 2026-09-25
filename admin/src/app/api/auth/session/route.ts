import { NextResponse } from 'next/server';
import { getCurrentAdmin, SUPERADMIN_EMAIL } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({
      authenticated: false,
      user: null,
      required_email: 'ADMIN'
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      ...admin,
      email: 'ADMIN',
      display_email: 'ADMIN',
    },
    required_email: 'ADMIN'
  });
}
