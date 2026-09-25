import { NextRequest, NextResponse } from 'next/server';
import { verifyOAuthState, verifyGoogleIdToken } from '@/lib/google-auth';
import { SUPERADMIN_EMAIL, ADMIN_SESSION_COOKIE, signAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');

  const origin = request.nextUrl.origin;

  // Handle Google OAuth cancellation or consent denial
  if (oauthError) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('error', `oauth_${oauthError}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code || !state) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('error', 'missing_code_or_state');
    return NextResponse.redirect(redirectUrl);
  }

  // 1. Verify CSRF State
  const stateResult = verifyOAuthState(state);
  if (!stateResult.valid) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('error', 'invalid_state');
    return NextResponse.redirect(redirectUrl);
  }

  // Check state cookie if present
  const stateCookie = request.cookies?.get('ta12_admin_oauth_state')?.value;
  if (stateCookie && stateCookie !== state) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('error', 'state_mismatch');
    return NextResponse.redirect(redirectUrl);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('error', 'oauth_unconfigured');
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const redirectUri = `${origin}/api/auth/callback/google`;
    const tokenUrl = 'https://oauth2.googleapis.com/token';

    // 2. Exchange authorization code for tokens
    const tokenRes = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      console.error('Google token exchange error:', await tokenRes.text());
      const redirectUrl = new URL('/', origin);
      redirectUrl.searchParams.set('error', 'token_exchange_failed');
      return NextResponse.redirect(redirectUrl);
    }

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;

    if (!idToken) {
      const redirectUrl = new URL('/', origin);
      redirectUrl.searchParams.set('error', 'missing_id_token');
      return NextResponse.redirect(redirectUrl);
    }

    // 3. Cryptographically verify id_token signature and claims using native Node.js crypto
    const payload = await verifyGoogleIdToken(idToken, clientId);

    const email = payload.email.toLowerCase().trim();
    const isEmailVerified = payload.email_verified === true;

    // 4. Strict Zero-Bypass Gate: ONLY dot71714@gmail.com with email_verified === true
    if (email === SUPERADMIN_EMAIL.toLowerCase() && isEmailVerified) {
      const sessionToken = signAdminToken(SUPERADMIN_EMAIL);
      const returnUrl = stateResult.data?.returnUrl || '/';
      const redirectUrl = new URL(returnUrl, origin);

      const response = NextResponse.redirect(redirectUrl);

      // Set secure admin session cookie
      response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      // Clear state cookie
      response.cookies.set('ta12_admin_oauth_state', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
      });

      return response;
    }

    // 5. ANY OTHER EMAIL: 403 Forbidden rejection redirect
    const forbiddenUrl = new URL('/', origin);
    forbiddenUrl.searchParams.set('error', 'forbidden');
    forbiddenUrl.searchParams.set('email', email);

    const response = NextResponse.redirect(forbiddenUrl, { status: 303 });
    // Clear any existing admin session if non-admin attempted to login
    response.cookies.set(ADMIN_SESSION_COOKIE, '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });
    return response;
  } catch (err: any) {
    console.error('Admin Google OAuth callback error:', err);
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('error', 'auth_failed');
    redirectUrl.searchParams.set('message', err.message || 'Verification failed');
    return NextResponse.redirect(redirectUrl);
  }
}
