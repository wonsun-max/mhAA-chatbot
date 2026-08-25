"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, GraduationCap, Sparkles, Loader2 } from "lucide-react";

/**
 * Mandatory Onboarding Modal for completing required profile information
 * when users sign in via Google OAuth or are missing mandatory fields.
 */
export function OnboardingModal() {
    const { data: session, status, update } = useSession();
    const [open, setOpen] = useState(false);

    // Form fields — matching signup exactly
    const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
    const [name, setName] = useState("");
    const [nickname, setNickname] = useState("");
    const [grade, setGrade] = useState("");
    const [qtGroup, setQtGroup] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const grades = ["7", "8", "9", "10", "11", "12-1", "12-2"];
    const qtGroups = ["1", "2", "3", "4", "5", "6", "7", "8"];

    useEffect(() => {
        if (status === "authenticated" && session?.user) {
            const user = session.user;
            const isStudent = user.role !== "TEACHER";
            
            // Check if mandatory details are missing based on role
            const isMissing =
                !user.name ||
                !user.nickname ||
                (isStudent && !user.grade);

            if (isMissing) {
                setOpen(true);
                if (user.name && !name) {
                    setName(user.name);
                }
                if (user.nickname && !nickname) {
                    setNickname(user.nickname);
                }
                if (user.grade && !grade) {
                    setGrade(user.grade);
                }
                if (user.role === "TEACHER" || user.role === "STUDENT") {
                    setRole(user.role);
                }
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

        // Validate required fields per role
        if (!name.trim() || name.trim().length < 2) {
            setError("성명을 2글자 이상 입력해주세요.");
            return;
        }
        if (!nickname.trim() || nickname.trim().length < 2) {
            setError("닉네임은 최소 2글자 이상이어야 합니다.");
            return;
        }
        if (role === "STUDENT" && !grade) {
            setError("학년/반을 선택해주세요.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    nickname: nickname.trim(),
                    role,
                    grade: role === "STUDENT" ? grade : null,
                    qtGroup: role === "STUDENT" ? (qtGroup || null) : null,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "프로필 정보 저장에 실패했습니다.");
                setLoading(false);
                return;
            }

            // Refresh session so token updates in memory
            await update({
                name: name.trim(),
                nickname: nickname.trim(),
                role,
                grade: role === "STUDENT" ? grade : null,
                qtGroup: role === "STUDENT" ? (qtGroup || null) : null,
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
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-y-auto max-h-[90vh] my-auto"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-2">
                            <Sparkles size={14} />
                            <span>추가 정보 입력</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">프로필 설정이 필요합니다</h2>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            서비스 이용을 위해 아래 필수 정보를 모두 입력해 주세요.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-xs text-red-400">
                                {error}
                            </div>
                        )}

                        {/* Role selector — 학생 / 선생님 */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 ml-1">역할</label>
                            <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-950 border border-zinc-800 rounded-2xl">
                                <button
                                    type="button"
                                    onClick={() => { setRole("STUDENT"); setGrade(""); setQtGroup(""); }}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${
                                        role === "STUDENT" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                >
                                    학생
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setRole("TEACHER"); setGrade(""); setQtGroup(""); }}
                                    className={`py-3 rounded-xl text-sm font-bold transition-all ${
                                        role === "TEACHER" ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                >
                                    선생님
                                </button>
                            </div>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-zinc-400 ml-1">성명</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="홍길동"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-base sm:text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Nickname */}
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
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-base sm:text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Grade + QT — only for students */}
                        {role === "STUDENT" && (
                            <>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-zinc-400 ml-1">학년 / 반</label>
                                    <div className="relative">
                                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                                        <select
                                            required
                                            value={grade}
                                            onChange={(e) => setGrade(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-base sm:text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
                                        >
                                            <option value="">학년 선택</option>
                                            {grades.map((g) => (
                                                <option key={g} value={g}>{g}학년</option>
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
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-3.5 pl-11 pr-4 text-base sm:text-sm text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
                                        >
                                            <option value="">QT조 선택 (선택 사항)</option>
                                            {qtGroups.map((group) => (
                                                <option key={group} value={group}>{group}조</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !name.trim() ||
                                !nickname.trim() ||
                                (role === "STUDENT" && !grade)
                            }
                            className="w-full font-bold py-3.5 rounded-2xl bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : "설정 완료"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
