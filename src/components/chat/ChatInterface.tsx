"use client"

import { useRef, useLayoutEffect } from "react"
import { Coffee, Calendar, MapPin } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useChat } from "@ai-sdk/react"

export function ChatInterface() {
    const { data: session, status: authStatus } = useSession()

    // AI SDK v3/v4 Stable initialization
    const { messages, append, isLoading: isChatLoading } = useChat({
        api: "/api/ai/chat",
        onError: (error) => {
            console.error("Chat Interaction Error:", error);
        },
        onFinish: () => {
            scrollToBottom();
        }
    })

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useLayoutEffect(() => {
        scrollToBottom()
    }, [messages, isChatLoading])

    const handleSend = async (text: string) => {
        if (authStatus !== "authenticated" || !text.trim() || isChatLoading) return

        append({
            role: 'user',
            content: text,
        })
    }

    const starterChips = [
        { label: "Today's Menu", icon: Coffee, text: "What's on the menu for today?" },
        { label: "My Schedule", icon: Calendar, text: "Show me my class schedule for today?" },
        { label: "School Events", icon: MapPin, text: "What upcoming events are happening?" },
    ]

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
            {/* Chat Header */}
            <div className="text-center py-8 border-b border-white/5">
                <h1 className="text-3xl font-bold text-white mb-2">MissionLink AI Assistant</h1>
                <p className="text-gray-400 text-sm">Ask me anything about school, meals, schedules, and more!</p>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-32 space-y-6 scrollbar-hide [&::-webkit-scrollbar]:hidden">
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center h-full space-y-8 px-6"
                    >
                        <div className="text-center space-y-3">
                            <h2 className="text-2xl font-bold text-white">Welcome to MissionLink AI</h2>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Your intelligent school companion. Ask about meals, schedules, birthdays, or prayer requests.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
                            {starterChips.map((chip) => (
                                <button
                                    key={chip.label}
                                    onClick={() => handleSend(chip.text)}
                                    disabled={authStatus !== "authenticated"}
                                    className={`
                                        group flex flex-col items-center p-6 rounded-2xl border 
                                        ${authStatus === "authenticated"
                                            ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 cursor-pointer"
                                            : "bg-white/5 border-white/5 opacity-50 cursor-not-allowed"}
                                        transition-all duration-300
                                    `}
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
                    <>
                        {messages.map((m: any, i) => {
                            // Robust text extraction
                            let textContent = "";
                            if (typeof m.content === 'string') {
                                textContent = m.content;
                            } else if (Array.isArray(m.parts)) {
                                textContent = m.parts
                                    .filter((p: any) => p.type === 'text' || p.text)
                                    .map((p: any) => p.text)
                                    .join("");
                            } else if (m.parts?.[0]?.text) {
                                textContent = m.parts[0].text;
                            }

                            // Skip rendering empty messages (like tool calls without text)
                            if (!textContent && m.role !== 'user') return null;

                            return (
                                <motion.div
                                    key={m.id || i}
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0 }}
                                >
                                    <ChatMessage role={m.role as "user" | "assistant"} content={textContent} />
                                </motion.div>
                            );
                        })}
                        {isChatLoading && (
                            <motion.div
                                key="loading-indicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start py-2"
                            >
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                </div>
                            </motion.div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <ChatInput
                status={authStatus}
                isLoading={isChatLoading}
                onSend={handleSend}
            />
        </div>
    )
}