// components/force-signout.tsx
"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export function ForceSignOut() {
  useEffect(() => {
    signOut({ callbackUrl: "/auth/login" });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Signing you out...</p>
    </div>
  );
}
