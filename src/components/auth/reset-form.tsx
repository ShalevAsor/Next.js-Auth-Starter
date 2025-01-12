/**
 * Password Reset Request Form
 *
 * This component handles the initial step of the password reset flow where users
 * request a reset link to be sent to their email. It includes validation,
 * error handling, and integration with the server-side reset action.
 *
 * Security Features:
 * - Email validation
 * - Rate limiting (through server action)
 * - Loading state management
 * - Success/Error feedback
 */
"use client";
import { useTransition, useState } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas/index";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { reset } from "@/actions/auth/reset";
export const ResetForm = () => {
  /**
   * State Management:
   * - isPending: Tracks loading state during form submission
   * - error: Stores error messages from the server
   * - success: Stores success messages from the server
   */
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  /**
   * Form initialization with Zod schema validation
   * ResetSchema typically validates email format and presence
   */
  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });
  /**
   * Handles form submission
   * 1. Clears previous error/success states
   * 2. Initiates password reset process
   * 3. Handles response feedback
   *
   * @param values - Form values containing email
   */
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    //clear error and success messages
    setError("");
    setSuccess("");
    console.log(values);
    startTransition(() => {
      reset(values).then((response) => {
        setError(response?.error);
        setSuccess(response?.success);
      });
    });
  };
  return (
    <CardWrapper
      headerTitle="App Name"
      headerLabel="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="name@email.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
