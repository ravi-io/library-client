'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginInput } from '../schemas';
import { authClient } from '@/lib/auth-client';
import { Mail, Lock, Loader2, ShieldAlert } from 'lucide-react';
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
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
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
        const msg = authError.message || 'Invalid email or password';
        setError(msg);
        toast.error(msg);
      } else {
        toast.success('Logged in successfully');
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border-slate-800 shadow-xl text-slate-100 p-6 md:p-8 gap-0">
      <CardHeader className="flex flex-col items-center space-y-1.5 p-0 pb-6">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-sm text-slate-400">
          Sign in to manage your library dashboard
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {error && (
          <div className="flex items-center gap-3 p-3.5 mb-5 text-sm rounded-xl bg-destructive/10 border border-destructive/20 text-destructive-foreground">
            <ShieldAlert className="w-4.5 h-4.5 shrink-0 text-destructive" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-slate-300 text-xs font-semibold"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="pl-10 h-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-transparent rounded-xl text-sm"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="password"
              className="text-slate-300 text-xs font-semibold"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="pl-10 h-10 bg-slate-950/50 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary focus-visible:border-transparent rounded-xl text-sm"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full mt-2 h-10 bg-primary text-primary-foreground hover:bg-primary-dark font-semibold shadow-md transition-all cursor-pointer rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="pt-6 mt-6 border-t border-slate-800/50 flex justify-center text-sm text-slate-400">
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
