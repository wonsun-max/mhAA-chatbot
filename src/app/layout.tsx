import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PromotionModal } from "@/components/modals/PromotionModal";
import { OnboardingModal } from "@/components/modals/OnboardingModal";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mhawithus.shop"),
  title: {
    default: "WITHUS MHA | 마닐라한국아카데미 통합 캠퍼스 플랫폼 (withusmha)",
    template: "%s | WITHUS MHA (withusmha)",
  },
  description:
    "WITHUS MHA (withusmha / mhawithus) - 마닐라한국아카데미(Manila Hankuk Academy) 학생과 교사를 위한 통합 스마트 캠퍼스 라이프 플랫폼. 공지사항, 시간표, 급식표, 학사일정, 커뮤니티 및 AI 도우미 서비스.",
  keywords: [
    "withusmha",
    "withus mha",
    "withusmha.shop",
    "mhawithus",
    "mhawithus.shop",
    "MHA withus",
    "withus",
    "mha",
    "Manila Hankuk Academy",
    "마닐라한국아카데미",
    "마닐라 한국 아카데미",
    "위더스",
    "마한아",
    "필리핀 한국학교",
    "MHA 캠퍼스 라이프",
    "MHA 교사",
    "MHA 선생님",
    "MHA 학생 커뮤니티",
    "MHA 입시",
    "마닐라 한인 학교",
    "필리핀 한인 학교",
  ],
  applicationName: "WITHUS MHA",
  appleWebApp: {
    title: "WITHUS MHA",
    statusBarStyle: "default",
    capable: true,
  },
  alternates: {
    canonical: "https://mhawithus.shop",
  },
  openGraph: {
    title: "WITHUS MHA | 마닐라한국아카데미 통합 캠퍼스 플랫폼 (withusmha)",
    description:
      "WITHUS MHA (withusmha / mhawithus) - 마닐라한국아카데미 학생과 교사를 위한 통합 캠퍼스 라이프 플랫폼.",
    siteName: "WITHUS MHA (withusmha)",
    url: "https://mhawithus.shop",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary",
    title: "WITHUS MHA | 마닐라한국아카데미 (withusmha)",
    description:
      "WITHUS MHA (withusmha / mhawithus) - MHA 학생 및 교사를 위한 통합 캠퍼스 플랫폼.",
  },
  verification: {
    google: "UgMH0SGAU1AonBchOM9OurUhEyGX1S7nRT2NwYFa688",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
                "name": "WITHUS MHA",
                "alternateName": [
                  "withusmha",
                  "withus mha",
                  "mhawithus",
                  "mhawithus.shop",
                  "WITHUS",
                  "마닐라한국아카데미 위더스",
                  "Manila Hankuk Academy"
                ],
                "url": "https://mhawithus.shop",
                "description": "마닐라한국아카데미(MHA) 통합 스마트 캠퍼스 라이프 플랫폼 WITHUS MHA (withusmha)",
              },
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "WITHUS MHA",
                "alternateName": [
                  "withusmha",
                  "withus mha",
                  "mhawithus",
                  "마닐라한국아카데미 위더스",
                  "MHA WithUs",
                  "마닐라한국아카데미"
                ],
                "url": "https://mhawithus.shop",
                "logo": "https://mhawithus.shop/images/site-logo.png",
                "description": "마닐라한국아카데미(MHA) 학생과 교사를 위한 통합 스마트 캠퍼스 라이프 플랫폼 WITHUS (withusmha)",
              },
            ]),
          }}
        />
      </head>
      <body className={`${outfit.variable} min-h-screen bg-black text-white font-sans selection:bg-blue-500/30`}>
        <AuthProvider>
          {/* Background Component */}
          <Background />

          {/* Layout Content */}
          <Navbar />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          <Footer />
          <PromotionModal />
          <OnboardingModal />
          <Analytics />
          <SpeedInsights />
          <GoogleAnalytics gaId="G-NRSBWWTND4" />
        </AuthProvider>
      </body>
    </html>
  );
}
