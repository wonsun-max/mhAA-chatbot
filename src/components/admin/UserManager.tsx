"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Check, X, Loader2, Search } from "lucide-react"

export function UserManager() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState("PENDING") // PENDING, APPROVED

    const fetchUsers = async () => {
        setLoading(true)
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

    useEffect(() => { fetchUsers() }, [])

    const handleApprove = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "POST" })
            if (res.ok) setUsers(users.filter(u => u.id !== id))
        } catch (err) { console.error(err) }
    }

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure? This will delete the user.")) return
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
            if (res.ok) setUsers(users.filter(u => u.id !== id))
        } catch (err) { console.error(err) }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">User Approvals</h2>
                    <p className="text-sm text-zinc-500">Manage pending registrations</p>
                </div>
                <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
                    <button
                        onClick={() => setFilter("PENDING")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === "PENDING" ? "bg-white/10 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter("APPROVED")}
                        disabled
                        className="px-4 py-1.5 rounded-lg text-xs font-bold text-zinc-700 cursor-not-allowed"
                    >
                        Active Users
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>
                ) : users.length === 0 ? (
                    <div className="bg-zinc-900/10 border border-white/5 rounded-3xl p-20 text-center opacity-30">
                        <User className="mx-auto mb-4" size={32} />
                        <p className="text-xs uppercase tracking-widest">No pending applications</p>
                    </div>
                ) : users.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-zinc-900/20 border border-white/5 rounded-2xl p-6 flex items-center justify-between group hover:border-white/10 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500">
                                <User size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold">{user.name} <span className="text-zinc-500 font-normal">@{user.nickname}</span></h3>
                                <p className="text-xs text-zinc-500 mb-1">{user.email}</p>
                                <span className="text-[10px] bg-white/5 border border-white/5 px-2 py-0.5 rounded-md uppercase font-bold text-zinc-400">G{user.grade}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
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
        </div>
    )
}
