import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { AccessToggle } from "./AccessToggle"
import { ApprovalActions } from "./ApprovalActions"
import { UserCheck, Users, Clock, ShieldAlert, GraduationCap, School, Users as ParentIcon, UserPlus } from "lucide-react"

interface DashboardUser {
    id: string
    name: string | null
    koreanName: string | null
    email: string
    username: string
    role: string
    status: string
    aiEnabled: boolean
    emailVerified: boolean
    grade: number | null
    gender: string | null
    studentName: string | null
    createdAt: Date
}

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)

    if ((session?.user as any)?.role !== "ADMIN") {
        // Check both "admin" and "ADMIN" just in case of casing mismatch during migration
        if ((session?.user as any)?.role?.toUpperCase() !== "ADMIN") {
            redirect("/")
        }
    }

    const allUsers: DashboardUser[] = await prisma.user.findMany({
        orderBy: { createdAt: "desc" }
    }) as any

    const pendingUsers = allUsers.filter((u) => u.status === "PENDING")
    const activeUsers = allUsers.filter((u) => u.status === "ACTIVE")

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "STUDENT": return <GraduationCap size={14} className="mr-2" />
            case "TEACHER": return <School size={14} className="mr-2" />
            case "PARENT": return <ParentIcon size={14} className="mr-2" />
            default: return <ShieldAlert size={14} className="mr-2" />
        }
    }

    return (
        <main className="min-h-screen relative overflow-hidden bg-background py-32 px-4 md:px-8">
            <div className="aurora-glow opacity-50" />

            <div className="max-w-7xl mx-auto space-y-16 relative">
                {/* Header Section */}
                <div className="glass-panel p-10 rounded-[3rem] shadow-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] group-hover:bg-blue-600/10 transition-colors" />

                    <div className="space-y-4 relative">
                        <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Mission Control</h1>
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em] flex items-center">
                            <ShieldAlert className="mr-3" size={16} />
                            Strategic Personnel Allocation
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-6 w-full md:w-auto relative">
                        {[
                            { label: "Total Nodes", value: allUsers.length, color: "blue" },
                            { label: "Pending Auth", value: pendingUsers.length, color: "amber" },
                            { label: "Active Uplink", value: activeUsers.length, color: "green" },
                        ].map((stat, i) => (
                            <div key={i} className={`bg-white/5 px-8 py-5 rounded-3xl border border-white/5 text-center min-w-[120px] shadow-lg`}>
                                <div className={`text-3xl font-black text-${stat.color}-500 tracking-tighter`}>{stat.value}</div>
                                <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Approvals Section */}
                {pendingUsers.length > 0 && (
                    <section className="space-y-8">
                        <div className="flex items-center space-x-4 pl-4 text-amber-500">
                            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                <Clock size={20} className="animate-pulse" />
                            </div>
                            <h2 className="text-2xl font-black tracking-tight uppercase">Access Required</h2>
                            <span className="bg-amber-500/20 text-amber-500 px-4 py-1.5 rounded-full text-xs font-black border border-amber-500/20">{pendingUsers.length}</span>
                        </div>

                        <div className="glass-panel rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 border-b border-white/5">
                                        <tr>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">Protocol</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Credentials</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Classification</th>
                                            <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Timestamp</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {pendingUsers.map((user) => (
                                            <tr key={user.id} className="group hover:bg-amber-500/5 transition-colors">
                                                <td className="px-10 py-8">
                                                    <ApprovalActions userId={user.id} />
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="text-sm font-black text-white">{user.name} / {user.koreanName}</div>
                                                    <div className="text-xs text-blue-500 font-black uppercase tracking-widest mt-1">@{user.username}</div>
                                                    <div className="text-[10px] text-gray-500 font-medium uppercase mt-2">{user.email}</div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col space-y-2">
                                                        <span className="inline-flex items-center text-[10px] font-black text-white uppercase tracking-widest">
                                                            <div className="p-1 px-2.5 bg-white/5 rounded-lg mr-2 border border-white/10">
                                                                {getRoleIcon(user.role)}
                                                                {user.role}
                                                            </div>
                                                        </span>
                                                        {user.role === "STUDENT" && <span className="text-[10px] font-black text-blue-500 uppercase ml-2 tracking-widest leading-none">Status: Grade {user.grade}</span>}
                                                        {user.role === "PARENT" && <span className="text-[10px] font-black text-purple-500 uppercase ml-2 tracking-widest leading-none">Link: {user.studentName}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                                    {user.createdAt.toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                )}

                {/* Active Registry Section */}
                <section className="space-y-8 pb-32">
                    <div className="flex items-center space-x-4 pl-4 text-blue-500">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Users size={20} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight uppercase">Tactical Registry</h2>
                    </div>

                    <div className="glass-panel rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5">
                                    <tr>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Identity Node</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Access Role</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] text-center">AI Uplink</th>
                                        <th className="px-10 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Authorization</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {activeUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-10 py-8">
                                                <div className="text-sm font-black text-white">{user.name} <span className="text-gray-600 font-medium">/</span> {user.koreanName}</div>
                                                <div className="text-xs text-blue-500 font-black uppercase tracking-widest mt-1">@{user.username}</div>
                                                <div className="text-[10px] text-gray-500 font-medium uppercase mt-2">{user.email}</div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="inline-flex items-center px-5 py-2 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                                    {getRoleIcon(user.role)}
                                                    {user.role}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center text-white">
                                                <div className="inline-block transform hover:scale-110 transition-transform">
                                                    <AccessToggle userId={user.id} initialValue={user.aiEnabled} />
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className={`w-12 h-12 rounded-2xl inline-flex items-center justify-center border ${user.emailVerified ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-white/5 text-gray-700 border-white/5'}`}>
                                                    {user.emailVerified ? <UserCheck size={24} /> : <UserPlus size={24} />}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
