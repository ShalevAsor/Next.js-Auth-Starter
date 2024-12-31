/**
 * @fileoverview Service module for handling password reset token operations
 * This module provides functions to retrieve password reset tokens from the database
 * by either token value or email address.
 */

import { db } from "@/lib/db";

/**
 * Retrieves a password reset token from the database by its token value
 *
 * @param {string} token - The password reset token string to search for
 * @returns {Promise<PasswordResetToken | null>} The verification token record if found, null otherwise
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
 *
 * @param {string} email - The email address associated with the password reset token
 * @returns {Promise<PasswordResetToken | null>} The first matching verification token record if found, null otherwise
 *
 *
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
