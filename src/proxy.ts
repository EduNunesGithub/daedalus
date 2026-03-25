import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const appHost = new URL(
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  ).host;

  console.debug("[START: proxy]", { host, pathname });

  if (host !== appHost) {
    const url = request.nextUrl.clone();
    url.pathname = `/domain/${host}${pathname}`;
    console.debug("[END: proxy] custom domain rewrite", { to: url.pathname });
    return NextResponse.rewrite(url);
  }

  const session = getSessionCookie(request);

  if (!session) {
    console.debug("[END: proxy] no session — redirecting");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  console.debug("[END: proxy] session found");
  return NextResponse.next();
}

export const config = {
  matcher: ["/create-workspace", "/dashboard/:path*"],
};
