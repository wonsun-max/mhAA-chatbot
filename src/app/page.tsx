"use client"

import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col relative min-h-screen bg-[#020617] text-white overflow-hidden selection:bg-blue-500/30">

      {/* Background Ambience - Optimized for performance */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] mix-blend-screen animate-pulse-slow delay-1000" />
      </div>

      <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 min-h-screen">

        {/* Floating AI Showcase - The "Centerpiece" */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[40px] blur-[80px] -z-10 opacity-60"
        />

        <div className="max-w-4xl mx-auto w-full text-center space-y-12">

          {/* Header Group */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium tracking-wide backdrop-blur-sm"
            >
              <Sparkles size={12} className="text-blue-400" />
              <span>Next Gen School Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-500 leading-[1.05]"
            >
              All Your School Life.<br />
              <span className="text-blue-500/90">One Interface.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto font-light leading-relaxed"
            >
              Access schedules, meals, and real-time student data.
              <br className="hidden md:block" />
              Simple. Intelligent. Designed for you.
            </motion.p>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/chatbot" className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg tracking-tight transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              <span className="relative z-10 flex items-center">
                Launch System
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </span>
            </Link>

            <Link href="/signup" className="px-8 py-4 rounded-full text-gray-400 font-medium hover:text-white transition-colors">
              Create Profile
            </Link>
          </motion.div>
        </div>

        {/* Floating UI Elements (Decorative) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 2 }}
          className="absolute bottom-10 left-0 right-0 text-center"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-gray-600 font-semibold">
            MissionLink™ Systems Active
          </p>
        </motion.div>

      </main>
    </div>
  )
}
