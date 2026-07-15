import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { assembleTransaction, generateRawTransaction, scoreTransaction } from "@/lib/mock";
import { transactionToRow, rowToRule, rowToWatchlistEntry, type RuleRow, type WatchlistRow } from "@/lib/rows";
import type { CaseRecord } from "@/lib/types";

export async function POST() {
  const authed = await requireRole("simulate:transactions");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const supabase = await createClient();
  const raw = generateRawTransaction();

  const [{ data: ruleRows }, { count: recentCount }, { data: watchlistRows }] = await Promise.all([
    supabase.from("fraudshield_rules").select("*").eq("org_id", orgId).eq("enabled", true),
    supabase
      .from("fraudshield_transactions")
      .select("id", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("customer", raw.customer)
      .gte("created_at", new Date(Date.now() - 2 * 60 * 1000).toISOString()),
    supabase.from("fraudshield_watchlist").select("*").eq("org_id", orgId),
  ]);

  const rules = ((ruleRows as RuleRow[] | null) ?? []).map(rowToRule);
  const watchlist = ((watchlistRows as WatchlistRow[] | null) ?? []).map(rowToWatchlistEntry);
  const scored = scoreTransaction(raw, rules, (recentCount ?? 0) + 1, watchlist);
  const transaction = assembleTransaction(raw, scored);

  const { error: txError } = await supabase
    .from("fraudshield_transactions")
    .insert(transactionToRow(transaction, orgId));
  if (txError) {
    console.error("insert transaction failed", txError);
    return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
  }

  let caseRecord: CaseRecord | null = null;
  if (transaction.riskScore > 60) {
    const { error: caseError } = await supabase
      .from("fraudshield_cases")
      .insert({ tx_id: transaction.id, status: "new", org_id: orgId });
    if (!caseError) {
      caseRecord = { txId: transaction.id, tx: transaction, status: "new" };
      await supabase.from("fraudshield_case_events").insert({
        tx_id: transaction.id,
        org_id: orgId,
        event_type: "case_created",
        actor_name: "System",
        detail: { riskScore: transaction.riskScore },
      });
    }
  }

  return NextResponse.json({ transaction, case: caseRecord });
}
