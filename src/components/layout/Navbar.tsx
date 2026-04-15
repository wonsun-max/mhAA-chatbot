"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { LogOut, Menu, X, LayoutDashboard, Globe } from "lucide-react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    if (pathname.startsWith("/admin")) return null

    const currentUser = session?.user
    const displayName = currentUser?.nickname || currentUser?.name || currentUser?.email

    const navLinks = [
        { name: "홈", href: "/" },
        { name: "콜라보", href: "/collab" },
        { name: "공지사항", href: "/notices" },
        { name: "커뮤니티", href: "/community" },
        { name: "AI 어시스턴트", href: "/chatbot" },
    ] as const

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                ? "bg-black/20 backdrop-blur-2xl border-b border-white/10 py-2 shadow-2xl"
                : "bg-transparent py-6"
                }`}
        >
            <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center h-16 relative">
                    {/* Left Navigation (Desktop) */}
                    <div className="hidden lg:flex items-center space-x-10 flex-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[13px] font-medium text-white/60 hover:text-white transition-all duration-300 tracking-[0.1em] uppercase relative group"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
                            </Link>
                        ))}
                    </div>

                    {/* Centered Logo Section */}
                    <div className="lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 flex justify-center items-center">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <motion.div
                                className="flex flex-row items-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            >
                                <div className="flex flex-col items-center">
                                    <span className="text-xl md:text-2xl font-light text-white leading-none tracking-[0.3em] uppercase group-hover:text-white/90 april-fools-logo">
                                        WITHUS
                                    </span>
                                    <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/40 to-transparent mt-1" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Right Utilities & Session */}
                    <div className="flex items-center justify-end space-x-4 md:space-x-8 flex-1">
                        {/* Search/Global Icons placeholder to match the reference look */}
                        <div className="hidden lg:flex items-center space-x-6 text-white/40 border-r border-white/10 pr-8 mr-2">
                            <Globe size={18} className="hover:text-white cursor-pointer transition-colors" />
                        </div>

                        {session ? (
                            <div className="hidden lg:flex items-center space-x-6">
                                {session.user && (session.user as { role?: string }).role === "ADMIN" && (
                                    <Link
                                        href="/admin"
                                        className="p-2 text-white/40 hover:text-white transition-colors"
                                        title="대시보드"
                                    >
                                        <LayoutDashboard size={18} />
                                    </Link>
                                )}
                                {session.user && (session.user as { role?: string }).role === "ADMIN" && (
                                    <div className="h-4 w-[1px] bg-white/10" />
                                )}
                                <div className="flex items-center space-x-3 group cursor-pointer">
                                    <Link href="/profile" className="text-right">
                                        <p className="text-[12px] font-medium text-white/80 group-hover:text-white transition-colors">{displayName}</p>
                                    </Link>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="p-2 text-white/40 hover:text-red-400 transition-colors"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <div className="hidden lg:flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-[13px] font-medium text-white/70 hover:text-white transition-all duration-300 tracking-[0.1em] uppercase py-2 px-4 rounded-full border border-white/10 hover:border-white/30 backdrop-blur-sm"
                                >
                                    로그인
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <div className="lg:hidden flex items-center">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Expanded Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-white/5 bg-black/98 backdrop-blur-2xl overflow-hidden"
                    >
                        <div className="px-8 pt-8 pb-12 space-y-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block text-lg font-light tracking-[0.2em] text-white/60 hover:text-white transition-all"
                                >
                                    {link.name.toUpperCase()}
                                </Link>
                            ))}
                            <div className="pt-8 border-t border-white/5 space-y-6">
                                {session ? (
                                    <>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between">
                                                <Link 
                                                    href="/profile" 
                                                    onClick={() => setIsOpen(false)}
                                                    className="text-white/80 text-sm tracking-wider uppercase hover:text-white transition-colors flex items-center gap-2"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                                                        {displayName?.charAt(0)}
                                                    </div>
                                                    내 프로필
                                                </Link>
                                                {session.user?.role === "ADMIN" && (
                                                    <Link href="/admin" onClick={() => setIsOpen(false)}>
                                                        <LayoutDashboard size={20} className="text-white/60 hover:text-white" />
                                                    </Link>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setIsOpen(false)
                                                    signOut()
                                                }}
                                                className="w-full py-4 rounded-xl bg-white/5 text-sm font-medium text-red-400 hover:bg-red-400/10 transition-all uppercase tracking-widest"
                                            >
                                                로그아웃
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full py-4 text-center rounded-xl bg-white/5 text-[13px] font-medium text-white/80 hover:bg-white/10 transition-all uppercase tracking-[0.2em]"
                                    >
                                        로그인
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
