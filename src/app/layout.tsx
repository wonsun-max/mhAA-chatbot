import type { Metadata } from "next";
import "./globals.css";
import Background from "@/components/Background";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// 1. Metadata setup

export const metadata: Metadata = {
  title: "MHA AI Assistant",
  description: "Advanced AI Assistant Platform",
  icons: {
    icon: "/site-favicon.png",
    apple: "/site-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0A1929] text-white">
        <AuthProvider>
          {/* 3. Background Component */}
          <Background />

          {/* Layout Content */}
          <Navbar />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
