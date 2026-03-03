"use client"

import { Bot, Mail, Globe } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

export function Footer() {
    const pathname = usePathname()
    if (pathname === "/chatbot") return null

    return (
        <footer className="relative bg-black/20 backdrop-blur-sm border-t border-white/5 py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                                <Bot className="text-blue-500 w-8 h-8 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">WITHUS</span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed font-medium max-w-xs">
                            현대 교육 환경을 위한 안전하고 프라이빗한 맞춤형 학술 지능 서비스입니다.
                        </p>
                    </div>

                    {/* Platform Links */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest">플랫폼</h4>
                        <ul className="space-y-3">
                            <li><Link href="/notices" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">공지사항</Link></li>
                            <li><Link href="/chatbot" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">AI 어시스턴트</Link></li>
                            <li><Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">로그인</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest">지원</h4>
                        <ul className="space-y-3">
                            <li><Link href="/privacy" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">개인정보처리방침</Link></li>
                            <li><Link href="/terms" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">이용약관</Link></li>
                            <li><Link href="https://forms.gle/dTZNPr29Gs8Sg1i49" target="_blank" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">버그 리포트</Link></li>
                            <li><Link href="https://forms.gle/ijQgKpGLvUexQ2tBA" target="_blank" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">아이디어 제출</Link></li>
                        </ul>
                    </div>

                    {/* Connection Section */}
                    <div className="space-y-6">
                        <h4 className="text-xs font-bold text-gray-200 uppercase tracking-widest">연결</h4>
                        <div className="flex space-x-4">
                            <a href="mailto:wonsunpro123444@gmail.com" className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium text-gray-500">
                        &copy; 2026 WITHUS Intelligence Unit. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">시스템 정상 운영 중</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
