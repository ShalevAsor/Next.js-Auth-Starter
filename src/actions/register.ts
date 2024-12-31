"use server";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  //validate fields
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  } else {
    //extract fields
    const { email, password, name } = validatedFields.data;
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // check if email already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      //this email is already registered
      return { error: "Email already registered!" };
    }
    await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent" };
  }
};
