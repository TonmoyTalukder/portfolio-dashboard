import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import { getCurrentUser } from "@/src/services/AuthService";

const AuthRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const user = await getCurrentUser();

  if (!user) {
    if (AuthRoutes.includes(pathname)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(
        new URL(`/login?redirect=${pathname}`, request.url),
      );
    }
  }

  // Restrict access to login/signup pages for logged-in users
  if (AuthRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
