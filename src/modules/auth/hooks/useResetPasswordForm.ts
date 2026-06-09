import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordInput } from '../schemas';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';

export function useResetPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setError(null);
    try {
      // Better Auth handles parsing the ?token=xxx query param automatically from the URL
      const { error: authError } = await authClient.resetPassword({
        newPassword: data.password,
      });

      if (authError) {
        const msg = authError.message || 'Failed to reset password';
        setError(msg);
        toast.error(msg);
      } else {
        toast.success('Password reset successful! Please log in.');
        router.push('/login');
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

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    error,
    isLoading,
  };
}
