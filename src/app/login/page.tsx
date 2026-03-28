"use client"

import { useState, Suspense, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Lock, ChevronRight, User } from "lucide-react"
import { motion } from "framer-motion"

function LoginContent() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const { status } = useSession()
    const message = searchParams.get("message")

    /**
     * If the user is already authenticated, send them to their destination.
     * This also fires after a successful login when the session transitions
     * from "loading" → "authenticated".
     * Using window.location.assign ensures a full hard navigation so the
     * middleware gets a fresh request with the new cookie set.
     */
    useEffect(() => {
        if (status === "authenticated") {
            const callbackUrl = searchParams.get("callbackUrl") || "/chatbot"
            // Hard navigation: guarantees the cookie is sent with the request
            window.location.assign(callbackUrl)
        }
    }, [status, searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isLoading) return

        setIsLoading(true)
        setError("")

        try {
            const res = await signIn("credentials", {
                identifier,
                password,
                redirect: false,
            })

            if (!res || res.error) {
                if (res?.error === "계정이 아직 승인되지 않았거나 정지된 상태입니다.") {
                    setError("아직 승인되지 않은 계정입니다. 관리자의 승인을 기다려주세요.")
                } else {
                    setError("이메일/닉네임 또는 비밀번호가 올바르지 않습니다.")
                }
                setIsLoading(false)
                return
            }

            // signIn() succeeded and set the cookie.
            // The useEffect above will now fire when session status becomes
            // "authenticated" and will do a hard redirect to the destination.
            // Keep spinner visible during this brief transition.

        } catch {
            setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.")
            setIsLoading(false)
        }
    }

    // If session is loading, show a neutral loading screen (prevents flicker)
    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        )
    }

    // If already authenticated (before form submit), show brief redirect screen
    if (status === "authenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        )
    }

    return (
        <div className="min-h-[100dvh] bg-black text-white flex items-center justify-center p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-6 md:space-y-8 py-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">WITHUS</h1>
                    <p className="text-zinc-500 text-sm md:text-base">다시 오신 것을 환영합니다</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 bg-blue-400/10 text-blue-400 text-sm rounded-2xl border border-blue-500/20 mb-6"
                        >
                            {message}
                        </motion.div>
                    )}

                    <form className="space-y-6 relative" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                key={error}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-400/10 text-red-500 text-sm rounded-2xl border border-red-500/20"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">이메일 또는 닉네임</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="이메일 또는 닉네임 입력"
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-sm font-medium text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder-zinc-700"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-sm font-medium text-zinc-400">비밀번호</label>
                                    <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-white transition-colors">
                                        비밀번호를 잊으셨나요?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-sm font-medium text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder-zinc-700"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 active:scale-[0.98] bg-white text-black hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>로그인</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>

                        <div className="pt-6 border-t border-zinc-800 text-center">
                            <p className="text-sm text-zinc-500">
                                계정이 없으신가요?{" "}
                                <Link href="/signup" className="text-white hover:underline font-medium">
                                    여기에서 회원가입하세요
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
