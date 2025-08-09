"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { authClient } from "@/lib/auth-client";

interface ForgotPasswordFormProps extends React.ComponentProps<"div"> {}

export function ForgotPasswordForm({ className, ...props }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email) {
      setError("Email is required.");
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        setError(error.message || "Failed to send reset link");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (success) {
    return (
      <div className={`flex flex-col gap-6 ${className ?? ""}`} {...props}>
        <Card className="overflow-hidden p-0">
          <div className="grid p-0 md:grid-cols-2">
            <CardBody className="p-6 md:p-8">
              <div className="mb-6">
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center text-sm text-default-500 hover:text-primary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Sign In
                </Link>
              </div>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-2">Check your email</h1>
                  <p className="text-default-500">
                    If your email exists in our system, we've sent you a password reset link.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>
                <div className="text-center text-sm">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </CardBody>
            <div className="relative hidden md:block">
              <Image
                src="/images/auth-image.png"
                alt="Authentication background"
                fill
                className="object-cover dark:brightness-[0.2] dark:grayscale"
                priority
              />
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-6 ${className ?? ""}`} {...props}>
      <Card className="overflow-hidden p-0">
        <div className="grid p-0 md:grid-cols-2">
          <CardBody className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="mb-2">
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center text-sm text-default-500 hover:text-primary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Sign In
                </Link>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-default-500">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-danger-50/20 p-3 border border-danger-200 text-danger-600 text-sm">
                  {error}
                </div>
              )}

              {/* Email Form */}
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm">Email</label>
                  <Input
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" isDisabled={isLoading} className="w-full">
                  {isLoading ? "Sending reset link..." : "Send reset link"}
                </Button>
              </form>

              <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/auth/sign-in" className="text-primary underline">
                  Sign in
                </Link>
              </div>
            </div>
          </CardBody>
          <div className="relative hidden md:block">
            <Image
              src="/images/auth-image.png"
              alt="Authentication background"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              priority
            />
          </div>
        </div>
      </Card>
      <div className="text-default-500 text-center text-xs">
        By clicking continue, you agree to our{" "}
        <a href="/terms" className="underline hover:text-primary transition-colors">Terms of Service</a> and{" "}
        <a href="/privacy" className="underline hover:text-primary transition-colors">Privacy Policy</a>.
      </div>
    </div>
  );
}