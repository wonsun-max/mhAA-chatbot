"use client"

import { useRef, useLayoutEffect } from "react"
import { Coffee, Calendar, MapPin } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useChat } from "@ai-sdk/react"

export function ChatInterface() {
    const { data: session, status: authStatus } = useSession()
    const { messages, sendMessage, status: chatStatus } = useChat({
        api: "/api/ai/chat",
        onFinish: () => {
            scrollToBottom();
        }
    })

    const isChatLoading = chatStatus === "submitting" || chatStatus === "streaming"

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight
        }
    }

    useLayoutEffect(() => {
        scrollToBottom()
    }, [messages, isChatLoading])

    const handleSend = async (text: string) => {
        if (authStatus !== "authenticated" || !text.trim() || isChatLoading) return

        sendMessage({
            role: "user",
            content: text,
        })
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
                                    disabled={authStatus !== "authenticated"}
                                    className={`flex flex-col items-start p-4 bg-white/5 border border-white/5 rounded-2xl transition-all text-left ${authStatus === "authenticated"
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
                            <ChatMessage key={m.id || i} role={m.role as "user" | "assistant"} content={m.content} />
                        ))}
                        {isChatLoading && messages[messages.length - 1]?.role !== "assistant" && (
                            <motion.div
                                key="loading-indicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
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
            <ChatInput
                status={authStatus === "authenticated" ? "authenticated" : "unauthenticated"}
                isLoading={isChatLoading}
                onSend={handleSend}
            />
        </div>
    )
}
