"use client"

import { useState } from "react"
import { ArrowUp, ShieldCheck, Lock } from "lucide-react"
import Link from "next/link"

interface ChatInputProps {
    status: "authenticated" | "loading" | "unauthenticated"
    isLoading: boolean
    onSend: (text: string) => void
}

export function ChatInput({ status, isLoading, onSend }: ChatInputProps) {
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
        <div className="absolute bottom-0 left-0 right-0 p-4 pt-10">
            <div className="max-w-3xl mx-auto relative group">
                {status === "authenticated" ? (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                        <div className="relative bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl flex items-center p-2 transition-all group-focus-within:border-white/20 group-focus-within:bg-[#1e293b]/70">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Message MissionLink AI..."
                                className="w-full bg-transparent border-none text-white placeholder:text-gray-400 focus:ring-0 outline-none resize-none py-4 px-6 min-h-[60px] max-h-[200px] scrollbar-hide [&::-webkit-scrollbar]:hidden text-lg font-medium leading-relaxed"
                                rows={1}
                                style={{ height: input ? 'auto' : '60px' }}
                            />
                            <button
                                onClick={handleSendClick}
                                disabled={!input.trim() || isLoading}
                                className={`p-3 rounded-full transition-all duration-200 flex-shrink-0 ${input.trim() && !isLoading
                                    ? "bg-white text-[#0A1929] hover:bg-gray-200 shadow-lg"
                                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                <ArrowUp size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="relative bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="flex items-center space-x-2 text-yellow-400">
                            <Lock size={20} />
                            <span className="font-bold uppercase tracking-wider text-sm">Authentication Required</span>
                        </div>
                        <p className="text-gray-300 font-medium">Please login to access the AI Assistant.</p>
                        <div className="flex gap-4 w-full justify-center">
                            <Link href="/login" className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-colors w-full max-w-[140px]">
                                Login
                            </Link>
                            <Link href="/signup" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors w-full max-w-[140px]">
                                Get Access
                            </Link>
                        </div>
                    </div>
                )}

                <div className="text-center mt-3">
                    <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-medium opacity-60">
                        <ShieldCheck size={10} />
                        <span>Confidential & Secure • AI may make mistakes.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
