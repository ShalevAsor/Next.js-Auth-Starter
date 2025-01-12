/**
 * User Settings Server Action
 * Handles updates to user settings including profile information,
 * email changes, and password updates. Includes special handling
 * for OAuth users and email verification.
 */
"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById, getUserByEmail } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
/**
 * Updates user settings with comprehensive validation and security checks.
 * Handles different update scenarios including email changes and password updates.
 *
 * @param values - Object containing the settings to update
 * @returns Object containing success or error message
 */
export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  // user Authentication
  const user = await currentUser();
  if (!user || !user.id) return { error: "Unauthorized" };
  const dbUser = await getUserById(user.id);
  if (!dbUser) return { error: "Unauthorized" };
  //disabled fields for OAuth users
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  //if the user is trying to update his email , send new verification token
  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already in use!" };
    }
    //create and send new verification token
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    //update user email and set emailVerified to null
    await db.user.update({
      where: { id: user.id },
      data: {
        email: verificationToken.email,
        emailVerified: null,
      },
    });
    return { success: "Verification email sent!" };
  }
  // password change handling
  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordsMatch) {
      return { error: "Incorrect password!" };
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  //update user settings
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });
  return { success: "Settings updated" };
};
