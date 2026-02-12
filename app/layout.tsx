import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Custom fonts - CSS variables will be set in globals.css
// When you have the font files, use localFont or add @font-face in globals.css
// For now, using CSS variables with fallback fonts

export const metadata: Metadata = {
  title: "Antar Pravaah",
  description: "Healing and transformation through bodywork and energy healing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Hydration can mismatch when browser extensions inject attributes on <body>
    // (e.g. Grammarly). Suppress warnings for attribute-only diffs.
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BackgroundWrapper>
          <ScrollToTop />
          <Header />
          {children}
        </BackgroundWrapper>
      </body>
    </html>
  );
}
