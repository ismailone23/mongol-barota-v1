"use client";
import { ReactNode } from "react";
import { Card } from "@workspace/ui/components/card";

export default function AuthCard({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">{children}</Card>
    </div>
  );
}
