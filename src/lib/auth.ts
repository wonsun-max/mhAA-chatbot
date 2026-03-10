import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "WITHUS Account",
            credentials: {
                identifier: { label: "Email or Nickname", type: "text" },
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

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid credentials");
                }

                if (user.status !== "APPROVED") {
                    throw new Error("Your account is pending approval or has been suspended.");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isPasswordValid) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    nickname: user.nickname,
                    role: user.role,
                    status: user.status,
                    grade: user.grade,
                };
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = (user as any).role;
                token.status = (user as any).status;
                token.grade = (user as any).grade;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).status = token.status;
                (session.user as any).grade = token.grade;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 Days persistence
    }
};
