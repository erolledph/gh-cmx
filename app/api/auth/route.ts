import { NextRequest, NextResponse } from 'next/server';
import { checkAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (checkAuth(password)) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
