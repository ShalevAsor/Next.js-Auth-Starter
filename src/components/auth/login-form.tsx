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
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { RateLimitCountdown } from "./rate-limit-countdown";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [isPending, startTransition] = useTransition();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

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

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || rateLimitSeconds !== null}
          >
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
