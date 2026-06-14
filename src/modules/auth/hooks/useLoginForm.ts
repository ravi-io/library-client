import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginInput } from '../schemas';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export function useLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const emailValue = useWatch({
    control: form.control,
    name: 'email',
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: resData, error: authError } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        const msg = authError.message || 'Invalid email or password';
        setError(msg);
        toast.error(msg);
      } else {
        toast.success('Logged in successfully');
        
        const user = resData?.user;
        const hasCompletedOnboarding =
          user &&
          !!user.university &&
          !!user.department &&
          !!user.course &&
          user.idCardUrls &&
          user.idCardUrls.length >= 2 &&
          !!user.idCardUrls[0] &&
          !!user.idCardUrls[1];

        if (hasCompletedOnboarding) {
          router.push('/');
        } else {
          router.push('/onboarding');
        }
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

  const handleForgetPassword = async () => {
    const email = form.getValues('email');
    if (!email) {
      setError('Please enter your email address to reset password');
      toast.error('Email address is required');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const { error: authError } = await authClient.requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      });

      if (authError) {
        setError(authError.message || 'Failed to request password reset');
        toast.error(authError.message || 'Failed to request password reset');
      } else {
        toast.success('Password reset link sent to your email!');
        setIsForgotPassword(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (_provider: 'google' | 'github') => {
    toast.info('This feature is coming soon, currently not available.');
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    error,
    isLoading,
    isForgotPassword,
    setIsForgotPassword,
    handleForgetPassword,
    emailValue,
    handleSocialSignIn,
  };
}
