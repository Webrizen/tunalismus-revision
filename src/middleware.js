import { NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const { pathname } = req.nextUrl;

  const publicPaths = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/forgot-password",
    "/api/auth/reset-password",
  ];

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Allow login page and home page
  if (pathname.startsWith("/login") || pathname === "/") {
    return NextResponse.next();
  }

  // For API routes, check authentication
  if (pathname.startsWith("/api/")) {
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("X-User-Id", payload.id);
      requestHeaders.set("X-User-Role", payload.role);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }
  }

  // For page routes, let the client-side RouteGuard handle authentication
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};