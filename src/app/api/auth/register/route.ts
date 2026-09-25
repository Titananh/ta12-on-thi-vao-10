import { NextRequest, NextResponse } from 'next/server';
import { POST as handleLogin } from '../login/route';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    body.mode = 'register';
    const modifiedReq = new NextRequest(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(body),
    });
    return handleLogin(modifiedReq);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
