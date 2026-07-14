import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { rowToCaseNote, type CaseNoteRow } from "@/lib/rows";

export async function POST(request: Request, { params }: { params: Promise<{ txId: string }> }) {
  const authed = await requireRole("manage:cases");
  if (!isAuthedUser(authed)) return authed;
  const { orgId, user } = authed;

  const { txId } = await params;
  const body = await request.json().catch(() => null);
  const note = typeof body?.note === "string" ? body.note.trim() : "";
  if (!note) {
    return NextResponse.json({ error: "Note text is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const authorName = user.email ?? "Unknown";

  const { data, error } = await supabase
    .from("fraudshield_case_notes")
    .insert({ tx_id: txId, org_id: orgId, author_user_id: user.id, author_name: authorName, note })
    .select("id, tx_id, author_name, note, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }

  await supabase.from("fraudshield_case_events").insert({
    tx_id: txId,
    org_id: orgId,
    event_type: "note_added",
    actor_user_id: user.id,
    actor_name: authorName,
  });

  return NextResponse.json({ note: rowToCaseNote(data as CaseNoteRow) });
}
