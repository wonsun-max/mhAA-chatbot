"use client"

import Link from "next/link"
import { ChevronRight, Globe, Shield, Zap, Info, ArrowUpRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import Image from "next/image"

export default function Home() {
  return (
    <div className="flex flex-col relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Decorative Grainy Texture Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150 brightness-150" />

      <Navbar />

      <main className="flex-1 flex flex-col pt-16">
        {/* Intro Hero - Bridges the Duality */}
        <section className="relative h-[40vh] flex flex-col items-center justify-center text-center px-6 z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium">Evolution of Connection</span>
            <h1 className="text-4xl md:text-6xl font-extralight tracking-[-0.02em] leading-tight">
              WITHUS <span className="opacity-40 italic">&</span> THE FUTURE
            </h1>
            <p className="text-sm md:text-base text-white/50 font-light max-w-xl mx-auto tracking-wide">
              An exclusive ecosystem where human coordination meets autonomous intelligence.
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </section>

        {/* The Duality Split Section */}
        <section className="relative flex flex-col md:flex-row min-h-[90vh] w-full border-t border-white/5">

          {/* Left Side: The Private Network (Dark/Exclusive) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="group relative flex-1 min-h-[500px] border-r border-white/5 flex flex-col justify-end p-8 md:p-16 overflow-hidden"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/private-network.png"
                alt="Private Network"
                fill
                className="object-cover opacity-30 grayscale group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            </div>

            <div className="relative z-20 space-y-6">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <Shield size={14} className="text-white/60" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/60">Restricted Access</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-tight">
                BEYOND <br /> ACCESS.
              </h2>

              <p className="text-sm md:text-base text-zinc-400 font-light max-w-md leading-relaxed">
                WITHUS is a high-density network of verified professionals. Membership ensures a curated environment free from digital noise, fostering high-impact collaboration.
              </p>

              <div className="flex flex-wrap gap-6 pt-4 text-[11px] uppercase tracking-[0.15em] font-medium text-white/40">
                <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Verified Synergy</span>
                <span className="flex items-center gap-2"><div className="w-1 h-1 rounded-full bg-blue-500" /> Exclusive Flow</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: AI Intelligence (Light/Tech) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="group relative flex-1 min-h-[500px] flex flex-col justify-end p-8 md:p-16 overflow-hidden"
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/ai-intelligence.png"
                alt="AI Intelligence"
                fill
                className="object-cover opacity-20 group-hover:scale-105 group-hover:opacity-30 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            </div>

            <div className="relative z-20 space-y-6 text-right items-end flex flex-col">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
                <Zap size={14} className="text-blue-400" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-blue-400">Next-Gen Intelligence</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-light tracking-tight leading-tight">
                BEYOND <br /> SEARCH.
              </h2>

              <p className="text-sm md:text-base text-zinc-400 font-light max-w-md leading-relaxed text-right">
                Our neural layer understands context, not just keywords. From complex problem-solving to strategic insights, our AI acts as a multiplier for your cognitive potential.
              </p>

              <div className="flex flex-wrap gap-6 pt-4 text-[11px] uppercase tracking-[0.15em] font-medium text-white/40 justify-end">
                <span className="flex items-center gap-2">Cognitive Clarity <div className="w-1 h-1 rounded-full bg-blue-400" /></span>
                <span className="flex items-center gap-2">Neural Synergy <div className="w-1 h-1 rounded-full bg-blue-400" /></span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section - Minimal */}
        <section className="py-32 px-6 flex flex-col items-center justify-center text-center space-y-12 bg-zinc-950/30">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl md:text-4xl font-extralight tracking-tight opacity-80"> Ready to transcend the standard? </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/signup"
                className="px-10 py-4 bg-white text-black text-sm uppercase tracking-[0.2em] font-bold rounded-none hover:bg-zinc-200 transition-colors shadow-2xl shadow-white/5"
              >
                Request Access
              </Link>
              <Link
                href="/chatbot"
                className="group flex items-center gap-2 px-10 py-4 border border-white/10 text-sm uppercase tracking-[0.2em] font-light hover:bg-white/5 transition-colors"
              >
                Enter Chatroom
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-60" />
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Info Grid - Three Column */}
        <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5">
          <div className="space-y-4">
            <Globe className="text-white/40" size={20} />
            <h4 className="text-lg font-light tracking-wide uppercase">Global Fabric</h4>
            <p className="text-xs text-zinc-500 leading-relaxed tracking-wider font-light uppercase">
              Connecting visionaries across borders in a secure, decentralized fashion, maintaining privacy as the highest priority.
            </p>
          </div>
          <div className="space-y-4">
            <Info className="text-white/40" size={20} />
            <h4 className="text-lg font-light tracking-wide uppercase">Insight Nodes</h4>
            <p className="text-xs text-zinc-500 leading-relaxed tracking-wider font-light uppercase">
              Every interaction adds to a shared, high-quality knowledge base, refined by AI for maximum utility and clarity.
            </p>
          </div>
          <div className="space-y-4">
            <ArrowUpRight className="text-white/40" size={20} />
            <h4 className="text-lg font-light tracking-wide uppercase">Exponential Growth</h4>
            <p className="text-xs text-zinc-500 leading-relaxed tracking-wider font-light uppercase">
              Leveraging the combined power of human networking and AI speed to accelerate your projects and vision.
            </p>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.5em] text-white/20">WITHUS © 2026</p>
      </footer>
    </div>
  )
}
