/**
 * Login Server Action
 * Handles the complete login flow including:
 * - Rate limiting
 * - Input validation
 * - Email verification
 * - Two-factor authentication
 * - OAuth compatibility checks
 * - Credential verification
 */
"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { checkLoginRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";
/**
 * Handles user login with comprehensive security checks and multi-factor authentication
 *
 * @param values - Login form data (email, password, and optional 2FA code)
 * @param callbackUrl - URL to redirect to after successful login
 * @returns Object containing success/error message
 */
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  // Step 1: Rate Limiting
  // Prevent brute force attacks by limiting login attempts per IP/email
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  // Step 2: Input Validation
  // Ensure the submitted data matches our schema requirements
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password, code } = validatedFields.data;

  try {
    // Apply rate limiting using combined IP and email
    const identifier = `${ip}:${email}`;
    await checkLoginRateLimit(identifier);
  } catch (rateLimitError) {
    // If rate limit is exceeded, return the error message
    if (rateLimitError instanceof Error) {
      return { error: rateLimitError.message };
    }
  }
  // Step 3: User Existence Check
  // Verify the user exists in our database
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Invalid credentials" };
  }
  // Step 4: OAuth Compatibility Check
  // Prevent password login for OAuth users
  if (!existingUser.email || !existingUser.password) {
    return {
      error:
        "This email is registered with a social login. Please sign in with your social account",
    };
  }
  // Step 5: Email Verification Check
  // Ensure email is verified before allowing login
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent!" };
  }

  /// Step 6: Two-Factor Authentication Flow
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // Verify the submitted 2FA code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) return { error: "Invalid code!" };
      if (twoFactorToken.token !== code) return { error: "Invalid code!" };
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) return { error: "Code expired!" };
      // Clean up used token
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });
      // Handle 2FA confirmation
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
      // Create new confirmation
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      //check if password is matched then send two factor token
      const passwordsMatch = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (!passwordsMatch) {
        return { error: "Invalid credentials!" };
      }
      // Generate and send 2FA token
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }
  // Step 7: Final Login Attempt
  // All checks passed, attempt to sign in
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log({ error });
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
