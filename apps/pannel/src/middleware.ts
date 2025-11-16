import { auth } from "@workspace/auth";
import { NextResponse } from "next/server";
import { authRoutes } from "./constants/route";

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = authRoutes.includes(pathname);

  // If logged in and trying to access auth pages, redirect to home
  if (isLoggedIn && isAuthRoute) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    if (callbackUrl && callbackUrl !== pathname) {
      return NextResponse.redirect(new URL(callbackUrl, req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If not logged in and trying to access protected pages
  if (!isLoggedIn && !isAuthRoute) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
