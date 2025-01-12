/**
 * Logout Server Action
 * Handles user logout by terminating the current session.
 * This is intentionally kept simple to ensure consistent session cleanup.
 */
"use server";

import { signOut } from "@/auth";
/**
 * Terminates the current user session and cleans up authentication state.
 * Uses NextAuth's signOut function which handles:
 * - Clearing session cookies
 * - Removing server-side session data
 * - Cleaning up any active tokens
 */
export const logout = async () => {
  await signOut();
};
