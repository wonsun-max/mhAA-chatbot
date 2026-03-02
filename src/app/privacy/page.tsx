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
                        Back to Home.
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
                            We collect information you provide directly to us when you create an account, use our AI chat services, or communicate with us. This includes your nickname, name, email address, grade, and chat history (ChatLogs).
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. Use of Information</h2>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. 정보 수집 및 이용 목적</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            WITHUS는 교목실의 학생 상담 및 영성 지도를 지원하기 위해 설립되었습니다. 수집된 모든 정보(이름, 닉네임, 이메일, 채팅 로그 등)는 학생들의 필요를 파악하고, 보다 나은 영적 지원을 제공하며, 학교 건학 이념에 부합하는 안전한 공동체 환경을 조성하는 데에만 사용됩니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. 채팅 로그의 보관 및 보호</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            사용자와 AI 간의 모든 대화 내용은 철저히 암호화되어 보관됩니다. 이는 위기 상황 시 적절한 도움을 제공하거나 상담의 연속성을 유지하기 위함이며, 법령에 정한 경우를 제외하고는 제3자에게 제공되지 않습니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. 데이터 보관 기간</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            수집된 개인정보는 원칙적으로 목적이 달성되거나 사용자가 계정을 삭제할 때까지 보관됩니다. 단, 학사 관리 및 상담 지도 기록 보존이 필요한 경우 관련 규정에 따라 일정 기간 보관될 수 있습니다.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
