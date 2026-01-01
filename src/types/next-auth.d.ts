import { UserRole } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: UserRole;
            username?: string | null;
            koreanName?: string | null;
            aiEnabled: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: UserRole;
        username?: string | null;
        koreanName?: string | null;
        aiEnabled: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: UserRole;
        id: string;
    }
}
