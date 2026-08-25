"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Bug, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export type FeedbackType = "IDEA" | "BUG"

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    initialType?: FeedbackType
}

export function FeedbackModal({
    isOpen,
    onClose,
    initialType = "IDEA",
}: FeedbackModalProps) {
    const [type, setType] = useState<FeedbackType>(initialType)
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Reset all internal state whenever modal opens or initialType changes
    useEffect(() => {
        if (isOpen) {
            setType(initialType)
            setContent("")
            setLoading(false)
            setSubmitted(false)
            setError(null)
        }
    }, [isOpen, initialType])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || loading) return

        setLoading(true)
        setError(null)

        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type,
                    content: content.trim(),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "제출에 실패했습니다.")
            }

            setSubmitted(true)
            setTimeout(() => {
                onClose()
            }, 1600)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "제출 중 오류가 발생했습니다.")
        } finally {
            setLoading(false)
        }
    }

    const isIdea = type === "IDEA"

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                    {/* Backdrop click to close */}
                    <div className="fixed inset-0" onClick={onClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-full max-w-lg bg-zinc-950/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6 overflow-hidden max-h-[calc(100dvh-2rem)] overflow-y-auto"
                    >
                        {/* Ambient top glow */}
                        <div
                            className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-[80px] pointer-events-none transition-colors duration-500 ${
                                isIdea ? "bg-amber-500/20" : "bg-red-500/20"
                            }`}
                        />

                        {submitted ? (
                            /* Success State */
                            <div className="py-10 text-center space-y-4">
                                <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10 animate-in zoom-in-75 duration-300">
                                    <CheckCircle2 size={32} />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-xl font-bold text-white tracking-tight">
                                        소중한 의견이 등록되었습니다
                                    </h3>
                                    <p className="text-xs text-zinc-400">
                                        관리자 검토 후 WITHUS 개선에 적극 반영하겠습니다. 감사합니다!
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Form State */
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                            <span>피드백 & 건의함</span>
                                        </h3>
                                        <p className="text-xs text-zinc-400">
                                            더 나은 WITHUS를 위한 아이디어나 버그를 알려주세요.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="p-2.5 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                                        aria-label="닫기"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Segmented Type Switcher */}
                                <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-zinc-900/80 border border-white/5 gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setType("IDEA")}
                                        className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                            isIdea
                                                ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        <Sparkles size={14} />
                                        <span>새로운 아이디어</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setType("BUG")}
                                        className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                            !isIdea
                                                ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                                        }`}
                                    >
                                        <Bug size={14} />
                                        <span>버그 / 오류 제보</span>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Content Textarea */}
                                    <div className="space-y-2">
                                        <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
                                            {isIdea ? "💡 제안하고 싶은 아이디어" : "🐛 발생한 오류 내용"}
                                        </label>
                                        <textarea
                                            required
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={4}
                                            placeholder={
                                                isIdea
                                                    ? "이런 기능이 생기면 좋겠어요! (예: 도서관 도서 검색, 스터디 그룹 등)"
                                                    : "어떤 화면에서 어떤 문제가 발생했나요? (예: 모바일에서 버튼 클릭이 안 돼요)"
                                            }
                                            className="w-full rounded-2xl bg-zinc-900/60 border border-white/10 px-4 py-3.5 text-base sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Error Alert */}
                                    {error && (
                                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                                            <AlertCircle size={14} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-2 flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-3 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                                        >
                                            취소
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={loading || !content.trim()}
                                            className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                                                isIdea
                                                    ? "bg-amber-400 hover:bg-amber-300 text-black shadow-amber-500/20"
                                                    : "bg-red-500 hover:bg-red-400 text-white shadow-red-500/20"
                                            }`}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    <span>전송 중...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={14} />
                                                    <span>의견 보내기</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
