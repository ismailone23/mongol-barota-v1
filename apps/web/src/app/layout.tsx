import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type React from "react";
import { Suspense } from "react";
import "@workspace/ui/globals.css";

export const metadata: Metadata = {
  title: "MIST Mongol Barota",
  description:
    "MIST Mongol Barota is Bangladesh's premier Mars rover team, competing in University Rover Challenge and Anatolian Rover Challenge. URC 2021 Global Champions.",
  keywords: [
    "Mars rover",
    "robotics",
    "MIST",
    "Mongol Barota",
    "Mars Exploration",
    "NASA",
    "URC",
    "Anatolian Rover Challenge",
    "ARC",
    "University Rover Challenge",
    "Bangladesh",
    "space exploration",
    "engineering",
  ],
  authors: [{ name: "MIST Mongol Barota Team" }],
  creator: "MIST Mongol Barota",
  publisher: "Military Institute of Science and Technology",
  icons: {
    icon: "/logo_black.svg",
  },
  openGraph: {
    title: "MIST Mongol Barota",
    description:
      "Bangladesh's premier Mars rover team. URC 2021 Global Champions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MIST Mongol Barota",
    description:
      "Bangladesh's premier Mars rover team. URC 2021 Global Champions.",
  },
};

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
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Analytics />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
