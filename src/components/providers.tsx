'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { queryClient } from '@/lib/queryClient';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { OnboardingGuard } from './OnboardingGuard';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <OnboardingGuard>
            {children}
          </OnboardingGuard>
          <Toaster
            position="bottom-right"
            toastOptions={{
              unstyled: true,
              classNames: {
                toast: 'w-full flex items-center gap-3 px-4 py-3 rounded-2xl border bg-slate-950/70 border-white/10 backdrop-blur-xl text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.6)] font-sans text-sm font-medium transition-all duration-300',
                title: 'text-sm font-semibold',
                description: 'text-xs text-slate-400',
                success: '!border-emerald-500/20 !text-emerald-400 !bg-emerald-950/25',
                error: '!border-red-500/20 !text-red-400 !bg-red-950/25',
                info: '!border-blue-500/20 !text-blue-400 !bg-blue-950/25',
                warning: '!border-amber-500/20 !text-amber-400 !bg-amber-950/25',
              },
            }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    </NextThemesProvider>
  );
}
