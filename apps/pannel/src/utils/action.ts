"use server";
import { api } from "@/trpc/server";
import { LoginSchema, RegisterSchema } from "@workspace/types";
import { signIn } from "@workspace/auth/index";
import { AuthError } from "next-auth";
// import { signIn } from "next-auth/react";
import * as z from "zod";
import { supabase } from "./supabase";

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

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `rovers/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("rover-images") // Your bucket name
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("rover-images").getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.log({ error });
    throw new Error(
      `Failed to upload image: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};
