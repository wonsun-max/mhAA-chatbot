import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { UserStatus } from "@prisma/client";

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
                if (user.status !== UserStatus.ACTIVE) {
                    throw new Error(user.status === UserStatus.PENDING
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
                };
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
                    session.user.role = user.role;
                    session.user.aiEnabled = user.aiEnabled;
                    session.user.koreanName = user.koreanName;
                    session.user.username = user.username;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
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
