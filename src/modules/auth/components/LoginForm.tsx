'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginInput } from '../schemas';
import { authClient } from '@/lib/auth-client';
import { Mail, Lock, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: authError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        setError(authError.message || 'Invalid email or password');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl text-slate-100">
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Sign in to manage your library dashboard
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 mb-4 text-sm rounded-lg bg-danger/10 border border-danger/20 text-danger">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2 border border-slate-800 bg-slate-950/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-500"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-slate-300">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="password"
              {...register('password')}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2 border border-slate-800 bg-slate-950/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-slate-500"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary text-primary-foreground hover:bg-primary-dark font-medium rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-blue-400 hover:text-blue-300 font-semibold transition-all"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
