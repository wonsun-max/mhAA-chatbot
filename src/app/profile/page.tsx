"use client"

import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Mail, GraduationCap, Shield,
    ChevronLeft, LogOut, MessageSquare,
    Calendar, CheckCircle2, AlertCircle,
    Activity, ArrowRight, Edit3, X
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserStats {
    totalChats: number
    memberSince: string
    status: string
    grade: string
}

export default function ProfilePage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<UserStats | null>(null)
    const [loadingStats, setLoadingStats] = useState(true)

    // Nickname Edit State
    const [isEditingNickname, setIsEditingNickname] = useState(false)
    const [newNickname, setNewNickname] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [updateError, setUpdateError] = useState<string | null>(null)

    const handleNicknameUpdate = async () => {
        if (!newNickname || newNickname.trim() === (session?.user as any)?.nickname) {
            setIsEditingNickname(false)
            return
        }

        setIsSaving(true)
        setUpdateError(null)

        try {
            const res = await fetch("/api/user/nickname", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname: newNickname.trim() })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "변경에 실패했습니다.")

            // Update session locally
            await update({ nickname: newNickname.trim() })
            setIsEditingNickname(false)
            setUpdateError(null)
        } catch (err: any) {
            setUpdateError(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/user/stats")
                .then(res => res.json())
                .then(data => {
                    setStats(data)
                    setLoadingStats(false)
                })
                .catch(() => setLoadingStats(false))
        }
    }, [status])

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
                    <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        )
    }

    if (!session) return null

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-5xl mx-auto px-6 pt-32 pb-24 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-12"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <motion.div variants={itemVariants}>
                                <Link
                                    href="/"
                                    className="inline-flex items-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors group"
                                >
                                    <ChevronLeft size={14} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                                    홈으로 돌아가기
                                </Link>
                            </motion.div>
                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl md:text-6xl font-black tracking-tight"
                            >
                                Student<span className="text-blue-500">.</span>
                            </motion.h1>
                            <motion.p variants={itemVariants} className="text-zinc-400 text-lg max-w-md">
                                플랫폼 개인 식별 및 활동 관리
                            </motion.p>
                        </div>

                        <motion.button
                            variants={itemVariants}
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="bg-zinc-900 border border-white/5 hover:bg-zinc-800 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all group active:scale-95"
                        >
                            <LogOut size={18} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
                            <span className="font-medium">로그아웃</span>
                        </motion.button>
                    </div>

                    {/* Dashboard Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Stats Section */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2 space-y-8"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <StatCard
                                    label="총 채팅 미션"
                                    value={loadingStats ? "..." : stats?.totalChats || 0}
                                    icon={MessageSquare}
                                    color="blue"
                                />
                                <StatCard
                                    label="현재 학년"
                                    value={(session.user as any)?.grade ? `${(session.user as any).grade}학년` : "미지정"}
                                    icon={GraduationCap}
                                    color="indigo"
                                />
                                <StatCard
                                    label="회원 상태"
                                    value={stats?.status === "APPROVED" ? "승인됨" : "대기 중"}
                                    icon={Shield}
                                    color={stats?.status === "APPROVED" ? "green" : "orange"}
                                />
                                <StatCard
                                    label="가입 일자"
                                    value={stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString() : "---"}
                                    icon={Calendar}
                                    color="zinc"
                                />
                            </div>

                            {/* Activity Section Placeholder or Alternative Content */}
                            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-zinc-950/20">
                                <div className="space-y-4 text-center py-6">
                                    <CheckCircle2 size={32} className="mx-auto text-blue-500/50 mb-4" />
                                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">학습 활동 정보</h3>
                                    <p className="text-xs text-zinc-500">미션 수행 기록과 활동 로그가 이곳에 표시됩니다.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Profile Info Section */}
                        <motion.div variants={itemVariants} className="space-y-8">
                            <div className="glass-panel p-8 rounded-[2rem] border border-white/5 bg-zinc-950/30 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 shadow-2xl shadow-blue-500/20 border border-white/10 p-2 bg-gradient-to-br from-white/5 to-white/10">
                                    <div className="relative w-full h-full">
                                        <Image
                                            src="/images/site-logo.png"
                                            alt="Student Profile"
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 mb-8">
                                    <h2 className="text-2xl font-bold">{session.user?.name}</h2>
                                    <div className="flex flex-col items-center space-y-2">
                                        {isEditingNickname ? (
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={newNickname}
                                                    onChange={(e) => setNewNickname(e.target.value)}
                                                    className="bg-black/50 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                    placeholder="새 닉네임"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={handleNicknameUpdate}
                                                    disabled={isSaving}
                                                    className="p-1.5 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    {isSaving ? <Activity size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => setIsEditingNickname(false)}
                                                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2 group">
                                                <p className="text-blue-400 text-sm font-semibold">
                                                    {(session.user as any)?.nickname}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setNewNickname((session.user as any)?.nickname || "")
                                                        setIsEditingNickname(true)
                                                    }}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded-md transition-all text-zinc-500 hover:text-white"
                                                >
                                                    <Edit3 size={14} />
                                                </button>
                                            </div>
                                        )}
                                        {updateError && (
                                            <p className="text-[10px] text-red-500 font-bold">{updateError}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full space-y-4 pt-8 border-t border-white/5">
                                    <InfoRow icon={Mail} label="이메일" value={session.user?.email || "이메일 없음"} />
                                    <InfoRow icon={Shield} label="계정 등급" value={(session.user as any)?.role || "사용자"} />
                                </div>

                                <Link
                                    href="/chatbot"
                                    className="w-full mt-10 bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center group transition-all hover:bg-zinc-200"
                                >
                                    챗봇 입장하기
                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="px-4 text-center">
                                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-bold">
                                    위더스 교육 보안 플랫폼
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: any, icon: any, color: string }) {
    const colors: Record<string, string> = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        indigo: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
        green: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        zinc: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
    }

    return (
        <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-zinc-950/20 flex flex-col justify-between group hover:border-white/10 transition-colors text-white">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 border ${colors[color]}`}>
                <Icon size={20} />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {label}
                </p>
                <h4 className="text-xl font-bold tracking-tight">{value}</h4>
            </div>
        </div>
    )
}

function InfoRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center space-x-3 w-full text-left">
            <div className="text-zinc-600">
                <Icon size={16} />
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 leading-tight">{label}</p>
                <p className="text-xs font-medium text-zinc-300 truncate">{value}</p>
            </div>
        </div>
    )
}
