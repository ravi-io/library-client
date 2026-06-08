import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for the better-auth session token cookies
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__secure-better-auth.session_token')?.value;

  const { pathname } = request.nextUrl;

  // If the user has a session and is trying to access auth pages, redirect to home page
  if (sessionToken && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/signup'],
};
