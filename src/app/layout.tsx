import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PromotionModal } from "@/components/modals/PromotionModal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// 1. Metadata setup

export const metadata: Metadata = {
  title: "WITHUS | 마닐라한국아카데미 MHA",
  description: "WITHUS - 마닐라한국아카데미(MHA) 학생들의 학습 효율성과 성장을 위한 통합 스마트 허브 및 AI 어시스턴트 플랫폼입니다.",
  keywords: ["MHA", "withus", "마닐라한국아카데미", "Manila Hankuk Academy", "위더스", "마한아", "필리핀 한국학교", "mha withus", "withus mha"],
  applicationName: "withus",
  appleWebApp: {
    title: "withus",
    statusBarStyle: "default",
    capable: true,
  },
  icons: {
    icon: "/images/site-favicon.png",
    apple: "/images/site-favicon.png",
  },
  openGraph: {
    title: "WITHUS | 마닐라한국아카데미 MHA",
    description: "마닐라한국아카데미(MHA) 학생들을 위한 스마트 학습 플랫폼 WITHUS",
    type: "website",
    siteName: "WITHUS",
    locale: "ko_KR",
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
      <body className={`${outfit.variable} min-h-screen bg-black text-white font-sans selection:bg-blue-500/30`}>
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
