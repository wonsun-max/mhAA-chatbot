"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Loader2, Sparkles, Instagram, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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
    const [activeSlide, setActiveSlide] = useState(0)

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

    // Extract ALL image URLs from notice content
    const imageMatches = Array.from(notice.content.matchAll(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/g));
    const imageUrls = imageMatches.map(m => m[1]);

    // Extract Instagram permalink
    const instaLinkMatch = notice.content.match(/https?:\/\/(www\.)?instagram\.com\/p\/[a-zA-Z0-9_-]+/);
    const instagramPermalink = instaLinkMatch ? instaLinkMatch[0] : "https://www.instagram.com/mha_withus";

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

                    {/* Instagram Carousel Slider */}
                    {imageUrls.length > 0 && (
                        <div className="relative max-w-xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl group">
                            {/* Slide Counter Indicator */}
                            {imageUrls.length > 1 && (
                                <div className="absolute top-4 right-4 z-20 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white">
                                    {activeSlide + 1} / {imageUrls.length}
                                </div>
                            )}

                            {/* Main Slide Image */}
                            <div className="relative aspect-square w-full bg-black flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeSlide}
                                        src={imageUrls[activeSlide]}
                                        alt={`${notice.title} - Slide ${activeSlide + 1}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.25 }}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                            </div>

                            {/* Left/Right Carousel Controls */}
                            {imageUrls.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setActiveSlide((prev) => (prev > 0 ? prev - 1 : imageUrls.length - 1))}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/90 transition-all opacity-80 hover:opacity-100"
                                        title="이전 슬라이드"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    <button
                                        onClick={() => setActiveSlide((prev) => (prev < imageUrls.length - 1 ? prev + 1 : 0))}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/90 transition-all opacity-80 hover:opacity-100"
                                        title="다음 슬라이드"
                                    >
                                        <ChevronRight size={20} />
                                    </button>

                                    {/* Carousel Dots */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-black/50 backdrop-blur-md">
                                        {imageUrls.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveSlide(idx)}
                                                className={`h-2 rounded-full transition-all ${
                                                    activeSlide === idx ? "w-5 bg-pink-500" : "w-2 bg-white/40 hover:bg-white/70"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Content */}
                    <div className="relative group">
                        <div className="relative p-0 md:p-4 space-y-6">
                            <div className="text-base md:text-lg font-light text-white/70 leading-relaxed whitespace-pre-wrap selection:bg-pink-500/30 tracking-tight">
                                {cleanContent || notice.content}
                            </div>

                            {/* Instagram Link CTA */}
                            {instagramPermalink && (
                                <div className="pt-6">
                                    <a
                                        href={instagramPermalink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-500 hover:via-pink-500 hover:to-orange-400 text-white text-xs font-bold transition-all shadow-xl shadow-pink-500/20 active:scale-95"
                                    >
                                        <Instagram size={16} />
                                        <span>Instagram 원본 게시물 보기</span>
                                        <ExternalLink size={14} className="opacity-70" />
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
