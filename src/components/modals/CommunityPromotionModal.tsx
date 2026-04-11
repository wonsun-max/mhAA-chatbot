"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Sparkles, Image as ImageIcon, Gift, ArrowRight, UserCircle } from "lucide-react";
import Link from "next/link";

/**
 * CommunityPromotionModal: A high-performance, glassmorphic modal to encourage
 * community usage among authenticated users. Includes AI-inspired design touches.
 */
export function CommunityPromotionModal() {
    const { status } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Don't show if unauthenticated
        if (status !== "authenticated") return;

        const hideUntil = typeof window !== "undefined" ? localStorage.getItem("mha-community-promo-hide-until") : null;
        
        // Show after 2 seconds if not hidden
        if (!hideUntil || Date.now() > parseInt(hideUntil)) {
            const timer = setTimeout(() => setIsOpen(true), 2500);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const closeBase = () => setIsOpen(false);

    const closeForADay = () => {
        const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem("mha-community-promo-hide-until", tomorrow.toString());
        setIsOpen(false);
    };

    if (!mounted || status !== "authenticated") return null;

    const features = [
        {
            icon: <Shield className="text-cyan-400" size={20} />,
            text: "모든 게시물은 익명(닉네임)으로 표시됩니다.",
            delay: 0.1
        },
        {
            icon: <UserCircle className="text-blue-400" size={20} />,
            text: "닉네임은 '내 프로필'에서 언제든지 변경 가능합니다.",
            delay: 0.2
        },
        {
            icon: <ImageIcon className="text-purple-400" size={20} />,
            text: "사진 업로드가 가능하니 일상의 순간들을 공유해 주세요.",
            delay: 0.3
        },
        {
            icon: <Gift className="text-pink-400" size={20} />,
            text: "매주 재미있는 글은 인스타 스토리 업로드 & 아이스크림 증정!",
            highlight: true,
            delay: 0.4
        }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeBase}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-lg max-h-[calc(100vh-2rem)] overflow-y-auto rounded-3xl border border-white/10 bg-zinc-900/40 p-1 shadow-2xl backdrop-blur-2xl no-scrollbar"
                    >
                        {/* Interactive AI-like Background Glows */}
                        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-cyan-500/20 blur-[80px] pointer-events-none animate-pulse" />
                        <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-purple-500/20 blur-[80px] pointer-events-none animate-pulse" />

                        <div className="relative z-10 bg-zinc-900/60 rounded-[22px] p-6 md:p-10 space-y-6 md:space-y-8">
                            {/* Close Button */}
                            <button
                                onClick={closeBase}
                                className="absolute right-6 top-6 rounded-full p-2 text-white/30 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                                aria-label="닫기"
                            >
                                <X size={20} />
                            </button>

                            {/* Header Section */}
                            <div className="space-y-4">
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20"
                                >
                                    <Sparkles size={14} className="animate-spin-slow" />
                                    Community Insight
                                </motion.div>
                                <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                                    우리의 일상을 더 깊게,<br/>
                                    <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        "withus Community"
                                    </span>
                                </h2>
                            </div>

                            {/* Features List */}
                            <div className="space-y-5">
                                {features.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: item.delay }}
                                        className={`flex items-start gap-4 p-3.5 rounded-2xl transition-all ${
                                            item.highlight 
                                            ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20" 
                                            : "hover:bg-white/5"
                                        }`}
                                    >
                                        <div className={`mt-0.5 p-2 rounded-xl bg-white/5 border border-white/10 ${item.highlight ? "animate-bounce-subtle" : ""}`}>
                                            {item.icon}
                                        </div>
                                        <p className={`text-[15px] md:text-base leading-snug ${item.highlight ? "font-semibold text-pink-100" : "text-zinc-300 font-medium"}`}>
                                            {item.text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Action Button */}
                            <div className="pt-2">
                                <Link
                                    href="/community"
                                    onClick={closeBase}
                                    className="relative group block w-full"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-500" />
                                    <div className="relative flex items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 font-bold text-white transition-all group-active:scale-[0.98]">
                                        커뮤니티 바로가기
                                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                                    </div>
                                </Link>
                            </div>

                            {/* Footer Options */}
                            <div className="flex items-center justify-between pt-4">
                                <button
                                    onClick={closeForADay}
                                    className="text-xs text-zinc-500 hover:text-white transition-colors cursor-pointer"
                                >
                                    24시간 동안 보지 않기
                                </button>
                                <button
                                    onClick={closeBase}
                                    className="text-sm font-medium text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
