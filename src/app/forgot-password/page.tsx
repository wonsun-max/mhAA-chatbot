"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Mail, Lock, ShieldCheck, CheckCircle2, ChevronRight, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

/**
 * Forgot Password Page — 3-step flow:
 * 1. Email input → send reset code via /api/auth/forgot-password
 * 2. 6-digit code verification via /api/auth/verify-code
 * 3. New password input → update via /api/auth/reset-password
 * 4. Success screen
 */
export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const stepLabels = ["이메일", "코드 인증", "새 비밀번호", "완료"]

    /** STEP 1 → 2: Send reset code */
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setStep(2)
            } else {
                const data = await res.json()
                setError(data.error || "코드 전송에 실패했습니다.")
            }
        } catch {
            setError("오류가 발생했습니다. 다시 시도해주세요.")
        } finally {
            setLoading(false)
        }
    }

    /** STEP 2 → 3: Verify code */
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            })
            if (res.ok) {
                setStep(3)
            } else {
                const data = await res.json()
                setError(data.error || "인증 코드가 올바르지 않습니다.")
            }
        } catch {
            setError("오류가 발생했습니다. 다시 시도해주세요.")
        } finally {
            setLoading(false)
        }
    }

    /** STEP 3 → 4: Reset password */
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.")
            return
        }
        if (password.length < 6) {
            setError("비밀번호는 최소 6자 이상이어야 합니다.")
            return
        }
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code, password }),
            })
            if (res.ok) {
                setStep(4)
            } else {
                const data = await res.json()
                setError(data.error || "비밀번호 변경에 실패했습니다.")
            }
        } catch {
            setError("오류가 발생했습니다. 다시 시도해주세요.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">WITHUS</h1>
                    <p className="text-zinc-500">비밀번호를 재설정하세요</p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center mb-8 gap-2">
                    {stepLabels.map((label, i) => {
                        const s = i + 1
                        const isCompleted = step > s
                        const isActive = step === s
                        return (
                            <div key={s} className="flex items-center">
                                <div className="flex flex-col items-center gap-1">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCompleted ? "bg-green-500 text-white" :
                                            isActive ? "bg-blue-500 text-white" :
                                                "bg-zinc-800 text-zinc-500"
                                        }`}>
                                        {isCompleted ? "✓" : s}
                                    </div>
                                    <span className={`text-[9px] uppercase tracking-wider ${isActive ? "text-blue-400" : "text-zinc-600"}`}>
                                        {label}
                                    </span>
                                </div>
                                {i < stepLabels.length - 1 && (
                                    <div className={`w-8 h-px mx-2 mb-4 ${step > s ? "bg-green-500/50" : "bg-zinc-800"}`} />
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Card */}
                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">

                        {/* ── STEP 1: Email ── */}
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSendCode}
                                className="space-y-6"
                            >
                                <div className="space-y-1 mb-2">
                                    <h2 className="text-lg font-bold">이메일 확인</h2>
                                    <p className="text-xs text-zinc-500">가입 시 사용한 이메일 주소를 입력하세요. 인증 코드를 보내드립니다.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400 ml-1">이메일 주소</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="이메일 주소 입력"
                                        />
                                    </div>
                                </div>
                                {error && <p className="text-red-500 text-sm ml-1">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            <span>인증 코드 전송</span>
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}

                        {/* ── STEP 2: Code Verification ── */}
                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyCode}
                                className="space-y-6"
                            >
                                <div className="space-y-1 mb-2">
                                    <h2 className="text-lg font-bold">이메일 코드 확인</h2>
                                    <p className="text-xs text-zinc-500">{email}로 전송된 6자리 인증 코드를 입력해주세요.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400 ml-1">인증 코드</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-4 text-center text-2xl tracking-[0.5em] font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                        placeholder="000000"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm ml-1">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading || code.length < 6}
                                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                        <>
                                            <ShieldCheck size={20} />
                                            <span>코드 확인</span>
                                        </>
                                    )}
                                </button>
                                <button type="button" onClick={() => { setStep(1); setCode(""); setError("") }} className="w-full text-zinc-500 text-sm hover:text-white transition-colors">
                                    ← 이메일 다시 입력
                                </button>
                            </motion.form>
                        )}

                        {/* ── STEP 3: New Password ── */}
                        {step === 3 && (
                            <motion.form
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleResetPassword}
                                className="space-y-5"
                            >
                                <div className="space-y-1 mb-2">
                                    <h2 className="text-lg font-bold">새 비밀번호 설정</h2>
                                    <p className="text-xs text-zinc-500">새로운 비밀번호를 입력해주세요. (최소 6자)</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400 ml-1">새 비밀번호</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-12 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400 ml-1">비밀번호 확인</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`w-full bg-zinc-950 border rounded-2xl py-4 pl-12 pr-4 focus:ring-2 outline-none transition-all ${confirmPassword && confirmPassword !== password
                                                    ? "border-red-500/50 focus:ring-red-500/20 focus:border-red-500"
                                                    : "border-zinc-800 focus:ring-blue-500/20 focus:border-blue-500"
                                                }`}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    {confirmPassword && confirmPassword !== password && (
                                        <p className="text-red-500 text-xs ml-1">비밀번호가 일치하지 않습니다.</p>
                                    )}
                                </div>

                                {error && <p className="text-red-500 text-sm ml-1">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading || !password || !confirmPassword || password !== confirmPassword}
                                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : "비밀번호 변경"}
                                </button>
                            </motion.form>
                        )}

                        {/* ── STEP 4: Success ── */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 py-4"
                            >
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                                        <CheckCircle2 size={48} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">비밀번호 변경 완료!</h2>
                                    <p className="text-zinc-500">새 비밀번호로 로그인할 수 있습니다.</p>
                                </div>
                                <Link
                                    href="/login"
                                    className="block w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all"
                                >
                                    로그인 하러 가기
                                </Link>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Footer link back to login */}
                {step < 4 && (
                    <p className="text-center mt-8 text-zinc-500 text-sm">
                        비밀번호가 기억났나요?{" "}
                        <Link href="/login" className="text-white hover:underline font-medium">
                            로그인
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}
