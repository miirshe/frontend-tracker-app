import { z } from "zod";

// Create user schema (with password required)
export const createUserSchema = z.object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be less than 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    role: z.enum(['user', 'admin'], {
      required_error: 'Please select a role',
    }),
  });


  // Update user schema (password optional)
export const updateUserSchema = z.object({
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be less than 50 characters'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address'),
    role: z.enum(['user', 'admin'], {
      required_error: 'Please select a role',
    }),
  });