"use client"

import { motion } from "framer-motion"
import { Users, Bell, LayoutDashboard, LogOut, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"

interface SidebarItemProps {
    icon: any
    label: string
    active: boolean
    onClick: () => void
}

function SidebarItem({ icon: Icon, label, active, onClick }: SidebarItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                active
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
        >
            <Icon size={18} className={cn("transition-transform duration-300", active && "scale-110")} />
            <span className="text-sm font-medium tracking-tight">{label}</span>
            {active && (
                <motion.div
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500"
                />
            )}
        </button>
    )
}

export function AdminLayout({
    children,
    activeTab,
    setActiveTab
}: {
    children: React.ReactNode
    activeTab: string
    setActiveTab: (tab: string) => void
}) {
    return (
        <div className="flex min-h-screen bg-black text-white selection:bg-blue-500/30">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-white/5 bg-zinc-900/10 backdrop-blur-xl z-50 p-6 flex flex-col">
                <div className="mb-12 px-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-500">
                            <span className="text-black font-black text-xs">W</span>
                        </div>
                        <span className="text-lg font-bold tracking-tighter">WITHUS <span className="text-[10px] text-blue-500 align-top opacity-50 ml-0.5">ADMIN</span></span>
                    </Link>
                </div>

                <nav className="flex-1 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="개요"
                        active={activeTab === "overview"}
                        onClick={() => setActiveTab("overview")}
                    />
                    <SidebarItem
                        icon={Users}
                        label="사용자"
                        active={activeTab === "users"}
                        onClick={() => setActiveTab("users")}
                    />
                    <SidebarItem
                        icon={Bell}
                        label="공지사항"
                        active={activeTab === "notices"}
                        onClick={() => setActiveTab("notices")}
                    />
                    <SidebarItem
                        icon={LayoutDashboard} // Reuse icon or choose another, e.g., Calendar/School
                        label="콜라보"
                        active={activeTab === "collab"}
                        onClick={() => setActiveTab("collab")}
                    />
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
                    <Link
                        href="/"
                        className="w-full flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-xl transition-all"
                    >
                        <ChevronLeft size={18} />
                        <span className="text-sm font-medium">관리자 나가기</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-12">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
