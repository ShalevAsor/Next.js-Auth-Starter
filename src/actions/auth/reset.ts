/**
 * Password Reset Server Action
 * Handles the initial step of the password reset process.
 * This action verifies the email and initiates the reset flow.
 */
"use server";
import { ResetSchema } from "@/schemas";
import * as z from "zod";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
/**
 * Initiates the password reset process for a given email.
 * The process includes:
 * 1. Validating the email
 * 2. Checking user existence
 * 3. Generating a reset token
 * 4. Sending reset instructions via email
 *
 * @param values - Object containing the email address
 * @returns Object containing success or error message
 */
export const reset = async (values: z.infer<typeof ResetSchema>) => {
  //Input Validation
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Invalid email!" };
  //User Verification
  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "Email not found!" };
  //Token Generation and Email Sending
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return { success: "Reset email sent!" };
};
