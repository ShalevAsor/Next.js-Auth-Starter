/**
 * User Data Access Layer
 * Provides functions to retrieve user information from the database.
 * All functions include error handling and return null on failure.
 */
import { db } from "@/lib/db";
/**
 * Retrieves a user by their email address
 * Used primarily for authentication and password reset flows
 *
 * @param email - The email address to search for
 * @returns The user object if found, null otherwise
 */
export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch {
    return null;
  }
};

/**
 * Retrieves a user by their unique identifier
 * Used for profile access and user-specific operations
 *
 * @param id - The unique identifier of the user
 * @returns The user object if found, null otherwise
 */
export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    return user;
  } catch {
    return null;
  }
};
