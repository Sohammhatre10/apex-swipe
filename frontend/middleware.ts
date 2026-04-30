import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/swipe", "/profile", "/search"];

export function middleware(req: NextRequest) {
  const needsAuth = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("apexswipe_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/swipe/:path*", "/profile/:path*", "/search/:path*"],
};
