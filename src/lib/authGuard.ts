import "server-only";
import { createClient } from "@/lib/supabase/server";
import { hasPermission, unauthorized, forbidden, type AuthedUser, type Permission } from "@/lib/permissions";
import { NextResponse } from "next/server";

export async function getAuthedUser(): Promise<AuthedUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("fraudshield_profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();
  if (!profile) return null;

  return { user, role: profile.role, orgId: profile.org_id };
}

/** For Route Handlers: returns the authed user, or a 401/403 NextResponse to return immediately. */
export async function requireRole(
  allowed: Permission | Permission[]
): Promise<AuthedUser | NextResponse> {
  const authed = await getAuthedUser();
  if (!authed) return unauthorized();

  const perms = Array.isArray(allowed) ? allowed : [allowed];
  if (!perms.some((p) => hasPermission(authed.role, p))) return forbidden();

  return authed;
}

export function isAuthedUser(value: AuthedUser | NextResponse): value is AuthedUser {
  return !(value instanceof NextResponse);
}
