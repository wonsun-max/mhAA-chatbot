import type { Metadata, Viewport } from "next";
import "./globals.css";
import Background from "@/components/Background";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PromotionModal } from "@/components/modals/PromotionModal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// 1. Metadata setup

export const metadata: Metadata = {
  title: "WITHUS",
  description: "WITHUS - 학생들의 학습과 효율성을 위한 AI 어시스턴트.",
  icons: {
    icon: "/images/site-favicon.png",
    apple: "/images/site-favicon.png",
  },
  verification: {
    google: "DEKgJttmf7dYRdnjv9mswaqltxz445K-kZJuQ_JNtrM",
  },
};

/**
 * Viewport config: prevents layout shift when the iOS virtual keyboard appears.
 * `interactive-widget=resizes-content` makes the viewport resize with the keyboard
 * instead of overlapping content. `viewport-fit=cover` enables safe-area insets
 * for notched iPhones.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
        <AuthProvider>
          {/* 3. Background Component */}
          <Background />

          {/* Layout Content */}
          <Navbar />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          <Footer />
          <PromotionModal />
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}
