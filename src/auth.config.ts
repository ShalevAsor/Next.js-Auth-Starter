/**
 * @fileoverview Authentication provider configuration for the application.
 * Configures and exports OAuth providers and credentials-based authentication.
 */
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
    /**
     * Google OAuth provider configuration.
     * Enables sign-in with Google accounts.
     */
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    /**
     * GitHub OAuth provider configuration.
     * Enables sign-in with GitHub accounts.
     */
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    /**
     * Credentials provider configuration for email/password authentication.
     * Implements custom authorization logic with password verification.
     */
    Credentials({
      async authorize(credentials) {
        // validate the incoming credentials using Zod schema
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);
          // If no user found or user has no password (OAuth-only user)
          if (!user || !user.password) {
            return null;
          }
          // Compare the provided password with the stored hash
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) {
            return user;
          }
        }
        // Return null for any failure case
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
