"use client"

import Link from "next/link"
import { Shield, Zap, ChevronRight, ArrowRight, Sparkles, Globe, Brain } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col relative min-h-screen overflow-hidden">
      <div className="ambient-bg" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>MissionLink Platform</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-6xl md:text-8xl font-bold tracking-tight text-white leading-[1.1]"
            >
              School Life, <br />
              <span className="text-gray-500">Intelligently Managed.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light"
            >
              The central operating system for your academic journey. Seamlessly access schedules, meals, and student data in one secure environment.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link href="/chatbot" className="btn-primary flex items-center group">
              Launch Assistant
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
            <Link
              href="/signup"
              className="btn-secondary"
            >
              Initialize Profile
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Clean Grid */}
      <section className="max-w-6xl mx-auto w-full px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-white/5 py-12">
          {[
            { label: "Active Nodes", value: "200+", icon: Globe },
            { label: "Daily Operations", value: "1.5k", icon: Zap },
            { label: "Uptime", value: "99.9%", icon: Shield },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center space-y-2"
            >
              <div className="text-4xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <stat.icon size={12} /> {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features - Minimalist Cards */}
      <section className="max-w-6xl mx-auto px-6 py-32 space-y-16 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-4 max-w-xl">
            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-widest">Core Capabilities</h2>
            <h3 className="text-4xl font-bold text-white tracking-tight">Engineered for Efficiency.</h3>
          </div>
          <p className="text-gray-400 max-w-xs text-sm leading-relaxed pb-2">
            Advanced tools designed to reduce friction in your daily academic routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Brain,
              title: "Contextual Awareness",
              desc: "Understands your specific grade level and schedule for precise assistance.",
            },
            {
              icon: Shield,
              title: "Privacy First",
              desc: "Enterprise-grade security masking your identity from external AI models.",
            },
            {
              icon: Zap,
              title: "Real-time Sync",
              desc: "Instant connection to school databases for up-to-the-minute information.",
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bento-card group flex flex-col justify-between min-h-[280px]"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                  <feature.icon size={20} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-white">{feature.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section - Simple & Direct */}
      <section className="max-w-4xl mx-auto px-6 py-32 w-full text-center">
        <div className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Ready to optimize your workflow?
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Join the platform today and experience the next generation of school management tools.
          </p>
          <div className="pt-4">
            <Link href="/signup" className="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
