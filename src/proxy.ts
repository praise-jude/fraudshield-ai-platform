import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = [
  "/auth/sign-in",
  "/auth/sign-up",
  "/auth/verify-email",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/callback",
];

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const path = request.nextUrl.pathname;
  const isApi = path.startsWith("/api/");
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));

  // API routes always get a refreshed session cookie (so their own server
  // client sees it) but return 401 JSON via requireRole rather than a
  // redirect — handled per-route, not here.
  if (!user && !isApi && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/sign-in";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
