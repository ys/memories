import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const tt2020 = localFont({
  src: "../fonts/TT2020Base-Regular.woff2",
  display: "swap",
  variable: "--font-typewriter",
});

export const metadata: Metadata = {
  title: "Memories",
  description: "A table full of polaroid memories",
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
