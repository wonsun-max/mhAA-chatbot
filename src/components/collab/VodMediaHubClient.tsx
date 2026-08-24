"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Youtube, 
    ExternalLink, 
    Play, 
    X, 
    Calendar, 
    Sparkles, 
    Radio, 
    Film, 
    Users, 
    BookOpen,
    PlayCircle
} from "lucide-react"
import type { MhaChannel, VodVideo } from "@/app/collab/vod/page"

interface VodMediaHubClientProps {
    channels: MhaChannel[]
    initialVideos: VodVideo[]
}

export function VodMediaHubClient({ channels, initialVideos }: VodMediaHubClientProps) {
    const [selectedChannel, setSelectedChannel] = useState<string>("ALL")
    const [activeVideo, setActiveVideo] = useState<VodVideo | null>(null)

    const filteredVideos = initialVideos.filter(v => {
        if (selectedChannel === "ALL") return true
        return v.channelHandle === selectedChannel
    })

    const getChannelIcon = (id: string) => {
        switch (id) {
            case "mha-official":
                return <Film className="w-5 h-5 text-blue-400" />
            case "mha-hanain":
                return <Radio className="w-5 h-5 text-amber-400" />
            case "actualize-one":
                return <Users className="w-5 h-5 text-cyan-400" />
            case "mk-story":
                return <BookOpen className="w-5 h-5 text-emerald-400" />
            default:
                return <Youtube className="w-5 h-5 text-red-400" />
        }
    }

    return (
        <div className="space-y-16">
            {/* 1. 4 MHA Channels Spotlight Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Sparkles size={18} className="text-amber-400" />
                        <span>MHA 4대 공식 & 학생 채널</span>
                    </h2>
                    <span className="text-xs text-zinc-500 font-mono">총 4개 채널 연동</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {channels.map((channel) => {
                        const isSelected = selectedChannel === channel.handle
                        return (
                            <div
                                key={channel.id}
                                className={`p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group flex flex-col justify-between ${
                                    isSelected 
                                        ? "bg-zinc-900/80 border-white/20 shadow-xl shadow-red-500/5" 
                                        : "bg-zinc-900/30 border-white/5 hover:border-white/10 hover:bg-zinc-900/50"
                                }`}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                                                {getChannelIcon(channel.id)}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-white text-base tracking-tight">{channel.name}</h3>
                                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r ${channel.badgeColor} text-white shadow-sm`}>
                                                        {channel.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-zinc-400 font-mono mt-0.5">{channel.handle}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-zinc-400 leading-relaxed font-light">
                                        {channel.description}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedChannel(isSelected ? "ALL" : channel.handle)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                            isSelected 
                                                ? "bg-white text-black shadow-md" 
                                                : "bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
                                        }`}
                                    >
                                        {isSelected ? "선택 해제" : "영상 모아보기"}
                                    </button>

                                    <a
                                        href={channel.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white text-xs font-bold transition-all border border-red-500/20"
                                    >
                                        <Youtube size={14} />
                                        <span>채널 바로가기</span>
                                        <ExternalLink size={11} className="opacity-70" />
                                    </a>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* 2. Channel Filter Pills */}
            <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-white">최신 영상 피드</h2>
                        <p className="text-xs text-zinc-500 mt-0.5">업로드된 최신 순으로 영상을 감상하실 수 있습니다</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-zinc-900/60 border border-white/5">
                        <button
                            onClick={() => setSelectedChannel("ALL")}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                selectedChannel === "ALL" 
                                    ? "bg-white text-black shadow-sm" 
                                    : "text-zinc-400 hover:text-white"
                            }`}
                        >
                            전체 채널
                        </button>
                        {channels.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelectedChannel(c.handle)}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                    selectedChannel === c.handle 
                                        ? "bg-white text-black shadow-sm" 
                                        : "text-zinc-400 hover:text-white"
                                }`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Grid */}
                {filteredVideos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((video) => (
                            <motion.div
                                key={video.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="group flex flex-col rounded-3xl bg-zinc-900/30 border border-white/5 overflow-hidden hover:border-white/20 transition-all shadow-xl hover:shadow-2xl flex-grow"
                            >
                                {/* Thumbnail Container */}
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
                                        <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <Play size={20} className="ml-1 fill-white" />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/5 text-zinc-300 border border-white/10 font-mono">
                                                {video.channelName}
                                            </span>
                                            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                                                <Calendar size={10} />
                                                {new Date(video.publishedAt).toLocaleDateString("ko-KR", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>

                                        <h3 
                                            onClick={() => setActiveVideo(video)}
                                            className="text-sm font-bold text-white/90 line-clamp-2 leading-snug cursor-pointer hover:text-white transition-colors"
                                        >
                                            {video.title}
                                        </h3>
                                    </div>

                                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setActiveVideo(video)}
                                            className="text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1 transition-colors"
                                        >
                                            <PlayCircle size={14} className="text-red-400" />
                                            <span>바로 재생</span>
                                        </button>

                                        <a
                                            href={video.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                                            title="YouTube에서 열기"
                                        >
                                            <ExternalLink size={13} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center rounded-3xl border border-dashed border-white/5 space-y-4 p-8">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-500">
                            <Youtube size={24} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white">해당 채널의 영상을 준비 중입니다</p>
                            <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                                공식 YouTube 채널 링크를 통해 모든 동영상과 실시간 방송을 확인하실 수 있습니다.
                            </p>
                        </div>
                        {selectedChannel !== "ALL" && (
                            <a
                                href={channels.find(c => c.handle === selectedChannel)?.url || "https://www.youtube.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-500 transition-all shadow-lg shadow-red-500/20"
                            >
                                <Youtube size={14} />
                                <span>YouTube 채널 바로가기</span>
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* 3. Interactive Video Player Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto">
                        <div className="fixed inset-0" onClick={() => setActiveVideo(null)} />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10 space-y-4 p-4 sm:p-6"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                                        {activeVideo.channelName}
                                    </span>
                                    <h4 className="text-sm font-bold text-white line-clamp-1 max-w-md">{activeVideo.title}</h4>
                                </div>
                                <button
                                    onClick={() => setActiveVideo(null)}
                                    className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Responsive Player */}
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
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-zinc-500 font-mono">{activeVideo.channelHandle}</span>
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
        </div>
    )
}
