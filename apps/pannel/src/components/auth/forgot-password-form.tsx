"use client";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import * as z from "zod";
import Link from "next/link";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { ForgotPasswordSchema, ResetPasswordSchema } from "@workspace/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { useSearchParams } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";

export default function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (token && email) {
    return <ResetForm token={token} />;
  }
  return <RequestForm />;
}

function RequestForm() {
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const trpc = useTRPC();

  const forgotPassword = useMutation(
    trpc.auth.forgotPassword.mutationOptions({
      onSuccess: (data) => {
        setError(undefined);
        setMessage(data.message);
      },
      onError: (err) => {
        setMessage(undefined);
        setError(err.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    setError(undefined);
    setMessage(undefined);
    forgotPassword.mutate(values);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>
          Enter your email and we'll send you a reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="m@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormError message={error} />}
            {message && <FormSuccess message={message} />}
            <Button
              disabled={forgotPassword.isPending}
              type="submit"
              className="w-full cursor-pointer"
            >
              Send Reset Link
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Link
          href="/auth/login"
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Back to Login
        </Link>
      </CardFooter>
    </>
  );
}

function ResetForm({ token }: { token: string }) {
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const trpc = useTRPC();

  const resetPassword = useMutation(
    trpc.auth.resetPassword.mutationOptions({
      onSuccess: (data) => {
        setError(undefined);
        setMessage(data.message);
        form.reset();
      },
      onError: (err) => {
        setMessage(undefined);
        setError(err.message);
      },
    }),
  );

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { token, password: "" },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError(undefined);
    setMessage(undefined);
    resetPassword.mutate(values);
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="••••••" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormError message={error} />}
            {message && <FormSuccess message={message} />}
            <Button
              disabled={resetPassword.isPending}
              type="submit"
              className="w-full cursor-pointer"
            >
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Link
          href="/auth/login"
          className="text-sm text-muted-foreground hover:text-primary hover:underline"
        >
          Back to Login
        </Link>
      </CardFooter>
    </>
  );
}
