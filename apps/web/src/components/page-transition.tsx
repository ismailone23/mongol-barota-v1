"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-10 space-y-6">
        <Skeleton className="h-10 w-56" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border p-4 space-y-3">
              <Skeleton className="h-36 w-full" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div className="animate-fade-in-up">{children}</div>;
}
