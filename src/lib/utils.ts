import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS class names deterministically, resolving conflicts.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Formats a student grade/class string (e.g. "7" -> "7학년", "12-1" -> "12학년 1반")
 * so split-class grades like "12-1" do not render awkwardly as "12-1학년".
 */
export function formatGrade(grade?: string | null): string {
    if (!grade) return "미지정"
    const trimmed = grade.trim()
    if (!trimmed) return "미지정"
    if (trimmed.includes("-")) {
        const [g, c] = trimmed.split("-")
        return `${g}학년 ${c}반`
    }
    return `${trimmed}학년`
}

/**
 * Converts a Date into a Date object shifted to Asia/Manila (UTC+8) wall-clock time
 * so UTC/date methods reflect Manila local date regardless of server timezone.
 */
export function toManilaTime(date: Date = new Date()): Date {
    const utcMs = date.getTime() + date.getTimezoneOffset() * 60000
    return new Date(utcMs + 8 * 3600000)
}

