import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /product routes
  if (pathname.startsWith('/product')) {
    const segments = pathname.split('/').filter(Boolean);
    const handle = segments[1] || null;

    const response = NextResponse.next();
    if (handle) {
      response.headers.set('x-product-handle', handle);
    }
    return response;
  }

  // Handle /admin routes
  if (pathname.startsWith('/admin')) {

    const token = request.cookies.get('token') ;

    if (!token) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Proceed to the requested admin page
    return NextResponse.next();
  }

  // Default response for other routes
  return NextResponse.next();
}

export const config = {
  matcher: ['/product/:handle*', '/admin/:path*'],
};