'use client';

import React from 'react';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';
import { Lock, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ResetPasswordForm() {
  const { register, handleSubmit, errors, isValid, error, isLoading } =
    useResetPasswordForm();

  return (
    <Card className="w-full max-w-[380px] bg-slate-950/40 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-2xl p-6 sm:p-7 gap-0">
      <CardHeader className="flex flex-col items-center space-y-1 p-0 pb-5">
        <CardTitle className="text-xl font-bold tracking-tight text-white">
          Reset Password
        </CardTitle>
        <CardDescription className="text-xs text-slate-400 text-center">
          Enter a new password below to update your account access
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {error && (
          <div className="flex items-center gap-3 p-3 mb-4 text-xs rounded-xl bg-destructive/10 border border-destructive/20 text-destructive-foreground">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-destructive" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-slate-400 text-[10px] font-medium tracking-wide uppercase"
            >
              New Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="pl-9 h-9 bg-slate-950/35 border-slate-800/80 text-white placeholder:text-slate-500/70 focus-visible:ring-1 focus-visible:ring-primary/45 focus-visible:border-primary/45 rounded-xl text-xs transition-colors duration-200"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-[10px] text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="confirmPassword"
              className="text-slate-400 text-[10px] font-medium tracking-wide uppercase"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="••••••••"
                className="pl-9 h-9 bg-slate-950/35 border-slate-800/80 text-white placeholder:text-slate-500/70 focus-visible:ring-1 focus-visible:ring-primary/45 focus-visible:border-primary/45 rounded-xl text-xs transition-colors duration-200"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-[10px] text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full mt-2 h-9 bg-primary text-primary-foreground hover:bg-primary-dark font-semibold shadow-md transition-all duration-200 cursor-pointer rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                Updating Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>

          <div className="pt-4 mt-5 border-t border-slate-800/50 flex justify-center text-xs text-slate-400">
            Remembered your password?{' '}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-all ml-1"
            >
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
