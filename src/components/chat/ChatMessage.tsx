import { User } from "lucide-react"
import Image from "next/image"

interface ChatMessageProps {
    role: "user" | "assistant"
    content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isAssistant = role === "assistant"

    return (
        <div className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"} py-4 group`}>
            <div className={`flex max-w-[90%] md:max-w-[85%] ${isAssistant ? "flex-row gap-5" : "flex-row-reverse"}`}>

                {/* Avatar for Assistant */}
                {isAssistant && (
                    <div className="flex-shrink-0 w-8 h-8 mt-1">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden relative">
                            <Image
                                src="/site-logo.png"
                                alt="AI"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className={`flex flex-col ${isAssistant ? "items-start pt-1" : "items-end"}`}>
                    <div className={`
                        relative px-0 py-0 text-[#e3e3e3] text-lg font-normal leading-[1.8] tracking-wide
                        ${isAssistant
                            ? "" // AI: Pure text look (already has gap-5 from parent flex)
                            : "bg-[#2a2b2d] px-5 py-3 rounded-[1.5rem] text-[#e3e3e3]" // User: Dark bubble
                        }
                    `}>
                        <div className="whitespace-pre-wrap font-sans selection:bg-blue-500/30">{content}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
