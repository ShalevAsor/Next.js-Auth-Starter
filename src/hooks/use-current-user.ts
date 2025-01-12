/**
 * Current User Hook
 * A custom hook that provides access to the authenticated user's information
 * throughout the application. This hook acts as a centralized way to access
 * user data in client components.
 */
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  // Access the NextAuth session
  const session = useSession();
  // Return the entire user object from the session
  return session.data?.user;
};
