import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { requireSession } from "@/lib/authToken";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const { id } = await params;
  const body = await request.json().catch(() => null);

  if (!body || typeof body.enabled !== "boolean") {
    return NextResponse.json({ error: "Body must include a boolean 'enabled'" }, { status: 400 });
  }

  const { error } = await supabaseServer
    .from("fraudshield_rules")
    .update({ enabled: body.enabled })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 });
  }

  return NextResponse.json({ id, enabled: body.enabled });
}
