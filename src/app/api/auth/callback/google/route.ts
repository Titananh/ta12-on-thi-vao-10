import { NextRequest, NextResponse } from 'next/server';
import { verifyOAuthState, verifyGoogleIdToken } from '@/lib/google-auth';
import { upsertGoogleUser } from '@/lib/db';
import { signSessionToken, SESSION_COOKIE_NAME, SUPERADMIN_EMAIL, ADMIN_SESSION_COOKIE, signAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const oauthError = searchParams.get('error');

  const origin = request.nextUrl.origin;

  // Handle Google OAuth cancellation or error
  if (oauthError) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('auth_error', `oauth_${oauthError}`);
    return NextResponse.redirect(redirectUrl);
  }

  if (!code || !state) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('auth_error', 'missing_code_or_state');
    return NextResponse.redirect(redirectUrl);
  }

  // 1. Verify CSRF State
  const stateResult = verifyOAuthState(state);
  if (!stateResult.valid) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('auth_error', 'invalid_state');
    return NextResponse.redirect(redirectUrl);
  }

  const portal = stateResult.data?.portal || 'student';
  const stateCookieName = portal === 'admin' ? 'ta12_admin_oauth_state' : 'ta12_oauth_state';
  const stateCookie = request.cookies?.get(stateCookieName)?.value || request.cookies?.get('ta12_oauth_state')?.value;

  if (stateCookie && stateCookie !== state) {
    const redirectUrl = new URL(portal === 'admin' ? '/admin' : '/', origin);
    redirectUrl.searchParams.set(portal === 'admin' ? 'error' : 'auth_error', 'state_mismatch');
    return NextResponse.redirect(redirectUrl);
  }

  const returnUrl = stateResult.data?.returnUrl || (portal === 'admin' ? '/admin' : '/');
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    const redirectUrl = new URL('/', origin);
    redirectUrl.searchParams.set('auth_error', 'oauth_unconfigured');
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const redirectUri = `${origin}/api/auth/callback/google`;
    const tokenUrl = ['https:', '', 'oauth2.googleapis.com', 'token'].join('/');

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
      console.error('Failed to exchange Google OAuth code:', await tokenRes.text());
      const redirectUrl = new URL(returnUrl, origin);
      redirectUrl.searchParams.set('auth_error', 'token_exchange_failed');
      return NextResponse.redirect(redirectUrl);
    }

    const tokenData = await tokenRes.json();
    const idToken = tokenData.id_token;

    if (!idToken) {
      const redirectUrl = new URL(returnUrl, origin);
      redirectUrl.searchParams.set('auth_error', 'missing_id_token');
      return NextResponse.redirect(redirectUrl);
    }

    // 3. Cryptographically verify id_token signature and claims using RS256 JWKS
    const payload = await verifyGoogleIdToken(idToken, clientId);

    // 4. Extract verified claims
    const email = payload.email.toLowerCase().trim();
    const isEmailVerified = payload.email_verified === true || (payload.email_verified as any) === 'true';

    // -------------------------------------------------------------------------
    // PORTAL === 'admin': Strict Zero-Bypass Superadmin Gate
    // -------------------------------------------------------------------------
    if (portal === 'admin') {
      if (email === SUPERADMIN_EMAIL.toLowerCase() && isEmailVerified) {
        const sessionToken = signAdminToken(SUPERADMIN_EMAIL);
        const destination = returnUrl.startsWith('/admin') ? returnUrl : '/admin';
        const response = NextResponse.redirect(new URL(destination, origin));

        response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        response.cookies.set('ta12_admin_oauth_state', '', {
          httpOnly: true,
          path: '/',
          maxAge: 0,
        });
        response.cookies.set('ta12_oauth_state', '', {
          httpOnly: true,
          path: '/',
          maxAge: 0,
        });

        return response;
      }

      // Imposter / non-admin account: 403 Forbidden redirect to /admin
      const forbiddenUrl = new URL('/admin', origin);
      forbiddenUrl.searchParams.set('error', 'forbidden');
      forbiddenUrl.searchParams.set('email', email);
      const response = NextResponse.redirect(forbiddenUrl, { status: 303 });
      response.cookies.set(ADMIN_SESSION_COOKIE, '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
      });
      return response;
    }

    // -------------------------------------------------------------------------
    // PORTAL === 'student': Student Registration & Approval Gate
    // -------------------------------------------------------------------------
    const googleId = payload.sub;
    const name = payload.name;
    const avatarUrl = payload.picture || null;

    // 5. Upsert user into SQLite (pre_whitelist -> approved, existing -> keep status, new -> pending)
    const { user } = upsertGoogleUser({
      google_id: googleId,
      email,
      name,
      avatar_url: avatarUrl,
    });

    // 6. Issue HMAC session cookie ta12_session
    const token = signSessionToken(user.id);
    const response = NextResponse.redirect(new URL(returnUrl, origin));

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Clear CSRF state cookie
    response.cookies.set('ta12_oauth_state', '', {
      httpOnly: true,
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    const redirectUrl = new URL(returnUrl, origin);
    redirectUrl.searchParams.set('auth_error', 'auth_failed');
    redirectUrl.searchParams.set('message', error.message || 'Verification failed');
    return NextResponse.redirect(redirectUrl);
  }
}
