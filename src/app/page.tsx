"use client"

import Link from "next/link"
import { Bot, Shield, Zap, GraduationCap, ChevronRight, ArrowRight, Sparkles, Globe, Brain } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="flex flex-col relative">
      <div className="aurora-glow" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 px-6 py-2 rounded-full glass-panel text-blue-400 text-xs font-black uppercase tracking-[0.3em]"
          >
            <Sparkles size={14} className="animate-pulse" />
            <span>Academic Intelligence 2.0</span>
          </motion.div>

          <div className="space-y-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] text-gradient"
            >
              School Life, <br />
              <span className="text-blue-500">Redefined.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed"
            >
              The ultimate AI companion for the modern student. Secure, private, and deeply integrated with your academic journey.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link href="/chatbot" className="shiny-button flex items-center group">
              Launch Assistant
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <Link
              href="/signup"
              className="px-8 py-4 glass-panel text-white font-black rounded-2xl hover:bg-white/5 transition-all active:scale-95"
            >
              Initialize Profile
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Bento Style */}
      <section className="max-w-7xl mx-auto w-full px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Active Nodes", value: "200+", icon: Globe },
            { label: "AI Operations", value: "15k+", icon: Zap },
            { label: "Data Integrity", value: "100%", icon: Shield },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bento-card flex flex-col items-center text-center space-y-2 group"
            >
              <div className="p-3 bg-blue-500/10 text-blue-500 rounded-2xl group-hover:scale-110 transition-transform mb-2">
                <stat.icon size={24} />
              </div>
              <div className="text-4xl font-black text-white">{stat.value}</div>
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features - High Fidelity */}
      <section className="max-w-7xl mx-auto px-4 py-32 space-y-20 w-full">
        <div className="space-y-4">
          <h2 className="text-sm font-black text-blue-500 uppercase tracking-[0.4em]">Core Capabilities</h2>
          <h3 className="text-5xl font-black text-white tracking-tight">Built for Intelligence.</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Brain,
              title: "Neural Context",
              desc: "The assistant understands your specific grade, schedule, and school history for personalized answers.",
              color: "blue"
            },
            {
              icon: Shield,
              title: "Privacy Locked",
              desc: "Your identity is masked. Personal data never touches global AI processing units.",
              color: "purple"
            },
            {
              icon: Zap,
              title: "Instant Sync",
              desc: "Airtable connectivity ensures you get real-time meal plans and schedule updates.",
              color: "indigo"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bento-card group flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="w-14 h-14 glass-panel rounded-2xl flex items-center justify-center text-blue-500 group-hover:rotate-12 transition-transform">
                  <feature.icon size={28} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-white">{feature.title}</h4>
                  <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
              <div className="pt-8">
                <button className="flex items-center text-[10px] font-black text-blue-500 uppercase tracking-widest group/btn">
                  Analyze Protocol <ArrowRight className="ml-2 group-hover/btn:translate-x-2 transition-transform" size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-40 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass-panel rounded-[4rem] p-16 md:p-32 overflow-hidden text-center space-y-12"
        >
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[120px]" />

          <div className="space-y-6 relative">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              Initialize Your <br />
              Digital Experience.
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto font-medium">
              Join the official school AI network and streamline your life with high-fidelity automation.
            </p>
          </div>

          <div className="pt-6 relative">
            <Link href="/signup" className="shiny-button uppercase tracking-widest text-sm inline-block">
              Begin Onboarding
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
