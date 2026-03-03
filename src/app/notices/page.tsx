"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Bell, Calendar, Search, Filter, ArrowLeft, Plus, Trash2, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/layout/Navbar"
import { useSession } from "next-auth/react"

interface Notice {
    id: string
    title: string
    content: string
    category: string
    createdAt: string
    authorId?: string
}

export default function NoticesPage() {
    const { data: session } = useSession()
    const isAdmin = (session?.user as any)?.role === "ADMIN"

    const [notices, setNotices] = useState<Notice[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // Form State
    const [newNotice, setNewNotice] = useState({ title: "", content: "", category: "Notice" })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchNotices = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/notices")
            if (res.ok) {
                const data = await res.json()
                setNotices(data)
            }
        } catch (err) {
            console.error("Failed to fetch notices:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotices()
    }, [])

    const handleAddNotice = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/notices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newNotice),
            })
            if (res.ok) {
                setShowAddModal(false)
                setNewNotice({ title: "", content: "", category: "Notice" })
                fetchNotices()
            }
        } catch (err) {
            console.error("Error creating notice:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteNotice = async (id: string) => {
        if (!confirm("정말 이 공지사항을 삭제하시겠습니까?")) return
        try {
            const res = await fetch(`/api/notices/${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchNotices()
            }
        } catch (err) {
            console.error("Error deleting notice:", err)
        }
    }

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col relative min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden pt-32 pb-24">
            {/* Texture Overlay */}
            <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] contrast-150" />

            <Navbar />

            <main className="flex-1 flex flex-col">
                <div className="max-w-5xl mx-auto px-6 w-full space-y-12">

                    {/* Header */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white transition-colors group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 홈으로 돌아가기
                        </Link>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">공지사항 포털</h1>
                                <p className="text-xs text-white/30 font-light tracking-[0.4em] uppercase">소식 및 정보</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="공지사항 검색..."
                                        className="bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-[11px] font-light focus:outline-none focus:border-white/20 transition-all w-full md:w-64"
                                    />
                                </div>
                                {isAdmin && (
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="p-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider px-4"
                                    >
                                        <Plus size={16} /> 새 글 작성
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notices List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40 space-y-4 opacity-20">
                                <Loader2 size={32} className="animate-spin" />
                                <p className="text-[10px] uppercase tracking-widest">데이터를 불러오는 중...</p>
                            </div>
                        ) : filteredNotices.length > 0 ? (
                            filteredNotices.map((notice, i) => (
                                <motion.div
                                    key={notice.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    id={notice.id}
                                    className="group relative p-8 rounded-[32px] border border-white/5 bg-zinc-900/10 hover:bg-zinc-900/30 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                                        <div className="space-y-6 flex-1">
                                            <div className="flex items-center gap-4">
                                                <span className="px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold bg-white/5 text-white/50 border border-white/10 group-hover:bg-blue-500/10 group-hover:text-blue-400 group-hover:border-blue-500/20 transition-colors">
                                                    {notice.category === "Notice" ? "공지사항" : notice.category === "Mission" ? "미션" : notice.category === "Event" ? "이벤트" : notice.category === "Bible" ? "주제 말씀" : notice.category}
                                                </span>
                                                <span className="text-[10px] text-white/20 font-mono">
                                                    {new Date(notice.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })}
                                                </span>
                                            </div>

                                            <div className="space-y-3">
                                                <h2 className="text-2xl font-light text-white/90 group-hover:text-white transition-colors tracking-tight leading-snug">
                                                    {notice.title}
                                                </h2>
                                                <p className="text-sm text-white/40 font-light leading-relaxed whitespace-pre-wrap">
                                                    {notice.content}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 self-start">
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteNotice(notice.id)}
                                                    className="p-3 bg-red-500/5 rounded-full text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                            <button className="p-3 bg-white/5 rounded-full text-white/20 group-hover:text-white group-hover:bg-white/10 transition-all">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-40 text-center space-y-4 opacity-20">
                                <Bell size={40} className="mx-auto" />
                                <p className="text-sm italic">검색 결과가 없습니다.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Add Notice Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-12"
                        >
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="space-y-8">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-light">새로운 소식 업데이트</h3>
                                    <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">커뮤니티를 위한 새로운 공지사항을 작성하세요</p>
                                </div>

                                <form onSubmit={handleAddNotice} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 px-1 font-bold">카테고리</label>
                                            <select
                                                value={newNotice.category}
                                                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/20 transition-all appearance-none"
                                            >
                                                <option value="Notice" className="bg-zinc-900">공지사항</option>
                                                <option value="Mission" className="bg-zinc-900">미션</option>
                                                <option value="Event" className="bg-zinc-900">이벤트</option>
                                                <option value="Bible" className="bg-zinc-900">주제 말씀</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 px-1 font-bold">제목</label>
                                            <input
                                                type="text"
                                                required
                                                value={newNotice.title}
                                                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                                placeholder="공지사항 제목..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/20 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 px-1 font-bold">내용</label>
                                            <textarea
                                                required
                                                rows={6}
                                                value={newNotice.content}
                                                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                                placeholder="상세 내용을 입력하세요..."
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-white/20 transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-white text-black rounded-2xl text-[11px] uppercase tracking-widest font-black hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "공지사항 게시"}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <footer className="py-24 border-t border-white/5 text-center bg-transparent">
                <p className="text-[9px] uppercase tracking-[0.5em] text-white/10 font-bold">WITHUS MISSION PLATFORM</p>
            </footer>
        </div>
    )
}
