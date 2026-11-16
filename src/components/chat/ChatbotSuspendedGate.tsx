"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { PauseCircle, ArrowRight, Sparkles, Utensils, Clock, CalendarDays } from "lucide-react"

const COLLAB_SHORTCUTS = [
    { label: "시간표", href: "/collab/timetable", icon: Clock },
    { label: "오늘의 급식", href: "/collab/meals", icon: Utensils },
    { label: "학사일정", href: "/collab/calendar", icon: CalendarDays },
] as const

/**
 * Temporary service suspension overlay for the AI Assistant page.
 * Displays an informational notice when the chatbot is paused due to operating budget constraints
 * and directs users to the Collab hub without altering underlying chat functionality.
 */
export function ChatbotSuspendedGate() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="chatbot-suspended-title"
            className="absolute inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-xl"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 120, damping: 18 }}
                className="relative max-w-lg w-full glass p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] border border-white/10 shadow-2xl text-center space-y-6 overflow-hidden max-h-[calc(100dvh-6rem)] overflow-y-auto"
            >
                {/* Decorative Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-5">
                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold tracking-wider uppercase">
                        <PauseCircle size={13} />
                        <span>일시 운영 중단 안내</span>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500/15 to-blue-500/15 rounded-3xl border border-white/10 text-amber-400 shadow-inner">
                            <PauseCircle size={34} />
                        </div>
                    </div>

                    {/* Title & Message */}
                    <div className="space-y-3">
                        <h2
                            id="chatbot-suspended-title"
                            className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug"
                        >
                            AI 어시스턴트 운영이
                            <br />
                            잠시 중단되었습니다
                        </h2>
                        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
                            현재 <span className="text-amber-300 font-semibold">운영 자금 부족</span>으로 인해
                            AI 어시스턴트 서비스 운영이 일시 중단되었습니다.
                        </p>
                        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                            급식, 시간표, 학사일정, 시험 일정, 채플·QT 등 학교 생활 정보는{" "}
                            <span className="text-white font-semibold">콜라보</span> 페이지에서 정상적으로 확인하실 수 있습니다.
                        </p>
                    </div>

                    {/* Collab Quick Shortcuts */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                        {COLLAB_SHORTCUTS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-all"
                            >
                                <item.icon size={13} className="text-blue-400" />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Primary CTA */}
                    <div className="pt-2 space-y-3">
                        <Link
                            href="/collab"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98]"
                        >
                            <Sparkles size={17} />
                            <span>콜라보 페이지에서 확인하기</span>
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
