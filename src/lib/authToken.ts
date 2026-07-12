import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

export const SESSION_COOKIE = "fs_session";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function secret(): string {
  const value = process.env.API_SHARED_SECRET;
  if (!value) throw new Error("API_SHARED_SECRET must be set");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function issueToken(): string {
  const issuedAt = Date.now().toString();
  return `${issuedAt}.${sign(issuedAt)}`;
}

export function extractToken(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${SESSION_COOKIE}=`));
  return match ? match.slice(SESSION_COOKIE.length + 1) : null;
}

export function isValidToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;
  if (Date.now() - Number(issuedAt) > TOKEN_TTL_MS) return false;

  const expected = sign(issuedAt);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Returns a 401 response if the request lacks a valid session cookie, else null. */
export function requireSession(request: Request): NextResponse | null {
  if (isValidToken(extractToken(request))) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
