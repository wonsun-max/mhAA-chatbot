"use client"

import { ChatInterface } from "@/components/chat/ChatInterface"
import { ShieldCheck, Info, Lock } from "lucide-react"
import { motion } from "framer-motion"

export default function ChatbotPage() {
    return (
        <main className="h-screen relative overflow-hidden pt-16">

            <div className="h-full w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full w-full"
                >
                    <ChatInterface />
                </motion.div>
            </div>
        </main>
    )
}
