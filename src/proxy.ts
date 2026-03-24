import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.debug("[START: proxy]", { pathname });

  const session = getSessionCookie(request);

  if (!session) {
    console.debug("[END: proxy] no session cookie — redirecting to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.debug("[END: proxy] session cookie found");
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
