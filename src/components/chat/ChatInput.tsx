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

/**
 * ChatInput component with premium Gemini styling.
 * Features glassmorphism, glow effects, and smooth focus transitions.
 */
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
                        borderColor: isFocused ? "#4285f4" : "#303134",
                        backgroundColor: isFocused ? "#202124" : "#1e1f20"
                    }}
                    className={`
                        relative border rounded-[1.75rem] shadow-2xl flex flex-col p-2 
                        transition-all duration-300 ease-out backdrop-blur-xl
                        ${isFocused ? "shadow-[0_0_20px_rgba(66,133,244,0.15)]" : "shadow-black/50"}
                    `}
                >
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Ask Mha bot..."
                        disabled={status !== "authenticated"}
                        className="w-full bg-transparent border-none text-[#e3e3e3] placeholder:text-[#8e9196] focus:ring-0 outline-none resize-none py-4 px-6 min-h-[64px] max-h-[400px] scrollbar-hide [&::-webkit-scrollbar]:hidden text-[1.125rem] font-normal leading-relaxed tracking-wide disabled:cursor-not-allowed"
                        rows={1}
                        style={{ height: input ? 'auto' : '64px' }}
                    />
                    <div className="flex items-center justify-between px-4 pb-2">
                        <div className="flex gap-1 text-[10px] text-gray-500 font-medium">
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 uppercase tracking-tighter">Markdown</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 uppercase tracking-tighter">Shift+Enter for New Line</span>
                        </div>
                        <button
                            onClick={handleSendClick}
                            disabled={!input.trim() || isLoading || status !== "authenticated"}
                            className={`
                                p-2 rounded-[1rem] transition-all duration-300 flex-shrink-0
                                ${input.trim() && !isLoading && status === "authenticated"
                                    ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_4px_12px_rgba(66,133,244,0.3)] scale-100 opacity-100"
                                    : "bg-white/5 text-[#5f6368] cursor-not-allowed scale-95 opacity-50"
                                }
                            `}
                        >
                            <ArrowUp size={24} strokeWidth={2.5} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {variant === 'centered' && (
                <div className="text-center mt-6">
                    <p className="text-xs text-[#8e9196] font-light tracking-wide">
                        Gemini may provide inaccurate info, so double-check its responses.
                        <span className="ml-1 opacity-50 underline cursor-help">Learn more</span>
                    </p>
                </div>
            )}
        </div>
    )
}
