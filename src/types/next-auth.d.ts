import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            nickname?: string | null;
            koreanName?: string | null;
            aiEnabled: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        nickname?: string | null;
        koreanName?: string | null;
        aiEnabled: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}
