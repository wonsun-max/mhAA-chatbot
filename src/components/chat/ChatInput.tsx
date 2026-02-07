"use client"

import { useState } from "react"
import { ArrowUp, ShieldCheck, Lock } from "lucide-react"
import Link from "next/link"

interface ChatInputProps {
    status: "authenticated" | "loading" | "unauthenticated"
    isLoading: boolean
    onSend: (text: string) => void
    variant?: "centered" | "sticky"
}

export function ChatInput({ status, isLoading, onSend, variant = "sticky" }: ChatInputProps) {
    const [input, setInput] = useState("")

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
                    <div className="relative bg-[#1e1f20] border border-[#303134] rounded-[2rem] shadow-xl flex flex-col p-2 transition-all hover:border-[#424242] focus-within:border-[#424242] focus-within:bg-[#252627]">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Message AI..."
                            className="w-full bg-transparent border-none text-[#e3e3e3] placeholder:text-[#9aa0a6] focus:ring-0 outline-none resize-none py-4 px-6 min-h-[60px] max-h-[200px] scrollbar-hide [&::-webkit-scrollbar]:hidden text-lg font-normal leading-relaxed"
                            rows={1}
                            style={{ height: input ? 'auto' : '60px' }}
                        />
                        <div className="flex justify-end px-2 pb-1">
                            <button
                                onClick={handleSendClick}
                                disabled={!input.trim() || isLoading}
                                className={`p-2 rounded-full transition-all duration-200 flex-shrink-0 ${input.trim() && !isLoading
                                    ? "bg-[#e3e3e3] text-[#1e1f20] hover:bg-[#ffffff] shadow-lg"
                                    : "bg-transparent text-[#5f6368] cursor-not-allowed"
                                    }`}
                            >
                                <ArrowUp size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative bg-[#1e1f20] border border-[#303134] rounded-[2.5rem] shadow-2xl p-8 flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="p-4 bg-yellow-400/10 rounded-full text-yellow-400">
                            <Lock size={32} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-medium text-[#e3e3e3]">Sign in to start chatting</h3>
                            <p className="text-[#9aa0a6] max-w-sm">Please login to access the AI Assistant and start getting things done.</p>
                        </div>
                        <div className="flex gap-4 w-full justify-center pt-2">
                            <Link href="/login" className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10">
                                Login
                            </Link>
                            <Link href="/signup" className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg shadow-blue-500/20">
                                Get Access
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {variant === 'centered' && (
                <div className="text-center mt-6">
                    <p className="text-xs text-[#9aa0a6] opacity-60">
                        AI Assistant may display inaccurate info, so double-check its responses.
                    </p>
                </div>
            )}
        </div>
    )
}
