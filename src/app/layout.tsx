import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tt2020 = localFont({
  src: "../fonts/TT2020Base-Regular.woff2",
  display: "swap",
  variable: "--font-typewriter",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://daily.yannickschutz.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yannick's Daily Captures - Small Moments Worth Keeping",
    template: "%s | Yannick's Daily Captures",
  },
  description:
    "Small moments I liked enough to capture. A collection of everyday life fragments presented as polaroid-style photos.",
  keywords: [
    "photography",
    "polaroid",
    "memories",
    "daily moments",
    "life snapshots",
    "photo gallery",
  ],
  authors: [{ name: "Yannick" }],
  creator: "Yannick",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Yannick's Daily Captures",
    title: "Yannick's Daily Captures - Small Moments Worth Keeping",
    description:
      "Small moments I liked enough to capture. A collection of everyday life fragments presented as polaroid-style photos.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Memories - A collection of polaroid photos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yannick's Daily Captures - Small Moments Worth Keeping",
    description:
      "Small moments I liked enough to capture. A collection of everyday life fragments presented as polaroid-style photos.",
    images: ["/og-image.jpg"],
    creator: "@yannick",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={tt2020.variable}>
      <body className={tt2020.className}>{children}</body>
    </html>
  );
}
