import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClientIp } from "@/lib/audit";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("fraudshield_profiles")
      .select("org_id")
      .eq("id", user.id)
      .maybeSingle();

    await supabase.from("fraudshield_audit_logs").insert({
      org_id: profile?.org_id ?? null,
      user_id: user.id,
      event_type: "logout",
      ip_address: getClientIp(request),
      user_agent: request.headers.get("user-agent"),
    });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
