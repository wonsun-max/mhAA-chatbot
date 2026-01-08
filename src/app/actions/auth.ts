"use server"



/**
 * Note: Base user registration is handled via /api/auth/signup/... API routes 
 * to support the multi-step flow. This file retains only global auth utilities.
 */

export async function approveUser() {
    // Legacy mapping - now handled in admin.ts
    // Removed to avoid duplication
    throw new Error("Use admin.ts for approving users");
}

export async function rejectUser() {
    // Legacy mapping - now handled in admin.ts
    // Removed to avoid duplication
    throw new Error("Use admin.ts for rejecting users");
}
