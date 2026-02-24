import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";
import { LOTTERY_SLUGS } from "@/constants/lotteries";

const protectedPrefixes = ["/dashboard", "/profile", "/saved-games"];

function isProtectedRoute(pathname: string): boolean {
  if (protectedPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }
  const firstSegment = pathname.split("/")[1];
  if (LOTTERY_SLUGS.includes(firstSegment as (typeof LOTTERY_SLUGS)[number])) {
    return true;
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasAuthToken = request.cookies.get("__session")?.value;

  if (isProtectedRoute(pathname) && !hasAuthToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ROUTES.includes(pathname) && hasAuthToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
