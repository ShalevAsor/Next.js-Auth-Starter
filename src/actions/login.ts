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

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  // Get IP for rate limiting
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";
  //validate fields
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password, code } = validatedFields.data;

  try {
    // Check rate limit before proceeding with login
    const identifier = `${ip}:${email}`;
    await checkLoginRateLimit(identifier);
  } catch (rateLimitError) {
    // If rate limit is exceeded, return the error message
    if (rateLimitError instanceof Error) {
      return { error: rateLimitError.message };
    }
  }
  // check if user is exist
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return { error: "Invalid credentials" };
  }
  // check if user should login with oauth
  if (!existingUser.email || !existingUser.password) {
    return {
      error:
        "This email is registered with a social login. Please sign in with your social account",
    };
  }
  //check if the user verified his email
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

  //check if 2FA enabled
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) return { error: "Invalid code!" };
      if (twoFactorToken.token !== code) return { error: "Invalid code!" };
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) return { error: "Code expired!" };
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
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
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }
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
