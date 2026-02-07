"use client"

import { useRef, useLayoutEffect, useState, useEffect } from "react"
import { Coffee, Calendar, MapPin, ChevronDown } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

/**
 * Main ChatInterface component.
 * Orchestrates the chat experience with premium Gemini-inspired layout.
 */
export function ChatInterface() {
    const { data: session, status: authStatus } = useSession()
    const [showScrollButton, setShowScrollButton] = useState(false)

    const { messages, sendMessage, status } = useChat({
        transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
        onError: (error: any) => {
            console.error("Chat Interaction Error:", error);
        },
        onFinish: () => {
            scrollToBottom();
        }
    } as any) as any;

    const isChatLoading = status !== 'ready';

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Monitor scroll position to show/hide "Scroll to Bottom" button
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop } = messagesContainerRef.current
            // In flex-col-reverse, scrollTop is 0 at bottom and increases as you scroll UP.
            // Math.abs handles browsers that might use negative values.
            const isNearBottom = Math.abs(scrollTop) < 200
            setShowScrollButton(!isNearBottom && messages.length > 0)
        }
    }

    useLayoutEffect(() => {
        scrollToBottom()
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
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto relative px-4 md:px-8">
            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className={`flex-1 overflow-y-auto pt-12 pb-40 space-y-2 scrollbar-hide [&::-webkit-scrollbar]:hidden ${messages.length === 0 ? 'flex items-center justify-center' : ''}`}
            >
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-full max-w-3xl flex flex-col items-center justify-center space-y-16"
                    >
                        <div className="text-left w-full space-y-3">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-6xl font-semibold tracking-tight leading-tight"
                            >
                                <span className="bg-gradient-to-r from-[#4285f4] via-[#9b72cb] to-[#d96570] bg-clip-text text-transparent">
                                    Hello, {session?.user?.name || "Student"}
                                </span>
                            </motion.h1>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-6xl font-semibold text-[#444746] tracking-tight leading-tight"
                            >
                                How can I help you today?
                            </motion.h2>
                        </div>

                        <div className="w-full space-y-10">
                            <ChatInput
                                status={authStatus}
                                isLoading={isChatLoading}
                                onSend={handleSend}
                                variant="centered"
                            />

                            <div className="flex flex-wrap items-center justify-center gap-3">
                                {starterChips.map((chip, idx) => (
                                    <motion.button
                                        key={chip.label}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 + idx * 0.1 }}
                                        onClick={() => handleSend(chip.text)}
                                        disabled={authStatus !== "authenticated"}
                                        className={`
                                            px-5 py-2.5 rounded-xl border text-sm font-medium
                                            ${authStatus === "authenticated"
                                                ? "bg-[#1e1f20] border-[#303134] hover:bg-[#2a2b2d] hover:border-[#424242] text-[#e3e3e3]"
                                                : "bg-[#1e1f20]/50 border-white/5 opacity-50 cursor-not-allowed text-gray-500"}
                                            transition-all duration-300 flex items-center gap-2.5 shadow-sm
                                        `}
                                    >
                                        <chip.icon size={18} className="text-[#4285f4]" />
                                        {chip.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="max-w-4xl mx-auto w-full flex flex-col-reverse justify-start min-h-full">
                        {/* Anchor point for scrolling to bottom - stays visually at bottom */}
                        <div ref={messagesEndRef} className="h-4" />

                        {isChatLoading && (
                            <motion.div
                                key="loading-indicator"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-start py-6 px-12"
                            >
                                <div className="flex items-center space-x-3 text-blue-400 opacity-80">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="w-2.5 h-2.5 bg-current rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                                        className="w-2.5 h-2.5 bg-current rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                                        className="w-2.5 h-2.5 bg-current rounded-full"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <AnimatePresence mode="popLayout">
                            {[...messages].reverse().map((m: any, i: number) => {
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
                                    <ChatMessage
                                        key={m.id || `msg-${messages.length - i}`}
                                        role={m.role as "user" | "assistant"}
                                        content={textContent}
                                    />
                                );
                            })}
                        </AnimatePresence>

                        {/* Spacer to allow scrolling when few messages */}
                        <div className="flex-1" />
                    </div>
                )}
            </div>

            {/* Floaties / Controls */}
            <AnimatePresence>
                {showScrollButton && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 20 }}
                        onClick={scrollToBottom}
                        className="fixed bottom-32 right-8 md:right-12 z-50 p-3 rounded-full bg-[#1e1f20] border border-[#303134] text-[#e3e3e3] shadow-2xl hover:bg-[#2a2b2d] transition-all group"
                    >
                        <ChevronDown size={24} className="group-hover:translate-y-0.5 transition-transform" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Sticky Input Area for Chat View */}
            {messages.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-40">
                    {/* Gradient background for text legibility */}
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0b0c0d] via-[#0b0c0d]/90 to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className="relative max-w-4xl mx-auto px-4 pb-8"
                    >
                        <ChatInput
                            status={authStatus}
                            isLoading={isChatLoading}
                            onSend={handleSend}
                            variant="sticky"
                        />
                    </motion.div>
                </div>
            )}
        </div>
    )
}