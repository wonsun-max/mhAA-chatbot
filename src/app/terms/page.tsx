"use client"

import { motion } from "framer-motion"
import { FileText, ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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
                            <FileText size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">Terms of Service</h1>
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
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the MissionLink AI Assistant, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Use of Service</h2>
                        <p>
                            You agree to use our AI chat services only for lawful purposes. You are responsible for all activity that occurs under your account.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. AI Content</h2>
                        <p>
                            The AI assistant provides responses based on advanced language models. These responses are for informational purposes only and should not be considered professional advice. We do not guarantee the accuracy of AI-generated content.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. Account Responsibilities</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your login credentials. We reserve the right to suspend or terminate accounts that violate our community standards or security policies.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">5. Modifications</h2>
                        <p>
                            We reserve the right to modify or replace these terms at any time. Your continued use of the service after any changes constitutes acceptance of the new terms.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
