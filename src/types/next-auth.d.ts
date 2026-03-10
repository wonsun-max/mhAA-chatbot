import { DefaultSession } from "next-auth"
import { UserRole, UserStatus } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            status: UserStatus;
            nickname?: string | null;
            grade?: string | null;
        } & DefaultSession["user"]
    }

    interface User {
        role: UserRole;
        status: UserStatus;
        nickname?: string | null;
        grade?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        status: UserStatus;
        nickname?: string | null;
        grade?: string | null;
    }
}
