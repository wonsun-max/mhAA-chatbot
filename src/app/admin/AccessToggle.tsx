"use client"

import { toggleChatbotAccess } from "@/app/actions/admin"
import { useState } from "react"

export function AccessToggle({ userId, initialValue }: { userId: string, initialValue: boolean }) {
    const [enabled, setEnabled] = useState(initialValue)
    const [isLoading, setIsLoading] = useState(false)

    const handleToggle = async () => {
        setIsLoading(true)
        try {
            await toggleChatbotAccess(userId)
            setEnabled(!enabled)
        } catch {
            alert("Failed to toggle access")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${enabled ? 'bg-blue-600' : 'bg-white/10'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    )
}
