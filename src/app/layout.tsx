import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import siteConfig from "../../site.config";

const tt2020 = localFont({
  src: "../fonts/TT2020Base-Regular.woff2",
  display: "swap",
  variable: "--font-typewriter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "photography",
    "polaroid",
    "memories",
    "daily moments",
    "life snapshots",
    "photo gallery",
  ],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.og.image,
        width: siteConfig.og.width,
        height: siteConfig.og.height,
        alt: `${siteConfig.name} - A collection of polaroid photos`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.og.image],
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
