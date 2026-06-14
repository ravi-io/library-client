import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { signUpSchema, SignUpInput } from '../schemas';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export function useSignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: authError } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (authError) {
        const msg = authError.message || 'Failed to create an account';
        setError(msg);
        toast.error(msg);
      } else {
        toast.success('Account created successfully!');
        router.push('/onboarding');
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
    handleSocialSignIn,
  };
}
