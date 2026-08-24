"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Bug, Lightbulb, Loader2, CheckCircle2, Send } from "lucide-react"
import { useSession } from "next-auth/react"

interface FeedbackModalProps {
    isOpen: boolean
    onClose: () => void
    initialType?: "IDEA" | "BUG"
}

export function FeedbackModal({ isOpen, onClose, initialType = "IDEA" }: FeedbackModalProps) {
    const { data: session } = useSession()
    const [type, setType] = useState<"IDEA" | "BUG">(initialType)
    const [content, setContent] = useState("")
    const [contact, setContact] = useState("")
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
                    contact: contact.trim() || undefined,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "제출 중 오류가 발생했습니다.")
            } else {
                setIsSubmitted(true)
                setTimeout(() => {
                    handleClose()
                }, 2000)
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
        setContact("")
        setError("")
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-md bg-zinc-900/90 border border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-2xl"
                    >
                        {/* Background Glow */}
                        <div className={`absolute top-0 right-0 w-72 h-72 ${type === "IDEA" ? "bg-amber-500/10" : "bg-red-500/10"} blur-3xl pointer-events-none transition-colors duration-500`} />

                        {/* Modal Header */}
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors ${
                                    type === "IDEA" 
                                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400" 
                                        : "bg-red-500/10 border-red-500/30 text-red-400"
                                }`}>
                                    {type === "IDEA" ? <Lightbulb size={20} /> : <Bug size={20} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">
                                        {type === "IDEA" ? "아이디어 제안" : "버그 / 오류 제보"}
                                    </h3>
                                    <p className="text-xs text-zinc-400 font-light">
                                        WITHUS를 더 좋게 만들기 위한 의견을 남겨주세요
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {isSubmitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 flex flex-col items-center justify-center text-center space-y-3"
                            >
                                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-white">소중한 의견이 접수되었습니다!</h4>
                                <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                                    보내주신 내용은 관리자가 확인 후 플랫폼 개선에 적극 반영하겠습니다. 감사합니다!
                                </p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                {/* Type Selector Pills */}
                                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-zinc-950 border border-white/5">
                                    <button
                                        type="button"
                                        onClick={() => setType("IDEA")}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                            type === "IDEA"
                                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-md"
                                                : "text-zinc-500 hover:text-zinc-300"
                                        }`}
                                    >
                                        <Lightbulb size={14} />
                                        <span>💡 아이디어 제안</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setType("BUG")}
                                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                            type === "BUG"
                                                ? "bg-red-500/20 text-red-300 border border-red-500/30 shadow-md"
                                                : "text-zinc-500 hover:text-zinc-300"
                                        }`}
                                    >
                                        <Bug size={14} />
                                        <span>🐛 버그 / 불편한 점</span>
                                    </button>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                        {error}
                                    </div>
                                )}

                                {/* Content Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">
                                        {type === "IDEA" ? "어떤 기능이 추가되면 좋을까요? *" : "어떤 오류나 불편한 점이 발생했나요? *"}
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder={
                                            type === "IDEA"
                                                ? "예: 매점 실시간 재고나 도서관 책 목록도 볼 수 있으면 좋겠어요!"
                                                : "예: 시간표 페이지에서 3교시 클릭 시 화면이 멈춰요."
                                        }
                                        className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-3.5 px-4 text-sm text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 outline-none transition-all resize-none placeholder:text-zinc-600"
                                    />
                                </div>

                                {/* Optional Contact Field (Auto-filled hint if logged in) */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">
                                        연락처 / 닉네임 <span className="text-zinc-600 font-normal">(선택)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        placeholder={
                                            session?.user?.email 
                                                ? `${session.user.name || session.user.nickname || "내 계정"} (${session.user.email})으로 자동 등록`
                                                : "답변을 받고 싶으시다면 이메일이나 이름을 남겨주세요"
                                        }
                                        className="w-full bg-zinc-950 border border-white/10 rounded-2xl py-3 px-4 text-xs text-white focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 outline-none transition-all placeholder:text-zinc-600"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !content.trim()}
                                    className={`w-full font-bold py-3.5 rounded-2xl text-white flex items-center justify-center gap-2 transition-all shadow-xl disabled:opacity-50 mt-3 ${
                                        type === "IDEA"
                                            ? "bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400 shadow-amber-500/20"
                                            : "bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 shadow-red-500/20"
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <Send size={15} />
                                            <span>의견 보내기</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
