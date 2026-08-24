"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Youtube, ExternalLink, Play, X, Calendar, PlayCircle, ChevronRight } from "lucide-react"
import type { ChannelGroup, VideoItem } from "@/app/collab/vod/page"

export function ChannelShelfSection({ group }: { group: ChannelGroup }) {
    const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null)
    const hasVideos = group.videos && group.videos.length > 0

    return (
        <section className="space-y-6">
            {/* Shelf Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/5 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                            <Youtube size={16} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                            {group.name}
                        </h2>
                    </div>
                    <p className="text-xs text-zinc-500 font-mono pl-11">{group.handle}</p>
                </div>

                <a
                    href={group.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group/link self-start sm:self-auto"
                >
                    <span>채널 방문하기</span>
                    <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
            </div>

            {/* Video Row / Shelf */}
            {hasVideos ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {group.videos.slice(0, 4).map((video) => (
                        <div
                            key={video.id}
                            className="group flex flex-col rounded-2xl bg-zinc-900/40 border border-white/5 overflow-hidden hover:border-white/20 transition-all shadow-lg hover:shadow-2xl"
                        >
                            {/* Thumbnail */}
                            <div
                                onClick={() => setActiveVideo(video)}
                                className="relative aspect-video bg-zinc-950 cursor-pointer overflow-hidden"
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={video.thumbnailUrl}
                                    alt={video.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <Play size={16} className="ml-0.5 fill-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                                <h3
                                    onClick={() => setActiveVideo(video)}
                                    className="text-xs font-bold text-white/90 line-clamp-2 leading-snug cursor-pointer hover:text-white transition-colors"
                                >
                                    {video.title}
                                </h3>

                                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={11} />
                                        {new Date(video.publishedAt).toLocaleDateString("ko-KR", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={() => setActiveVideo(video)}
                                        className="font-bold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        <PlayCircle size={13} className="text-red-400" />
                                        <span>재생</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Fallback Channel Banner Card */
                <a
                    href={group.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-8 rounded-3xl bg-zinc-900/20 border border-white/5 hover:border-white/15 hover:bg-zinc-900/40 transition-all duration-300 group"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h4 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                                {group.name} 공식 YouTube 채널
                            </h4>
                            <p className="text-xs text-zinc-500 font-light">
                                채널을 방문하여 업로드된 모든 최신 동영상과 쇼츠를 감상하세요.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-bold transition-all shadow-lg group-hover:bg-zinc-200">
                            <Youtube size={14} className="text-red-600" />
                            <span>YouTube에서 모든 영상 보기</span>
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </div>
                </a>
            )}

            {/* Video Modal Player */}
            <AnimatePresence>
                {activeVideo && (
                    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
                        <div className="fixed inset-0" onClick={() => setActiveVideo(null)} />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 space-y-4 p-4 sm:p-6"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-white/5">
                                <h4 className="text-sm font-bold text-white line-clamp-1 max-w-xl">
                                    {activeVideo.title}
                                </h4>
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Video Frame */}
                            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
                                <iframe
                                    src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                                    title={activeVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-xs text-zinc-500 font-mono">{group.handle}</span>
                                <a
                                    href={activeVideo.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Youtube size={14} />
                                    <span>YouTube 앱에서 열기</span>
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    )
}
