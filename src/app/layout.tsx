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
import { GoogleAnalytics } from "@next/third-parties/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// 1. Metadata setup
export const metadata: Metadata = {
  metadataBase: new URL("https://mhawithus.shop"),
  title: {
    default: "마닐라한국아카데미 학습 플랫폼 WITHUS",
    template: "%s | WITHUS",
  },
  description: "마닐라한국아카데미(MHA) 학생과 교사를 위한 통합 학습 플랫폼. 공지사항, 시간표, 급식표, AI 도우미 기능 제공.",
  keywords: [
    "mhawithus.shop",
    "MHA withus",
    "mha",
    "withus mha",
    "Manila Hankuk Academy",
    "마닐라한국아카데미",
    "위더스",
    "마한아",
    "필리핀 한국학교",
    "MHA 학습 허브",
    "MHA 교사",
    "MHA 선생님",
    "MHA 학생 커뮤니티",
    "MHA 입시"
  ],
  applicationName: "WITHUS",
  appleWebApp: {
    title: "WITHUS",
    statusBarStyle: "default",
    capable: true,
  },

  openGraph: {
    title: "마닐라한국아카데미 학습 플랫폼 WITHUS",
    siteName: "WITHUS",
  },
  verification: {
    google: "UgMH0SGAU1AonBchOM9OurUhEyGX1S7nRT2NwYFa688",
  },
  robots: {
    index: true,
    follow: true,
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "WITHUS",
                "url": "https://mhawithus.shop",
                "alternateName": "마닐라한국아카데미 위더스",
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "WITHUS",
                "alternateName": [
                  "마닐라한국아카데미 위더스",
                  "MHA WithUs"
                ],
                "url": "https://mhawithus.shop",
                "logo": "https://mhawithus.shop/images/site-logo.png",
                "description": "마닐라한국아카데미(MHA) 학생과 교사를 위한 통합 스마트 학습 플랫폼 WITHUS",
                "sameAs": [


                ]
              }
            ]),
          }}
        />
      </head>
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
          <GoogleAnalytics gaId="G-NRSBWWTND4" />
        </AuthProvider>
      </body>
    </html>
  );
}
