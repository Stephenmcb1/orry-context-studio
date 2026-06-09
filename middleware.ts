// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from '@/lib/token';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login page is always public
  if (pathname.startsWith('/login')) return NextResponse.next();

  const token = request.cookies.get('studio_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const payload = await verify(token);
  if (!payload) {
    // Token invalid or expired — clear cookie and redirect
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('studio_session');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
