"use client"

import { useState, useRef, useLayoutEffect } from "react"
import { Send, Sparkles, Coffee, Calendar, MapPin, ShieldCheck, ArrowUp, Lock } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import Link from "next/link"

export function ChatInterface() {
    const { data: session, status } = useSession()
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }

    useLayoutEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleSend = async (text?: string) => {
        if (status !== "authenticated") return

        const messageText = text || input
        if (!messageText.trim() || isLoading) return

        const userMessage = { role: "user" as const, content: messageText }
        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsLoading(true)

        try {
            const res = await fetch("/api/ai/chat", {
                method: "POST",
                body: JSON.stringify({ messages: [...messages, userMessage] }),
                headers: { "Content-Type": "application/json" }
            })

            if (!res.ok) throw new Error("Failed to send")

            const data = await res.json()
            setMessages(prev => [...prev, { role: "assistant", content: data.content }])
        } catch {
            setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting to the school servers right now. Please try again or contact the IT office if the problem persists." }])
        } finally {
            setIsLoading(false)
        }
    }

    const starterChips = [
        { label: "Today's Menu", icon: Coffee, text: "What's on the menu for today?" },
        { label: "My Schedule", icon: Calendar, text: "Show me my class schedule for today." },
        { label: "School Events", icon: MapPin, text: "What upcoming events are happening?" },
    ]

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">

            {/* Messages Area - Fills space */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto px-4 pb-32 space-y-6 scrollbar-hide scroll-smooth"
            >
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full space-y-8 text-center"
                    >
                        <div className="w-16 h-16 relative mb-4">
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <h2 className="text-4xl font-bold text-white tracking-tight">Hi there,</h2>
                            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">How can I help you today?</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl px-4">
                            {starterChips.map((chip, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend(chip.text)}
                                    // Disable interaction if not logged in, visually dimmed
                                    disabled={status !== "authenticated"}
                                    className={`flex flex-col items-start p-4 bg-white/5 border border-white/5 rounded-2xl transition-all text-left ${status === "authenticated"
                                        ? "hover:bg-white/10 hover:scale-[1.02] cursor-pointer group"
                                        : "opacity-50 cursor-not-allowed"
                                        }`}
                                >
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mb-3 group-hover:text-blue-300">
                                        <chip.icon size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-200">{chip.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {messages.map((m, i) => (
                            <ChatMessage key={i} role={m.role} content={m.content} />
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center space-x-3 px-4"
                            >
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                </div>
                                <span className="text-xs font-medium text-gray-500 animate-pulse">Thinking...</span>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </AnimatePresence>
                )}
            </div>

            {/* Floating Input Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pt-10">
                <div className="max-w-3xl mx-auto relative group">
                    {status === "authenticated" ? (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                            <div className="relative bg-[#1e293b]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl flex items-center p-2 transition-all group-focus-within:border-white/20 group-focus-within:bg-[#1e293b]/70">
                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault()
                                            handleSend()
                                        }
                                    }}
                                    placeholder="Message MissionLink AI..."
                                    className="w-full bg-transparent border-none text-white placeholder:text-gray-400 focus:ring-0 outline-none resize-none py-4 px-6 min-h-[60px] max-h-[200px] scrollbar-hide [&::-webkit-scrollbar]:hidden text-lg font-medium leading-relaxed"
                                    rows={1}
                                    style={{ height: input ? 'auto' : '60px' }}
                                />
                                <button
                                    onClick={() => handleSend()}
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
        </div>
    )
}
