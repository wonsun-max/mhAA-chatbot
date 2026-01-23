"use client"

import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { Bot, LogOut, Menu, X, LayoutDashboard, Globe } from "lucide-react"
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
        { name: "Official Site", href: "https://mhawebsitess.vercel.app/", external: true, icon: Globe },
        ...(isAdmin ? [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }] : []),
    ]

    const displayName = (session?.user as any)?.koreanName || session?.user?.name || session?.user?.email

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-black/40 backdrop-blur-md border-b border-white/5 py-2 shadow-lg"
                : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            <Image
                                src="/site-logo.png"
                                alt="MHA Logo"
                                fill
                                className="object-contain drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                priority
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white leading-none tracking-tight">MissionLink</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center"
                            >
                                {link.icon && <link.icon size={16} className="mr-2" />}
                                {link.name}
                            </Link>
                        ))}

                        {session ? (
                            <div className="flex items-center space-x-6 pl-8 border-l border-white/10 ml-8">
                                <div className="text-right flex flex-col items-end">
                                    <p className="text-sm font-bold text-white">{displayName}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">{userRole}</p>
                                </div>
                                <button
                                    onClick={() => signOut()}
                                    className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4 ml-4">
                                <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-white transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="text-sm font-bold text-white bg-blue-600 px-5 py-2.5 rounded-lg hover:bg-blue-500 transition-colors"
                                >
                                    Get Access
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Controls */}
                    <div className="md:hidden flex items-center space-x-4">
                        {session && (
                            <div className="text-right mr-2">
                                <p className="text-xs font-bold text-white tracking-tight">{displayName?.split(' ')[0]}</p>
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-white hover:bg-white/5 transition-colors"
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
