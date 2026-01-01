"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
    Mail,
    Lock,
    User,
    Calendar,
    CheckCircle,
    ArrowRight,
    ChevronLeft,
    School,
    GraduationCap,
    Users,
    ShieldCheck,
    Send,
    Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SignupStep = "email" | "verify" | "role" | "account" | "details";
type UserRole = "STUDENT" | "TEACHER" | "PARENT";

export default function SignupPage() {
    const router = useRouter();
    const [step, setStep] = useState<SignupStep>("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form data
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [tempKey, setTempKey] = useState("");
    const [role, setRole] = useState<UserRole>("STUDENT");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [koreanName, setKoreanName] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [gender, setGender] = useState<"MALE" | "FEMALE" | "">("");
    const [age, setAge] = useState("");
    const [grade, setGrade] = useState("");
    const [studentName, setStudentName] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSendCode = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup/send-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to send verification code.");
                return;
            }

            setStep("verify");
        } catch {
            setError("A network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup/verify-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Code verification failed.");
                return;
            }

            setTempKey(data.data.tempKey);
            setStep("role");
        } catch {
            setError("A network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteSignup = async () => {
        setError("");

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!name || !koreanName || !birthdate || !gender || !age) {
            setError("Please fill in all required profile information.");
            return;
        }

        if (role === "STUDENT" && !grade) {
            setError("Please select your current grade.");
            return;
        }

        if (role === "PARENT" && !studentName) {
            setError("Please enter your child's name.");
            return;
        }

        if (!agreedToTerms) {
            setError("You must agree to the privacy protocol.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup/complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tempKey,
                    username,
                    password,
                    role,
                    name,
                    koreanName,
                    birthdate,
                    gender,
                    age: parseInt(age),
                    grade: grade ? parseInt(grade) : null,
                    studentName: studentName || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Signup completion failed.");
                return;
            }

            // Success - redirect to login
            router.push("/login?message=Account created! Waiting for admin approval.");
        } catch {
            setError("A network error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const steps: SignupStep[] = ["email", "verify", "role", "account", "details"];
    const currentStepIndex = steps.indexOf(step);

    return (
        <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-background">
            <div className="aurora-glow scale-125 opacity-40" />

            <div className="w-full max-w-lg z-10 py-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel rounded-[3rem] shadow-2xl p-8 md:p-12 border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl" />
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Join MissionLink</h1>
                        <p className="text-blue-200/60 font-bold text-xs uppercase tracking-[0.2em]">
                            {step === "email" && "Begin with your academic email"}
                            {step === "verify" && "Verify your secure identity"}
                            {step === "role" && "Define your access profile"}
                            {step === "account" && "Configure your credentials"}
                            {step === "details" && "Finalize your professional profile"}
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex justify-between mb-12 relative px-4">
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -z-10 -translate-y-1/2" />
                        {steps.map((s, i) => (
                            <div
                                key={s}
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-[11px] font-black transition-all duration-500 ${i <= currentStepIndex
                                    ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110"
                                    : "bg-white/5 text-gray-600 border border-white/5"
                                    }`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                            >
                                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Form Content */}
                    <div className="min-h-[360px]">
                        <AnimatePresence mode="wait">
                            {step === "email" && (
                                <motion.div
                                    key="email"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] ml-2">Academic Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="example@school.edu"
                                                className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-700 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleSendCode}
                                        disabled={loading || !email}
                                        className="shiny-button w-full py-5 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Request Code <Send className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {step === "verify" && (
                                <motion.div
                                    key="verify"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="text-center space-y-2">
                                        <p className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em]">Safety code sent to</p>
                                        <p className="text-lg font-bold text-white tracking-tight">{email}</p>
                                    </div>

                                    <div className="relative flex justify-center gap-3">
                                        {[0, 1, 2, 3, 4, 5].map((index) => (
                                            <div
                                                key={index}
                                                className={`w-12 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black transition-all duration-300 ${code[index]
                                                    ? "border-blue-500 bg-blue-500/10 text-white shadow-[0_0_20px_rgba(59,130,246,0.2)]"
                                                    : "border-white/10 bg-white/5 text-gray-700"
                                                    }`}
                                            >
                                                {code[index] || ""}
                                            </div>
                                        ))}
                                        <input
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                            placeholder="000000"
                                            maxLength={6}
                                            className="absolute inset-0 opacity-0 cursor-text w-full h-full"
                                            autoFocus
                                        />
                                    </div>

                                    <button
                                        onClick={handleVerifyCode}
                                        disabled={loading || code.length !== 6}
                                        className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                Verify Code <CheckCircle className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={() => setStep("email")}
                                        className="w-full text-[10px] font-black text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                                    >
                                        Incorrect Email? Go Back
                                    </button>
                                </motion.div>
                            )}

                            {step === "role" && (
                                <motion.div
                                    key="role"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    {[
                                        { value: "STUDENT", label: "Student", desc: "Access academic tools & data", icon: GraduationCap },
                                        { value: "TEACHER", label: "Educator", desc: "Manage resources & faculty info", icon: School },
                                        { value: "PARENT", label: "Guardian", desc: "Monitor student status & meals", icon: Users },
                                    ].map((r) => (
                                        <button
                                            key={r.value}
                                            onClick={() => setRole(r.value as UserRole)}
                                            className={`w-full p-5 rounded-2xl border transition-all text-left flex items-center gap-5 group ${role === r.value
                                                ? "border-blue-500 bg-blue-500/10 shadow-lg"
                                                : "border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10"
                                                }`}
                                        >
                                            <div className={`p-4 rounded-xl transition-colors ${role === r.value ? "bg-blue-600 text-white" : "bg-white/5 text-gray-500 group-hover:text-gray-300"}`}>
                                                <r.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-black text-base uppercase tracking-wider ${role === r.value ? "text-white" : "text-gray-400 group-hover:text-white"}`}>{r.label}</div>
                                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-400">{r.desc}</div>
                                            </div>
                                            {role === r.value && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,1)]" />}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setStep("account")}
                                        className="w-full mt-6 py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                                    >
                                        Continue <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}

                            {step === "account" && (
                                <motion.div
                                    key="account"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">Username</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (/^[a-zA-Z0-9._]*$/.test(val)) {
                                                        setUsername(val);
                                                    }
                                                }}
                                                placeholder="Letters, numbers 4-20 chars"
                                                className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">Secure Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="8+ characters"
                                                className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">Confirm Identity Key</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter password"
                                                className="w-full pl-12 pr-4 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-4 pt-6">
                                        <button
                                            onClick={() => setStep("role")}
                                            className="w-1/3 py-5 bg-white/5 hover:bg-white/10 text-gray-400 font-black rounded-2xl border border-white/5 transition-all text-[10px] uppercase tracking-widest"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setStep("details")}
                                            disabled={!username || !password || !confirmPassword}
                                            className="shiny-button flex-1 py-5 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                        >
                                            Initialize <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {step === "details" && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">English Name</label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">Korean Name</label>
                                            <input
                                                type="text"
                                                value={koreanName}
                                                onChange={(e) => setKoreanName(e.target.value)}
                                                placeholder="홍길동"
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">Birthdate</label>
                                            <input
                                                type="date"
                                                value={birthdate}
                                                onChange={(e) => setBirthdate(e.target.value)}
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">Gender</label>
                                            <select
                                                value={gender}
                                                onChange={(e) => setGender(e.target.value as "MALE" | "FEMALE")}
                                                className="w-full px-5 py-4 bg-[#0A1929] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                            >
                                                <option value="">SELECT</option>
                                                <option value="MALE">MALE</option>
                                                <option value="FEMALE">FEMALE</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">International Age</label>
                                            <input
                                                type="number"
                                                value={age}
                                                onChange={(e) => setAge(e.target.value)}
                                                placeholder="Full age"
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                            />
                                        </div>
                                        {role === "STUDENT" && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">Academic Year</label>
                                                <select
                                                    value={grade}
                                                    onChange={(e) => setGrade(e.target.value)}
                                                    className="w-full px-5 py-4 bg-[#0A1929] border border-white/10 rounded-2xl text-white focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                                >
                                                    <option value="">GRADE</option>
                                                    {[7, 8, 9, 10, 11, 12].map((g) => (
                                                        <option key={g} value={g}>YEAR {g}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    {role === "PARENT" && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-blue-200/50 uppercase tracking-[0.2em] ml-2">Student Associate</label>
                                            <input
                                                type="text"
                                                value={studentName}
                                                onChange={(e) => setStudentName(e.target.value)}
                                                placeholder="Full name of child"
                                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all text-sm font-medium"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center gap-3 py-2">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={agreedToTerms}
                                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                                            className="h-5 w-5 rounded-lg border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="terms" className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                                            I agree to the <span className="text-blue-400 underline cursor-pointer">Security Protocol & Privacy Policy</span>
                                        </label>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            onClick={() => setStep("account")}
                                            className="w-1/3 py-5 bg-white/5 hover:bg-white/10 text-gray-500 font-black rounded-2xl border border-white/5 transition-all text-sm uppercase tracking-widest"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleCompleteSignup}
                                            disabled={loading || !agreedToTerms}
                                            className="flex-1 py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    Finalize Onboarding <CheckCircle className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 text-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
                            Already registered?{" "}
                            <Link href="/login" className="text-blue-500 hover:text-blue-400 underline transition-colors">
                                Personnel Login
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
