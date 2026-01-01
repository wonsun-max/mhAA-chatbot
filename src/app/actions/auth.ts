"use server"

import { prisma } from "@/lib/prisma"
import { sendVerificationEmail } from "@/lib/mail"

/**
 * Note: Base user registration is handled via /api/auth/signup/... API routes 
 * to support the multi-step flow. This file retains only global auth utilities.
 */

export async function approveUser(userId: string) {
    // Legacy mapping - now handled in admin.ts
    // Removed to avoid duplication
    throw new Error("Use admin.ts for approving users");
}

export async function rejectUser(userId: string) {
    // Legacy mapping - now handled in admin.ts
    // Removed to avoid duplication
    throw new Error("Use admin.ts for rejecting users");
}
