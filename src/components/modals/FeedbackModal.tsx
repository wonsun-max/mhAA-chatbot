"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bug, Lightbulb, Loader2, CheckCircle2, ArrowRight } from "lucide-react"

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    initialType?: "IDEA" | "BUG"
}

export function FeedbackModal({ isOpen, onClose, initialType = "IDEA" }: FeedbackModalProps) {
    const [type, setType] = useState<"IDEA" | "BUG">(initialType)
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim()) {
            setError("내용을 입력해 주세요.")
            return
        }

        setIsSubmitting(true)
        setError("")

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
                setError(data.error || "제출 중 오류가 발생했습니다.")
            } else {
                setIsSubmitted(true)
                setTimeout(() => {
                    handleClose()
                }, 1800)
            }
        } catch {
            setError("서버 통신 중 오류가 발생했습니다.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setIsSubmitted(false)
        setContent("")
        setError("")
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
                    {/* Backdrop click to dismiss */}
                    <div className="fixed inset-0" onClick={handleClose} />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="w-full max-w-lg bg-zinc-950/95 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative z-10 backdrop-blur-2xl space-y-6"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">
                                    {type === "IDEA" ? "아이디어 제안" : "버그 / 불편 제보"}
                                </h3>
                                <p className="text-xs text-zinc-400 mt-0.5">
                                    남겨주신 의견은 관리자에게 안전하게 전달됩니다
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="p-2.5 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 flex flex-col items-center justify-center text-center space-y-3"
                            >
                                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 size={28} />
                                </div>
                                <h4 className="text-base font-bold text-white">접수가 완료되었습니다</h4>
                                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                                    소중한 의견 감사합니다. 플랫폼 개선에 적극 반영하겠습니다.
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Segmented Type Switcher */}
                                <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-900/80 border border-white/5 gap-1">
                                    <button
                                        type="button"
                                        onClick={() => setType("IDEA")}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                            type === "IDEA"
                                                ? "bg-white/10 text-white shadow-sm border border-white/10"
                                                : "text-zinc-500 hover:text-zinc-300"
                                        }`}
                                    >
                                        <Lightbulb size={14} className={type === "IDEA" ? "text-amber-400" : ""} />
                                        <span>아이디어 제안</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType("BUG")}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                                            type === "BUG"
                                                ? "bg-white/10 text-white shadow-sm border border-white/10"
                                                : "text-zinc-500 hover:text-zinc-300"
                                        }`}
                                    >
                                        <Bug size={14} className={type === "BUG" ? "text-red-400" : ""} />
                                        <span>버그 / 오류 제보</span>
                                    </button>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                        {error}
                                    </div>
                                )}

                                {/* Single Pure Textarea */}
                                <div className="space-y-2">
                                    <textarea
                                        required
                                        autoFocus
                                        rows={5}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder={
                                            type === "IDEA"
                                                ? "어떤 기능이나 아이디어가 추가되면 좋을까요?"
                                                : "어떤 화면에서 어떤 문제가 발생했나요?"
                                        }
                                        className="w-full bg-zinc-900/50 border border-white/10 focus:border-white/30 rounded-2xl p-4 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-colors resize-none leading-relaxed"
                                    />
                                </div>

                                {/* Footer Action Buttons */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="px-5 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !content.trim()}
                                        className="px-6 py-2.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 transition-all flex items-center gap-2 disabled:opacity-40 disabled:hover:bg-white shadow-lg shadow-white/5"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="animate-spin" size={14} />
                                        ) : (
                                            <>
                                                <span>보내기</span>
                                                <ArrowRight size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
