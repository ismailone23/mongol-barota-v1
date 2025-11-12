"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { LoadingSpinner } from "@workspace/ui/components/loading-spinner";

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner className="w-8 h-8 text-primary" />
          <p className="text-sm text-muted-foreground">{loadingText}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
