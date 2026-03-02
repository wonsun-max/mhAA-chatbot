"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Mail, Lock, ChevronRight, User } from "lucide-react"
import { motion } from "framer-motion"

function LoginContent() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [agreed, setAgreed] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get("message")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!agreed) {
            setError("로그인하시려면 이용약관 및 개인정보 처리방침에 동의해주셔야 합니다.")
            return
        }
        setIsLoading(true)
        setError("")
        const res = await signIn("credentials", {
            identifier,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError(res.error || "Invalid credentials or account pending approval.")
            setIsLoading(false)
        } else {
            router.push("/chatbot")
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">WITHUS</h1>
                    <p className="text-zinc-500">Welcome back</p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />

                    <form className="space-y-6 relative" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-400/10 text-red-500 text-sm rounded-2xl border border-red-500/20"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Email or Nickname</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="your@email.com or nickname"
                                        className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-2xl text-sm font-medium text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder-zinc-700"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-400 ml-1">Password</label>
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

                        <div className="flex items-start space-x-3 px-1 mb-6">
                            <input
                                type="checkbox"
                                id="login-agree"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-blue-500 focus:ring-blue-500/20"
                            />
                            <label htmlFor="login-agree" className="text-xs text-zinc-500 leading-normal">
                                <Link href="/terms" className="text-zinc-300 hover:text-white underline">이용약관</Link> 및 <Link href="/privacy" className="text-zinc-300 hover:text-white underline">개인정보 처리방침</Link>에 동의합니다.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !agreed}
                            className={`w-full font-bold py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 active:scale-[0.98] ${agreed ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                                }`}
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Log In</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>

                        <div className="pt-6 border-t border-zinc-800 text-center">
                            <p className="text-sm text-zinc-500">
                                Don&apos;t have an account?{" "}
                                <Link href="/signup" className="text-white hover:underline font-medium">
                                    Sign up here
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
