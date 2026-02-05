import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip ALL middleware processing for now - just handle auth
  const response = NextResponse.next();

  const token = request.cookies.get("token")?.value;

  // --- Admin routes protection ---
  if (pathname.startsWith("/admin")) {
    if (pathname.startsWith("/admin/login")) {
      return response;
    }
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // --- Dashboard routes protection ---
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
};
