import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import type { CaseRecord } from "@/lib/types";

const NEXT_STATUS: Record<CaseRecord["status"], CaseRecord["status"]> = {
  new: "investigating",
  investigating: "resolved",
  resolved: "resolved",
};

export async function PATCH(_request: Request, { params }: { params: Promise<{ txId: string }> }) {
  const { txId } = await params;

  const { data: existing, error: fetchError } = await supabaseServer
    .from("fraudshield_cases")
    .select("status")
    .eq("tx_id", txId)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Case not found" }, { status: 404 });
  }

  const nextStatus = NEXT_STATUS[existing.status as CaseRecord["status"]];

  const { error: updateError } = await supabaseServer
    .from("fraudshield_cases")
    .update({ status: nextStatus })
    .eq("tx_id", txId);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
  }

  return NextResponse.json({ txId, status: nextStatus });
}
