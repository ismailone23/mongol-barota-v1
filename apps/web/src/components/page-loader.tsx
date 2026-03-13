"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface PageLoaderProps {
  children: React.ReactNode;
  loadingText?: string;
}

export function PageLoader({
  children,
  loadingText = "Loading...",
}: PageLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] container mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-full max-w-md" />
        <p className="text-sm text-muted-foreground">{loadingText}</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
