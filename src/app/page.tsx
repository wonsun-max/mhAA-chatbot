"use client"

import Link from "next/link"
import { ChevronRight, Bell, BookOpen, MessageSquare, ArrowUpRight, Heart } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

export default function Home() {
  return (
    <div className="flex flex-col relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150" />

      <Navbar />

      <main className="flex-1 flex flex-col pt-24">
        {/* Sacred Hero Section */}
        <section className="relative px-6 py-20 md:py-32 flex flex-col items-center justify-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 max-w-4xl"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
            >
              <Heart size={14} className="text-red-400/60" />
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/50">Immanuel: God is with us</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-extralight tracking-tight leading-[1] text-white">
              WITHUS <br />
              <span className="opacity-30 font-serif italic font-light">The Presence</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-sm md:text-lg text-white/40 font-light max-w-2xl mx-auto tracking-wide leading-relaxed">
              교목부 커뮤니티에 오신 것을 환영합니다. <br />
              하나님의 말씀과 함께하는 새로운 소통의 공간입니다.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
              <Link href="/notices" className="px-10 py-4 bg-white text-black text-[12px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-all shadow-xl shadow-white/5">
                공지사항 확인하기
              </Link>
              <Link href="/chatbot" className="group flex items-center gap-2 px-10 py-4 border border-white/10 text-[12px] uppercase tracking-[0.2em] font-light hover:bg-white/5 transition-all">
                AI 어시스턴트 <ArrowUpRight size={14} className="opacity-40 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Daily Verse Section - Premium Card */}
        <section className="px-6 py-20 bg-zinc-950/40 border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-12 md:p-20 rounded-[40px] border border-white/5 bg-gradient-to-br from-zinc-900/50 via-black to-zinc-900/30 overflow-hidden group"
            >
              {/* Decorative Beam */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 space-y-8 text-center md:text-left">
                <div className="inline-flex items-center gap-3 text-blue-400/80">
                  <BookOpen size={20} />
                  <span className="text-sm uppercase tracking-[0.2em] font-medium">Daily Bread</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-serif italic text-white/90 leading-relaxed font-light">
                  "볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라 하시니라"
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
                  <span className="text-sm text-white/40 tracking-[0.1em] uppercase">마태복음 28:20</span>
                  <button className="text-[11px] uppercase tracking-[0.2em] font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2">
                    암송 챌린지 참여 <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Notice & Grid Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left: Recent Notices */}
          <div className="lg:col-span-8 space-y-12">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3 text-white/80">
                <Bell size={18} />
                <h3 className="text-xl font-light tracking-widest uppercase">Latest Notices</h3>
              </div>
              <Link href="/notices" className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">See all</Link>
            </div>

            <div className="space-y-4">
              {[
                { title: "2026학년도 1학기 교목부 오리엔테이션 안내", date: "2026.03.02", category: "Notice" },
                { title: "새 학기 맞이 성경 암송 챌린지 (1주차)", date: "2026.03.01", category: "Mission" },
                { title: "채플 시간 및 장소 변경 공지", date: "2026.02.28", category: "Notice" },
              ].map((notice, i) => (
                <Link key={i} href="/notices" className="flex items-center justify-between p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest text-blue-400/60 font-medium">{notice.category}</span>
                    <h4 className="text-base font-light text-white/80 group-hover:text-white transition-colors">{notice.title}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-white/30 text-[11px] font-mono">
                    {notice.date}
                    <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Quick Stats/Info */}
          <div className="lg:col-span-4 space-y-12">
            <div className="p-8 rounded-[32px] border border-white/5 bg-zinc-900/30 space-y-6">
              <div className="flex items-center gap-3 text-white/60">
                <MessageSquare size={18} />
                <h3 className="text-sm uppercase tracking-widest font-medium">Faith Assistant</h3>
              </div>
              <p className="text-xs text-white/40 leading-relaxed font-light tracking-wide">
                궁금한 성경 구절이나 신앙 관련 고민을 WITHUS AI 어시스턴트에게 물어보세요. 교목부의 가이드를 바탕으로 답변해 드립니다.
              </p>
              <Link href="/chatbot" className="block w-full py-3 text-center border border-blue-500/20 rounded-xl text-[10px] uppercase tracking-widest text-blue-400 hover:bg-blue-500/5 transition-all">
                Chat Now
              </Link>
            </div>

            <div className="space-y-4 px-2">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Quick Links</h4>
              <div className="grid grid-cols-1 gap-2">
                {["성경 읽기표", "주간 기도제목", "봉사 활동 신청"].map((item) => (
                  <button key={item} className="flex items-center justify-between py-2 text-xs font-light text-white/50 hover:text-white transition-colors group">
                    {item}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-white/5 text-center bg-zinc-950">
        <div className="max-w-xs mx-auto space-y-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-medium">WITHUS Chaplaincy</p>
          <p className="text-[9px] text-white/10 font-light">© 2026 All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}
