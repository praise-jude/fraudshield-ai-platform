import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureOrganizationProvisioned } from "@/lib/orgProvisioning";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await ensureOrganizationProvisioned(supabase, data.user);

      const { data: profile } = await supabase
        .from("fraudshield_profiles")
        .select("org_id")
        .eq("id", data.user.id)
        .maybeSingle();

      await supabase.from("fraudshield_audit_logs").insert({
        org_id: profile?.org_id ?? null,
        user_id: data.user.id,
        event_type: "email_verified",
      });

      return NextResponse.redirect(new URL(next, url.origin));
    }
  }

  return NextResponse.redirect(new URL("/auth/sign-in?error=verification_failed", url.origin));
}
