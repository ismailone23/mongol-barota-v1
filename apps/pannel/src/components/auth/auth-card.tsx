"use client";
import { ReactNode } from "react";
import { Card } from "@workspace/ui/components/card";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">{children}</Card>
    </div>
  );
}
