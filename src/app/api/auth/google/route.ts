import { NextRequest, NextResponse } from 'next/server';
import { generateOAuthState } from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl') || '/';
  const requestedPersona = searchParams.get('persona') || 'approved';
  const portal = searchParams.get('portal') || (returnUrl.startsWith('/admin') ? 'admin' : 'student');

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    const origin = request.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/callback/google`;
    const scope = encodeURIComponent('openid email profile');
    const state = generateOAuthState({ returnUrl, portal });

    const authEndpoint = ['https:', '', 'accounts.google.com', 'o', 'oauth2', 'v2', 'auth'].join('/');
    const authUrl = `${authEndpoint}?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code&scope=${scope}&state=${encodeURIComponent(state)}&access_type=online&prompt=select_account`;

    const response = NextResponse.redirect(authUrl);

    // Set CSRF state cookie with 10-minute expiry
    response.cookies.set('ta12_oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60, // 10 minutes
    });

    if (portal === 'admin') {
      response.cookies.set('ta12_admin_oauth_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 10 * 60,
      });
    }

    return response;
  }

  // When credentials are not configured in production, redirect with error flag
  if (process.env.NODE_ENV === 'production') {
    const errorUrl = new URL(portal === 'admin' ? '/admin' : '/', request.url);
    if (portal === 'admin') {
      errorUrl.searchParams.set('error', 'oauth_unconfigured');
    } else {
      errorUrl.searchParams.set('auth_error', 'oauth_unconfigured');
    }
    return NextResponse.redirect(errorUrl);
  }

  // Fallback to test mock login when credentials are not configured in offline dev/test environment
  const mockLoginUrl = new URL('/api/auth/mock-login', request.url);
  mockLoginUrl.searchParams.set('persona', requestedPersona);
  mockLoginUrl.searchParams.set('redirect', returnUrl);
  return NextResponse.redirect(mockLoginUrl);
}
