"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Loader2, Sparkles, Instagram, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

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
            <div className="min-h-screen bg-black text-white selection:bg-pink-500/30">
                <main className="max-w-4xl mx-auto px-6 py-32 flex flex-col items-center justify-center space-y-4">
                    <Loader2 size={32} className="animate-spin text-pink-500" />
                    <p className="text-zinc-500 text-sm animate-pulse tracking-widest uppercase">소식을 불러오는 중...</p>
                </main>
            </div>
        )
    }

    if (!notice) {
        return (
            <div className="min-h-screen bg-black text-white selection:bg-pink-500/30">
                <main className="max-w-4xl mx-auto px-6 py-32 text-center space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-light">소식을 찾을 수 없습니다</h1>
                        <p className="text-white/20 uppercase tracking-[0.3em] text-xs font-bold">요청하신 게시물이 존재하지 않거나 삭제되었을 수 있습니다</p>
                    </div>
                    <Link href="/notices" className="inline-flex items-center gap-2 px-8 py-3 border border-white/10 text-[11px] uppercase tracking-[0.2em] font-light hover:bg-white/5 transition-all">
                        <ArrowLeft size={14} /> 목록으로 돌아가기
                    </Link>
                </main>
            </div>
        )
    }

    // Extract Instagram shortcode (e.g. DV6EgqwktZE from /p/DV6EgqwktZE)
    const shortcodeMatch = notice.content.match(/\/p\/([a-zA-Z0-9_-]+)/);
    const shortcode = shortcodeMatch ? shortcodeMatch[1] : null;

    // Extract Instagram permalink
    const instaLinkMatch = notice.content.match(/https?:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+/);
    const instagramPermalink = instaLinkMatch ? instaLinkMatch[0] : (shortcode ? `https://www.instagram.com/p/${shortcode}` : "https://www.instagram.com/mha_withus");

    // Extract cover image
    const imageMatch = notice.content.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);
    const coverImageUrl = imageMatch ? imageMatch[1] : null;

    // Clean text without markdown image/link tags
    const cleanContent = notice.content
        .replace(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/g, "")
        .replace(/\[.*?\]\(https?:\/\/[^\s)]+\)/g, "")
        .trim();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-pink-500/30 overflow-x-hidden">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-40 space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-10"
                >
                    {/* Header */}
                    <div className="space-y-6">
                        <Link
                            href="/notices"
                            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Notice Board
                        </Link>

                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 text-pink-300 border border-pink-500/30 flex items-center gap-1.5 shadow-lg shadow-pink-500/10">
                                    <Instagram size={12} />
                                    <span>@mha_withus</span>
                                </span>
                                <div className="flex items-center gap-2 text-[10px] text-white/20 font-mono uppercase tracking-widest">
                                    <Calendar size={12} />
                                    {new Date(notice.createdAt).toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-extralight tracking-tight leading-[1.15] text-white/90">
                                {notice.title}
                            </h1>
                        </div>
                    </div>

                    <div className="w-full h-px bg-gradient-to-r from-white/10 via-white/5 to-transparent" />

                    {/* Clean Instagram Embed Card with Perfect Full-Height Finish */}
                    {shortcode ? (
                        <div className="flex flex-col items-center justify-center my-6">
                            <div className="w-full max-w-[480px] sm:max-w-[500px] rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl p-2 sm:p-3">
                                <iframe
                                    src={`https://www.instagram.com/p/${shortcode}/embed/`}
                                    width="100%"
                                    height="800"
                                    frameBorder="0"
                                    scrolling="no"
                                    allowTransparency={true}
                                    allow="fullscreen; clipboard-write; encrypted-media; picture-in-picture; web-share"
                                    className="w-full min-h-[760px] sm:min-h-[800px] rounded-2xl bg-black"
                                />
                            </div>
                            <p className="text-[11px] text-zinc-500 mt-3 text-center">
                                💡 좌우 화살표를 눌러 모든 카드뉴스 슬라이드 사진을 확인하실 수 있습니다.
                            </p>
                        </div>
                    ) : coverImageUrl ? (
                        <div className="relative max-w-[480px] sm:max-w-[500px] mx-auto rounded-[2rem] overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl aspect-[4/5]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={coverImageUrl} alt={notice.title} className="w-full h-full object-cover" />
                        </div>
                    ) : null}

                    {/* Full Text Content */}
                    <div className="relative group max-w-2xl mx-auto">
                        <div className="relative p-6 md:p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 space-y-6">
                            <div className="text-base md:text-lg font-light text-white/80 leading-relaxed whitespace-pre-wrap selection:bg-pink-500/30 tracking-tight">
                                {cleanContent || notice.content}
                            </div>

                            {/* Direct Instagram Link CTA */}
                            {instagramPermalink && (
                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <a
                                        href={instagramPermalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white text-xs font-bold transition-all shadow-xl shadow-pink-500/20 active:scale-95"
                                    >
                                        <Instagram size={15} />
                                        <span>인스타그램 앱에서 열기</span>
                                        <ExternalLink size={13} className="opacity-70" />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="pt-20 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-white/10">
                            <Sparkles size={16} />
                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold">WITHUS HUB INSIGHT</span>
                        </div>
                        <Link href="/notices" className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
                            Back to Notices
                        </Link>
                    </div>
                </motion.div>
            </main>
        </div>
    )
}
