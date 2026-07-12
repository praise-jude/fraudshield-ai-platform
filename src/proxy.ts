import { NextResponse } from "next/server";
import { SESSION_COOKIE, extractToken, issueToken, isValidToken } from "@/lib/authToken";

export function proxy(request: Request) {
  if (isValidToken(extractToken(request))) {
    return NextResponse.next();
  }

  const res = NextResponse.next();
  res.cookies.set(SESSION_COOKIE, issueToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}

export const config = {
  matcher: "/",
};
