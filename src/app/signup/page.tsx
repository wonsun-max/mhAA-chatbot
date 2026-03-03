"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Mail, Lock, User, GraduationCap, ChevronRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [nickname, setNickname] = useState("")
    const [grade, setGrade] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const [agreed, setAgreed] = useState(false)

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreed) {
            setError("개인정보 처리방침 및 이용약관에 동의해야 합니다.")
            return
        }
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/send-code", {
                method: "POST",
                body: JSON.stringify({ email }),
            })
            if (res.ok) {
                setStep(2)
            } else {
                const data = await res.json()
                setError(data.error || "코드 전송에 실패했습니다.")
            }
        } catch (err) {
            setError("오류가 발생했습니다. 다시 시도해주세요.")
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, code, name, nickname, grade, password }),
            })
            if (res.ok) {
                setStep(3)
            } else {
                const data = await res.json()
                setError(data.error || "가입에 실패했습니다.")
            }
        } catch (err) {
            setError("오류가 발생했습니다. 다시 시도해주세요.")
        } finally {
            setLoading(false)
        }
    }

    const grades = [
        "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12-1", "12-2"
    ]

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold tracking-tight mb-2">WITHUS</h1>
                    <p className="text-zinc-500">프라이빗 네트워크에 가입하세요</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.form
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleSendCode}
                                className="space-y-6"
                            >
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
                                <div className="flex items-start space-x-3 px-1">
                                    <input
                                        type="checkbox"
                                        id="agree"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-blue-500/20"
                                    />
                                    <label htmlFor="agree" className="text-xs text-zinc-500 leading-normal">
                                        <Link href="/privacy" className="text-zinc-300 hover:text-white underline">개인정보 처리방침</Link> 및 <Link href="/terms" className="text-zinc-300 hover:text-white underline">이용약관</Link>에 동의합니다. 선교 지원 목적으로 채팅 로그가 저장됨을 이해합니다.
                                    </label>
                                </div>
                                {error && <p className="text-red-500 text-sm ml-1">{error}</p>}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 ${agreed ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                        }`}
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

                        {step === 2 && (
                            <motion.form
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleRegister}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400 ml-1">인증 코드</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-4 text-center text-2xl tracking-[0.5em] font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                            placeholder="000000"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400 ml-1">성명</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                placeholder="홍길동"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400 ml-1">닉네임</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                            <input
                                                type="text"
                                                required
                                                value={nickname}
                                                onChange={(e) => setNickname(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                placeholder="닉네임 입력"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400 ml-1">학년 / 반</label>
                                        <div className="relative">
                                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                            <select
                                                required
                                                value={grade}
                                                onChange={(e) => setGrade(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none"
                                            >
                                                <option value="">학년 선택</option>
                                                {grades.map(g => <option key={g} value={g}>{g}학년</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-400 ml-1">비밀번호</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                                            <input
                                                type="password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm ml-1">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : "가입 완료"}
                                </button>
                            </motion.form>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
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
                                    <h2 className="text-2xl font-bold">회원가입 성공</h2>
                                    <p className="text-zinc-500">
                                        계정이 승인 대기 중입니다. 관리자가 곧 요청을 검토할 예정입니다.
                                    </p>
                                </div>
                                <Link
                                    href="/login"
                                    className="block w-full bg-zinc-800 text-white font-bold py-4 rounded-2xl hover:bg-zinc-700 transition-all"
                                >
                                    로그인으로 돌아가기
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {step < 3 && (
                    <p className="text-center mt-8 text-zinc-500 text-sm">
                        이미 계정이 있으신가요?{" "}
                        <Link href="/login" className="text-white hover:underline font-medium">
                            로그인
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}
