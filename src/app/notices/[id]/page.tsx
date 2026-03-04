"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Bell, Loader2, Sparkles, User, Tag } from "lucide-react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"

interface Notice {
    id: string
    title: string
    content: string
    category: string
    createdAt: string
}

export default function NoticeDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const [notice, setNotice] = useState<Notice | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchNotice() {
            try {
                const res = await fetch(`/api/notices/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setNotice(data)
                }
            } catch (err) {
                console.error("Failed to fetch notice:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchNotice()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
                <Navbar />
                <main className="max-w-4xl mx-auto px-6 py-32 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={32} className="animate-spin text-blue-500" />
                    <p className="text-zinc-500 text-sm animate-pulse tracking-widest uppercase">공지사항을 불러오는 중...</p>
                </main>
            </div>
        )
    }

    if (!notice) {
        return (
            <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
                <Navbar />
                <main className="max-w-4xl mx-auto px-6 py-32 text-center space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-light">공지사항을 찾을 수 없습니다</h1>
                        <p className="text-white/20 uppercase tracking-[0.3em] text-xs font-bold">요청하신 페이지가 존재하지 않거나 삭제되었을 수 있습니다</p>
                    </div>
                    <Link href="/notices" className="inline-flex items-center gap-2 px-8 py-3 border border-white/10 text-[11px] uppercase tracking-[0.2em] font-light hover:bg-white/5 transition-all">
                        <ArrowLeft size={14} /> 목록으로 돌아가기
                    </Link>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
            {/* Texture Overlay */}
            <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150" />

            <Navbar />

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-40">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-12"
                >
                    {/* Header */}
                    <div className="space-y-8">
                        <Link
                            href="/notices"
                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Notice Board
                        </Link>

                        <div className="space-y-6">
                            <div className="flex flex-wrap items-center gap-4">
                                <span className="px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                    {notice.category === "Notice" ? "공지사항" : notice.category === "Mission" ? "미션" : notice.category === "Event" ? "이벤트" : notice.category === "Bible" ? "주제 말씀" : notice.category}
                                </span>
                                <div className="flex items-center gap-2 text-[10px] text-white/20 font-mono uppercase tracking-widest">
                                    <Calendar size={12} />
                                    {new Date(notice.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                                </div>
                            </div>

                            <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-[1.1] text-white/90">
                                {notice.title}
                            </h1>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                    {/* Content */}
                    <div className="relative group">
                        {/* Glass Box Container */}
                        <div className="absolute -inset-8 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-2xl" />

                        <div className="relative p-0 md:p-4">
                            <div className="text-lg md:text-xl font-light text-white/60 leading-relaxed whitespace-pre-wrap selection:bg-blue-500/30 tracking-tight">
                                {notice.content}
                            </div>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-white/10">
                            <Sparkles size={16} />
                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold">WITHUS HUB INSIGHT</span>
                        </div>
                        <Link
                            href="/notices"
                            className="px-8 py-3 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-black hover:bg-zinc-200 transition-all active:scale-95"
                        >
                            목록으로
                        </Link>
                    </div>
                </motion.div>
            </main>

            <footer className="py-24 border-t border-white/5 text-center bg-transparent opacity-30">
                <p className="text-[9px] uppercase tracking-[0.5em] text-white/10 font-bold">WITHUS MISSION PLATFORM</p>
            </footer>
        </div>
    )
}
