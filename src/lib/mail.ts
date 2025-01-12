/**
 * Email Service Configuration
 * Handles sending of authentication-related emails using Resend
 */
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;
// TODO: Change to your verified domain email
const FROM_EMAIL = "onboarding@resend.dev"; // After domain verification

/**
 * Sends a Two-Factor Authentication token via email
 *
 * @param email - Recipient's email address
 * @param token - The 2FA token to be sent
 */

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};
/**
 * Sends an email verification link
 *
 * @param email - Recipient's email address
 * @param token - Verification token for the confirmation link
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};
/**
 * Sends a password reset link
 *
 * @param email - Recipient's email address
 * @param token - Reset token for the password reset link
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};
