"use client"

import { useState } from "react"
import { ArrowUp, ShieldCheck, Lock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface ChatInputProps {
    status: "authenticated" | "loading" | "unauthenticated"
    isLoading: boolean
    onSend: (text: string) => void
    variant?: "centered" | "sticky"
}

export function ChatInput({ status, isLoading, onSend, variant = "sticky" }: ChatInputProps) {
    const [input, setInput] = useState("")
    const [isFocused, setIsFocused] = useState(false)

    const handleSendClick = () => {
        if (!input.trim() || isLoading) return
        onSend(input)
        setInput("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendClick()
        }
    }

    return (
        <div className={`w-full ${variant === 'centered' ? 'max-w-3xl mx-auto' : ''}`}>
            <div className="relative group">
                <motion.div
                    initial={false}
                    animate={{
                        borderColor: isFocused ? "#3b82f6" : "#27272a",
                        backgroundColor: isFocused ? "#09090b" : "#111113"
                    }}
                    className={`
                        relative border rounded-2xl shadow-xl flex flex-col p-2 
                        transition-all duration-300 ease-out backdrop-blur-xl
                        ${isFocused ? "shadow-blue-500/5" : "shadow-black/20"}
                    `}
                >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="궁금한 점을 입력하세요..."
                        disabled={status !== "authenticated"}
                        className="w-full bg-transparent border-none text-zinc-200 placeholder:text-zinc-600 focus:ring-0 outline-none resize-none py-4 px-6 min-h-[56px] max-h-[400px] scrollbar-hide [&::-webkit-scrollbar]:hidden text-base font-normal leading-relaxed disabled:cursor-not-allowed"
                        rows={1}
                        style={{ height: input ? 'auto' : '56px' }}
                    />
                    <div className="flex items-center justify-between px-4 pb-2">
                        <div className="flex gap-2 text-[10px] text-zinc-600 font-medium">
                            <span className="opacity-50 tracking-tight">Shift+Enter for new line</span>
                        </div>
                        <button
                            onClick={handleSendClick}
                            disabled={!input.trim() || isLoading || status !== "authenticated"}
                            className={`
                                p-2 rounded-xl transition-all duration-300 flex-shrink-0
                                ${input.trim() && !isLoading && status === "authenticated"
                                    ? "bg-blue-600 text-white hover:bg-blue-500 scale-100 opacity-100 shadow-lg shadow-blue-500/20"
                                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed scale-95 opacity-50"
                                }
                            `}
                        >
                            <ArrowUp size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {variant === 'centered' && (
                <div className="text-center mt-6">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                        MissionLink Intelligent Assistant
                    </p>
                </div>
            )}
        </div>
    )
}
