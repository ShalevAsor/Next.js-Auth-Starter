/**
 * Validation Schemas
 * This module defines all the validation schemas used throughout the application
 * for form validation and data integrity. It uses Zod for runtime type checking
 * and validation.
 */
import { UserRole } from "@prisma/client";
import * as z from "zod";
/**
 * Settings Update Schema
 * Validates user settings updates with complex validation rules for password changes.
 * All fields are optional to allow partial updates, but password changes require
 * both old and new passwords.
 */
export const SettingsSchema = z
  .object({
    // Optional name field with no additional validation
    name: z.optional(z.string()),
    // Toggle for two-factor authentication
    isTwoFactorEnabled: z.optional(z.boolean()),
    // User role - must be either ADMIN or USER
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    // Email must be valid if provided
    email: z.optional(z.string().email()),
    // Current password (optional unless changing password)
    password: z.optional(z.string().min(6)),
    // New password (optional unless changing password)
    newPassword: z.optional(z.string().min(6)),
  })
  // Custom refinement: Ensure new password is provided if current password is given

  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New password is required! ",
      path: ["newPassword"],
    }
  )
  // Custom refinement: Ensure current password is provided if new password is given

  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );
/**
 * Login Schema
 * Validates login form data with support for two-factor authentication.
 * The code field is optional as it's only required when 2FA is enabled.
 */
export const LoginSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(1, "Password is required"),
  code: z.optional(z.string()),
});
/**
 * Registration Schema
 * Validates new user registration data with stricter password requirements
 * than the login schema to ensure secure passwords for new accounts.
 */
export const RegisterSchema = z.object({
  email: z.string().email("Email is required"),
  password: z.string().min(6, "Minimum 6 characters required"),
  name: z.string().min(1, "Name is required"),
});
/**
 * Password Reset Request Schema
 * Simple schema to validate email for password reset requests.
 */
export const ResetSchema = z.object({
  email: z.string().email("Email is required"),
});
/**
 * New Password Schema
 * Used when setting a new password after reset.
 * Maintains the same password strength requirements as registration.
 */
export const NewPasswordSchema = z.object({
  password: z.string().min(6, "Minimum 6 characters required"),
});
