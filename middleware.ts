import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname; // example: /product/shoes
  const segments = pathname.split("/").filter(Boolean);

  const handle = segments[0] === "product" ? segments[1] : null;

  const response = NextResponse.next();

  if (handle) {
    response.headers.set("x-product-handle", handle);
  }

  return response;
}

export const config = {
  matcher: ["/product/:handle*"],
};
