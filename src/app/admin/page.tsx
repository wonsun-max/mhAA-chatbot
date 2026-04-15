"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Users, Bell, ShieldCheck, type LucideIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/AdminLayout"
import { UserManager } from "@/components/admin/UserManager"
import { NoticeManager } from "@/components/admin/NoticeManager"
import { CollabManager } from "@/components/admin/CollabManager"

interface Stats {
    totalUsers: number
    pendingUsers: number
    totalNotices: number
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: LucideIcon, color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 rounded-[32px] bg-zinc-900/10 border border-white/5 hover:border-white/10 transition-all relative overflow-hidden group"
        >
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all ${color}`}>
                <Icon size={120} />
            </div>
            <div className="relative z-10 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/5 ${color}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h3 className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">{label}</h3>
                    <p className="text-4xl font-light tracking-tighter mt-1">{value}</p>
                </div>
            </div>
        </motion.div>
    )
}

function Overview({ stats }: { stats: Stats | null }) {
    if (!stats) return null;

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">시스템 개요</h2>
                <p className="text-sm text-zinc-500">실시간 지표 및 플랫폼 상태</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="전체 커뮤니티" value={stats.totalUsers} icon={Users} color="text-blue-500" />
                <StatCard label="승인 대기 중" value={stats.pendingUsers} icon={ShieldCheck} color="text-amber-500" />
                <StatCard label="미션 업데이트" value={stats.totalNotices} icon={Bell} color="text-purple-500" />
            </div>

            <div className="p-12 rounded-[40px] border border-white/5 bg-zinc-900/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-light tracking-tight italic">&ldquo;이스라엘아 들으라 우리 하나님 여호와는 오직 유일한 여호와이시니 너는 마음을 다하고 뜻을 다하고 힘을 다하여 네 하나님 여호와를 사랑하라.&rdquo;</h3>
                        <p className="text-xs text-white/20 uppercase tracking-[0.4em] font-bold">신명기 6:4-5</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function AdminDashboardPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("overview")
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === "unauthenticated" || session?.user?.role !== "ADMIN") {
            router.push("/")
        } else if (status === "authenticated") {
            fetchStats()
        }
    }, [status, session, router])

    const fetchStats = async () => {
        try {
            const res = await fetch("/api/admin/stats")
            const data = await res.json()
            if (data.stats) setStats(data.stats)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-30">관리 센터 초기화 중</p>
            </div>
        )
    }

    return (
        <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === "overview" && <Overview stats={stats} />}
            {activeTab === "users" && <UserManager />}
            {activeTab === "notices" && <NoticeManager />}
            {activeTab === "collab" && <CollabManager />}
        </AdminLayout>
    )
}
