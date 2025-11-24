import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import prisma from '@/lib/prisma';
import { sendEmail } from '@/app/services/email-service';
import {
  getPasswordResetEmail,
  getVerificationEmail,
} from '@/app/services/auth-email-service';
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
    },
  },
  trustedOrigins:
    process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_APP_URL
      ? [process.env.NEXT_PUBLIC_APP_URL]
      : undefined,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      // Extract user name or use email username as fallback
      const name = user.name || user.email.split('@')[0];

      await sendEmail({
        to: user.email,
        subject: 'Reset your password - PicturemeAI',
        html: getPasswordResetEmail(name, url),
      });

      console.log('Password reset email sent successfully');
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log('Email verification triggered for:', user.email);
      console.log('Verification URL:', url);

      // Extract user name or use email username as fallback
      const name = user.name || user.email.split('@')[0];

      await sendEmail({
        to: user.email,
        subject: 'Verify your email - PicturemeAI',
        html: getVerificationEmail(name, url),
      });
    },
  },
  socialProviders: {
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID as string,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    // },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

/**
 * Check if authentication is disabled for development
 * WARNING: Only use in local development, never in production!
 */
export function isAuthDisabled(): boolean {
  return (
    process.env.DISABLE_AUTH === 'true' &&
    process.env.NODE_ENV === 'development'
  );
}

/**
 * Get a mock session for development when authentication is disabled
 * This allows testing functionality without going through the login flow
 */
export function getMockSession() {
  if (!isAuthDisabled()) {
    return null;
  }

  // Return a mock session with a test user
  return {
    user: {
      id: 'dev-test-user-id',
      email: 'dev@test.com',
      name: 'Dev Test User',
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      token: 'dev-mock-session-token',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      userId: 'dev-test-user-id',
      ipAddress: '127.0.0.1',
      userAgent: 'dev-mode',
    },
  };
}
