"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Lightbulb, 
    Bug, 
    Trash2, 
    CheckCircle2, 
    Clock, 
    Eye, 
    Search, 
    Loader2, 
    User as UserIcon,
    RefreshCw
} from "lucide-react"

interface FeedbackItem {
    id: string
    type: "IDEA" | "BUG"
    content: string
    contact: string | null
    status: "PENDING" | "REVIEWED" | "RESOLVED"
    createdAt: string
    user?: {
        name: string | null
        nickname: string | null
        email: string
        grade: string | null
    } | null
}

export function FeedbackManager() {
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
    const [loading, setLoading] = useState(true)
    const [filterType, setFilterType] = useState<"ALL" | "IDEA" | "BUG">("ALL")
    const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "REVIEWED" | "RESOLVED">("ALL")
    const [searchQuery, setSearchQuery] = useState("")

    const fetchFeedbacks = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/feedback")
            if (res.ok) {
                const data = await res.json()
                setFeedbacks(data.feedbacks || [])
            }
        } catch (err) {
            console.error("Failed to fetch feedbacks:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchFeedbacks()
    }, [])

    const handleUpdateStatus = async (id: string, newStatus: "PENDING" | "REVIEWED" | "RESOLVED") => {
        try {
            const res = await fetch(`/api/admin/feedback/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            })
            if (res.ok) {
                setFeedbacks(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f))
            }
        } catch (err) {
            console.error("Failed to update status:", err)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("이 피드백을 삭제하시겠습니까?")) return
        try {
            const res = await fetch(`/api/admin/feedback/${id}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setFeedbacks(prev => prev.filter(f => f.id !== id))
            }
        } catch (err) {
            console.error("Failed to delete feedback:", err)
        }
    }

    const filtered = feedbacks.filter(f => {
        const matchesType = filterType === "ALL" || f.type === filterType
        const matchesStatus = filterStatus === "ALL" || f.status === filterStatus
        const matchesSearch = 
            f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (f.contact && f.contact.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (f.user?.email && f.user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (f.user?.name && f.user.name.toLowerCase().includes(searchQuery.toLowerCase()))

        return matchesType && matchesStatus && matchesSearch
    })

    const pendingCount = feedbacks.filter(f => f.status === "PENDING").length
    const ideaCount = feedbacks.filter(f => f.type === "IDEA").length
    const bugCount = feedbacks.filter(f => f.type === "BUG").length

    return (
        <div className="space-y-8">
            {/* Header & Stats Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">피드백 & 건의함</h2>
                    <p className="text-sm text-zinc-500">학생/선생님들이 보낸 아이디어 및 버그 리포트 관리</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchFeedbacks}
                        className="p-3 rounded-2xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white transition-colors"
                        title="새로고침"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-amber-500">미확인 대기 중</p>
                        <p className="text-3xl font-light text-white mt-1">{pendingCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Clock size={20} />
                    </div>
                </div>

                <div className="p-5 rounded-3xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-blue-400">아이디어 제안</p>
                        <p className="text-3xl font-light text-white mt-1">{ideaCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Lightbulb size={20} />
                    </div>
                </div>

                <div className="p-5 rounded-3xl bg-zinc-900/40 border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase font-bold tracking-widest text-red-400">버그 리포트</p>
                        <p className="text-3xl font-light text-white mt-1">{bugCount}</p>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <Bug size={20} />
                    </div>
                </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Type Filter */}
                    <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-white/5">
                        <button
                            onClick={() => setFilterType("ALL")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterType === "ALL" ? "bg-white text-black shadow-md" : "text-zinc-500 hover:text-white"}`}
                        >
                            전체
                        </button>
                        <button
                            onClick={() => setFilterType("IDEA")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${filterType === "IDEA" ? "bg-amber-500 text-black shadow-md font-black" : "text-zinc-500 hover:text-white"}`}
                        >
                            <Lightbulb size={12} />
                            <span>아이디어</span>
                        </button>
                        <button
                            onClick={() => setFilterType("BUG")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${filterType === "BUG" ? "bg-red-500 text-white shadow-md" : "text-zinc-500 hover:text-white"}`}
                        >
                            <Bug size={12} />
                            <span>버그</span>
                        </button>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center p-1 rounded-2xl bg-zinc-900 border border-white/5">
                        <button
                            onClick={() => setFilterStatus("ALL")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === "ALL" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-white"}`}
                        >
                            모든 상태
                        </button>
                        <button
                            onClick={() => setFilterStatus("PENDING")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === "PENDING" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" : "text-zinc-500 hover:text-white"}`}
                        >
                            대기 중
                        </button>
                        <button
                            onClick={() => setFilterStatus("RESOLVED")}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === "RESOLVED" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "text-zinc-500 hover:text-white"}`}
                        >
                            반영 완료
                        </button>
                    </div>
                </div>

                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
                    <input
                        type="text"
                        placeholder="내용, 이메일, 닉네임 검색"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900/60 border border-white/5 rounded-2xl py-2.5 pl-11 pr-4 text-base sm:text-xs text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                    />
                </div>
            </div>

            {/* Feedback List */}
            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center space-y-3">
                    <Loader2 className="animate-spin text-zinc-500" size={28} />
                    <p className="text-xs text-zinc-600">피드백 목록을 불러오는 중...</p>
                </div>
            ) : filtered.length > 0 ? (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filtered.map((item) => {
                            const isIdea = item.type === "IDEA"
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="p-6 rounded-3xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all space-y-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            {/* Type Badge */}
                                            <span className={`px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border ${
                                                isIdea 
                                                    ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                                                    : "bg-red-500/10 border-red-500/20 text-red-300"
                                            }`}>
                                                {isIdea ? <Lightbulb size={12} /> : <Bug size={12} />}
                                                <span>{isIdea ? "아이디어" : "버그 리포트"}</span>
                                            </span>

                                            {/* Date */}
                                            <span className="text-[11px] text-zinc-500 font-mono">
                                                {new Date(item.createdAt).toLocaleString("ko-KR", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        {/* Status Switcher & Delete */}
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleUpdateStatus(item.id, e.target.value as any)}
                                                className={`text-xs font-bold py-1.5 px-3 rounded-xl border outline-none bg-zinc-950 transition-colors ${
                                                    item.status === "PENDING"
                                                        ? "text-amber-400 border-amber-500/30"
                                                        : item.status === "REVIEWED"
                                                        ? "text-blue-400 border-blue-500/30"
                                                        : "text-emerald-400 border-emerald-500/30"
                                                }`}
                                            >
                                                <option value="PENDING">⏳ 대기 중</option>
                                                <option value="REVIEWED">👀 확인함</option>
                                                <option value="RESOLVED">✅ 반영 완료</option>
                                            </select>

                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="p-2 text-zinc-600 hover:text-red-400 rounded-xl hover:bg-white/5 transition-colors"
                                                title="삭제"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Main Content Text */}
                                    <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap break-words overflow-hidden">
                                        {item.content}
                                    </p>

                                    {/* Submitter Info Footer */}
                                    <div className="pt-3 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs text-zinc-500">
                                        {item.user ? (
                                            <div className="flex items-center gap-2">
                                                <UserIcon size={12} className="text-blue-400" />
                                                <span className="text-zinc-300 font-medium">{item.user.name || item.user.nickname || "재학생"}</span>
                                                {item.user.grade && (
                                                    <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-400 font-mono">
                                                        {item.user.grade}
                                                    </span>
                                                )}
                                                <span className="text-zinc-500">({item.user.email})</span>
                                            </div>
                                        ) : item.contact ? (
                                            <div className="flex items-center gap-1.5">
                                                <UserIcon size={12} className="text-zinc-400" />
                                                <span>연락처: {item.contact}</span>
                                            </div>
                                        ) : (
                                            <span className="italic text-zinc-600">익명 제보</span>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-24 text-center border border-dashed border-white/5 rounded-3xl space-y-2">
                    <p className="text-sm text-zinc-500 font-bold">등록된 피드백이 없습니다.</p>
                    <p className="text-xs text-zinc-600">새로운 아이디어나 버그 리포트가 접수되면 여기에 표시됩니다.</p>
                </div>
            )}
        </div>
    )
}
