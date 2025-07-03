"use server";

import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { auth } from "./auth";

const url = process.env.WEB_URL! || "http://localhost:3000";
const privateRoutes = [
  "/profile",
  "/settings",
  "/dashboard",
  "/complete-profile",
  "/ai-cover-letter",
  "/interview",
  "/resume",

];

export default async function middleware(req: NextRequest) {
  const session = await auth();
  const isLoggedIn = !!session;
  const { nextUrl } = req;
  const isPrivateRoutes = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.includes("/auth");
  const isApiRoute = nextUrl.pathname.includes("/api");

  if (isApiRoute) {
    return;
  }
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(`${url}dashboard`);
  }
  if (isAuthRoute && !isLoggedIn) {
    return;
  }
  if (isPrivateRoutes && !isLoggedIn) {
    return NextResponse.redirect(`${url}auth/login`);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
