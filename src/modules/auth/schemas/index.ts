import { z } from 'zod';

const isSafeInput = (val: string) => {
  const lowerVal = val.toLowerCase();
  // Reject HTML tag patterns
  if (/<[^>]*>/g.test(val)) return false;
  // Reject SQL injection comments and block sequences
  if (val.includes('--') || val.includes('/*') || val.includes('*/')) return false;
  // Reject javascript: injection prefix
  if (lowerVal.includes('javascript:')) return false;
  return true;
};

export const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address')
    .refine(isSafeInput, { message: 'Email contains suspicious characters or tags' }),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .refine((val) => !val.toLowerCase().includes('<script>'), {
      message: 'Password cannot contain script tags',
    }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .regex(/^[^<>]*$/, 'Name cannot contain HTML brackets')
      .refine(isSafeInput, { message: 'Name contains suspicious characters or SQL sequences' }),
    email: z
      .string()
      .email('Please enter a valid email address')
      .refine(isSafeInput, { message: 'Email contains suspicious characters or tags' }),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .refine((val) => !val.toLowerCase().includes('<script>'), {
        message: 'Password cannot contain script tags',
      }),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
