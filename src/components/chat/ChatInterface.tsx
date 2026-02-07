"use client"

import { useRef, useLayoutEffect } from "react"
import { Coffee, Calendar, MapPin } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

export function ChatInterface() {
    const { data: session, status: authStatus } = useSession()

    // AI SDK v6+ Initialization with stable v6 Transport and Status APIs
    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
        onError: (error: any) => {
            console.error("Chat Interaction Error:", error);
        },
        onFinish: () => {
            scrollToTop();
        }
    } as any) as any;

    const isChatLoading = status !== 'ready';

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    const scrollToTop = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    useLayoutEffect(() => {
        scrollToTop()
    }, [messages, isChatLoading])

    const handleSend = async (text: string) => {
        if (authStatus !== "authenticated" || !text.trim() || isChatLoading) return

        sendMessage({ text })
    }

    const starterChips = [
        { label: "Today's Menu", icon: Coffee, text: "What's on the menu for today?" },
        { label: "My Schedule", icon: Calendar, text: "Show me my class schedule for today?" },
        { label: "School Events", icon: MapPin, text: "What upcoming events are happening?" },
    ]

    return (
        <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative px-4">
            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                className={`flex-1 overflow-y-auto pt-8 pb-32 space-y-6 scrollbar-hide [&::-webkit-scrollbar]:hidden ${messages.length === 0 ? 'flex items-center justify-center' : ''}`}
            >
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-3xl flex flex-col items-center justify-center space-y-12"
                    >
                        <div className="text-left w-full space-y-2">
                            <h1 className="text-5xl font-medium tracking-tight">
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Hello, {session?.user?.name || "Student"}
                                </span>
                            </h1>
                            <h2 className="text-5xl font-medium text-gray-500 tracking-tight">
                                Where should we do?
                            </h2>
                        </div>

                        <div className="w-full">
                            <ChatInput
                                status={authStatus}
                                isLoading={isChatLoading}
                                onSend={handleSend}
                                variant="centered"
                            />

                            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                                {starterChips.map((chip) => (
                                    <button
                                        key={chip.label}
                                        onClick={() => handleSend(chip.text)}
                                        disabled={authStatus !== "authenticated"}
                                        className={`
                                            px-4 py-2 rounded-full border text-sm font-medium
                                            ${authStatus === "authenticated"
                                                ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-300"
                                                : "bg-white/5 border-white/5 opacity-50 cursor-not-allowed text-gray-500"}
                                            transition-all duration-300 flex items-center gap-2
                                        `}
                                    >
                                        <chip.icon size={16} className="text-blue-400" />
                                        {chip.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <>
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
                        {messages.slice().reverse().map((m: any, i: number) => {
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
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Sticky Input Area for Chat View */}
            {messages.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#0b0c0d] via-[#0b0c0d]/90 to-transparent pt-12">
                    <div className="max-w-4xl mx-auto px-4 pb-6">
                        <ChatInput
                            status={authStatus}
                            isLoading={isChatLoading}
                            onSend={handleSend}
                            variant="sticky"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}