"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogOut, RefreshCw, CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/**
 * Pending Approval Screen
 * Features:
 * - Real-time auto-polling every 4 seconds for database approval status
 * - Instant tab focus/visibility synchronization
 * - Manual one-click status refresh with animated feedback
 * - Automatic JWT session refresh via update() upon approval
 * - Seamless animated auto-redirect to homepage upon approval
 */
export default function PendingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();

    const [isChecking, setIsChecking] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    /**
     * Queries /api/user/status to check if the user has been approved in DB.
     * If approved, updates NextAuth session JWT and redirects to home.
     */
    const checkApprovalStatus = useCallback(async (isManual = false) => {
        if (isChecking || isApproved) return;

        if (isManual) setIsChecking(true);
        try {
            const res = await fetch("/api/user/status", { cache: "no-store" });
            if (!res.ok) {
                if (isManual) setStatusMessage("확인 중 오류가 발생했습니다.");
                return;
            }

            const data = await res.json();

            if (data.isApproved || data.user?.status === "APPROVED") {
                setIsApproved(true);
                setStatusMessage("승인이 완료되었습니다! 서비스로 이동합니다 🚀");

                // Sync the client & JWT cookie session with the new APPROVED status
                await update({ status: "APPROVED" });

                // Smooth redirect to main hub
                setTimeout(() => {
                    window.location.href = "/";
                }, 1200);
            } else {
                if (isManual) {
                    setStatusMessage("아직 관리자 승인 대기 중입니다.");
                    setTimeout(() => setStatusMessage(null), 3000);
                }
            }
        } catch (error) {
            console.error("[Pending Check Error]:", error);
            if (isManual) {
                setStatusMessage("네트워크 연결을 확인해 주세요.");
                setTimeout(() => setStatusMessage(null), 3000);
            }
        } finally {
            if (isManual) setIsChecking(false);
        }
    }, [isChecking, isApproved, update]);

    // Initial check on mount: If token or DB is already approved, escape immediately
    useEffect(() => {
        if (session?.user?.status === "APPROVED") {
            router.replace("/");
            return;
        }
        checkApprovalStatus(false);
    }, [session?.user?.status, checkApprovalStatus, router]);

    // Polling interval: Check every 4 seconds when page is visible
    useEffect(() => {
        if (isApproved) return;

        const interval = setInterval(() => {
            if (typeof document !== "undefined" && document.visibilityState === "visible") {
                checkApprovalStatus(false);
            }
        }, 4000);

        const handleVisibilityOrFocus = () => {
            if (typeof document !== "undefined" && document.visibilityState === "visible") {
                checkApprovalStatus(false);
            }
        };

        window.addEventListener("focus", handleVisibilityOrFocus);
        document.addEventListener("visibilitychange", handleVisibilityOrFocus);

        return () => {
            clearInterval(interval);
            window.removeEventListener("focus", handleVisibilityOrFocus);
            document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
        };
    }, [isApproved, checkApprovalStatus]);

    return (
        <div className="min-h-[100dvh] bg-black text-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-black to-black relative overflow-hidden">
            {/* Background glowing ambiance */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full blur-[140px] pointer-events-none transition-all duration-1000 ${
                isApproved ? "bg-emerald-500/20" : "bg-amber-500/10"
            }`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md text-center space-y-8 relative z-10"
            >
                {/* Status Animated Icon */}
                <div className="flex justify-center">
                    <motion.div
                        animate={isApproved ? { scale: [1, 1.15, 1], rotate: [0, 5, 0] } : {}}
                        transition={{ duration: 0.6 }}
                        className={`w-24 h-24 rounded-3xl flex items-center justify-center border transition-all duration-700 shadow-2xl ${
                            isApproved
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-emerald-500/20"
                                : "bg-zinc-900/80 border-white/10 text-amber-400 shadow-black/60 backdrop-blur-xl"
                        }`}
                    >
                        {isApproved ? (
                            <CheckCircle2 size={44} className="animate-in zoom-in duration-300" strokeWidth={2} />
                        ) : (
                            <Clock size={42} strokeWidth={1.75} className="animate-pulse" />
                        )}
                    </motion.div>
                </div>

                {/* Text & Header */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        {isApproved ? (
                            <>
                                <Sparkles size={12} className="text-emerald-400" />
                                <span className="text-emerald-400">Approved</span>
                            </>
                        ) : (
                            <>
                                <ShieldCheck size={12} className="text-amber-400" />
                                <span>Membership Verification</span>
                            </>
                        )}
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                        {isApproved ? "가입 승인 완료!" : "승인 대기 중"}
                    </h1>

                    <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
                        {isApproved ? (
                            <span className="text-emerald-400 font-medium">
                                계정이 승인되었습니다. 메인 포털로 자동 이동합니다...
                            </span>
                        ) : (
                            <>
                                {session?.user?.name ? (
                                    <>
                                        <span className="text-white font-bold">{session.user.name}</span>님, 가입 신청이 접수되었습니다.<br />
                                    </>
                                ) : (
                                    "가입 신청이 접수되었습니다.<br />"
                                )}
                                관리자가 승인하는 즉시 이 화면에서<br />
                                자동으로 서비스로 이동됩니다.
                            </>
                        )}
                    </p>
                </div>

                {/* Info Box */}
                <div className="p-5 bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl text-left space-y-3 shadow-xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">계정 정보</p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 text-xs">이메일</span>
                            <span className="text-white font-mono text-xs truncate max-w-[200px]">
                                {session?.user?.email ?? "-"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-500 text-xs">계정 상태</span>
                            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                                isApproved
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                                {isApproved ? "승인 완료" : "승인 대기 (실시간 감지 중)"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Message Feedback Toast */}
                <AnimatePresence>
                    {statusMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`p-3 rounded-2xl text-xs font-bold border backdrop-blur-md ${
                                isApproved
                                    ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-300"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-300"
                            }`}
                        >
                            {statusMessage}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    {/* Manual Refresh / Immediate Enter Button */}
                    {isApproved ? (
                        <button
                            onClick={() => { window.location.href = "/"; }}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                        >
                            <span>지금 바로 입장하기</span>
                            <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => checkApprovalStatus(true)}
                            disabled={isChecking}
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-white transition-all font-bold text-sm shadow-lg active:scale-[0.98] disabled:opacity-50"
                        >
                            <RefreshCw size={16} className={isChecking ? "animate-spin text-emerald-400" : "text-zinc-400"} />
                            <span>{isChecking ? "승인 상태 확인 중..." : "승인 상태 새로고침"}</span>
                        </button>
                    )}

                    {/* Logout Button */}
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900 border border-white/5 hover:border-white/15 text-zinc-500 hover:text-zinc-300 transition-all font-bold text-xs active:scale-[0.98]"
                    >
                        <LogOut size={14} />
                        <span>로그아웃</span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
