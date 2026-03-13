import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore
import "@workspace/ui/globals.css";
import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";
import { Toaster } from "@workspace/ui/components/sonner";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Mongol Barota – Admin Panel",
  description: "MIST Mongol Barota team management dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <div className="flex h-screen items-center justify-center">
                Loading...
              </div>
            }
          >
            <SessionProvider>
              <TRPCReactProvider>
                {children}
                <Toaster richColors />
              </TRPCReactProvider>
            </SessionProvider>
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
