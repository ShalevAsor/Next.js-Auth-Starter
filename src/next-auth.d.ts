/**
 * Type declarations for Next Auth
 * This file extends the default Next Auth types to include custom properties
 * such as user roles, 2FA status, and OAuth status.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { type DefaultSession } from "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

/**
 * Extended user type that includes additional properties beyond the default Next Auth user
 */

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};
/**
 * Extend the built-in session type from next-auth
 * This adds our custom user properties to the session object
 */
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
/**
 * Extend the JWT type from next-auth/jwt
 * This ensures the JWT token includes our custom properties
 */
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    role?: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  }
}
