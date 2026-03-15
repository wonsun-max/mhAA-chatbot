"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Bell, Calendar, Search, Filter, ArrowLeft, Plus, Trash2, X, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"

interface Notice {
    id: string
    title: string
    content: string
    category: string
    isPinned: boolean
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
    const [newNotice, setNewNotice] = useState({ title: "", content: "", category: "Notice", isPinned: false })
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
                setNewNotice({ title: "", content: "", category: "Notice", isPinned: false })
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
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
            <main className="max-w-5xl mx-auto px-4 md:px-8 pt-28 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20"
                        >
                            <Bell size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Notice Portal</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl font-bold tracking-tight"
                        >
                            전체 공지사항
                        </motion.h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-64 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-blue-500 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="제목 또는 내용 검색"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900/30 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-700"
                            />
                        </div>
                        {isAdmin && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold text-xs hover:bg-zinc-200 transition-all active:scale-[0.98]"
                            >
                                <Plus size={16} />
                                새로운 공지
                            </button>
                        )}
                    </div>
                </div>

                {/* List Section */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                        <p className="text-zinc-500 text-xs tracking-widest uppercase">소식을 가져오는 중</p>
                    </div>
                ) : filteredNotices.length > 0 ? (
                    <div className="space-y-1">
                        {filteredNotices.map((notice, i) => (
                            <motion.div
                                key={notice.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className={`group relative p-6 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
                                    notice.isPinned 
                                        ? "bg-blue-500/5 border-blue-500/20 hover:bg-blue-500/10" 
                                        : "bg-transparent border-transparent hover:bg-white/[0.02] border-b-white/5 last:border-b-0"
                                }`}
                            >
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center flex-wrap gap-3">
                                        {notice.isPinned && (
                                            <span className="flex items-center gap-1 text-[9px] font-black text-blue-400 uppercase tracking-widest bg-blue-400/10 px-2 py-0.5 rounded-full">
                                                <Bell size={10} className="fill-blue-400" /> 고정됨
                                            </span>
                                        )}
                                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-widest font-bold ${
                                            notice.category === 'Notice' ? 'text-blue-400 bg-blue-400/5' :
                                            notice.category === 'Mission' ? 'text-purple-400 bg-purple-400/5' :
                                            'text-zinc-500 bg-white/5'
                                        }`}>
                                            {notice.category === "Notice" ? "공지사항" : notice.category === "Mission" ? "미션" : notice.category === "Event" ? "이벤트" : notice.category === "Bible" ? "주제 말씀" : notice.category}
                                        </span>
                                        <span className="text-[10px] text-white/20 font-mono">
                                            {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                                        </span>
                                    </div>

                                    <Link href={`/notices/${notice.id}`} className="block group/title">
                                        <h2 className="text-lg font-medium text-white/80 group-hover/title:text-white transition-colors tracking-tight leading-snug">
                                            {notice.title}
                                        </h2>
                                    </Link>
                                    
                                    <p className="text-xs text-white/30 font-light leading-relaxed line-clamp-1 max-w-2xl">
                                        {notice.content}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 shrink-0">
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDeleteNotice(notice.id)}
                                            className="p-2 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                    <Link
                                        href={`/notices/${notice.id}`}
                                        className="h-10 w-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:border-white/20 transition-all"
                                    >
                                        <ChevronRight size={18} />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-40 text-center space-y-4 opacity-20">
                        <Bell size={40} className="mx-auto" />
                        <p className="text-sm italic">검색 결과가 없습니다.</p>
                    </div>
                )}
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
                            className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8 md:p-10"
                        >
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="space-y-8">
                                <div className="space-y-1 text-center">
                                    <h3 className="text-xl font-bold">새로운 공지 등록</h3>
                                    <p className="text-[10px] text-white/20 uppercase tracking-[0.3em]">커뮤니티를 위한 새로운 소식을 작성하세요</p>
                                </div>

                                <form onSubmit={handleAddNotice} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest text-white/40 px-1 font-bold">카테고리</label>
                                                <select
                                                    value={newNotice.category}
                                                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-white/20 transition-all appearance-none"
                                                >
                                                    <option value="Notice" className="bg-zinc-900">공지사항</option>
                                                    <option value="Mission" className="bg-zinc-900">미션</option>
                                                    <option value="Event" className="bg-zinc-900">이벤트</option>
                                                    <option value="Bible" className="bg-zinc-900">주제 말씀</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] uppercase tracking-widest text-white/40 px-1 font-bold">상단 고정</label>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewNotice({ ...newNotice, isPinned: !newNotice.isPinned })}
                                                    className={`w-full py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                                        newNotice.isPinned ? "bg-blue-500/10 border-blue-500/50 text-blue-400" : "bg-white/5 border-white/10 text-white/20"
                                                    }`}
                                                >
                                                    {newNotice.isPinned ? "고정됨" : "고정 안 함"}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 px-1 font-bold">제목</label>
                                            <input
                                                type="text"
                                                required
                                                value={newNotice.title}
                                                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                                placeholder="제목을 입력하세요"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-white/20 transition-all"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[10px] uppercase tracking-widest text-white/40 px-1 font-bold">내용</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={newNotice.content}
                                                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                                placeholder="내용을 입력하세요"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-white/20 transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-white text-black rounded-xl text-[11px] uppercase tracking-widest font-black hover:bg-zinc-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
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
