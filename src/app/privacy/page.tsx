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
                        홈으로 돌아가기
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">개인정보 처리방침</h1>
                    </div>
                    <p className="text-gray-400 font-medium">최종 수정일: 2026년 3월 3일</p>
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 md:p-12 rounded-[2rem] border border-white/5 space-y-8 text-gray-300 leading-relaxed"
                >
                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. 정보 수집 및 이용 목적</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            WITHUS는 학생들의 학술적 성장과 효율적인 학습 지원을 위해 운영되는 AI 기반 플랫폼입니다. 수집된 정보(성명, 닉네임, 이메일, 학년, 채팅 로그 등)는 사용자에게 맞춤형 AI 응답을 제공하고, 안전한 학습 환경을 조성하는 데에만 사용됩니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. 채팅 로그의 보관 및 보호</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            사용자와 AI 간의 모든 대화 내용은 암호화되어 안전하게 보관됩니다. 대화 기록은 서비스 품질 개선 및 연속적인 학습 지원을 목적으로만 활용되며, 법령에 의한 경우를 제외하고 제3자에게 제공되지 않습니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. 데이터 보관 기간</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            수집된 개인정보는 목적이 달성되거나 사용자가 계정을 삭제할 때까지 보관됩니다. 단, 관련 법령에 따라 일정 기간 보관이 필요한 경우에는 해당 규정에 따릅니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. 정보 주체의 권리</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            귀하는 언제든지 본인의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다. 관련 문의는 플랫폼 내 문의 채널을 통해 진행하실 수 있습니다.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
