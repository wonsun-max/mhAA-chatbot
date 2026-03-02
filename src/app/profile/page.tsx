"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { User, Mail, GraduationCap, Shield, Calendar, Clock, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!session) return null

    const userData = [
        { label: "Full Name", value: session.user?.name, icon: User },
        { label: "Nickname", value: (session.user as any)?.nickname, icon: Shield },
        { label: "Email Address", value: session.user?.email, icon: Mail },
        { label: "Grade / Class", value: (session.user as any)?.grade + " Grade", icon: GraduationCap },
        { label: "Account Status", value: "Approved Member", icon: Shield, color: "text-green-400" },
    ]

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-6">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors group">
                        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-zinc-500">Manage your student account and personal information.</p>
                </div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-8 md:p-10 rounded-[2.5rem] border border-white/5 space-y-10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {userData.map((item, idx) => (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center space-x-2 text-zinc-500">
                                    <item.icon size={14} />
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
                                </div>
                                <div className={`text-lg font-medium ${item.color || "text-white"}`}>
                                    {item.value || "Not set"}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Data & Privacy</h3>
                        <div className="bg-zinc-950/50 rounded-2xl p-6 border border-white/5 space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    <Clock size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">Chat History Transparency</p>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        Your chat logs are stored securely to provide personalized mission support.
                                        You can request a summary of your data by contacting the chaplaincy department.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
