"use client"

import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Mail, GraduationCap, Shield,
    ChevronLeft, LogOut, MessageSquare,
    Calendar, CheckCircle2, AlertCircle,
    Activity, ArrowRight, Edit3, X,
    Settings, UserCircle, Hash
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface UserStats {
    memberSince: string
    status: string
}

export default function ProfilePage() {
    const { data: session, status, update } = useSession()
    const router = useRouter()
    const [stats, setStats] = useState<UserStats | null>(null)
    const [loadingStats, setLoadingStats] = useState(true)

    // Profile Edit State
    const [isEditingNickname, setIsEditingNickname] = useState(false)
    const [newNickname, setNewNickname] = useState("")
    const [isEditingQtGroup, setIsEditingQtGroup] = useState(false)
    const [newQtGroup, setNewQtGroup] = useState("")
    const [isEditingGrade, setIsEditingGrade] = useState(false)
    const [newGrade, setNewGrade] = useState("")
    
    const [isSaving, setIsSaving] = useState(false)
    const [updateError, setUpdateError] = useState<string | null>(null)

    const qtGroups = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const grades = ["7", "8", "9", "10", "11", "12-1", "12-2"];

    const handleUpdate = async (fields: { nickname?: string, qtGroup?: string, grade?: string }) => {
        setIsSaving(true)
        setUpdateError(null)

        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fields)
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || "변경에 실패했습니다.")

            // Update session locally
            await update(fields)
            
            if (fields.nickname) setIsEditingNickname(false)
            if (fields.qtGroup) setIsEditingQtGroup(false)
            if (fields.grade) setIsEditingGrade(false)
            
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

            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
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
                                Profile<span className="text-blue-500">.</span>
                            </motion.h1>
                            <motion.p variants={itemVariants} className="text-zinc-400 text-lg">
                                나의 정보와 계정 설정을 관리합니다
                            </motion.p>
                        </div>

                        <motion.button
                            variants={itemVariants}
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-2xl flex items-center space-x-2 transition-all group active:scale-95 backdrop-blur-md"
                        >
                            <LogOut size={18} className="text-zinc-400 group-hover:text-red-400 transition-colors" />
                            <span className="font-medium text-sm">로그아웃</span>
                        </motion.button>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        {/* Main Account Section */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-zinc-950/30 backdrop-blur-2xl">
                                <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                                    {/* Avatar Column */}
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl shadow-blue-500/10 border-2 border-white/10 p-3 bg-gradient-to-br from-white/5 to-white/10 relative group">
                                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src="/images/site-logo.png"
                                                    alt="Student Profile"
                                                    fill
                                                    className="object-contain p-1"
                                                />
                                            </div>
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                                            {(session.user as any)?.role || "STUDENT"}
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="flex-1 w-full space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                            
                                            {/* Nickname Field */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <UserCircle size={12} /> 닉네임
                                                </label>
                                                <AnimatePresence mode="wait">
                                                    {isEditingNickname ? (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="text"
                                                                value={newNickname}
                                                                onChange={(e) => setNewNickname(e.target.value)}
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all"
                                                                autoFocus
                                                            />
                                                            <button 
                                                                onClick={() => handleUpdate({ nickname: newNickname })}
                                                                className="p-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
                                                            >
                                                                <CheckCircle2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => setIsEditingNickname(false)}
                                                                className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="flex items-center justify-between group h-[38px]"
                                                        >
                                                            <span className="text-xl font-bold tracking-tight">
                                                                {(session.user as any)?.nickname || "미지정"}
                                                            </span>
                                                            <button 
                                                                onClick={() => {
                                                                    setNewNickname((session.user as any)?.nickname || "")
                                                                    setIsEditingNickname(true)
                                                                }}
                                                                className="p-2 opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-zinc-400 hover:text-white"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Grade Field */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <GraduationCap size={12} /> 학년/반
                                                </label>
                                                <AnimatePresence mode="wait">
                                                    {isEditingGrade ? (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <select
                                                                value={newGrade}
                                                                onChange={(e) => setNewGrade(e.target.value)}
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none transition-all"
                                                            >
                                                                <option value="" className="bg-zinc-900">학년 선택</option>
                                                                {grades.map(g => (
                                                                    <option key={g} value={g} className="bg-zinc-900">{g}학년</option>
                                                                ))}
                                                            </select>
                                                            <button 
                                                                onClick={() => handleUpdate({ grade: newGrade })}
                                                                className="p-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
                                                            >
                                                                <CheckCircle2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => setIsEditingGrade(false)}
                                                                className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="flex items-center justify-between group h-[38px]"
                                                        >
                                                            <span className="text-xl font-bold tracking-tight">
                                                                {(session.user as any)?.grade ? `${(session.user as any).grade}학년` : "미지정"}
                                                            </span>
                                                            <button 
                                                                onClick={() => {
                                                                    setNewGrade((session.user as any)?.grade || "")
                                                                    setIsEditingGrade(true)
                                                                }}
                                                                className="p-2 opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-zinc-400 hover:text-white"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* QT Group Field */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Hash size={12} /> QT조
                                                </label>
                                                <AnimatePresence mode="wait">
                                                    {isEditingQtGroup ? (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0, y: -5 }}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <select
                                                                value={newQtGroup}
                                                                onChange={(e) => setNewQtGroup(e.target.value)}
                                                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 appearance-none transition-all"
                                                            >
                                                                <option value="" className="bg-zinc-900">조 선택</option>
                                                                {qtGroups.map(g => (
                                                                    <option key={g} value={g} className="bg-zinc-900">{g}조</option>
                                                                ))}
                                                            </select>
                                                            <button 
                                                                onClick={() => handleUpdate({ qtGroup: newQtGroup })}
                                                                className="p-2 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors"
                                                            >
                                                                <CheckCircle2 size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => setIsEditingQtGroup(false)}
                                                                className="p-2 bg-zinc-800 rounded-xl hover:bg-zinc-700 transition-colors"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </motion.div>
                                                    ) : (
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            className="flex items-center justify-between group h-[38px]"
                                                        >
                                                            <span className="text-xl font-bold tracking-tight">
                                                                {(session.user as any)?.qtGroup ? `${(session.user as any).qtGroup}조` : "미지정"}
                                                            </span>
                                                            <button 
                                                                onClick={() => {
                                                                    setNewQtGroup((session.user as any)?.qtGroup || "")
                                                                    setIsEditingQtGroup(true)
                                                                }}
                                                                className="p-2 opacity-0 group-hover:opacity-100 bg-white/5 hover:bg-white/10 rounded-lg transition-all text-zinc-400 hover:text-white"
                                                            >
                                                                <Edit3 size={14} />
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Static Info: Email */}
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Mail size={12} /> 이메일 주소
                                                </label>
                                                <div className="h-[38px] flex items-center">
                                                    <span className="text-sm font-medium text-zinc-300">
                                                        {session.user?.email}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        {updateError && (
                                            <motion.div 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="flex items-center gap-2 text-red-400 text-xs font-semibold bg-red-400/5 p-3 rounded-xl border border-red-400/10"
                                            >
                                                <AlertCircle size={14} />
                                                {updateError}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Actions / Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-zinc-950/20 flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-500 border border-white/5">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">가입 일자</p>
                                        <p className="text-sm font-bold text-zinc-300">
                                            {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric' }) : "---"}
                                        </p>
                                    </div>
                                </div>
                                <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-zinc-950/20 flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white/5 ${stats?.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" : "bg-orange-500/10 text-orange-500"}`}>
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">계정 상태</p>
                                        <p className="text-sm font-bold text-zinc-300">
                                            {stats?.status === "APPROVED" ? "활동 가능" : "승인 대기 중"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Quick Access Footer */}
                    <motion.div variants={itemVariants} className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black">
                            WITHUS Education Platform
                        </p>
                        <div className="flex gap-4">
                            <Link href="/community" className="text-xs text-zinc-500 hover:text-white transition-colors">커뮤니티</Link>
                            <Link href="/collab" className="text-xs text-zinc-500 hover:text-white transition-colors">콜라보</Link>
                            <Link href="/chatbot" className="text-xs text-zinc-500 hover:text-white transition-colors">챗봇</Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
