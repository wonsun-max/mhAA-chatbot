"use client"

import { approveUser, rejectUser } from "@/app/actions/admin"
import { useState } from "react"
import { Check, X, Loader2 } from "lucide-react"

export function ApprovalActions({ userId }: { userId: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending")

    const handleApprove = async () => {
        setIsLoading(true)
        try {
            await approveUser(userId)
            setStatus("approved")
        } catch {
            alert("Failed to approve")
        } finally {
            setIsLoading(false)
        }
    }

    const handleReject = async () => {
        setIsLoading(true)
        try {
            await rejectUser(userId)
            setStatus("rejected")
        } catch {
            alert("Failed to reject")
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "approved") return <span className="text-green-500 font-bold text-[10px] uppercase bg-green-500/10 px-4 py-1.5 rounded-full border border-green-500/20 tracking-widest">Approved</span>
    if (status === "rejected") return <span className="text-red-500 font-bold text-[10px] uppercase bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 tracking-widest">Rejected</span>

    return (
        <div className="flex items-center space-x-3 justify-center">
            <button
                onClick={handleApprove}
                disabled={isLoading}
                className="p-3 bg-green-500/10 text-green-500 rounded-2xl hover:bg-green-500/20 border border-green-500/20 transition-all active:scale-90"
            >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
            </button>
            <button
                onClick={handleReject}
                disabled={isLoading}
                className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500/20 border border-red-500/20 transition-all active:scale-90"
            >
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : <X size={18} />}
            </button>
        </div>
    )
}
