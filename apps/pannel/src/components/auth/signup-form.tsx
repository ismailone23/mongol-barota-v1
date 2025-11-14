"use client";
import React, { useState, useTransition } from "react";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@workspace/api/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { register } from "@/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";

export default function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [message, setMessage] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      mistid: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setMessage("");
    startTransition(() => {
      register(values)
        .then((data) => {
          setError(data.error);
          setMessage(data.message);
          if (!data.error) {
            form.reset();
          }
        })
        .catch((e) => setError(e.message));
    });
    // api.mutate({ ...values });
  };
  return (
    <>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your email, mistid and password</CardDescription>
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
            <FormField
              control={form.control}
              name="mistid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MIST ID</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="000000" type="text" />
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
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <FormError message={error} />}
            {message && <FormSuccess message={message} />}
            <Button
              disabled={isPending}
              type="submit"
              className="w-full cursor-pointer"
            >
              Create
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Link
          href={"/auth/login"}
          className="hover:text-blue-500 hover:underline"
        >
          Already have an account? Login
        </Link>
      </CardFooter>
    </>
  );
}
