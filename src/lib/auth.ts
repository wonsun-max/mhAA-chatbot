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
                            { nickname: credentials.identifier }
                        ]
                    },
                });

                if (!user || !user.passwordHash) return null;

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isPasswordValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    nickname: user.nickname,
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
                    session.user.id = user.id;
                    session.user.email = user.email;
                    session.user.name = user.name;
                    session.user.aiEnabled = user.aiEnabled;
                    session.user.koreanName = user.koreanName;
                    (session.user as any).nickname = user.nickname;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
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
