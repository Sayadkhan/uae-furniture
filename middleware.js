import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // Security Headers (relaxed CSP for compatibility)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' blob: data: https: http:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

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
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
};
