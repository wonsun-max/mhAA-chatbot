import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Custom middleware using getToken directly.
 * This is more reliable than withAuth in Next.js 15+ Edge Runtime
 * because it explicitly passes the secret, avoiding any env reading issues.
 */
export default async function middleware(req: NextRequest) {
    const secret = process.env.NEXTAUTH_SECRET
    const token = await getToken({ req, secret })
    const { pathname } = req.nextUrl

    // No valid session token → redirect to login
    if (!token) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Authenticated but NOT admin → block admin routes
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/admin",
        "/admin/:path*",
        "/profile",
        "/profile/:path*",
        "/chatbot",
        "/chatbot/:path*",
    ],
}
