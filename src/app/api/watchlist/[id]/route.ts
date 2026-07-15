import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireRole("manage:watchlist");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("fraudshield_watchlist").delete().eq("org_id", orgId).eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to remove entry" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
