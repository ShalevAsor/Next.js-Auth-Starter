/**
 * Account Data Access Layer
 * Handles retrieval of OAuth account information
 * Used to determine if a user authenticated via OAuth providers
 */
import { db } from "@/lib/db";
/**
 * Retrieves the first OAuth account associated with a user
 * Used to check if a user has any OAuth connections
 *
 * @param userId - The ID of the user to find accounts for
 * @returns The first account found for the user, or null if none exists
 */
export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId },
    });
    return account;
  } catch {
    return null;
  }
};
