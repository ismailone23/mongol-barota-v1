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
            <Suspense fallback={<div>Loading...</div>}>
              <Navigation />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <Analytics />
            </Suspense>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
