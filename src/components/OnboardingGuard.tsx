'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  const isAuthPage = ['/login', '/signup', '/reset-password'].includes(
    pathname
  );
  const isOnboardingPage = pathname === '/onboarding';
  const isPublicPage = pathname === '/' || isAuthPage;
  const isPublicOrOnboarding = isPublicPage || isOnboardingPage;

  useEffect(() => {
    if (isPending) return;

    if (session) {
      const hasCompletedOnboarding =
        !!session.user.university &&
        !!session.user.department &&
        !!session.user.course &&
        session.user.idCardUrls &&
        session.user.idCardUrls.length >= 2 &&
        !!session.user.idCardUrls[0] &&
        !!session.user.idCardUrls[1];

      if (!hasCompletedOnboarding && !isOnboardingPage && !isAuthPage) {
        // Logged in but hasn't completed onboarding -> force onboarding
        router.push('/onboarding');
      } else if (hasCompletedOnboarding && isOnboardingPage) {
        // Completed onboarding but trying to access onboarding page -> go to home
        router.push('/');
      }
    } else {
      // User is not logged in
      if (!isPublicPage) {
        // Trying to access a protected page but not logged in -> go to login
        router.push('/login');
      }
    }
  }, [session, isPending, pathname, router, isAuthPage, isOnboardingPage, isPublicPage]);

  if (isPending && !isPublicOrOnboarding) {
    return <div className="min-h-screen bg-slate-950" />;
  }

  return <>{children}</>;
}
