"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative w-full md:w-1/2 min-h-[50dvh] md:min-h-screen md:h-screen md:sticky md:top-0 overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
      <Image
        src="/images/hero-premium.png"
        alt="WITHUS Sacred space"
        fill
        className="object-cover opacity-80 filter brightness-90 saturate-[0.8]"
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-[0.4em] font-medium text-white/40">Immanuel</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-extralight tracking-tighter leading-[0.9]">
            WITH<br />US
          </h1>
          <p className="text-[11px] uppercase tracking-[0.5em] text-white/20 font-medium">하나님이 우리와 함께하십니다</p>
        </motion.div>
      </div>

      {/* Brand */}
      <div className="absolute bottom-8 left-8 hidden md:block">
        <p className="text-[9px] uppercase tracking-[0.3em] text-white/20">WITHUS Intelligence</p>
      </div>
    </section>
  )
}
