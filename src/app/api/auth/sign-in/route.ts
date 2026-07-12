import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signInSchema } from "@/lib/validation/auth";
import { getClientIp, geolocateIp } from "@/lib/audit";
import { recognizeLogin } from "@/lib/deviceRecognition";
import { defaultViewFor, type Role } from "@/lib/permissions";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signInSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { email, password } = parsed.data;
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent");

  const supabase = await createClient();

  const { data: lockedBefore } = await supabase.rpc("fraudshield_is_locked_out", { p_email: email });
  if (lockedBefore) {
    return NextResponse.json(
      { error: "Too many failed attempts. Try again in a few minutes." },
      { status: 423 }
    );
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword({ email, password });

  const { data: nowLocked } = await supabase.rpc("fraudshield_record_login_attempt", {
    p_email: email,
    p_ip: ip,
    p_user_agent: userAgent,
    p_success: !error,
  });

  if (error || !signInData.user) {
    if (nowLocked) {
      return NextResponse.json(
        { error: "Too many failed attempts. Your account is temporarily locked." },
        { status: 423 }
      );
    }
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const user = signInData.user;
  const country = await geolocateIp(ip);
  const { isNewDevice, isNewCountry } = await recognizeLogin(supabase, user.id, userAgent, ip, country);

  if (isNewDevice || isNewCountry) {
    await supabase.from("fraudshield_audit_logs").insert({
      user_id: user.id,
      event_type: isNewDevice ? "new_device_login" : "new_country_login",
      ip_address: ip,
      user_agent: userAgent,
      country,
    });
  }

  const { data: profile } = await supabase
    .from("fraudshield_profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role ?? "read_only") as Role;

  return NextResponse.json({
    ok: true,
    role,
    defaultView: defaultViewFor(role),
    flags: { isNewDevice, isNewCountry },
  });
}
