/**
 * @fileoverview Core authentication configuration and setup for the application.
 * This file handles the main authentication logic, including OAuth providers,
 * session management, JWT handling, and two-factor authentication.
 */

import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

/**
 * Core authentication configuration object that sets up NextAuth with custom
 * behavior for sign-in flows, session handling, and JWT management.
 */

export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * Custom pages configuration for authentication flows.
   * Overrides default NextAuth pages with application-specific routes.
   */
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  /**
   * Event handlers for authentication-related actions.
   * These handlers run when specific authentication events occur.
   */
  events: {
    /**
     * Handles account linking events, specifically marking email as verified
     * when an OAuth account is linked
     */
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    /**
     * Custom sign-in callback that handles credential-based authentication
     * and enforces two-factor authentication when enabled.
     * This callback runs at the very beginning of the authentication process, right after a user attempts to log in
     */
    async signIn({ user, account }) {
      //Allow OAuth sign-in without email verification
      if (account?.provider !== "credentials") return true;
      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      //prevent sign-in without email verification
      if (!existingUser?.emailVerified) return false;
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );
        if (!twoFactorConfirmation) return false;
        //Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }
      //allow the user to signin
      return true;
    },
    /**
     * Session callback that enriches the session object with additional
     * user information from the JWT token.
     */
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
        session.user.name = token.name;
        session.user.email = token.email || session.user.email;
        session.user.isOAuth = token.isOAuth;
      }
      return session;
    },
    /**
     * JWT callback that enriches the JWT token with additional user information from the database.
     * This callback runs whenever a JWT token needs to be created or updated
     */
    async jwt({ token }) {
      //if there is not token.sub the user is logged out
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      //get existing account
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      //add role to the token
      token.role = existingUser.role;
      //update fields
      token.name = existingUser.name;
      token.email = existingUser.email;
      //add two factor
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

export const { GET, POST } = handlers;
