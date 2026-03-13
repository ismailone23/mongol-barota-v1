import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import { TRPCReactProvider } from "@/trpc/react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Toaster } from "@workspace/ui/components/sonner";

// @ts-ignore
import "@workspace/ui/globals.css";
import { constructMetadata } from "@/lib/construct-metadata";

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            <Suspense
              fallback={
                <div className="container mx-auto px-4 py-10 space-y-6">
                  <Skeleton className="h-10 w-52" />
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border p-4 space-y-3"
                      >
                        <Skeleton className="h-36 w-full" />
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </div>
                </div>
              }
            >
              <Navigation />
              <main className="min-h-screen">
                {children}
                <Toaster />
              </main>
              <Footer />
              <Analytics />
            </Suspense>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
