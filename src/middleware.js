import { NextResponse } from "next/server";

export function middleware(request) {
  const user = request.cookies.get("user");

  const { pathname } = request.nextUrl;

  // If user is not logged in, redirect to login page
  if (
    !user &&
    !(pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in, redirect to dashboard
  if (
    user &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/board/:path*", "/login", "/register"],
};
