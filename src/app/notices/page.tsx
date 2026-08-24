"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Trash2, Loader2, Instagram, ExternalLink, Sparkles, Plus, RefreshCw, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { InstagramCardGraphic } from "@/components/notices/InstagramCardGraphic"

interface Notice {
    id: string
    title: string
    content: string
    category: string
    isPinned: boolean
    createdAt: string
}

export default function NoticesPage() {
    const { data: session } = useSession()
    const isAdmin = session?.user?.role === "ADMIN"

    const [notices, setNotices] = useState<Notice[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [showQuickAddModal, setShowQuickAddModal] = useState(false)
    const [quickTitle, setQuickTitle] = useState("")
    const [quickContent, setQuickContent] = useState("")
    const [quickImageUrl, setQuickImageUrl] = useState("")
    const [quickIsPinned, setQuickIsPinned] = useState(true)
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

    const handleCleanupAndSeed = async () => {
        if (!confirm("더미/오류 공지들을 정리하고 공식 인스타그램 게시물로 피드를 동기화하시겠습니까?")) return
        setLoading(true)
        try {
            const res = await fetch("/api/admin/notices/cleanup-and-seed", { method: "POST" })
            if (res.ok) {
                fetchNotices()
            }
        } catch (err) {
            console.error("Failed to cleanup notices:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteNotice = async (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm("정말 이 게시물을 삭제하시겠습니까?")) return
        try {
            const res = await fetch(`/api/notices/${id}`, { method: "DELETE" })
            if (res.ok) {
                fetchNotices()
            }
        } catch (err) {
            console.error("Error deleting notice:", err)
        }
    }

    const handleQuickAdd = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!quickTitle.trim()) return
        setIsSubmitting(true)
        try {
            let formattedContent = quickContent.trim() || quickTitle.trim()
            if (quickImageUrl.trim()) {
                formattedContent += `\n\n![Instagram Image](${quickImageUrl.trim()})`
            }
            formattedContent += `\n\n[Instagram 원본 게시물 보기](https://www.instagram.com/mha_withus)`

            const res = await fetch("/api/notices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: quickTitle.trim(),
                    content: formattedContent,
                    category: "Instagram",
                    isPinned: quickIsPinned,
                }),
            })
            if (res.ok) {
                setShowQuickAddModal(false)
                setQuickTitle("")
                setQuickContent("")
                setQuickImageUrl("")
                fetchNotices()
            }
        } catch (err) {
            console.error("Error creating notice:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const extractImage = (content: string) => {
        const match = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        return match ? match[1] : null;
    };

    const extractLink = (content: string) => {
        const match = content.match(/https?:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+/);
        return match ? match[0] : "https://www.instagram.com/mha_withus";
    };

    const extractCleanText = (content: string) => {
        return content
            .replace(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/g, "")
            .replace(/\[.*?\]\(https?:\/\/[^\s)]+\)/g, "")
            .trim();
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500/30 overflow-x-hidden">
            <main className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-32 space-y-12">
                
                {/* Instagram Channel Header Banner */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-950/40 via-zinc-900/80 to-zinc-950 border border-white/10 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        {/* Profile Info with Story Ring */}
                        <div className="flex items-center gap-5">
                            <a
                                href="https://www.instagram.com/mha_withus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative p-1 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-lg shadow-pink-500/20 active:scale-95 transition-all"
                                title="Instagram @mha_withus 방문하기"
                            >
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black flex items-center justify-center p-1">
                                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                                        <Instagram size={32} />
                                    </div>
                                </div>
                            </a>

                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">@mha_withus</h1>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center gap-1">
                                        <Sparkles size={10} />
                                        <span>Official Notice Feed</span>
                                    </span>
                                </div>
                                <p className="text-xs md:text-sm text-zinc-400 font-light leading-relaxed">
                                    마닐라한국아카데미(MHA) 공식 인스타그램 소식이 실시간으로 동기화됩니다.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                            {isAdmin && (
                                <>
                                    <button
                                        onClick={handleCleanupAndSeed}
                                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs border border-white/10 transition-all"
                                        title="더미 공지 삭제 및 인스타그램 공식 피드로 리셋"
                                    >
                                        <RefreshCw size={14} />
                                        <span>피드 정리 / 리셋</span>
                                    </button>

                                    <button
                                        onClick={() => setShowQuickAddModal(true)}
                                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-all shadow-lg"
                                    >
                                        <Plus size={15} />
                                        <span>인스타 소식 등록</span>
                                    </button>
                                </>
                            )}

                            <a
                                href="https://www.instagram.com/mha_withus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white font-bold text-xs shadow-xl shadow-pink-500/25 active:scale-95 transition-all"
                            >
                                <Instagram size={16} />
                                <span>팔로우</span>
                                <ExternalLink size={12} className="opacity-70" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">게시물</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-pink-400 text-xs font-mono font-bold border border-white/5">
                            {filteredNotices.length}
                        </span>
                    </div>

                    <div className="relative w-full sm:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-pink-400 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="소식 검색 (키워드 입력)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-xs focus:ring-1 focus:ring-pink-500/50 focus:border-pink-500/50 outline-none transition-all placeholder:text-zinc-600 text-white"
                        />
                    </div>
                </div>

                {/* Instagram Cards Grid (3 Columns) */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-4">
                        <Loader2 className="animate-spin text-pink-500" size={32} />
                        <p className="text-zinc-500 text-xs tracking-widest uppercase">인스타그램 소식을 가져오는 중</p>
                    </div>
                ) : filteredNotices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {filteredNotices.map((notice, i) => {
                            const imgUrl = extractImage(notice.content);
                            const cleanText = extractCleanText(notice.content);
                            const instaLink = extractLink(notice.content);

                            return (
                                <motion.div
                                    key={notice.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative flex flex-col justify-between rounded-3xl bg-zinc-900/40 border border-white/10 hover:border-pink-500/40 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300"
                                >
                                    <Link href={`/notices/${notice.id}`} className="block flex-1">
                                        {/* Authentic MHA Yellow Window Card or Photo */}
                                        <InstagramCardGraphic
                                            title={notice.title}
                                            imageUrl={imgUrl}
                                            aspectRatio="square"
                                        />

                                        {/* Caption Content */}
                                        <div className="p-6 space-y-3">
                                            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                                                <span>{new Date(notice.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span>
                                                {notice.isPinned && (
                                                    <span className="text-pink-400 font-bold uppercase tracking-wider">Pinned</span>
                                                )}
                                            </div>

                                            <h2 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1 leading-snug">
                                                {notice.title}
                                            </h2>

                                            <p className="text-xs text-zinc-400 font-light line-clamp-2 leading-relaxed">
                                                {cleanText || notice.title}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Action Bar */}
                                    <div className="px-6 pb-5 pt-2 flex items-center justify-between border-t border-white/5">
                                        <a
                                            href={instaLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-pink-400 hover:text-pink-300 font-bold transition-colors"
                                        >
                                            <Instagram size={13} />
                                            <span>인스타에서 보기</span>
                                            <ExternalLink size={10} className="opacity-60" />
                                        </a>

                                        {isAdmin && (
                                            <button
                                                onClick={(e) => handleDeleteNotice(notice.id, e)}
                                                className="p-2 text-zinc-600 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
                                                title="게시물 삭제"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-32 text-center border border-dashed border-white/5 rounded-3xl space-y-4">
                        <Instagram size={40} className="mx-auto text-zinc-700" />
                        <div className="space-y-2">
                            <p className="text-zinc-400 font-bold text-sm">등록된 인스타그램 소식이 없습니다.</p>
                            {isAdmin && (
                                <button
                                    onClick={handleCleanupAndSeed}
                                    className="px-6 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold hover:bg-pink-500/20 transition-all"
                                >
                                    기본 인스타그램 소식 채워넣기
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Admin Quick Add Modal */}
            <AnimatePresence>
                {showQuickAddModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh] my-auto"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                                        <Instagram size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">인스타 소식 즉시 등록</h3>
                                        <p className="text-xs text-zinc-500">인스타에 올린 소식을 웹사이트에 바로 추가합니다</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowQuickAddModal(false)}
                                    className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleQuickAdd} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">카드 제목 *</label>
                                    <input
                                        type="text"
                                        required
                                        value={quickTitle}
                                        onChange={(e) => setQuickTitle(e.target.value)}
                                        placeholder="예: 구글 로그인 도입 / 2학기 시간표 오픈"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 px-4 text-sm text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">본문 설명 (캡션)</label>
                                    <textarea
                                        rows={4}
                                        value={quickContent}
                                        onChange={(e) => setQuickContent(e.target.value)}
                                        placeholder="인스타그램 게시물 본문 내용을 입력하세요"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 px-4 text-sm text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none resize-none"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">카드뉴스 이미지 URL (선택)</label>
                                    <input
                                        type="url"
                                        value={quickImageUrl}
                                        onChange={(e) => setQuickImageUrl(e.target.value)}
                                        placeholder="https://... (비워두면 노란색 시그니처 카드가 자동 생성됩니다)"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 px-4 text-sm text-white focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none"
                                    />
                                </div>

                                <div className="flex items-center gap-2 px-1">
                                    <input
                                        type="checkbox"
                                        id="quickIsPinned"
                                        checked={quickIsPinned}
                                        onChange={(e) => setQuickIsPinned(e.target.checked)}
                                        className="rounded border-zinc-800 bg-zinc-950 text-pink-500 focus:ring-pink-500/20"
                                    />
                                    <label htmlFor="quickIsPinned" className="text-xs text-zinc-400 cursor-pointer">
                                        상단 고정 (Pinned)
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting || !quickTitle.trim()}
                                    className="w-full font-bold py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50 mt-2"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "소식 등록 완료"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
