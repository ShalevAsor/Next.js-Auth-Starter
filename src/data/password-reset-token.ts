/**
 * @fileoverview Service module for handling password reset token operations
 * This module provides functions to retrieve password reset tokens from the database
 * by either token value or email address.
 */

import { db } from "@/lib/db";

/**
 * Retrieves a password reset token from the database by its token value
 */
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};

/**
 * Retrieves a password reset token from the database by email address
 * @remarks
 * - This function returns the first matching token if multiple exist for the same email
 * - Returns null if no token is found or if an error occurs during the database query
 */
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return passwordResetToken;
  } catch {
    return null;
  }
};
