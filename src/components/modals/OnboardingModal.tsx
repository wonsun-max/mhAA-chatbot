"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, GraduationCap, Sparkles, Loader2 } from "lucide-react";

export function OnboardingModal() {
    const { data: session, status, update } = useSession();
    const [open, setOpen] = useState(false);
    const [nickname, setNickname] = useState("");
    const [grade, setGrade] = useState("");
    const [qtGroup, setQtGroup] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const grades = ["7", "8", "9", "10", "11", "12-1", "12-2"];
    const qtGroups = ["1", "2", "3", "4", "5", "6", "7", "8"];

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            // Check if mandatory details are missing
            const isMissingDetails = !session.user.nickname || !session.user.grade;
            if (isMissingDetails) {
                setOpen(true);
            } else {
                setOpen(false);
            }
        } else {
            setOpen(false);
        }
    }, [session, status]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nickname,
                    grade,
                    qtGroup: qtGroup || null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "프로필 정보 저장에 실패했습니다.");
                setLoading(false);
                return;
            }

            // Update session so token updates in memory
            await update({
                nickname,
                grade,
                qtGroup: qtGroup || null,
            });

            setOpen(false);
        } catch {
            setError("오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />

                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
                            <Sparkles size={14} />
                            <span>추가 정보 입력</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">프로필 설정이 필요합니다</h2>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            서비스 이용을 위해 닉네임과 학년/반 정보를 등록해 주세요.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 ml-1">닉네임</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="text"
                                    required
                                    minLength={2}
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="사용할 닉네임 입력"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 ml-1">학년 / 반</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <select
                                    required
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
                                >
                                    <option value="">학년 선택</option>
                                    {grades.map((g) => (
                                        <option key={g} value={g}>
                                            {g}학년
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 ml-1">QT조 (선택)</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <select
                                    value={qtGroup}
                                    onChange={(e) => setQtGroup(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
                                >
                                    <option value="">QT조 선택 (선택 사항)</option>
                                    {qtGroups.map((group) => (
                                        <option key={group} value={group}>
                                            {group}조
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !nickname.trim() || !grade}
                            className="w-full font-bold py-3.5 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "설정 완료"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
