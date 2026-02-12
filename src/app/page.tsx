"use client"

import Link from "next/link"
import { ChevronRight, Sparkles, MessageCircle, Zap, Shield, Globe, Users, Ghost, Coffee, Code } from "lucide-react"
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

  const funPrompts = [
    {
      icon: <Ghost className="text-purple-400" size={20} />,
      text: "오늘 점심 메뉴로 가사 써줘 🎤",
      color: "from-purple-500/20 to-transparent"
    },
    {
      icon: <Coffee className="text-yellow-400" size={20} />,
      text: "졸린데 잠 깨는 법 알려줘 ☕",
      color: "from-yellow-500/20 to-transparent"
    },
    {
      icon: <Code className="text-blue-400" size={20} />,
      text: "코딩 숙제 힌트 좀 줄래? 💻",
      color: "from-blue-500/20 to-transparent"
    }
  ]

  return (
    <div className="flex flex-col relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      <Navbar />

      {/* Background Ambience - More Dynamic */}
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
          className="max-w-5xl mx-auto w-full text-center space-y-12 mb-20"
        >
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[11px] font-black tracking-[0.2em] uppercase backdrop-blur-md">
              <Sparkles size={12} />
              <span>Only for MHA Students</span>
            </div>

            <h1 className="text-6xl md:text-[7rem] font-black tracking-[-0.04em] leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/20">
              우리들의 진짜<br />
              <span className="text-white">아지트.</span>
            </h1>

            <p className="text-lg md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              딱딱한 챗봇은 이제 그만. MHA 학생들만을 위한<br className="hidden md:block" /> 
              가장 똑똑하고 재밌는 AI 친구를 만나보세요. 
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-8">
            <Link href="/chatbot" className="group relative px-12 py-5 bg-white text-black rounded-2xl font-black text-xl tracking-tight transition-all hover:scale-[1.05] active:scale-[0.95] shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              <span className="flex items-center">
                채팅 시작하기
                <MessageCircle className="ml-3 group-hover:rotate-12 transition-transform" size={24} />
              </span>
            </Link>

            {/* Fun Prompt Cards */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {funPrompts.map((prompt, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className={`px-6 py-4 rounded-2xl bg-gradient-to-br ${prompt.color} border border-white/5 backdrop-blur-sm flex items-center gap-3 text-sm font-bold text-gray-300`}
                >
                  {prompt.icon}
                  {prompt.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Simplified "What we do" Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto w-full mt-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4">
              <Zap className="text-blue-400" size={32} />
              <h3 className="text-2xl font-bold">진짜 빨라요</h3>
              <p className="text-gray-500 font-medium">숙제 힌트부터 심심풀이 농담까지, 1초 만에 대답해줍니다.</p>
            </div>
            <div className="p-10 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-4">
              <Shield className="text-purple-400" size={32} />
              <h3 className="text-2xl font-bold">우리만 써요</h3>
              <p className="text-gray-500 font-medium">MHA 학생 계정 없이는 들어올 수 없는 우리만의 프라이빗 공간.</p>
            </div>
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
