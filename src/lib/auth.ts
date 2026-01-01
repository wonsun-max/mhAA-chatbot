import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "MissionLink Account",
            credentials: {
                identifier: { label: "Email or Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) return null;

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    },
                });

                if (!user || !user.passwordHash) return null;

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isPasswordValid) return null;

                // Check account status - only ACTIVE users can log in
                if (user.status !== "ACTIVE") {
                    throw new Error(user.status === "PENDING"
                        ? "Account pending approval."
                        : "Account suspended or inactive.");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    username: user.username,
                    koreanName: user.koreanName,
                    aiEnabled: user.aiEnabled,
                } as any;
            }
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                const user = await prisma.user.findUnique({
                    where: { id: token.sub },
                });
                if (user) {
                    (session.user as any).id = (user as any).id;
                    (session.user as any).role = (user as any).role;
                    (session.user as any).aiEnabled = (user as any).aiEnabled;
                    (session.user as any).koreanName = (user as any).koreanName;
                    (session.user as any).username = (user as any).username;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = (user as any).role;
            }
            return token;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    }
};
