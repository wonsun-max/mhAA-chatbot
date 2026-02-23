"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink } from "lucide-react";

/**
 * PromotionModal component that displays a welcome message and a signup link.
 * Includes logic to hide the modal for 24 hours if requested by the user.
 */
export function PromotionModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const hideUntil = localStorage.getItem("mha-promo-hide-until");
        if (!hideUntil || Date.now() > parseInt(hideUntil)) {
            // Delay opening slightly for a smoother entry
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const closeBase = () => setIsOpen(false);

    const closeForADay = () => {
        const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem("mha-promo-hide-until", tomorrow.toString());
        setIsOpen(false);
    };

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeBase}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl"
                        style={{
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                        }}
                    >
                        {/* Ambient Background Glows */}
                        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

                        <button
                            onClick={closeBase}
                            className="absolute right-4 top-4 rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                            aria-label="닫기"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-3">
                                <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                                    Notice
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-white">
                                                                         MHA 커뮤니티에 오신 것을 환영합니다!                                </h2>
                                <div className="space-y-4 text-white/70 leading-relaxed">
                                    <p>
                                        MHa 커뮤니티에서 계정 안 만들고 왔으면{" "}
                                        <span className="text-blue-400 font-semibold underline underline-offset-4">
                                            만들고 오세요.
                                        </span>
                                    </p>
                                    <p className="text-sm">
                                        로그인 했다면 자유롭게 채팅하세요.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://mhawebsitess.vercel.app/auth/signup"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-semibold text-white hover:from-blue-500 hover:to-indigo-500 transition-all active:scale-[0.98] group shadow-lg shadow-blue-900/20"
                                >
                                    계정 만들러 가기
                                    <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                <button
                                    onClick={closeForADay}
                                    className="text-xs text-white/30 hover:text-white/80 transition-colors underline underline-offset-4 cursor-pointer"
                                >
                                    1일 동안 보지 않기
                                </button>
                                <button
                                    onClick={closeBase}
                                    className="text-sm font-medium text-white/50 hover:text-white transition-colors cursor-pointer"
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
