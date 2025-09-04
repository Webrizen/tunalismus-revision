import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const { pathname } = req.nextUrl;

  const publicPaths = ["/api/auth/login", "/api/auth/register", "/api/auth/forgot-password", "/api/auth/reset-password"];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/login') || pathname === '/') {
    return NextResponse.next();
  }

  if (!token) {
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('X-User-Id', decoded.id);
    requestHeaders.set('X-User-Role', decoded.role);

    if (pathname.startsWith('/admin') && decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/login",
    "/"
  ],
};
