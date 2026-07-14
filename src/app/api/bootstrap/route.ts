import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_RULES, seedTransactions } from "@/lib/mock";
import type { CaseRecord, Rule, Transaction } from "@/lib/types";
import { rowToCase, rowToRule, rowToTransaction, transactionToRow, type CaseRow, type RuleRow, type TransactionRow } from "@/lib/rows";

export async function GET() {
  const authed = await requireRole("view:overview");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const supabase = await createClient();

  const [{ data: txRows }, { data: ruleRows }] = await Promise.all([
    supabase
      .from("fraudshield_transactions")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(60),
    supabase.from("fraudshield_rules").select("*").eq("org_id", orgId).order("name"),
  ]);

  let rules: Rule[] = (ruleRows as RuleRow[] | null)?.map(rowToRule) ?? [];

  if (rules.length === 0) {
    const { data: insertedRules, error } = await supabase
      .from("fraudshield_rules")
      .insert(
        DEFAULT_RULES.map((r) => ({
          org_id: orgId,
          name: r.name,
          description: r.description,
          enabled: r.enabled,
          rule_type: r.ruleType,
          config: r.config,
        }))
      )
      .select("*");
    if (!error && insertedRules) rules = (insertedRules as RuleRow[]).map(rowToRule);
  }

  let transactions: Transaction[] = (txRows as TransactionRow[] | null)?.map(rowToTransaction) ?? [];

  if (transactions.length === 0) {
    const seeded = seedTransactions(24, rules);
    const { error } = await supabase
      .from("fraudshield_transactions")
      .insert(seeded.map((tx) => transactionToRow(tx, orgId)));
    if (!error) transactions = seeded;
  }

  const { data: caseRows } = await supabase
    .from("fraudshield_cases")
    .select("tx_id, status, resolution, tx:fraudshield_transactions(*)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .limit(20);

  let cases: CaseRecord[] = ((caseRows as CaseRow[] | null) ?? []).map(rowToCase).filter((c): c is CaseRecord => c !== null);

  if (cases.length === 0 && transactions.length > 0) {
    const highRisk = transactions.filter((t) => t.riskScore > 60).slice(0, 5);
    const statuses: CaseRecord["status"][] = ["new", "investigating", "new", "resolved", "investigating"];
    const seededCases = highRisk.map((t, i) => ({ txId: t.id, tx: t, status: statuses[i % statuses.length] }));
    if (seededCases.length > 0) {
      const { error } = await supabase
        .from("fraudshield_cases")
        .insert(seededCases.map((c) => ({ tx_id: c.txId, status: c.status, org_id: orgId })));
      if (!error) cases = seededCases;
    }
  }

  return NextResponse.json({ transactions, cases, rules });
}
