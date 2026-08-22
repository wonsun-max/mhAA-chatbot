import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // 1. Block PENDING users from accessing protected routes
    if (token?.status === "PENDING" && pathname !== "/pending") {
      return NextResponse.redirect(new URL("/pending", req.url));
    }

    // 2. Role-based Authorization for Admin
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/profile/:path*",
    "/chatbot/:path*",
    "/collab/:path*",
    "/community/:path*",
    "/admin",
    "/profile",
    "/chatbot",
    "/collab",
    "/community",
  ],
};
