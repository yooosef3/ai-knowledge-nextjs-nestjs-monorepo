import { z } from 'zod';

export type AuthMessages = {
  email: string;
  passwordRequired: string;
  passwordMin: string;
};

export function createLoginSchema(messages: AuthMessages) {
  return z.object({
    email: z.string().email(messages.email),
    password: z.string().min(1, messages.passwordRequired),
  });
}

export function createRegisterSchema(messages: AuthMessages) {
  return z.object({
    email: z.string().email(messages.email),
    password: z.string().min(8, messages.passwordMin),
    name: z.string().optional(),
  });
}

export const loginSchema = createLoginSchema({
  email: 'Enter a valid email',
  passwordRequired: 'Password is required',
  passwordMin: 'Password must be at least 8 characters',
});

export const registerSchema = createRegisterSchema({
  email: 'Enter a valid email',
  passwordRequired: 'Password is required',
  passwordMin: 'Password must be at least 8 characters',
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
