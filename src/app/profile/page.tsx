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
        { label: "성명", value: session.user?.name, icon: User },
        { label: "닉네임", value: (session.user as any)?.nickname, icon: Shield },
        { label: "이메일 주소", value: session.user?.email, icon: Mail },
        { label: "학년 / 반", value: (session.user as any)?.grade + "학년", icon: GraduationCap },
        { label: "계정 상태", value: "승인된 회원", icon: Shield, color: "text-green-400" },
    ]

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto space-y-12">
                {/* Header */}
                <div className="space-y-6">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors group">
                        <ChevronLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
                        홈으로 돌아가기
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">사용자 프로필</h1>
                    <p className="text-zinc-500">학생 계정 및 개인 정보를 관리하세요.</p>
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
                                    {item.value || "설정되지 않음"}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-white/5 space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">데이터 및 개인정보 보호</h3>
                        <div className="bg-zinc-950/50 rounded-2xl p-6 border border-white/5 space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                    <Clock size={20} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-white">채팅 기록 투명성</p>
                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                        귀하의 채팅 로그는 맞춤형 선교 지원을 위해 안전하게 저장됩니다. 
                                        교목실에 문의하여 데이터 요약을 요청할 수 있습니다.
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
