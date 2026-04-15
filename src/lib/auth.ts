import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    // Explicitly set secret to avoid any env reading ambiguity
    secret: process.env.NEXTAUTH_SECRET,

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
                    throw new Error("이메일/닉네임 또는 비밀번호가 올바르지 않습니다.");
                }

                if (user.status !== "APPROVED") {
                    throw new Error("계정이 아직 승인되지 않았거나 정지된 상태입니다.");
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
                if (!isPasswordValid) {
                    throw new Error("이메일/닉네임 또는 비밀번호가 올바르지 않습니다.");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    nickname: user.nickname,
                    role: user.role,
                    status: user.status,
                    grade: user.grade,
                    qtGroup: user.qtGroup,
                };
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.status = user.status;
                token.grade = user.grade;
                token.nickname = user.nickname;
                token.qtGroup = user.qtGroup;
            }
            // Support updating token values if needed
            if (trigger === "update") {
                if (session?.nickname !== undefined) token.nickname = session.nickname;
                if (session?.qtGroup !== undefined) token.qtGroup = session.qtGroup;
                if (session?.grade !== undefined) token.grade = session.grade;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.status = token.status;
                session.user.grade = token.grade;
                session.user.nickname = token.nickname;
                session.user.qtGroup = token.qtGroup;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    // Ensure cookies are handled correctly across subdomains if applicable
    cookies: {
        sessionToken: {
            name: process.env.NODE_ENV === 'production' ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production'
            }
        }
    }
};
