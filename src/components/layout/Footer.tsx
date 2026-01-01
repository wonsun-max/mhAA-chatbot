"use client"

import { Bot, Mail, Github, Globe } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="relative bg-background border-t border-white/5 py-24 overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 overflow-hidden pointer-events-none">
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[50%] bg-indigo-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1 space-y-8">
                        <Link href="/" className="flex items-center space-x-4 group">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                <Bot className="text-white" size={24} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-black text-white leading-none tracking-tight uppercase">MHA</span>
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">AI Interface</span>
                            </div>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed font-medium">
                            Architecting the future of academic intelligence with secure, private, and localized AI assistance.
                        </p>
                    </div>

                    {/* Platform Links */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-1">Platform</h4>
                        <ul className="space-y-4">
                            <li><Link href="/chatbot" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">AI Uplink</Link></li>
                            <li><Link href="/signup" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Personnel Registry</Link></li>
                            <li><Link href="/login" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Security Login</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-1">Support</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Protocols</a></li>
                            <li><a href="#" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Privacy Charter</a></li>
                            <li><a href="#" className="text-sm font-bold text-gray-500 hover:text-white transition-colors">Master Agreement</a></li>
                        </ul>
                    </div>

                    {/* Connection Section */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pl-1">Terminal</h4>
                        <div className="flex space-x-5">
                            <a href="wonsunpro123444@gmail.com" className="p-3.5 bg-white/5 rounded-2xl border border-white/5 text-gray-500 hover:text-blue-500 hover:bg-white/10 hover:border-blue-500/30 transition-all">
                                <Mail size={22} />
                            </a>
                            <a href="https://mhawebsitess.vercel.app/" target="_blank" className="p-3.5 bg-white/5 rounded-2xl border border-white/5 text-gray-500 hover:text-blue-500 hover:bg-white/10 hover:border-blue-500/30 transition-all">
                                <Globe size={22} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
                        &copy; 2025 MissionLink Intelligence Unit • All Rights Reserved
                    </p>
                    <div className="flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-full border border-white/5 shadow-inner">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Uplink Status: Optimal</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
