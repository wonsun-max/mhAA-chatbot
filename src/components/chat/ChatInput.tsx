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
                {status === "authenticated" ? (
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
                            placeholder="Ask Gemini..."
                            className="w-full bg-transparent border-none text-[#e3e3e3] placeholder:text-[#8e9196] focus:ring-0 outline-none resize-none py-4 px-6 min-h-[64px] max-h-[400px] scrollbar-hide [&::-webkit-scrollbar]:hidden text-[1.125rem] font-normal leading-relaxed tracking-wide"
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
                                disabled={!input.trim() || isLoading}
                                className={`
                                    p-2 rounded-[1rem] transition-all duration-300 flex-shrink-0
                                    ${input.trim() && !isLoading
                                        ? "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_4px_12px_rgba(66,133,244,0.3)] scale-100 opacity-100"
                                        : "bg-white/5 text-[#5f6368] cursor-not-allowed scale-95 opacity-50"
                                    }
                                `}
                            >
                                <ArrowUp size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <div className="relative bg-[#1e1f20]/80 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 backdrop-blur-2xl flex flex-col items-center justify-center space-y-6 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-pink-500/5 pointer-events-none" />
                        <div className="relative z-10 p-4 bg-yellow-400/10 rounded-full text-yellow-500 ring-4 ring-yellow-400/5">
                            <Lock size={32} />
                        </div>
                        <div className="relative z-10 space-y-2">
                            <h3 className="text-2xl font-semibold text-white tracking-tight">Ready to collaborate?</h3>
                            <p className="text-[#9aa0a6] max-w-sm mx-auto">Sign in to unlock the full potential of your AI Assistant.</p>
                        </div>
                        <div className="relative z-10 flex gap-4 w-full justify-center pt-2">
                            <Link href="/login" className="px-10 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold transition-all border border-white/10 hover:border-white/20">
                                Login
                            </Link>
                            <Link href="/signup" className="px-10 py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
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
