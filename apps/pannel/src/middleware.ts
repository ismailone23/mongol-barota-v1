import { auth } from "@workspace/auth";
import { NextResponse } from "next/server";
import { authRoutes } from "./constants/route";
// import { apiAuthPrefixs } from "./constants/route";

export default auth(async (req) => {
  const pathname = req.nextUrl.pathname;
  const isLoggedIn = req.auth;
  const isAuthUrl = authRoutes.includes(pathname);
  // if (apiAuthPrefixs) {
  //   return NextResponse.next();
  // }
  if (isLoggedIn && isAuthUrl) {
    const callbackUrl = req.nextUrl.searchParams.get("callbackUrl");
    return NextResponse.redirect(new URL(callbackUrl ?? "/", req.url));
  }

  if (!isLoggedIn && !isAuthUrl) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
