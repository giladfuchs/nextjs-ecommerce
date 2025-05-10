import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle /product routes
  if (pathname.startsWith("/product")) {
    const segments = pathname.split("/").filter(Boolean);
    const handle = segments[1] || null;

    const response = NextResponse.next();
    if (handle) {
      response.headers.set("x-product-handle", handle);
    }
    return response;
  }

  // Default response for other routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:handle*"],
};
