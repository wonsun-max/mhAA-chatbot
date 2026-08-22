"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronRight, Bell, Search, Plus, Trash2, X, Loader2, Instagram, Check, Copy, KeyRound, Sparkles } from "lucide-react"
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
    const isAdmin = session?.user?.role === "ADMIN"

    const [notices, setNotices] = useState<Notice[]>([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showInstaModal, setShowInstaModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [copiedKey, setCopiedKey] = useState(false)
    const [copiedUrl, setCopiedUrl] = useState(false)

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

    const webhookUrl = typeof window !== "undefined" 
        ? `${window.location.origin}/api/notices/sync-instagram` 
        : "https://mhawithus.shop/api/notices/sync-instagram";

    const secretKey = "withus_insta_sync_2026";

    const copyToClipboard = (text: string, type: "url" | "key") => {
        navigator.clipboard.writeText(text);
        if (type === "url") {
            setCopiedUrl(true);
            setTimeout(() => setCopiedUrl(false), 2000);
        } else {
            setCopiedKey(true);
            setTimeout(() => setCopiedKey(false), 2000);
        }
    };

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

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-60 group">
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
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                    onClick={() => setShowInstaModal(true)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-pink-500/30 text-pink-300 rounded-xl font-bold text-xs hover:border-pink-500/60 transition-all"
                                    title="인스타그램 자동 연동 설정"
                                >
                                    <Instagram size={14} />
                                    <span>인스타 자동연동</span>
                                </button>

                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 bg-white text-black rounded-xl font-bold text-xs hover:bg-zinc-200 transition-all active:scale-[0.98]"
                                >
                                    <Plus size={16} />
                                    <span>새 공지</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* List Section with 30/70 Split */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                        <p className="text-zinc-500 text-xs tracking-widest uppercase">소식을 가져오는 중</p>
                    </div>
                ) : filteredNotices.length > 0 ? (
                    (() => {
                        const pinnedNotices = filteredNotices.filter(n => n.isPinned);
                        const normalNotices = filteredNotices.filter(n => !n.isPinned);
                        const hasPinned = pinnedNotices.length > 0;

                        return (
                            <div className={`flex flex-col ${hasPinned ? 'md:grid md:grid-cols-[3.5fr_6.5fr]' : ''} gap-12 md:gap-16`}>
                                {/* Pinned Column (35%) */}
                                {hasPinned && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Important & Instagram</span>
                                            <div className="h-px flex-1 bg-blue-500/20" />
                                        </div>
                                        <div className="space-y-4">
                                            {pinnedNotices.map((notice, i) => {
                                                const isInsta = notice.category.toLowerCase() === "instagram" || notice.content.includes("instagram.com");
                                                return (
                                                    <motion.div
                                                        key={notice.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.05 }}
                                                        className={`group p-6 rounded-2xl transition-all ${
                                                            isInsta 
                                                                ? "bg-gradient-to-br from-purple-950/20 via-pink-950/20 to-orange-950/20 border border-pink-500/20 hover:border-pink-500/40"
                                                                : "bg-blue-500/5 border border-blue-500/20 hover:bg-blue-500/10"
                                                        }`}
                                                    >
                                                        <div className="space-y-4">
                                                            <div className="flex items-center justify-between">
                                                                {isInsta ? (
                                                                    <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-black text-pink-300 bg-pink-500/20 flex items-center gap-1 border border-pink-500/30">
                                                                        <Instagram size={10} />
                                                                        <span>Instagram</span>
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-black text-blue-400 bg-blue-400/10">
                                                                        {notice.category}
                                                                    </span>
                                                                )}
                                                                <span className="text-[9px] text-white/20 font-mono">
                                                                    {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                                                                </span>
                                                            </div>
                                                            <Link href={`/notices/${notice.id}`} className="block">
                                                                <h2 className={`text-xl font-medium text-white transition-colors leading-tight ${isInsta ? 'group-hover:text-pink-300' : 'group-hover:text-blue-400'}`}>
                                                                    {notice.title}
                                                                </h2>
                                                            </Link>
                                                            <p className="text-xs text-white/40 line-clamp-2 leading-relaxed font-light">
                                                                {notice.content.replace(/!\[.*?\]\(.*?\)/g, "").replace(/\[.*?\]\(.*?\)/g, "")}
                                                            </p>
                                                            {isAdmin && (
                                                                <div className="flex justify-end pt-1">
                                                                    <button
                                                                        onClick={() => handleDeleteNotice(notice.id)}
                                                                        className="text-red-500/30 hover:text-red-500 transition-colors p-1"
                                                                        title="공지 삭제"
                                                                    >
                                                                        <Trash2 size={14} />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Normal Column (65% or 100%) */}
                                <div className="space-y-8">
                                    {hasPinned && (
                                        <div className="flex items-center gap-2 text-white/10">
                                            <span className="text-[10px] font-black uppercase tracking-widest">General Feed</span>
                                            <div className="h-px flex-1 bg-white/5" />
                                        </div>
                                    )}
                                    <div className="divide-y divide-white/5">
                                        {normalNotices.map((notice, i) => {
                                            const isInsta = notice.category.toLowerCase() === "instagram" || notice.content.includes("instagram.com");
                                            return (
                                                <motion.div
                                                    key={notice.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: i * 0.02 }}
                                                    className="group py-6 first:pt-0 flex items-center justify-between gap-8"
                                                >
                                                    <div className="flex-1 min-w-0 space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            {isInsta ? (
                                                                <span className="text-[9px] uppercase tracking-widest text-pink-400 font-bold flex items-center gap-1">
                                                                    <Instagram size={10} />
                                                                    <span>Instagram</span>
                                                                </span>
                                                            ) : (
                                                                <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold">{notice.category}</span>
                                                            )}
                                                            <span className="text-[9px] text-white/10 font-mono">
                                                                {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                                                            </span>
                                                        </div>
                                                        <Link href={`/notices/${notice.id}`} className="block">
                                                            <h4 className="text-base font-light text-white/70 group-hover:text-white transition-colors truncate">
                                                                {notice.title}
                                                            </h4>
                                                        </Link>
                                                    </div>
                                                    <div className="flex items-center gap-4 shrink-0">
                                                        {isAdmin && (
                                                            <button
                                                                onClick={() => handleDeleteNotice(notice.id)}
                                                                className="p-2 text-red-500/10 hover:text-red-500 transition-all"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                        <Link
                                                            href={`/notices/${notice.id}`}
                                                            className="h-8 w-8 rounded-full border border-white/5 flex items-center justify-center text-zinc-700 hover:text-white hover:border-white/20 transition-all"
                                                        >
                                                            <ChevronRight size={14} />
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                        {normalNotices.length === 0 && !hasPinned && (
                                            <div className="py-20 text-center opacity-20">
                                                <p className="text-sm italic">등록된 소식이 없습니다.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })()
                ) : (
                    <div className="py-32 text-center border border-dashed border-white/5 rounded-3xl">
                        <p className="text-zinc-600 font-bold text-sm">일치하는 공지사항이 없습니다.</p>
                    </div>
                )}
            </main>

            {/* Instagram Auto-Sync Guide Modal */}
            <AnimatePresence>
                {showInstaModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh] my-auto"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-orange-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                                        <Instagram size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">인스타그램 자동 연동</h3>
                                        <p className="text-xs text-zinc-500">인스타에 올리면 공지사항 자동 등록 (무료 100%)</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowInstaModal(false)}
                                    className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white">1. Webhook 수신 URL (Make.com에 입력)</span>
                                        <button
                                            onClick={() => copyToClipboard(webhookUrl, "url")}
                                            className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1"
                                        >
                                            {copiedUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                            <span>{copiedUrl ? "복사됨!" : "URL 복사"}</span>
                                        </button>
                                    </div>
                                    <div className="p-3 bg-black rounded-xl border border-zinc-800 font-mono text-[11px] text-zinc-300 break-all select-all">
                                        {webhookUrl}
                                    </div>
                                </div>

                                <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-2xl space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-white">2. 보안 Secret Key</span>
                                        <button
                                            onClick={() => copyToClipboard(secretKey, "key")}
                                            className="text-xs text-pink-400 hover:text-pink-300 font-bold flex items-center gap-1"
                                        >
                                            {copiedKey ? <Check size={12} className="text-emerald-400" /> : <KeyRound size={12} />}
                                            <span>{copiedKey ? "복사됨!" : "Key 복사"}</span>
                                        </button>
                                    </div>
                                    <div className="p-3 bg-black rounded-xl border border-zinc-800 font-mono text-xs text-zinc-300 select-all">
                                        {secretKey}
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-pink-400" />
                                        <span>초간단 설정 방법 (2분 소요)</span>
                                    </h4>
                                    <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside leading-relaxed">
                                        <li><strong className="text-white">Make.com</strong> 무료 가입 (월 1,000회 무료)</li>
                                        <li>새 Scenario 생성 → <strong className="text-pink-400">Instagram for Business (Watch Media)</strong> 선택</li>
                                        <li>두 번째 모듈로 <strong className="text-blue-400">HTTP (Make a request)</strong> 추가</li>
                                        <li>URL에 위의 <strong className="text-white">Webhook URL</strong> 입력, Method: <strong className="text-emerald-400">POST</strong></li>
                                        <li>Body type: <strong className="text-white">JSON</strong> 후 아래 내용 매핑:
                                            <div className="mt-1 p-2 bg-black rounded-lg text-[10px] font-mono text-zinc-300">
                                                {`{"secret": "${secretKey}", "caption": caption, "imageUrl": media_url, "permalink": permalink}`}
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Regular Add Notice Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh] my-auto"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">새로운 공지사항 작성</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleAddNotice} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">제목</label>
                                    <input
                                        type="text"
                                        required
                                        value={newNotice.title}
                                        onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                                        placeholder="공지사항 제목"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 px-4 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">구분 (카테고리)</label>
                                    <select
                                        value={newNotice.category}
                                        onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 px-4 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                    >
                                        <option value="Notice">공지사항 (Notice)</option>
                                        <option value="Instagram">인스타그램 (Instagram)</option>
                                        <option value="Mission">미션 (Mission)</option>
                                        <option value="Event">이벤트 (Event)</option>
                                        <option value="Bible">주제 말씀 (Bible)</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">내용</label>
                                    <textarea
                                        required
                                        rows={6}
                                        value={newNotice.content}
                                        onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                        placeholder="공지사항 내용을 입력하세요"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 px-4 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                                    />
                                </div>

                                <div className="flex items-center gap-2 px-1">
                                    <input
                                        type="checkbox"
                                        id="isPinned"
                                        checked={newNotice.isPinned}
                                        onChange={(e) => setNewNotice({ ...newNotice, isPinned: e.target.checked })}
                                        className="rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-blue-500/20"
                                    />
                                    <label htmlFor="isPinned" className="text-xs text-zinc-400 cursor-pointer">
                                        상단 중요 공지로 고정 (Important)
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !newNotice.title.trim() || !newNotice.content.trim()}
                                    className="w-full font-bold py-3.5 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center disabled:opacity-50 mt-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "공지 등록"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
