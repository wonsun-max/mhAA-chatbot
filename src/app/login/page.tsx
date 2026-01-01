"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, AlertCircle, Bot, User, Lock, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

function LoginContent() {
    const [identifier, setIdentifier] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const message = searchParams.get("message")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        const res = await signIn("credentials", {
            identifier,
            password,
            redirect: false,
        })

        if (res?.error) {
            setError("Invalid credentials or account pending approval.")
            setIsLoading(false)
        } else {
            router.push("/chatbot")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-20 relative overflow-hidden">
            <div className="aurora-glow opacity-60" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full space-y-12 relative"
            >
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-500/20">
                        <Bot className="text-white" size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Login</h2>
                        <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em]">MissionLink Intelligence</p>
                    </div>
                </div>

                <div className="glass-panel p-10 rounded-[3rem] shadow-2xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />

                    {(message || searchParams.get("message") === "signup_success") && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-4 mb-8 bg-blue-500/10 text-blue-400 text-[10px] rounded-2xl font-black uppercase tracking-widest flex items-center border border-blue-500/20"
                        >
                            <AlertCircle className="mr-3" size={18} />
                            {message || "Registration Successful. Awaiting Admin Review."}
                        </motion.div>
                    )}

                    <form className="space-y-6 relative" onSubmit={handleSubmit}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-red-400/10 text-red-400 text-[10px] rounded-2xl font-black uppercase tracking-widest border border-red-500/20"
                            >
                                {error}
                            </motion.div>
                        )}

                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                                    <User size={20} />
                                </div>
                                <input
                                    type="text"
                                    required
                                    placeholder="Email or Username"
                                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none placeholder-gray-600"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                            </div>

                            <div className="relative group">
                                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input
                                    type="password"
                                    required
                                    placeholder="Password"
                                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-sm font-medium text-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none placeholder-gray-600"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="shiny-button w-full flex justify-center items-center py-5 uppercase tracking-widest text-xs"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Initialize Session
                                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>

                        <div className="pt-6 text-center">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] leading-loose">
                                Missing Authentication?{" "}
                                <Link href="/signup" className="text-blue-500 hover:text-blue-400 transition-colors">
                                    Request Access
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
            <div className="min-h-screen flex items-center justify-center bg-[#0A1929]">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
