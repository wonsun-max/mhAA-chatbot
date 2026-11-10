"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { User, Check, X, Loader2 } from "lucide-react"
import { formatGrade } from "@/lib/utils"

interface ManagedUser {
    id: string
    name: string | null
    nickname: string | null
    email: string
    role: string
    grade: string | null
    qtGroup: string | null
    status: string
}

/**
 * Admin UserManager component for approving pending users and viewing active users.
 */
export function UserManager() {
    const [users, setUsers] = useState<ManagedUser[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<"PENDING" | "APPROVED">("PENDING")

    const fetchUsers = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/users?status=${filter}`)
            if (res.ok) {
                const data = await res.json()
                setUsers(Array.isArray(data) ? data : [])
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }, [filter])

    useEffect(() => {
        fetchUsers()
    }, [fetchUsers])

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "POST" })
            if (res.ok) setUsers(prev => prev.filter(u => u.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const handleReject = async (id: string) => {
        if (!confirm("정말입니까? 사용자가 삭제됩니다.")) return
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
            if (res.ok) setUsers(prev => prev.filter(u => u.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">사용자 관리</h2>
                    <p className="text-sm text-zinc-500">대기 중인 가입 신청 및 활성 사용자 관리</p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setFilter("PENDING")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === "PENDING" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        대기 중
                    </button>
                    <button
                        onClick={() => setFilter("APPROVED")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === "APPROVED" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        활성 사용자
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>
                ) : users.length === 0 ? (
                    <div className="bg-zinc-900/10 border border-white/5 rounded-3xl p-20 text-center opacity-30">
                        <User className="mx-auto mb-4" size={32} />
                        <p className="text-xs uppercase tracking-widest">
                            {filter === "PENDING" ? "대기 중인 신청이 없습니다." : "등록된 활성 사용자가 없습니다."}
                        </p>
                    </div>
                ) : users.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold">{user.name || "이름 없음"} <span className="text-zinc-500 font-normal">@{user.nickname || "미지정"}</span></h3>
                                <p className="text-xs text-zinc-500 mb-1.5">{user.email}</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-md uppercase font-bold border ${
                                        user.role === "ADMIN"
                                            ? "bg-red-500/10 border-red-500/20 text-red-400"
                                            : user.role === "TEACHER"
                                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                            : "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                    }`}>
                                        {user.role === "ADMIN" ? "관리자" : user.role === "TEACHER" ? "선생님" : "학생"}
                                    </span>
                                    {user.role === "STUDENT" && user.grade && (
                                        <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-bold text-zinc-400">
                                            {formatGrade(user.grade)}
                                        </span>
                                    )}
                                    {user.role === "STUDENT" && user.qtGroup && (
                                        <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md font-bold text-zinc-400">
                                            QT {user.qtGroup}조
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            {filter === "PENDING" && (
                                <button
                                    onClick={() => handleApprove(user.id)}
                                    className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-xl transition-colors"
                                    title="승인"
                                >
                                    <Check size={20} />
                                </button>
                            )}
                            {user.role !== "ADMIN" && (
                                <button
                                    onClick={() => handleReject(user.id)}
                                    className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors"
                                    title="삭제"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
