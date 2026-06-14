import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define route classifications
  const isAuthPage = ['/login', '/signup', '/reset-password'].includes(pathname);
  const isOnboardingPage = pathname === '/onboarding';
  const isPublicPage = pathname === '/' || isAuthPage;

  // Check for the better-auth session token cookies
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__secure-better-auth.session_token')?.value;

  const baseURL = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
    : 'http://localhost:5000';

  // If user is not logged in:
  if (!sessionToken) {
    // If trying to access a protected (non-public) page, redirect to login
    if (!isPublicPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If user is logged in, fetch session to check onboarding status
  try {
    const response = await fetch(`${baseURL}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });

    if (response.ok) {
      const data = await response.json();
      const user = data?.user;
      const hasCompletedOnboarding =
        user &&
        !!user.university &&
        !!user.department &&
        !!user.course &&
        user.idCardUrls &&
        user.idCardUrls.length >= 2 &&
        !!user.idCardUrls[0] &&
        !!user.idCardUrls[1];

      // 1. If user has not completed onboarding:
      if (!hasCompletedOnboarding) {
        if (!isOnboardingPage) {
          return NextResponse.redirect(new URL('/onboarding', request.url));
        }
      } else {
        // 2. If user has completed onboarding:
        if (isOnboardingPage || isAuthPage) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }
  } catch (err) {
    console.error('Middleware session fetch failed:', err);
  }

  return NextResponse.next();
}

export const config = {
  // Run middleware on all paths except static files/images/api
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)'],
};
