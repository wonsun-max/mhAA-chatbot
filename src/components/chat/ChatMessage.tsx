"use client"

import { useState } from "react"
import { Copy, Check, Sparkles } from "lucide-react"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessageProps {
    role: "user" | "assistant"
    content: string
}

/**
 * ChatMessage component that renders messages with markdown support and syntax highlighting.
 * Includes a premium "Gemini Sparkle" animation for the AI avatar.
 */
export function ChatMessage({ role, content }: ChatMessageProps) {
    const isAssistant = role === "assistant"

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"} py-4 group`}
        >
            <div className={`flex max-w-[90%] md:max-w-[85%] ${isAssistant ? "flex-row gap-5" : "flex-row-reverse"}`}>

                {/* Avatar for Assistant with Sparkle Animation */}
                {isAssistant && (
                    <div className="flex-shrink-0 w-8 h-8 mt-1 relative">
                        <motion.div
                            className="absolute -inset-1 bg-gradient-to-tr from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-md"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <div className="w-8 h-8 flex items-center justify-center rounded-full overflow-hidden relative z-10 bg-[#1e1f20] border border-white/5 shadow-inner">
                            <Image
                                src="/site-logo.png"
                                alt="AI"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <motion.div
                            className="absolute -top-1 -right-1 text-blue-400 z-20"
                            animate={{
                                scale: [0.8, 1.1, 0.8],
                                rotate: [0, 15, -15, 0]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            <Sparkles size={12} fill="currentColor" />
                        </motion.div>
                    </div>
                )}

                {/* Content Area */}
                <div className={`flex flex-col ${isAssistant ? "items-start pt-1" : "items-end"}`}>
                    <div className={`
                        relative w-full text-[#e3e3e3] text-[1.0625rem] font-normal leading-[1.75] tracking-[0.0125em]
                        ${isAssistant
                            ? "max-w-none"
                            : "bg-[#2a2b2d] px-5 py-3 rounded-[1.5rem] text-[#e3e3e3] shadow-sm"
                        }
                    `}>
                        <div className="font-sans selection:bg-blue-500/30 prose prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <div className="relative my-6 rounded-xl overflow-hidden border border-[#303134]">
                                                <div className="flex items-center justify-between px-4 py-2 bg-[#1e1f20] border-b border-[#303134]">
                                                    <span className="text-xs font-mono text-gray-400">{match[1]}</span>
                                                    <CopyButton text={String(children).replace(/\n$/, '')} />
                                                </div>
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{
                                                        margin: 0,
                                                        background: '#0b0c0d',
                                                        padding: '1.25rem',
                                                        fontSize: '0.9rem',
                                                    }}
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className={`${className} bg-white/5 px-1.5 py-0.5 rounded text-blue-300 font-mono text-[0.9em]`} {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                    a: ({ href, children }) => (
                                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                            {children}
                                        </a>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-white/10 pl-4 italic text-gray-400 my-4">
                                            {children}
                                        </blockquote>
                                    )
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

/**
 * Helper component for copying code to clipboard
 */
function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1"
                    >
                        <Check size={14} className="text-green-400" />
                        <span>Copied!</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="copy"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex items-center gap-1"
                    >
                        <Copy size={14} />
                        <span>Copy</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    )
}
