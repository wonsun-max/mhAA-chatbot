"use client"

import Link from "next/link"
import { ChevronRight, Sparkles, Zap, Shield, Globe, Users } from "lucide-react"
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

  const features = [
    {
      icon: <Zap className="text-yellow-400" size={24} />,
      title: "Intelligent Chat",
      description: "Experience natural, context-aware conversations with our advanced AI assistant."
    },
    {
      icon: <Shield className="text-blue-400" size={24} />,
      title: "Secure Privacy",
      description: "Your conversations are private and encrypted, ensuring your data stays yours."
    },
    {
      icon: <Globe className="text-purple-400" size={24} />,
      title: "Global Context",
      description: "Connect your AI assistant to the global knowledge base seamlessly."
    },
    {
      icon: <Users className="text-green-400" size={24} />,
      title: "Instant Support",
      description: "Get immediate answers to your questions, anytime and anywhere."
    }
  ]

  return (
    <div className="flex flex-col relative min-h-screen bg-black text-white selection:bg-blue-500/30">
      <Navbar />

      {/* Beta Announcement Banner */}
      <div className="fixed top-20 left-0 right-0 z-40 px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto glass border border-blue-500/20 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-2xl shadow-blue-500/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400">
              <Sparkles size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-white tracking-tight">Beta Test Live</p>
              <p className="text-[10px] text-gray-400 font-medium">현재 AI 어시스턴트 베타 테스트 중입니다. 자유롭게 이용해보세요!</p>
            </div>
          </div>
          <a 
            href="https://mhawebsitess.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] font-bold text-white transition-all whitespace-nowrap"
          >
            공식 사이트 방문
          </a>
        </motion.div>
      </div>

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px]" />
      </div>

      <main className="flex-1 flex flex-col items-center relative z-10 pt-32 pb-20 px-6">

        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto w-full text-center space-y-12 mb-32"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-md">
              <Sparkles size={12} className="text-blue-400" />
              <span>Next Generation AI Chat</span>
            </div>

            <h1 className="text-5xl md:text-[5.5rem] font-bold tracking-[-0.03em] leading-[1.05] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">
              Intelligence in every<br />
              <span className="text-white">interaction.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Experience the future of communication. MissionLink provides a fluid,
              beautiful interface for all your AI chat needs.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/chatbot" className="group relative px-10 py-4.5 bg-white text-black rounded-full font-bold text-lg tracking-tight transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-white/10">
              <span className="flex items-center">
                Start Chatting
                <ChevronRight className="ml-2 group-hover:translate-x-0.5 transition-transform" size={20} />
              </span>
            </Link>
          </motion.div>
        </motion.section>

        {/* Dynamic Feature Grid */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-7xl mx-auto w-full px-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative p-8 rounded-[32px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 shadow-inner">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white/90">{feature.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed group-hover:text-gray-400 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Visual Footer Credit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="mt-32 text-center"
        >
          <div className="inline-block h-[1px] w-12 bg-white/10 mb-6" />
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-bold">
            Redefining Education Systems
          </p>
        </motion.div>

      </main>
    </div>
  )
}
