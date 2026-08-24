import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SplashScreen } from "@/components/SplashScreen";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";
import { ChatBotWrapper } from "@/components/ChatBotWrapper";
import { AuthProvider } from "@/components/AuthProvider";
import { CustomCursor } from "@/components/CustomCursor";

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
  // Toggle this boolean to false whenever you want to reopen the website
  const isShutDown = true;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${space.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        {isShutDown ? (
          <main className="flex-1 flex flex-col items-center justify-center min-h-screen p-6 bg-[#0B1120] text-slate-100 text-center selection:bg-red-500/20">
            <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Warning
                </h1>
                <p className="text-lg text-slate-300 font-medium">
                  This business is a FRAUD and your details are at high risk.
                </p>
              </div>
              <div className="w-16 h-px bg-slate-800/80 my-1" />
              <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">
                Site Temporarily Closed
              </p>
            </div>
          </main>
        ) : (
          <AuthProvider>
            <CustomCursor />
            <ServiceWorkerRegistrar />
            <SplashScreen />
            {children}
            <ChatBotWrapper />
          </AuthProvider>
        )}
      </body>
    </html>
  );
}

