/**
 * Two Factor Token Data Access Layer
 * Manages the retrieval of 2FA tokens for authentication
 * These tokens are temporary and used during the 2FA verification process
 */
import { db } from "@/lib/db";
/**
 * Retrieves a two-factor token by its token string
 * Used during 2FA verification to validate user input
 *
 * @param token - The token string to search for
 * @returns The token object if found, null otherwise
 */
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: { token },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};
/**
 * Retrieves the most recent two-factor token for an email
 * Used to check for existing tokens before generating new ones
 *
 * @param email - The email address to find tokens for
 * @returns The most recent token object if found, null otherwise
 */
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: { email },
    });
    return twoFactorToken;
  } catch {
    return null;
  }
};
