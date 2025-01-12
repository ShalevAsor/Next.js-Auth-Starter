/**
 * Token Generation and Management Module
 * Handles creation and management of various security tokens:
 * - Two-Factor Authentication tokens
 * - Email verification tokens
 * - Password reset tokens
 */
import crypto from "crypto";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
import { AUTH } from "@/constants";
import { getVerificationTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

/**
 * Generates a new two-factor authentication token
 * Creates a 6-digit numerical token for 2FA verification
 *
 * @param email - The user's email address
 * @returns The created two-factor token object
 */

export const generateTwoFactorToken = async (email: string) => {
  // Generate a random 6-digit number between 100,000 and 999,999
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(
    new Date().getTime() + AUTH.TWO_FACTOR_TOKEN.EXPIRES_IN
  );
  // Delete any existing token for this email
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.twoFactorToken.delete({ where: { id: existingToken.id } });
  }
  // Create and return new token
  const twoFactorToken = await db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return twoFactorToken;
};
/**
 * Generates a new email verification token
 * Creates a UUID-based token for email verification
 *
 * @param email - The user's email address
 * @returns The created verification token object
 */
export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(
    new Date().getTime() + AUTH.VERIFICATION_TOKEN.EXPIRES_IN
  );
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};
/**
 * Generates a new password reset token
 * Creates a UUID-based token for password reset verification
 *
 * @param email - The user's email address
 * @returns The created password reset token object
 */
export const generatePasswordResetToken = async (email: string) => {
  const token = uuid();
  const expires = new Date(
    new Date().getTime() + AUTH.RESET_PASSWORD_TOKEN.EXPIRES_IN
  );
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return passwordResetToken;
};
