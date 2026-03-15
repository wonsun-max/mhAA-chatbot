import Link from "next/link"
import { Sparkles } from "lucide-react"
import { HeroSection } from "@/components/home/HeroSection"
import { NoticesFeed } from "@/components/home/NoticesFeed"
import * as motion from "framer-motion/client"

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen min-h-[100dvh] bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="noise" />

      {/* Left Column: Visual Pillar (Desktop Only/Top on Mobile) */}
      <HeroSection />

      {/* Right Column: Information & Interactions */}
      <main className="w-full md:w-1/2 flex flex-col pt-20 md:pt-24 px-6 md:px-16 lg:px-24 bg-[#0a0a0a] pb-[env(safe-area-inset-bottom,0px)]">

        {/* Intro Section */}
        <section className="py-12 md:py-24 space-y-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 max-w-lg"
          >
            <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-tight">
              학술적 지능과 <br />
              <span className="opacity-40 font-serif italic italic font-light">효율성</span>을 위한 공간
            </h2>
            <p className="text-sm font-light text-white/40 leading-relaxed tracking-wide">
              WITHUS.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/chatbot" className="px-8 py-3 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-all">
                대화 시작하기
              </Link>
              <Link href="/notices" className="px-8 py-3 border border-white/10 text-[11px] uppercase tracking-[0.2em] font-light hover:bg-white/5 transition-all">
                포털 보기
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Daily Insight Section - Elegant Minimal Box */}
        <section className="py-12 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 text-white/30">
              <Sparkles size={16} />
              <span className="text-[10px] uppercase tracking-[0.3em]">오늘의 인사이트</span>
            </div>

            <blockquote className="space-y-4">
              <p className="text-xl md:text-2xl font-serif italic text-white/80 leading-relaxed font-light">
                "이스라엘아 들으라 우리 하나님 여호와는 오직 유일한 여호와이시니 너는 마음을 다하고 뜻을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라."
              </p>
              <p className="text-[10px] text-white/20 uppercase tracking-[0.4em] font-bold">신명기 6:4-5</p>
            </blockquote>
          </motion.div>
        </section>

        {/* Notices Preview - Dynamic Feed (Client Side) */}
        <NoticesFeed />

        {/* Footer Minimal */}
        <footer className="py-24 space-y-8">
          <div className="space-y-2">
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/10 font-bold">WITHUS HUB</p>
            <p className="text-[9px] text-white/10 font-light max-w-xs leading-loose">
              본 플랫폼은 학생들의 학술적 성장과 지능형 학습 지원을 위해 운영됩니다.
            </p>
          </div>

          <div className="flex items-center gap-8 pt-8">
            {["공지사항", "개인정보처리방침", "이용약관"].map((l) => (
              <Link key={l} href={`/${l === "공지사항" ? "notices" : l === "개인정보처리방침" ? "privacy" : "terms"}`} className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </footer>
      </main>
    </div>
  )
}
