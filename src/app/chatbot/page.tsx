"use client"

import { ChatInterface } from "@/components/chat/ChatInterface"
import { ShieldCheck, Info, Lock } from "lucide-react"
import { motion } from "framer-motion"

export default function ChatbotPage() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-background pt-32 pb-20 px-4">
            <div className="aurora-glow scale-125 opacity-50" />

            <div className="max-w-7xl mx-auto space-y-12 relative">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">AI Assistant</h1>
                    <div className="flex items-center justify-center space-x-6">
                        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            <ShieldCheck className="text-blue-500 mr-2" size={14} />
                            Privacy Verified
                        </div>
                        <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
                            <Lock className="text-blue-500 mr-2" size={14} />
                            Secure Node
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="max-w-4xl mx-auto"
                >
                    <ChatInterface />
                </motion.div>

                {/* Info Cards - Bento Style */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto"
                >
                    <div className="bento-card space-y-4 p-8">
                        <div className="flex items-center space-x-3 text-blue-500 font-black text-xs uppercase tracking-widest">
                            <Info size={18} />
                            <span>Privacy Protocol</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            The assistant is designed to handle queries without compromising your identity. Personal data is never stored in AI memory contexts.
                        </p>
                    </div>
                    <div className="bento-card space-y-4 p-8">
                        <div className="flex items-center space-x-3 text-blue-500 font-black text-xs uppercase tracking-widest">
                            <ShieldCheck size={18} />
                            <span>Official Data</span>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium">
                            All information is pulled directly from official school Airtable and database records in real-time.
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}
