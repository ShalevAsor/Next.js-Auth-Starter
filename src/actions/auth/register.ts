/**
 * User Registration Server Action
 * Handles new user account creation with security measures including:
 * - Input validation
 * - Password hashing
 * - Duplicate account prevention
 * - Email verification
 */

"use server";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

/**
 * Handles new user registration with comprehensive validation and security measures.
 * The process includes input validation, password hashing, duplicate checking,
 * and initiating email verification.
 *
 * @param values - Registration form data (email, password, name)
 * @returns Object containing success message or error details
 */

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // Step 1: Input Validation
  // Ensure all submitted data meets our schema requirements
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  //extract fields
  const { email, password, name } = validatedFields.data;
  // Step 2: Password Hashing
  // Hash the password before storage using bcrypt with a cost factor of 10
  const hashedPassword = await bcrypt.hash(password, 10);
  // Step 3: Duplicate Check
  // Prevent duplicate accounts by checking email existence
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    //this email is already registered
    return { error: "Email already registered!" };
  }
  // Step 4: User Creation
  // Create new user record with hashed password
  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  // Step 5: Email Verification Setup
  // Generate and send verification token
  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent" };
};
