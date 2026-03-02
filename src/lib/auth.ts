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
        async session({ session, token }) {
            if (session.user && token.sub) {
                const user = await prisma.user.findUnique({
                    where: { id: token.sub },
                });
                if (user) {
                    session.user.id = user.id;
                    session.user.email = user.email;
                    session.user.name = user.name;
                    session.user.nickname = user.nickname;
                    session.user.role = user.role;
                    session.user.status = user.status;
                    session.user.grade = user.grade;
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
        maxAge: 30 * 24 * 60 * 60, // 30 Days persistence
    }
};
