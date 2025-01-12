/**
 * Email Verification Server Action
 * Handles the verification of user email addresses through verification tokens.
 * This action is triggered when users click the verification link in their email.
 */
"use server";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
/**
 * Verifies a user's email address using a verification token.
 * The process includes validating the token, checking expiration,
 * and updating the user's verification status.
 *
 * @param token - The verification token from the email link
 * @returns Object containing success or error message
 */
export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return { error: "Token does not exist!" };
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist!" };
  }
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });
  return { success: "Email verified!" };
};
