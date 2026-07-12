import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { seedTransactions } from "@/lib/mock";
import type { CaseRecord, Rule, Transaction } from "@/lib/types";
import { rowToTransaction, transactionToRow, type TransactionRow } from "@/lib/rows";

export async function GET() {
  const [{ data: txRows }, { data: ruleRows }] = await Promise.all([
    supabaseServer
      .from("fraudshield_transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60),
    supabaseServer.from("fraudshield_rules").select("id, name, description, enabled").order("id"),
  ]);

  let transactions: Transaction[] = (txRows as TransactionRow[] | null)?.map(rowToTransaction) ?? [];
  const rules: Rule[] = (ruleRows as Rule[] | null) ?? [];

  if (transactions.length === 0) {
    const seeded = seedTransactions(24);
    const { error } = await supabaseServer.from("fraudshield_transactions").insert(seeded.map(transactionToRow));
    if (!error) transactions = seeded;
  }

  const { data: caseRows } = await supabaseServer
    .from("fraudshield_cases")
    .select("tx_id, status, tx:fraudshield_transactions(*)")
    .order("created_at", { ascending: false })
    .limit(20);

  let cases: CaseRecord[] = mapCases(caseRows);

  if (cases.length === 0 && transactions.length > 0) {
    const highRisk = transactions.filter((t) => t.riskScore > 60).slice(0, 5);
    const statuses: CaseRecord["status"][] = ["new", "investigating", "new", "resolved", "investigating"];
    const seededCases = highRisk.map((t, i) => ({ txId: t.id, tx: t, status: statuses[i % statuses.length] }));
    if (seededCases.length > 0) {
      const { error } = await supabaseServer
        .from("fraudshield_cases")
        .insert(seededCases.map((c) => ({ tx_id: c.txId, status: c.status })));
      if (!error) cases = seededCases;
    }
  }

  return NextResponse.json({ transactions, cases, rules });
}

interface CaseRow {
  tx_id: string;
  status: CaseRecord["status"];
  tx: TransactionRow | TransactionRow[] | null;
}

function mapCases(rows: unknown): CaseRecord[] {
  if (!rows) return [];
  return (rows as CaseRow[])
    .map((row) => {
      const txRow = Array.isArray(row.tx) ? row.tx[0] : row.tx;
      if (!txRow) return null;
      return { txId: row.tx_id, status: row.status, tx: rowToTransaction(txRow) };
    })
    .filter((c): c is CaseRecord => c !== null);
}
