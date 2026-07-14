import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import {
  rowToCase,
  rowToCaseEvent,
  rowToCaseNote,
  rowToTransaction,
  type CaseEventRow,
  type CaseNoteRow,
  type CaseRow,
  type TransactionRow,
} from "@/lib/rows";
import type { CaseRecord, CaseResolution, LinkedActivity } from "@/lib/types";

const NEXT_STATUS: Record<CaseRecord["status"], CaseRecord["status"]> = {
  new: "investigating",
  investigating: "resolved",
  resolved: "resolved",
};

export async function GET(_request: Request, { params }: { params: Promise<{ txId: string }> }) {
  const authed = await requireRole("view:cases");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const { txId } = await params;
  const supabase = await createClient();

  const { data: caseRow, error } = await supabase
    .from("fraudshield_cases")
    .select("tx_id, status, resolution, tx:fraudshield_transactions(*)")
    .eq("org_id", orgId)
    .eq("tx_id", txId)
    .single();

  if (error || !caseRow) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const record = rowToCase(caseRow as CaseRow);
  if (!record) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const [{ data: noteRows }, { data: eventRows }, { data: linkedRows }] = await Promise.all([
    supabase
      .from("fraudshield_case_notes")
      .select("id, tx_id, author_name, note, created_at")
      .eq("org_id", orgId)
      .eq("tx_id", txId)
      .order("created_at", { ascending: false }),
    supabase
      .from("fraudshield_case_events")
      .select("id, tx_id, event_type, actor_name, detail, created_at")
      .eq("org_id", orgId)
      .eq("tx_id", txId)
      .order("created_at", { ascending: false }),
    supabase
      .from("fraudshield_transactions")
      .select("*")
      .eq("org_id", orgId)
      .neq("id", txId)
      .or(`customer.eq.${record.tx.customer},device.eq.${record.tx.device},ip.eq.${record.tx.ip}`)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const linkedActivity: LinkedActivity[] = ((linkedRows as TransactionRow[] | null) ?? []).map((row) => {
    const tx = rowToTransaction(row);
    const matchType = tx.customer === record.tx.customer ? "customer" : tx.ip === record.tx.ip ? "ip" : "device";
    const matchValue = matchType === "customer" ? tx.customer : matchType === "ip" ? tx.ip : tx.device;
    return { matchType, matchValue, transaction: tx };
  });

  return NextResponse.json({
    case: record,
    notes: ((noteRows as CaseNoteRow[] | null) ?? []).map(rowToCaseNote),
    events: ((eventRows as CaseEventRow[] | null) ?? []).map(rowToCaseEvent),
    linkedActivity,
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ txId: string }> }) {
  const authed = await requireRole("manage:cases");
  if (!isAuthedUser(authed)) return authed;
  const { orgId, user } = authed;

  const { txId } = await params;
  const body = await request.json().catch(() => ({}) as { resolution?: CaseResolution });
  const supabase = await createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("fraudshield_cases")
    .select("status")
    .eq("org_id", orgId)
    .eq("tx_id", txId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const nextStatus = NEXT_STATUS[existing.status as CaseRecord["status"]];
  const resolution = nextStatus === "resolved" ? (body.resolution ?? "resolved_legitimate") : null;

  const { error: updateError } = await supabase
    .from("fraudshield_cases")
    .update({ status: nextStatus, resolution })
    .eq("org_id", orgId)
    .eq("tx_id", txId);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
  }

  await supabase.from("fraudshield_case_events").insert({
    tx_id: txId,
    org_id: orgId,
    event_type: "status_changed",
    actor_user_id: user.id,
    actor_name: user.email,
    detail: { status: nextStatus, resolution },
  });

  return NextResponse.json({ txId, status: nextStatus, resolution });
}
