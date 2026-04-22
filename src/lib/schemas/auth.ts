import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

export const RegisterSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255),
    email: z.string().trim().email('Invalid email address').max(255),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255),
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const ResendVerificationSchema = z.object({
  email: z.string().trim().email('Invalid email address').max(255),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
