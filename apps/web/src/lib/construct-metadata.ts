import type { Metadata } from "next";

import { APP_URL } from "@/constants";

export function constructMetadata({
  title,
  fullTitle,
  description = "MIST Mongol Barota is Bangladesh's premier Mars rover team, competing in University Rover Challenge and Anatolian Rover Challenge. URC 2021 Global Champions.",
  image = `${APP_URL}/images/logo_black.svg`,
  video,
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: `${APP_URL}/favicons/apple-touch-icon.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: `${APP_URL}/favicons/favicon-32x32.png`,
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: `${APP_URL}/favicons/favicon-16x16.png`,
    },
  ],
  url,
  canonicalUrl,
  noIndex = false,
  manifest,
}: {
  title?: string;
  fullTitle?: string;
  description?: string;
  image?: string | null;
  video?: string | null;
  icons?: Metadata["icons"];
  url?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  manifest?: string | URL | null;
} = {}): Metadata {
  return {
    title:
      fullTitle ||
      (title ? `${title} | Mongol Barota` : "Mongol Barota | MIST"),
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: image,
      }),
      url,
      ...(video && {
        videos: video,
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        card: "summary_large_image",
        images: [image],
      }),
      ...(video && {
        player: video,
      }),
      creator: "@Mongol BarotaHQ",
    },
    icons,
    metadataBase: new URL(APP_URL),
    ...((url || canonicalUrl) && {
      alternates: {
        canonical: url || canonicalUrl,
      },
    }),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    ...(manifest && {
      manifest,
    }),
  };
}
