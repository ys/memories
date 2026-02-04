import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tt2020 = localFont({
  src: "../fonts/TT2020Base-Regular.woff2",
  display: "swap",
  variable: "--font-typewriter",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://memories.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Memories - Yannick's Dailies",
    template: "%s | Memories",
  },
  description:
    "Small moments no one notices. A collection of polaroid memories captured in everyday life.",
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
    siteName: "Memories",
    title: "Memories - Yannick's Dailies",
    description:
      "Small moments no one notices. A collection of polaroid memories captured in everyday life.",
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
    title: "Memories - Yannick's Dailies",
    description:
      "Small moments no one notices. A collection of polaroid memories captured in everyday life.",
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
