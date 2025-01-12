/**
 * Authentication Utility Functions
 * Provides helper functions to access current user information
 * from the authentication session.
 */
import { auth } from "@/auth";
/**
 * Retrieves the current authenticated user's information
 * @returns The user object from the session, or undefined if not authenticated
 */
export const currentUser = async () => {
  const session = await auth();
  return session?.user;
};
/**
 * Retrieves the current user's role
 * @returns The user's role from the session, or undefined if not authenticated
 */
export const currentRole = async () => {
  const session = await auth();
  return session?.user.role;
};
/**
 * Retrieves the current user's ID
 * @returns The user's ID from the session, or undefined if not authenticated
 */
export const currentUserId = async () => {
  const session = await auth();
  return session?.user.id;
};
