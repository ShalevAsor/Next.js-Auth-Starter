/**
 * @fileoverview Service module for handling verification token operations
 * This module provides functions to retrieve verification tokens from the database
 * by either token value or email address.
 */

import { db } from "@/lib/db";

/**
 * Retrieves a verification token from the database by its token value
 *
 */
export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: { token },
    });
    return verificationToken;
  } catch {
    return null;
  }
};

/**
 * Retrieves a verification token from the database by email address
 * @remarks
 * - This function returns the first matching token if multiple exist for the same email
 * - Returns null if no token is found or if an error occurs during the database query
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: { email },
    });
    return verificationToken;
  } catch {
    return null;
  }
};
