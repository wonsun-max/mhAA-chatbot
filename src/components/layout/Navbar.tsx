"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Bot, User, LogOut, Shield, Menu, X, LayoutDashboard } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function Navbar() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Support both casings for admin role during session transition
    const userRole = (session?.user as any)?.role?.toUpperCase()
    const isAdmin = userRole === "ADMIN"

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "AI Assistant", href: "/chatbot" },
        ...(isAdmin ? [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }] : []),
    ]

    const displayName = (session?.user as any)?.koreanName || session?.user?.name || session?.user?.email

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${scrolled
                    ? "bg-black/80 backdrop-blur-2xl border-white/10 py-0 shadow-2xl shadow-black/50"
                    : "bg-transparent border-transparent py-2 px-2"
                }`}
        >
            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-500 ${scrolled ? "" : "glass-panel rounded-[2rem] border-white/5"
                }`}>
                <div className="flex justify-between h-20 items-center">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Bot className="text-white" size={28} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-white leading-none tracking-tight uppercase">MissionLink</span>
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-1">AI Interface</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[10px] font-black text-gray-400 hover:text-white transition-all uppercase tracking-widest flex items-center group"
                            >
                                {link.icon && <link.icon size={14} className="mr-2 group-hover:scale-110 transition-transform" />}
                                <span className="relative">
                                    {link.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full" />
                                </span>
                            </Link>
                        ))}

                        {session ? (
                            <div className="flex items-center space-x-6 pl-10 border-l border-white/10">
                                <div className="text-right flex flex-col items-end">
                                    <p className="text-xs font-black text-white tracking-tight">{displayName}</p>
                                    <div className="flex items-center space-x-2 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em] font-black">{userRole}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all duration-300"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login" className="text-[10px] font-black text-gray-400 hover:text-white px-6 py-3 transition-colors uppercase tracking-[0.2em]">
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-[10px] font-black text-white bg-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5 uppercase tracking-[0.2em]"
                                >
                                    Join Access
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center space-x-4">
                        {session && (
                            <div className="text-right mr-2">
                                <p className="text-[10px] font-black text-white tracking-tight">{displayName?.split(' ')[0]}</p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-3 rounded-2xl text-white bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Expanded Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="md:hidden border-t border-white/5 glass-panel overflow-hidden"
                    >
                        <div className="px-6 pt-4 pb-10 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center space-x-4 px-6 py-5 text-xs font-black text-gray-300 hover:bg-white/5 hover:text-white rounded-2xl transition-all uppercase tracking-widest"
                                >
                                    {link.icon && <link.icon size={18} />}
                                    <span>{link.name}</span>
                                </Link>
                            ))}
                            <div className="pt-6 mt-6 border-t border-white/5">
                                {session ? (
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center space-x-4 px-6 py-5 text-xs font-black text-red-400 hover:bg-red-400/5 rounded-2xl transition-all uppercase tracking-widest"
                                    >
                                        <LogOut size={18} />
                                        <span>Personnel Exit</span>
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link
                                            href="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center py-5 rounded-2xl border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                                        >
                                            Login
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center py-5 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Access
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
