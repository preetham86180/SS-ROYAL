import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/SplashScreen";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { ChatBot } from "@/components/ChatBot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SS Royal - Properties & Developers",
  description:
    "Discover premium properties for sale, rent & investment. SS Royal Properties & Developers — your trusted real estate partner.",
  applicationName: "SS Royal",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SS Royal",
  },
  formatDetection: { telephone: false },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <ServiceWorkerRegistrar />
        <SplashScreen />
        {children}
        <ChatBot />
      </body>
    </html>
  );
}
