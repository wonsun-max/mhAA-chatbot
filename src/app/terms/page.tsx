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
                            By accessing or using the WITHUS AI Assistant, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Community Standards</h2>
                        <p>
                            As part of our Christian school community, users are expected to engage with the AI assistant and other members with respect and integrity. Harassment, profanity, or misuse of the AI for non-academic/disruptive purposes is strictly prohibited.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. Academic Integrity</h2>
                        <p>
                            The AI assistant is a tool for support and information. Students must maintain academic integrity and follow school policies regarding the use of AI in their studies. Do not use AI to generate work that should be your own.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. AI Content</h2>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. AI Content</h2>
                        <p>
                            The AI assistant provides responses based on advanced language models. These responses are for informational purposes only and should not be considered professional advice. We do not guarantee the accuracy of AI-generated content.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">5. 커뮤니티 가이드라인</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            본 서비스는 기독교 정신에 기초한 상호 존중과 사랑의 공동체를 지향합니다. 타인을 비방하거나 부적절한 언어를 사용하는 행위, 건학 이념에 반하는 내용을 유포하는 행위는 제한될 수 있습니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">6. 학업 및 인공지능 윤리</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            WITHUS AI는 학생들의 영적 고민과 일상적인 질문에 도움을 주기 위한 도구입니다. 과제 대행 등 학업 정직성을 해치는 용도로 사용하는 것을 금하며, 모든 답변은 참고용으로 활용하시기 바랍니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">7. Account Responsibilities</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your login credentials. We reserve the right to suspend or terminate accounts that violate our community standards or security policies.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">8. Modifications</h2>
                        <p>
                            We reserve the right to modify or replace these terms at any time. Your continued use of the service after any changes constitutes acceptance of the new terms.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
