"use client"

import { useState, useRef, useEffect, useLayoutEffect } from "react"
import { Send, Loader2, Sparkles, Coffee, Calendar, MapPin, ShieldCheck } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import { motion, AnimatePresence } from "framer-motion"

export function ChatInterface() {
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
        { role: "assistant", content: "Hello! I am your MissionLink AI Assistant. I have secure access to school schedules, meal plans, and academic records. How can I help you excel today?" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }

    useLayoutEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleSend = async (text?: string) => {
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
        } catch (error) {
            setMessages(prev => [...prev, { role: "assistant", content: "I'm sorry, I'm having trouble connecting to the school servers right now. Please try again or contact the IT office if the problem persists." }])
        } finally {
            setIsLoading(false)
        }
    }

    const starterChips = [
        { label: "What's for lunch?", icon: Coffee, text: "What's on the menu for today?" },
        { label: "My schedule", icon: Calendar, text: "Show me my class schedule for today." },
        { label: "Vacation countdown", icon: MapPin, text: "When is the next break?" },
    ]

    return (
        <div className="flex flex-col h-[700px] w-full glass-panel rounded-[2.5rem] overflow-hidden relative shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 z-10 px-8 py-5 bg-white/5 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Sparkles className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight">MissionLink AI</h2>
                        <div className="flex items-center text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] leading-none mt-1.5">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                            Interface Active
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-8 space-y-2 scrollbar-hide scroll-smooth"
            >
                <AnimatePresence mode="popLayout">
                    {messages.map((m, i) => (
                        <ChatMessage key={i} role={m.role} content={m.content} />
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start mb-6"
                    >
                        <div className="glass-panel px-6 py-4 rounded-[1.5rem] rounded-tl-none flex items-center">
                            <div className="flex space-x-1.5 mr-4">
                                <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                <motion.div animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            </div>
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Processing Node</span>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Controls & Input */}
            <div className="p-8 bg-black/20 border-t border-white/5 space-y-6">
                {messages.length === 1 && (
                    <div className="flex overflow-x-auto pb-2 space-x-3 no-scrollbar">
                        {starterChips.map((chip, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(chip.text)}
                                className="flex-shrink-0 flex items-center space-x-3 px-5 py-2.5 glass-panel text-gray-300 rounded-xl text-xs font-black hover:bg-white/5 hover:text-white hover:border-blue-500/30 transition-all active:scale-95 uppercase tracking-widest"
                            >
                                <chip.icon size={16} className="text-blue-500" />
                                <span>{chip.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                <div className="relative group">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSend()
                            }
                        }}
                        placeholder="Type your inquiry..."
                        className="w-full pl-8 pr-20 py-6 bg-white/5 border-white/10 border rounded-[1.5rem] text-sm font-medium text-white placeholder:text-gray-600 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white/10 transition-all resize-none min-h-[72px] outline-none"
                        rows={1}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isLoading}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-4 rounded-xl transition-all ${input.trim() && !isLoading ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95" : "bg-white/5 text-gray-700 pointer-events-none"}`}
                    >
                        <Send size={22} strokeWidth={3} />
                    </button>
                </div>

                <div className="flex items-center justify-center space-x-2 text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] opacity-40">
                    <ShieldCheck size={12} />
                    <span>Secure School Node • Identity Masked</span>
                </div>
            </div>
        </div>
    )
}
