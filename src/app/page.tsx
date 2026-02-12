"use client"

import Link from "next/link"
import { ChevronRight, Sparkles, MessageCircle, Zap, Shield, Calendar, Info, Star } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  }

  return (
    <div className="flex flex-col relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <main className="flex-1 flex flex-col items-center relative z-10 pt-40 pb-20 px-6">

        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto w-full text-center space-y-16 mb-24"
        >
          <motion.div variants={itemVariants} className="space-y-10">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[11px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
              <Sparkles size={12} />
              <span>MHA STUDENTS ONLY</span>
            </div>

            <div className="flex flex-col items-center">
              <h1 className="text-5xl md:text-[5.5rem] font-black tracking-[-0.04em] leading-none text-white/40">
                MHA 애들만 아는
              </h1>
              <h1 className="text-6xl md:text-[7.5rem] font-black tracking-[-0.04em] leading-none text-white mt-10 md:mt-14">
                프라이빗 딥챗 라운지
              </h1>
            </div>

            <div className="space-y-4 pt-6">
              <p className="text-lg md:text-2xl text-gray-400 font-bold leading-tight">
                📅 오늘 학교 일정부터 시험기간 정보까지 한눈에
              </p>
              <p className="text-lg md:text-2xl text-gray-400 font-bold leading-tight">
                🏫 학교생활 궁금한 건 뭐든 물어봐 (알아서 척척)
              </p>
              <p className="text-lg md:text-2xl text-gray-400 font-bold leading-tight">
                ✨ 복잡한 질문도 알잘딱깔센하게 대답해주는 전용 AI
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-10">
            <Link href="/chatbot" className="group relative inline-flex items-center justify-center px-16 py-6 bg-white text-black rounded-3xl font-black text-2xl tracking-tighter transition-all hover:scale-[1.05] active:scale-[0.95] shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                채팅룸 입장하기
                <ChevronRight className="ml-2 group-hover:translate-x-2 transition-transform" size={28} strokeWidth={3} />
            </Link>
          </motion.div>
        </motion.section>

        {/* Info Cards */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="p-12 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-4 hover:bg-white/[0.05] transition-colors">
            <Calendar className="text-blue-400" size={32} />
            <h3 className="text-2xl font-bold">스마트한 일정</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              학교의 모든 공지와 일정을<br />
              누구보다 빠르게 확인해봐.
            </p>
          </div>
          <div className="p-12 rounded-[3rem] bg-white/[0.03] border border-white/5 space-y-4 hover:bg-white/[0.05] transition-colors">
            <Star className="text-purple-400" size={32} />
            <h3 className="text-2xl font-bold">알잘딱깔센 답변</h3>
            <p className="text-gray-500 font-medium leading-relaxed">
              길게 말 안 해도 찰떡같이<br />
              네 의도를 파악해서 대답해줄게.
            </p>
          </div>
        </motion.section>

        {/* Visual Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="mt-40 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.5em] text-gray-700 font-black">
            MHA Digital Playground • 2026
          </p>
        </motion.div>

      </main>
    </div>
  )
}
