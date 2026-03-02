"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Bell, BookOpen, MessageSquare, ArrowUpRight, Heart, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import Image from "next/image"

interface Notice {
  id: string
  title: string
  category: string
  createdAt: string
}

export default function Home() {
  const [notices, setNotices] = useState<Notice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch("/api/notices?limit=3")
        if (res.ok) {
          const data = await res.json()
          setNotices(data)
        }
      } catch (err) {
        console.error("Failed to fetch notices:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotices()
  }, [])

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Texture Overlay */}
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150" />

      <Navbar />

      {/* Left Column: Visual Pillar (Desktop Only/Top on Mobile) */}
      <section className="relative w-full md:w-1/2 h-[50vh] md:h-screen sticky top-0 overflow-hidden border-r border-white/5">
        <Image
          src="/images/hero-premium.png"
          alt="WITHUS Sacred space"
          fill
          className="object-cover opacity-80 filter brightness-90 saturate-[0.8]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/40">Immanuel</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-extralight tracking-tighter leading-[0.9]">
              WITH<br />US
            </h1>
            <p className="text-[11px] uppercase tracking-[0.5em] text-white/20 font-medium">God is with us</p>
          </motion.div>
        </div>

        {/* Floating Credit/Brand */}
        <div className="absolute bottom-12 left-12 hidden md:block">
          <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">Chaplaincy Department</p>
        </div>
      </section>

      {/* Right Column: Information & Interactions */}
      <main className="w-full md:w-1/2 min-h-screen flex flex-col pt-12 md:pt-24 px-8 md:px-16 lg:px-24 bg-[#0a0a0a]">

        {/* Intro Section */}
        <section className="py-12 md:py-24 space-y-12">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6 max-w-lg"
          >
            <h2 className="text-3xl md:text-5xl font-extralight tracking-tight leading-tight">
              A space for <br />
              <span className="opacity-40 font-serif italic italic font-light">Faith & Connection</span>
            </h2>
            <p className="text-sm font-light text-white/40 leading-relaxed tracking-wide">
              WITHUS.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/chatbot" className="px-8 py-3 bg-white text-black text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-zinc-200 transition-all">
                Start Conversation
              </Link>
              <Link href="/notices" className="px-8 py-3 border border-white/10 text-[11px] uppercase tracking-[0.2em] font-light hover:bg-white/5 transition-all">
                View Mission Portal
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Daily Verse Section - Elegant Minimal Box */}
        <section className="py-12 border-t border-white/5">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 text-white/30">
              <BookOpen size={16} />
              <span className="text-[10px] uppercase tracking-[0.3em]">주제 말씀</span>
            </div>

            <blockquote className="space-y-4">
              <p className="text-xl md:text-2xl font-serif italic text-white/80 leading-relaxed font-light">
                "너는 마음을 다하고 뜻을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라"
              </p>
              <footer className="text-[10px] uppercase tracking-[0.2em] text-white/20">신명기 6:4-5 </footer>
            </blockquote>
          </motion.div>
        </section>

        {/* Notices Preview - Dynamic Feed */}
        <section className="py-12 md:py-24 border-y border-white/5 space-y-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-blue-400/50" />
              <h3 className="text-sm uppercase tracking-[0.3em] font-medium text-white/60">Recent Notices</h3>
            </div>
            <Link href="/notices" className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">See Portal</Link>
          </div>

          <div className="space-y-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={24} className="animate-spin text-white/10" />
              </div>
            ) : notices.length > 0 ? (
              notices.map((notice, i) => (
                <Link key={notice.id} href={`/notices#${notice.id}`} className="block border-b border-white/5 last:border-0 py-8 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-widest text-blue-400 font-medium">{notice.category}</span>
                      <h4 className="text-lg font-light text-white/70 group-hover:text-white transition-colors tracking-tight">{notice.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-white/20 whitespace-nowrap">
                      {new Date(notice.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-white/20 py-12 text-center italic">등록된 공지사항이 없습니다.</p>
            )}
          </div>
        </section>

        {/* Footer Minimal */}
        <footer className="py-24 space-y-8">
          <div className="space-y-2">
            <p className="text-[9px] uppercase tracking-[0.5em] text-white/10 font-bold">WITHUS HUB</p>
            <p className="text-[9px] text-white/10 font-light max-w-xs leading-loose">
              본 플랫폼은 교목부의 신앙 사역과 학생들의 영적 성장을 위해 운영됩니다.
            </p>
          </div>

          <div className="flex items-center gap-8 pt-8">
            {["Notices", "Privacy", "Terms"].map((l) => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors">
                {l}
              </Link>
            ))}
          </div>
        </footer>
      </main>
    </div>
  )
}
