import { forwardRef } from "react"
import { motion } from "framer-motion"
import { User } from "lucide-react"

interface ChatMessageProps {
    role: "user" | "assistant"
    content: string
}

export const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(function ChatMessage({ role, content }, ref) {
    const isAssistant = role === "assistant"

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"} py-2`}
        >
            <div className={`flex max-w-[85%] md:max-w-[75%] ${isAssistant ? "flex-row gap-4" : "flex-row-reverse"}`}>

                {/* Avatar */}
                {isAssistant && (
                    <div className="flex-shrink-0 w-8 h-8 mt-1">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden">
                            <img src="/site-logo.png" alt="AI" className="w-full h-full object-contain" />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className={`flex flex-col ${isAssistant ? "items-start" : "items-end"}`}>
                    <div className={`
                        relative px-5 py-3.5 text-lg font-medium leading-7
                        ${isAssistant
                            ? "text-gray-100 pl-0 pt-1" // AI: Pure text look
                            : "bg-[#1a1a1a] text-white rounded-[20px] rounded-tr-sm" // User: Dark bubble (almost black)
                        }
                    `}>
                        <div className="whitespace-pre-wrap font-sans">{content}</div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
})
