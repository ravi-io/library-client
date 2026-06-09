'use client';

import React, { Suspense } from 'react';
import { ResetPasswordForm } from '@/modules/auth/components/ResetPasswordForm';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-slate-400">Loading form...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
