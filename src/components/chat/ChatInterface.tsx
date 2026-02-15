"use client"

import { useRef, useLayoutEffect, useState, useEffect } from "react"
import { MessageSquare, Sparkles, Brain, ChevronDown, BookOpen, Languages, Utensils, Calendar } from "lucide-react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { motion, AnimatePresence } from "framer-motion"
import { useSession } from "next-auth/react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { AccessGate } from "../layout/AccessGate"

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
                top: messagesContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    // Monitor scroll position to show/hide "Scroll to Bottom" button
    const handleScroll = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 200
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
        { label: "오늘의 말씀", icon: BookOpen, text: "오늘의 말씀 하나만 추천해줘." },
        { label: "오늘의 영어 단어", icon: Languages, text: "오늘 외우면 좋을 영어 단어 하나 알려줘." },
        { label: "오늘 급식", icon: Utensils, text: "오늘 급식 메뉴가 뭐야?" },
        { label: "오늘 시간표", icon: Calendar, text: "오늘 내 시간표 알려줘." },
    ]

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto relative px-4 md:px-8">
            {/* Access Gate Overlay */}
            {authStatus !== "authenticated" && (
                <AccessGate 
                    title="대화를 시작하려면"
                    description="MissionLink 지능형 어시스턴트와 대화하려면 로그인이 필요합니다."
                />
            )}

            {/* Messages Area */}
            <div
                ref={messagesContainerRef}
                onScroll={handleScroll}
                className={`flex-1 overflow-y-auto pt-12 pb-40 space-y-2 scrollbar-hide [&::-webkit-scrollbar]:hidden ${messages.length === 0 ? 'flex items-center justify-center' : ''}`}
            >
                {messages.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full max-w-3xl flex flex-col items-center justify-center space-y-12"
                    >
                        <div className={`w-full space-y-4 ${authStatus !== "authenticated" ? "text-center" : "text-left"}`}>
                            <motion.h1
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold tracking-tight leading-tight text-white"
                            >
                                안녕하세요, {authStatus === "authenticated" ? (session?.user?.name || "사용자") : "Guest"}님
                            </motion.h1>
                            <motion.h2
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl md:text-4xl font-semibold text-zinc-600 tracking-tight leading-tight"
                            >
                                무엇을 도와드릴까요?
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
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        onClick={() => handleSend(chip.text)}
                                        disabled={authStatus !== "authenticated"}
                                        className={`
                                            px-5 py-2.5 rounded-xl border text-sm font-medium
                                            ${authStatus === "authenticated"
                                                ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300"
                                                : "bg-zinc-900/50 border-white/5 opacity-50 cursor-not-allowed text-zinc-600"}
                                            transition-all duration-300 flex items-center gap-2.5 shadow-sm
                                        `}
                                    >
                                        <chip.icon size={16} className="text-blue-500" />
                                        {chip.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="max-w-4xl mx-auto w-full flex flex-col">
                        <AnimatePresence mode="popLayout">
                            {messages.map((m: any, i: number) => {
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
                                        key={m.id || i}
                                        role={m.role as "user" | "assistant"}
                                        content={textContent}
                                    />
                                );
                            })}
                        </AnimatePresence>

                        {isChatLoading && (
                            <motion.div
                                key="loading-indicator"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
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
                        <div ref={messagesEndRef} className="h-4" />
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