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
                        홈으로 돌아가기
                    </Link>
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-500">
                            <FileText size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">이용약관</h1>
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
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">1. 약관의 동의</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            WITHUS AI 어시스턴트를 이용함으로써 귀하는 본 이용약관에 동의하게 됩니다. 본 약관의 모든 내용에 동의하지 않으실 경우 서비스를 이용하실 수 없습니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">2. 커뮤니티 가이드라인</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            본 서비스는 상호 존중과 건전한 학습 환경을 지향합니다. 타인을 비방하거나 부적절한 언어를 사용하는 행위, 혐오 또는 차별적 내용을 유포하는 행위는 엄격히 금지되며, 위반 시 서비스 이용이 제한될 수 있습니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">3. 학업 및 인공지능 윤리</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            WITHUS AI는 학생들의 학습과 학업 생산성을 지원하기 위한 도구입니다. 과제 대행 등 학업 정직성을 해치는 용도로 사용하는 것을 금하며, 모든 AI 응답은 참고 자료로만 활용하시기 바랍니다. AI가 생성한 콘텐츠의 정확성을 보장하지 않습니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">4. 계정 책임</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            귀하는 자신의 로그인 정보에 대한 보안을 유지할 책임이 있습니다. 커뮤니티 기준이나 보안 정책을 위반하는 계정은 정지 또는 해지될 수 있습니다.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider">5. 약관의 변경</h2>
                        <p className="text-zinc-400 leading-relaxed text-sm">
                            운영 측은 언제든지 본 약관을 수정하거나 교체할 권리를 보유합니다. 변경된 약관이 게시된 후에도 서비스를 계속 이용하는 것은 새로운 약관에 동의하는 것으로 간주됩니다.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    )
}
