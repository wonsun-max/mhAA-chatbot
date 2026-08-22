"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Trash2, Loader2, Instagram, ExternalLink, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"

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

    const filteredNotices = notices.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Helper to extract image URL from notice content
    const extractImage = (content: string) => {
        const match = content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
        return match ? match[1] : null;
    };

    // Helper to extract Instagram link
    const extractLink = (content: string) => {
        const match = content.match(/https?:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+/);
        return match ? match[0] : "https://www.instagram.com/mha_withus";
    };

    // Helper to extract clean text without markdown image/link tags
    const extractCleanText = (content: string) => {
        return content
            .replace(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/g, "")
            .replace(/\[.*?\]\(https?:\/\/[^\s)]+\)/g, "")
            .trim();
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500/30 overflow-x-hidden">
            <main className="max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-32 space-y-16">
                {/* Instagram Channel Header Banner */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-950/40 via-zinc-900/80 to-zinc-950 border border-white/10 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none" />

                    <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        {/* Profile Info with Story Ring */}
                        <div className="flex items-center gap-5">
                            {/* Instagram Profile Avatar with Active Story Gradient Ring */}
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

                        {/* Direct Instagram Follow Button */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <a
                                href="https://www.instagram.com/mha_withus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white font-bold text-xs shadow-xl shadow-pink-500/25 active:scale-95 transition-all"
                            >
                                <Instagram size={16} />
                                <span>Instagram 팔로우</span>
                                <ExternalLink size={12} className="opacity-70" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">게시물</span>
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-mono font-bold">
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
                                        {/* Image Box or Styled Gradient Card Box */}
                                        {imgUrl ? (
                                            <div className="relative aspect-square w-full bg-zinc-950 overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={imgUrl}
                                                    alt={notice.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity" />
                                                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-md text-white">
                                                    <Instagram size={14} />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-amber-500/20 via-pink-500/10 to-purple-900/20 p-6 flex flex-col justify-between border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2.5 py-1 rounded-full text-[9px] font-bold bg-pink-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1">
                                                        <Instagram size={10} />
                                                        <span>@mha_withus</span>
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white tracking-tight leading-snug line-clamp-3">
                                                    {notice.title}
                                                </h3>
                                            </div>
                                        )}

                                        {/* Caption Content */}
                                        <div className="p-6 space-y-3">
                                            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                                                <span>{new Date(notice.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span>
                                                {notice.isPinned && (
                                                    <span className="text-pink-400 font-bold uppercase tracking-wider">Pinned</span>
                                                )}
                                            </div>

                                            {imgUrl && (
                                                <h2 className="text-base font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-2 leading-snug">
                                                    {notice.title}
                                                </h2>
                                            )}

                                            <p className="text-xs text-zinc-400 font-light line-clamp-3 leading-relaxed">
                                                {cleanText || notice.title}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Action Bar */}
                                    <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
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
                                                title="공지 삭제"
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
                        <div className="space-y-1">
                            <p className="text-zinc-500 font-bold text-sm">등록된 인스타그램 소식이 없습니다.</p>
                            <p className="text-zinc-700 text-xs">인스타그램(@mha_withus)에 새 게시물이 올라오면 여기에 자동으로 표시됩니다.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
