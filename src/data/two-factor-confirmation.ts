/**
 * Two Factor Confirmation Data Access Layer
 * Manages the retrieval of 2FA confirmation records
 * These records indicate that a user has completed 2FA verification
 */
import { db } from "@/lib/db";
/**
 * Retrieves a two-factor confirmation record by user ID
 * Used to verify if a user has completed 2FA for the current session
 */
export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId },
    });
    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
