import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const { pathname } = req.nextUrl;

  const publicPaths = ["/api/auth/login", "/api/auth/register"];

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('X-User-Id', decoded.id);
    requestHeaders.set('X-User-Role', decoded.role);


    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}

export const config = {
  matcher: [
    "/api/users/:path*",
    "/api/courses/:path*",
    "/api/batches/:path*",
    "/api/payments/:path*",
    "/api/materials/:path*",
    "/api/attendance/:path*",
    "/api/progress/:path*",
    "/api/meetings/:path*",
  ],
};
