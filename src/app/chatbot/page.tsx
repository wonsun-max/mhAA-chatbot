"use client"

import { ChatInterface } from "@/components/chat/ChatInterface"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function ChatbotPage() {
    const { status } = useSession()

    if (status === "loading") {
        return (
            <div className="h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        )
    }

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
