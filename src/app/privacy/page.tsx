"use client"

import { motion } from "framer-motion"
import { Shield, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen py-32 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-6">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors group">
                        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Privacy Policy</h1>
                    </div>
                    <p className="text-gray-400 font-medium">Last updated: February 12, 2026</p>
                </div>

                {/* Content */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 md:p-12 rounded-[2rem] border border-white/5 space-y-8 text-gray-300 leading-relaxed"
                >
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Information Collection</h2>
                        <p>
                            We collect information you provide directly to us when you create an account, use our AI chat services, or communicate with us. This may include your nickname, email address, and chat history.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Use of Information</h2>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, including to personalize your AI chat experience and to protect the security of our platform.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. AI Interactions</h2>
                        <p>
                            Your chat interactions are processed by our AI models (including GPT-4o) to generate responses. While we take steps to ensure privacy, please avoid sharing sensitive personal information during chat sessions.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. Data Security</h2>
                        <p>
                            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">5. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at wonsunpro123444@gmail.com.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
