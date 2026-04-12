import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/SplashScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SS ROYAL - PROPERTIES & DEVELOPERS",
  description: "Find your dream home with AI-powered insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${space.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
