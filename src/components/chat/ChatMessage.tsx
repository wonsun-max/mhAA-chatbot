"use client"

import { motion } from "framer-motion"
import { User, Bot } from "lucide-react"

interface ChatMessageProps {
    role: "user" | "assistant"
    content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isAssistant = role === "assistant"

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`flex w-full mb-6 ${isAssistant ? "justify-start" : "justify-end"}`}
        >
            <div className={`flex max-w-[85%] ${isAssistant ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${isAssistant ? "bg-blue-600 text-white mr-4 shadow-blue-500/20" : "bg-white/5 text-gray-400 ml-4 border border-white/5"}`}>
                    {isAssistant ? <Bot size={22} /> : <User size={22} />}
                </div>
                <div className={`px-6 py-4 rounded-[1.5rem] ${isAssistant ? "glass-panel text-gray-200 rounded-tl-none" : "bg-blue-600 text-white shadow-xl shadow-blue-500/10 rounded-tr-none"}`}>
                    <p className="text-sm leading-[1.6] font-medium whitespace-pre-wrap">{content}</p>
                </div>
            </div>
        </motion.div>
    )
}
