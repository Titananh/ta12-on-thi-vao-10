import { NextRequest, NextResponse } from 'next/server';
import { generateOAuthState } from '@/lib/google-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const returnUrl = searchParams.get('returnUrl') || '/';

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // If credentials are not configured, redirect to login page with error flag
  if (!clientId || !clientSecret) {
    const errorUrl = new URL('/', request.url);
    errorUrl.searchParams.set('error', 'oauth_unconfigured');
    return NextResponse.redirect(errorUrl);
  }

  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;
  const scope = encodeURIComponent('openid email profile');
  const state = generateOAuthState({ returnUrl, portal: 'admin' });

  const authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
  const authUrl = `${authEndpoint}?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&state=${encodeURIComponent(
    state
  )}&access_type=online&prompt=select_account`;

  const response = NextResponse.redirect(authUrl);

  // Set CSRF state cookie with 10-minute expiry
  response.cookies.set('ta12_admin_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 10 * 60, // 10 minutes
  });

  return response;
}
