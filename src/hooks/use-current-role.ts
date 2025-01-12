/**
 * Role Access Hook
 * A custom hook that provides easy access to the current user's role
 * from the authentication session. This hook simplifies role-based
 * access control throughout the application.
 */
import { useSession } from "next-auth/react";

export const useCurrentRole = () => {
  // Access the NextAuth session, which contains user information
  const session = useSession();
  // Return the role from the session, or undefined if not authenticated
  return session.data?.user.role;
};
