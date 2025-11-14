import AuthCard from "@/components/auth/auth-card";
import LoginForm from "@/components/auth/login-form";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <AuthCard>
      <LoginForm />
    </AuthCard>
  );
}
