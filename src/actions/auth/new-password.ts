/**
 * New Password Server Action
 * Handles the final step of the password reset process where the user sets their new password.
 * This action verifies the reset token and updates the user's password securely.
 */
"use server";
import * as z from "zod";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";

/**
 * Updates a user's password after validating their reset token.
 * The process includes multiple security checks to ensure the password
 * reset is legitimate and secure.
 *
 * @param values - Object containing the new password
 * @param token - The password reset token from the email link
 * @returns Object containing success or error message
 */

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) => {
  //token validation
  if (!token) return { error: "Missing token!" };
  // password validation
  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid password" };
  const { password } = validatedFields.data;
  // token verification
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "Invalid token!" };
  // token expiration check
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired!" };
  // user verification
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "Email does not exist!" };
  // password update
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });
  // token cleanup
  await db.passwordResetToken.delete({
    where: { id: existingToken.id },
  });
  return { success: "Password updated!" };
};
