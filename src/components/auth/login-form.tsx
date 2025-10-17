/**
 * Login Form Component
 *
 * This component handles user authentication through OAuth providers and email/password and two-factor authentication.
 * It includes rate limiting protection, error handling, and OAuth error management.
 *
 * Features:
 * - Email and password authentication
 * - Two-factor authentication (2FA)
 * - Rate limiting with countdown
 * - Social authentication integration
 * - Form validation using Zod
 * - Responsive error handling
 */
"use client";
import { useTransition, useState } from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/index";
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
import { login } from "@/actions/auth/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RateLimitCountdown } from "./rate-limit-countdown";
import { Loader } from "lucide-react";

export const LoginForm = () => {
  // Handle OAuth callback URLs and errors
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";
  // State management for form transitions and UI states
  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);
  // Initialize form with Zod schema validation
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "demo07730@gmail.com",
      password: "123456",
      code: "",
    },
  });
  /**
   * Handles form submission for both initial login and 2FA verification
   * Uses React transitions for better loading state management
   *
   * @param values - Form values matching LoginSchema
   */
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    //clear error and success messages
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values, callbackUrl).then((response) => {
        if (response?.error) {
          if (response.error.includes("Too many login attempts")) {
            const seconds = parseInt(
              response.error.match(/(\d+) seconds/)?.[1] || "0"
            );
            setRateLimitSeconds(seconds);
          } else {
            form.reset();
            setError(response.error);
          }
        }
        if (response?.success) {
          form.reset();
          setSuccess(response.success);
        }
        if (response?.twoFactor) {
          setShowTwoFactor(true);
        }
      });
    });
  };
  /**
   * Reset rate limit state when countdown completes
   */
  const handleRateLimitComplete = () => {
    setRateLimitSeconds(null);
    setError(undefined);
  };
  return (
    <CardWrapper
      headerTitle="Login"
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial // equivalent to showSocial={true}
    >
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Conditional rendering of 2FA or login fields */}
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="123456"
                        disabled={isPending || rateLimitSeconds !== null}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                          disabled={isPending || rateLimitSeconds !== null}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          disabled={isPending || rateLimitSeconds !== null}
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {/* Show either rate limit countdown or error/success messages */}
          {rateLimitSeconds ? (
            <RateLimitCountdown
              initialSeconds={rateLimitSeconds}
              onComplete={handleRateLimitComplete}
            />
          ) : (
            <>
              <FormError message={error || urlError} />
              <FormSuccess message={success} />
            </>
          )}

          {/* <Button
            type="submit"
            className="w-full"
            disabled={isPending || rateLimitSeconds !== null}
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button> */}
          <Button
            type="submit"
            className="w-full relative"
            disabled={isPending || rateLimitSeconds !== null}
          >
            {isPending ? (
              <div className="flex items-center justify-center">
                <span className="animate-spin mr-2">
                  <Loader className="w-4 h-4" />
                </span>
                {showTwoFactor ? "Verifying..." : "Logging in..."}
              </div>
            ) : showTwoFactor ? (
              "Confirm"
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
