"use server";
import { api, trpc } from "@/trpc/server";
import { LoginSchema, RegisterSchema } from "@workspace/api/schema/auth";
import { signIn } from "@workspace/auth/index";
import { AuthError } from "next-auth";
// import { signIn } from "next-auth/react";
import * as z from "zod";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl: string
) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }
  try {
    await signIn("credentials", {
      ...validateFields.data,
      redirectTo: callbackUrl,
    });
    return { message: "Login Successfull" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Credentials isn't correct!" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid fields!" };
  }

  try {
    const caller = await api();
    const result = await caller.auth.registerUser(values);

    return {
      message: result.message,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong!" };
  }
};
