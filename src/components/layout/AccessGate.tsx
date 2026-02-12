"use client"

import { motion } from "framer-motion"
import { Lock, ChevronRight, Globe, ShieldAlert } from "lucide-react"
import Link from "next/link"

interface AccessGateProps {
    title?: string
    description?: string
    loginUrl?: string
    externalUrl?: string
}

export function AccessGate({
    title = "접근 권한이 필요합니다",
    description = "이 섹션의 지능형 기능을 이용하시려면 로그인이 필요합니다.",
    loginUrl = "/login",
    externalUrl = "https://mhawebsitess.vercel.app/auth/signup"
}: AccessGateProps) {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/10 backdrop-blur-xl"
        >
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                className="relative max-w-lg w-full glass p-10 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl text-center space-y-8 overflow-hidden"
            >
                {/* Decorative Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full" />

                <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl border border-white/10 text-blue-400 shadow-inner">
                        <Lock size={32} />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {title}
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-[280px] mx-auto font-medium">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Link 
                            href={loginUrl}
                            className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                        >
                            로그인하여 시작하기
                            <ChevronRight size={18} />
                        </Link>
                        
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-white/5" />
                            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">or</span>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        <a 
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                        >
                            <Globe size={18} className="text-blue-400" />
                            공식 포털에서 계정 요청
                        </a>
                    </div>
                </div>

                {/* Bottom Badge */}
                <div className="relative z-10 pt-4 flex items-center justify-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                    <ShieldAlert size={12} className="text-blue-500/50" />
                    Secure Access Only
                </div>
            </motion.div>
        </motion.div>
    )
}
