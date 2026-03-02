"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Loader2, Check, X, User } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === "unauthenticated" || (session?.user as any)?.role !== "ADMIN") {
            router.push("/")
        } else if (status === "authenticated") {
            fetchPendingUsers()
        }
    }, [status, session, router])

    const fetchPendingUsers = async () => {
        try {
            const res = await fetch("/api/admin/users")
            const data = await res.json()
            setUsers(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "POST" })
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id))
            }
        } catch (err) {
            console.error(err)
        }
    }

    const handleReject = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
            if (res.ok) {
                setUsers(users.filter(u => u.id !== id))
            }
        } catch (err) {
            console.error(err)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black text-white p-8 pt-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Pending User Approvals</h1>

                {users.length === 0 ? (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
                        No pending users to approve.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {users.map((user) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                                        <User className="text-blue-500" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{user.name}</h3>
                                        <p className="text-sm text-zinc-400">{user.email}</p>
                                        <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider text-zinc-500">
                                            Grade: {user.grade}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleApprove(user.id)}
                                        className="p-3 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-xl transition-colors"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleReject(user.id)}
                                        className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
