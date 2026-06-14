'use client';

import React from 'react';
import { useLoginForm } from '../hooks/useLoginForm';
import { SocialAuthButtons } from './SocialAuthButtons';
import { Mail, Lock, Loader2, ShieldAlert, ArrowLeft } from 'lucide-react';
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

export function LoginForm() {
  const {
    register,
    handleSubmit,
    errors,
    isValid,
    error,
    isLoading,
    isForgotPassword,
    setIsForgotPassword,
    handleForgetPassword,
    emailValue,
    handleSocialSignIn,
  } = useLoginForm();

  if (isForgotPassword) {
    return (
      <Card className="w-full max-w-[380px] bg-slate-950/40 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-2xl p-6 sm:p-7 gap-0">
        <CardHeader className="flex flex-col items-center space-y-1 p-0 pb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsForgotPassword(false)}
            className="self-start gap-1 text-[11px] text-slate-400 hover:text-white mb-2 p-0 h-auto hover:bg-transparent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </Button>
          <CardTitle className="text-xl font-bold tracking-tight text-white self-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-xs text-slate-400 text-center">
            Enter your email and we&apos;ll send you a password reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          {error && (
            <div className="flex items-center gap-3 p-3 mb-4 text-xs rounded-xl bg-red-500/10 border border-red-500/25 text-red-200">
              <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-slate-400 text-[10px] font-medium tracking-wide uppercase"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className="pl-9 h-9 bg-slate-950/35 border-slate-800/80 text-white placeholder:text-slate-500/70 focus-visible:ring-1 focus-visible:ring-primary/45 focus-visible:border-primary/45 rounded-xl text-xs transition-colors duration-200"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[10px] text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              onClick={handleForgetPassword}
              disabled={isLoading || !emailValue}
              className="w-full mt-2 h-9 bg-primary text-primary-foreground hover:bg-primary-dark font-semibold shadow-md transition-all duration-200 cursor-pointer rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                  Sending Link...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-[380px] bg-slate-950/40 backdrop-blur-xl border border-slate-800/80 shadow-2xl rounded-2xl p-6 sm:p-7 gap-0">
      <CardHeader className="flex flex-col items-center space-y-1 p-0 pb-5">
        <CardTitle className="text-xl font-bold tracking-tight text-white">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-xs text-slate-400">
          Sign in to manage your library dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {error && (
          <div className="flex items-center gap-3 p-3 mb-4 text-xs rounded-xl bg-red-500/10 border border-red-500/25 text-red-200">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-slate-400 text-[10px] font-medium tracking-wide uppercase"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="pl-9 h-9 bg-slate-950/35 border-slate-800/80 text-white placeholder:text-slate-500/70 focus-visible:ring-1 focus-visible:ring-primary/45 focus-visible:border-primary/45 rounded-xl text-xs transition-colors duration-200"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-[10px] text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <Label
                htmlFor="password"
                className="text-slate-400 text-[10px] font-medium tracking-wide uppercase"
              >
                Password
              </Label>
              <button
                type="button"
                onClick={() => setIsForgotPassword(true)}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer transition-colors"
              >
                Forgot Password?
              </button>
            </div>
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

          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full mt-2 h-9 bg-primary text-primary-foreground hover:bg-primary-dark font-semibold shadow-md transition-all duration-200 cursor-pointer rounded-xl text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <SocialAuthButtons
            isLoading={isLoading}
            onSignIn={handleSocialSignIn}
          />

          <div className="pt-4 mt-5 border-t border-slate-800/50 flex justify-center text-xs text-slate-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-all ml-1"
            >
              Sign up
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
