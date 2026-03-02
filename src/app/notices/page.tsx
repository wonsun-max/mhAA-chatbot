"use client"

import Link from "next/link"
import { ChevronRight, Bell, Calendar, Search, Filter, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"

const notices = [
    {
        id: 1,
        title: "2026학년도 1학기 교목부 오리엔테이션 안내",
        date: "2026.03.02",
        category: "Notice",
        description: "신입생 및 재학생들을 위한 교목부 프로그램 오리엔테이션이 진행됩니다. 일시: 3월 5일 오후 4시, 장소: 소강당",
        author: "교목부 사무실"
    },
    {
        id: 2,
        title: "새 학기 맞이 성경 암송 챌린지 (1주차)",
        date: "2026.03.01",
        category: "Mission",
        description: "새 학기를 하나님의 말씀으로 시작하세요! 이번 주 암송 구절은 마태복음 5:3-12입니다.",
        author: "선교팀"
    },
    {
        id: 3,
        title: "채플 시간 및 장소 변경 공지",
        date: "2026.02.28",
        category: "Notice",
        description: "이번 주 목요일 채플은 대강당 공사로 인해 3층 예배실에서 진행됩니다.",
        author: "교목부"
    },
    {
        id: 4,
        title: "방학 중 단기 선교 활동 보고서 제출안내",
        date: "2026.02.15",
        category: "Mission",
        description: "지난 겨울 단기 선교를 다녀온 학생들은 2월 말까지 활동 보고서를 제출해 주시기 바랍니다.",
        author: "선교팀"
    },
]

export default function NoticesPage() {
    return (
        <div className="flex flex-col relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Texture Overlay */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150" />

            <Navbar />

            <main className="flex-1 flex flex-col pt-32 pb-24">
                <div className="max-w-5xl mx-auto px-6 w-full space-y-12">

                    {/* Header */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white transition-colors group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-light tracking-tight">Notices</h1>
                                <p className="text-sm text-white/30 font-light tracking-widest uppercase">Community & Mission Updates</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                    <input
                                        type="text"
                                        placeholder="Search notices..."
                                        className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-light focus:outline-none focus:border-white/20 transition-all w-full md:w-64"
                                    />
                                </div>
                                <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
                                    <Filter size={14} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notices List */}
                    <div className="space-y-4">
                        {notices.map((notice, i) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group relative p-8 rounded-3xl border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                {notice.category}
                                            </span>
                                            <span className="text-[10px] text-white/20 font-mono">{notice.date}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <h2 className="text-xl font-light text-white/90 group-hover:text-white transition-colors tracking-tight">
                                                {notice.title}
                                            </h2>
                                            <p className="text-sm text-white/40 font-light leading-relaxed">
                                                {notice.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                                <Calendar size={10} className="text-white/30" />
                                            </div>
                                            <span className="text-[11px] text-white/20 font-medium">{notice.author}</span>
                                        </div>
                                    </div>

                                    <button className="md:mt-1 self-start p-3 bg-white/5 rounded-full text-white/20 group-hover:text-white group-hover:bg-white/10 transition-all">
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Pagination Placeholder */}
                    <div className="flex items-center justify-center pt-8">
                        <div className="flex items-center gap-2">
                            {[1, 2, 3].map((n) => (
                                <button key={n} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-mono transition-all ${n === 1 ? "bg-white text-black" : "text-white/30 hover:bg-white/5 hover:text-white"}`}>
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center bg-transparent">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/10">WITHUS © 2026</p>
            </footer>
        </div>
    )
}
