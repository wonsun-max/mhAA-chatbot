import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

/**
 * Next.js 16 Proxy Function
 * Acts as a network boundary and routing layer.
 */
export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const secret = process.env.NEXTAUTH_SECRET

    // 1. Skip proxy for non-protected routes and static assets
    const protectedPaths = ["/admin", "/profile", "/chatbot"]
    const isProtected = protectedPaths.some(path => pathname.startsWith(path))

    if (!isProtected) return NextResponse.next()

    // 2. Extract Token
    const token = await getToken({ req, secret })

    if (!token) {
        const loginUrl = new URL("/login", req.url)
        loginUrl.searchParams.set("callbackUrl", pathname)
        return NextResponse.redirect(loginUrl)
    }

    // 3. Role-based Authorization
    if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export default proxy

export const config = {
    matcher: [
        "/admin/:path*",
        "/profile/:path*",
        "/chatbot/:path*",
    ],
}
