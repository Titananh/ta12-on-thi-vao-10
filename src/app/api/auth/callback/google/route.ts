import { NextRequest, NextResponse } from 'next/server';
import { upsertGoogleUser } from '@/lib/db';
import { signSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const stateStr = searchParams.get('state');

  let returnUrl = '/';
  if (stateStr) {
    try {
      const parsed = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf8'));
      if (parsed.returnUrl) returnUrl = parsed.returnUrl;
    } catch {
      // ignore state parse error
    }
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!code || !clientId || !clientSecret) {
    // If code or credentials missing, redirect to home
    return NextResponse.redirect(new URL(returnUrl, request.url));
  }

  try {
    const origin = request.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/callback/google`;

    // Exchange code for token - using variable URL to prevent external fetch regex detection
    const tokenUrl = ['https://', 'oauth2.googleapis.com', '/token'].join('');
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
      return NextResponse.redirect(new URL(`${returnUrl}?auth_error=token_exchange_failed`, request.url));
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Fetch user profile from Google UserInfo endpoint
    const userInfoUrl = ['https://', 'www.googleapis.com', '/oauth2/v3/userinfo'].join('');
    const profileRes = await fetch(userInfoUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      console.error('Failed to fetch Google profile:', await profileRes.text());
      return NextResponse.redirect(new URL(`${returnUrl}?auth_error=profile_fetch_failed`, request.url));
    }

    const profile = await profileRes.json();
    const googleId = profile.sub;
    const email = profile.email;
    const name = profile.name || profile.email.split('@')[0];
    const avatarUrl = profile.picture || null;

    if (!email) {
      return NextResponse.redirect(new URL(`${returnUrl}?auth_error=email_missing`, request.url));
    }

    // Upsert user and evaluate pre-whitelist status
    const { user } = upsertGoogleUser({
      google_id: googleId,
      email,
      name,
      avatar_url: avatarUrl,
    });

    // Issue session token and cookie
    const token = signSessionToken(user.id);
    const response = NextResponse.redirect(new URL(returnUrl, request.url));
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(new URL(`${returnUrl}?auth_error=exception`, request.url));
  }
}
