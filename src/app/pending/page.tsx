"use client";

import { motion } from "framer-motion";
import { Clock, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

export default function PendingPage() {
    const { data: session } = useSession();

    return (
        <div className="min-h-[100dvh] bg-black text-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/30 via-black to-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center space-y-8"
            >
                {/* Icon */}
                <div className="flex justify-center">
                    <div className="w-24 h-24 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-400">
                        <Clock size={40} strokeWidth={1.5} />
                    </div>
                </div>

                {/* Text */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold tracking-tight">승인 대기 중</h1>
                    <p className="text-zinc-400 leading-relaxed">
                        {session?.user?.name
                            ? <><span className="text-white font-medium">{session.user.name}</span>님, 가입 신청이 완료되었습니다.<br /></>
                            : "가입 신청이 완료되었습니다.\n"
                        }
                        관리자가 계정을 검토한 후 승인하면<br />
                        서비스를 이용하실 수 있습니다.
                    </p>
                </div>

                {/* Info box */}
                <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-3xl text-left space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest text-zinc-500">가입 정보</p>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                            <span className="text-zinc-500">이메일</span>
                            <span className="text-white font-mono text-xs">{session?.user?.email ?? "-"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">상태</span>
                            <span className="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-wider">승인 대기</span>
                        </div>
                    </div>
                </div>

                {/* Logout button */}
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-bold text-sm"
                >
                    <LogOut size={16} />
                    <span>로그아웃</span>
                </button>
            </motion.div>
        </div>
    );
}
