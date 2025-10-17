/**
 * Email Service Configuration
 * Handles sending of authentication-related emails using Gmail SMTP via Nodemailer
 */
import nodemailer from "nodemailer";

const domain = process.env.NEXT_PUBLIC_APP_URL;

/**
 * Create reusable transporter object using Gmail SMTP
 * This will use your Gmail account to send emails
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_APP_PASSWORD, // Your App Password (NOT regular password)
  },
});

/**
 * Sends a Two-Factor Authentication token via email
 *
 * @param email - Recipient's email address
 * @param token - The 2FA token to be sent
 */
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("\n🔐 [2FA CODE]");
    console.log("To:", email);
    console.log("Code:", token);
    console.log("─────────────────────────────────────\n");
  }

  try {
    await transporter.sendMail({
      from: `"Auth App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Two-Factor Authentication Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Two-Factor Authentication Code</h2>
          <p>Your authentication code is:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
            ${token}
          </div>
          <p style="color: #666;">This code will expire in 15 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send 2FA email:", error);
    if (process.env.NODE_ENV !== "development") {
      throw error;
    }
  }
};

/**
 * Sends an email verification link
 *
 * @param email - Recipient's email address
 * @param token - Verification token for the confirmation link
 */
export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("\n📧 [EMAIL VERIFICATION]");
    console.log("To:", email);
    console.log("Link:", confirmLink);
    console.log("─────────────────────────────────────\n");
  }

  try {
    await transporter.sendMail({
      from: `"Auth App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Confirm Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome! Please Verify Your Email</h2>
          <p>Thank you for signing up. Please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmLink}" style="background-color: #0070f3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #0070f3; word-break: break-all; font-size: 12px;">${confirmLink}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    if (process.env.NODE_ENV !== "development") {
      throw error;
    }
  }
};

/**
 * Sends a password reset link
 *
 * @param email - Recipient's email address
 * @param token - Reset token for the password reset link
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  // Development logging
  if (process.env.NODE_ENV === "development") {
    console.log("\n🔒 [PASSWORD RESET]");
    console.log("To:", email);
    console.log("Link:", resetLink);
    console.log("─────────────────────────────────────\n");
  }

  try {
    await transporter.sendMail({
      from: `"Auth App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
          <p style="color: #dc2626; word-break: break-all; font-size: 12px;">${resetLink}</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    if (process.env.NODE_ENV !== "development") {
      throw error;
    }
  }
};
