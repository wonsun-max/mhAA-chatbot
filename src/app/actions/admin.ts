"use server"

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role?.toUpperCase();
    if (role !== "ADMIN") {
        throw new Error("Unauthorized Access Reserved for Administrators.");
    }
}

export async function toggleChatbotAccess(userId: string) {
    await ensureAdmin();

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { aiEnabled: true },
    });

    if (!user) throw new Error("User not found");

    await prisma.user.update({
        where: { id: userId },
        data: { aiEnabled: !user.aiEnabled },
    });

    revalidatePath("/admin");
}

export async function approveUser(userId: string) {
    await ensureAdmin();

    await prisma.user.update({
        where: { id: userId },
        data: { status: "ACTIVE" },
    });

    revalidatePath("/admin");
}

export async function rejectUser(userId: string) {
    await ensureAdmin();

    await prisma.user.update({
        where: { id: userId },
        data: { status: "REJECTED" },
    });

    revalidatePath("/admin");
}
