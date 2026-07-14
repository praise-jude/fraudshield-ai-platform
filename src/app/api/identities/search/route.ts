import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { rowToTransaction, type TransactionRow } from "@/lib/rows";
import type { IdentitySummary } from "@/lib/types";

export async function GET(request: Request) {
  const authed = await requireRole("view:identities");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const { data: rows, error } = await supabase
    .from("fraudshield_transactions")
    .select("*")
    .eq("org_id", orgId)
    .or(`customer.ilike.%${q}%,device.ilike.%${q}%,ip.eq.${q}`)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }

  const byCustomer = new Map<string, IdentitySummary & { scores: number[] }>();
  const qLower = q.toLowerCase();

  for (const row of (rows as TransactionRow[] | null) ?? []) {
    const tx = rowToTransaction(row);
    const matchedOn: IdentitySummary["matchedOn"] = tx.customer.toLowerCase().includes(qLower)
      ? "customer"
      : tx.device.toLowerCase().includes(qLower)
        ? "device"
        : "ip";

    const existing = byCustomer.get(tx.customer);
    if (existing) {
      existing.transactionCount += 1;
      existing.scores.push(tx.riskScore);
      existing.maxRiskScore = Math.max(existing.maxRiskScore, tx.riskScore);
      if (tx.time > existing.lastSeen) existing.lastSeen = tx.time;
    } else {
      byCustomer.set(tx.customer, {
        customer: tx.customer,
        transactionCount: 1,
        avgRiskScore: tx.riskScore,
        maxRiskScore: tx.riskScore,
        lastSeen: tx.time,
        matchedOn,
        scores: [tx.riskScore],
      });
    }
  }

  const results: IdentitySummary[] = Array.from(byCustomer.values()).map((entry) => ({
    customer: entry.customer,
    transactionCount: entry.transactionCount,
    avgRiskScore: Math.round(entry.scores.reduce((s, n) => s + n, 0) / entry.scores.length),
    maxRiskScore: entry.maxRiskScore,
    lastSeen: entry.lastSeen,
    matchedOn: entry.matchedOn,
  }));

  return NextResponse.json({ results });
}
