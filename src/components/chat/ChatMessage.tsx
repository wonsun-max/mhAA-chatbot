"use client"

import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react"
import { Copy, Check } from "lucide-react"
import Image from "next/image"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { motion, AnimatePresence } from "framer-motion"

interface ChatMessageProps {
    role: "user" | "assistant"
    content: string
}

type MarkdownCodeProps = ComponentPropsWithoutRef<"code"> & {
    children?: ReactNode
    className?: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isAssistant = role === "assistant"
    const markdownComponents: Components = {
        code({ className, children, ...props }: MarkdownCodeProps) {
            const match = /language-(\w+)/.exec(className || "");

            return match ? (
                <div className="relative my-6 rounded-xl overflow-hidden border border-zinc-800">
                    <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
                        <span className="text-xs font-mono text-zinc-500">{match[1]}</span>
                        <CopyButton text={String(children).replace(/\n$/, "")} />
                    </div>
                    <SyntaxHighlighter
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        style={vscDarkPlus as any}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                            margin: 0,
                            background: "#050505",
                            padding: "1.25rem",
                            fontSize: "0.875rem",
                        }}
                        {...props}
                    >
                        {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <code className={`${className} bg-zinc-800/50 px-1.5 py-0.5 rounded text-blue-400 font-mono text-[0.9em]`} {...props}>
                    {children}
                </code>
            );
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
            <blockquote className="border-l-4 border-zinc-800 pl-4 italic text-zinc-500 my-4">
                {children}
            </blockquote>
        ),
        table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-zinc-800/50">
                <table className="w-full border-collapse text-sm text-left">
                    {children}
                </table>
            </div>
        ),
        thead: ({ children }) => (
            <thead className="bg-zinc-900/80 border-b border-zinc-800">
                {children}
            </thead>
        ),
        th: ({ children }) => (
            <th className="px-4 py-2.5 font-semibold text-zinc-100 border-x border-zinc-800/30 first:border-l-0 last:border-r-0">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="px-4 py-2 text-zinc-300 border-x border-zinc-800/30 first:border-l-0 last:border-r-0">
                {children}
            </td>
        ),
        tr: ({ children }) => (
            <tr className="border-b border-zinc-800 last:border-0 even:bg-zinc-900/40 hover:bg-zinc-800/30 transition-colors">
                {children}
            </tr>
        ),
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${isAssistant ? "justify-start" : "justify-end"} py-6 group`}
        >
            <div className={`flex max-w-[90%] md:max-w-[80%] ${isAssistant ? "flex-row gap-4" : "flex-row-reverse"}`}>

                {/* Simplified Assistant Avatar */}
                {isAssistant && (
                    <div className="flex-shrink-0 w-8 h-8 mt-1">
                        <div className="w-8 h-8 flex items-center justify-center rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 shadow-sm relative">
                            <Image
                                src="/images/site-logo.png"
                                alt="AI"
                                fill
                                className="object-contain p-1.5 grayscale"
                            />
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className={`flex flex-col ${isAssistant ? "items-start pt-1" : "items-end"}`}>
                    <div className={`
                        relative w-full text-zinc-200 text-base font-normal leading-relaxed
                        ${isAssistant
                            ? "max-w-none"
                            : "bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl shadow-sm"
                        }
                    `}>
                        <div className="font-sans selection:bg-blue-500/30 prose prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
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
                        <span>복사됨!</span>
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
                        <span>복사</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    )
}
