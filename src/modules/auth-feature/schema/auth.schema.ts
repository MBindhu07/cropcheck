import { z } from 'zod';

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number');

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, 'Enter the 6-digit code');
