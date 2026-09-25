import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl') || '/';
  const requestedPersona = searchParams.get('persona') || 'approved';

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    const origin = request.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/callback/google`;
    const scope = encodeURIComponent('openid email profile');
    const state = Buffer.from(JSON.stringify({ returnUrl })).toString('base64');

    const authEndpoint = ['https:', '', 'accounts.google.com', 'o', 'oauth2', 'v2', 'auth'].join('/');
    const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${state}&access_type=online&prompt=consent`;

    return NextResponse.redirect(authUrl);
  }

  // Fallback to test mock login when credentials are not configured in .env.local
  const mockLoginUrl = new URL('/api/auth/mock-login', request.url);
  mockLoginUrl.searchParams.set('persona', requestedPersona);
  mockLoginUrl.searchParams.set('redirect', returnUrl);
  return NextResponse.redirect(mockLoginUrl);
}
