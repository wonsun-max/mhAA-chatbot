"use client"

import Link from "next/link"
import { ChevronRight, Sparkles, MessageCircle, Calendar, Shield, Activity, ArrowUpRight } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <div className="flex flex-col relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 flex flex-col items-center relative z-10 pt-32 pb-32 px-6">

        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto w-full text-center space-y-12 mb-32"
        >
          <motion.div variants={itemVariants} className="space-y-8">
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.15)", borderColor: "rgba(59, 130, 246, 0.4)" }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium tracking-wide cursor-default transition-colors duration-300"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={14} />
              </motion.div>
              <span>MHA Students Private Network</span>
            </motion.div>

            <div className="flex flex-col items-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                ___ 앞서가는 <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                  MHA AI 챗봇
                </span>
              </h1>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/chatbot" className="group inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-bold text-lg transition-all hover:bg-zinc-200 active:scale-95 shadow-lg shadow-white/5">
              채팅룸 입장하기
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link href="https://mhawebsitess.vercel.app/" target="_blank" className="inline-flex items-center justify-center px-8 py-4 bg-zinc-900 text-white border border-zinc-800 rounded-full font-bold text-lg transition-all hover:bg-zinc-800 active:scale-95">
              공식 사이트
              <ArrowUpRight className="ml-2 opacity-50" size={18} />
            </Link>
          </motion.div>
        </motion.section>

        {/* Feature Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="bento-card group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">학사 일정 자동화</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              중요한 학사 일정과 공지사항을 실시간으로 동기화하여 놓치는 일 없이 관리합니다.
            </p>
          </div>

          <div className="bento-card group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Activity className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">끊김 없는 대화</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              학교 관련해서 궁금한 점을 무엇이든 물어보세요.
            </p>
          </div>

          <div className="bento-card group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="text-blue-500" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">프라이빗 네트워크</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              오직 MHA 학생들만을 위한 전용 공간으로, 안전하고 신뢰할 수 있는 정보를 공유합니다.
            </p>
          </div>
        </motion.section>

        {/* Status Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-32 w-full max-w-4xl p-8 rounded-3xl bg-gradient-to-b from-zinc-900/50 to-transparent border border-zinc-800/50 text-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  )
}
