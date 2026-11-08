import { delay } from '@/lib/delay';

import type { AuthSession } from '../types/auth';

export const DEMO_OTP = '123456';

export class AuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthServiceError';
  }
}

// Mock: no SMS goes out. Swap these two for a real OTP provider later.
export async function requestOtp(phone: string): Promise<{ phone: string }> {
  await delay(600);
  return { phone };
}

export async function verifyOtp(phone: string, otp: string): Promise<AuthSession> {
  await delay(700);

  if (otp !== DEMO_OTP) {
    throw new AuthServiceError('That code is incorrect. Check it and try again.');
  }

  return {
    phone,
    token: `demo-${Date.now().toString(36)}`,
    signedInAt: new Date().toISOString(),
    isDemo: true,
  };
}
