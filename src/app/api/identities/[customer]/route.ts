import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { rowToCase, rowToTransaction, type CaseRow, type TransactionRow } from "@/lib/rows";
import type { CaseRecord, IdentityProfile, RelatedIdentity, Transaction } from "@/lib/types";

export async function GET(_request: Request, { params }: { params: Promise<{ customer: string }> }) {
  const authed = await requireRole("view:identities");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const { customer: encodedCustomer } = await params;
  const customer = decodeURIComponent(encodedCustomer);
  const supabase = await createClient();

  const { data: txRows, error } = await supabase
    .from("fraudshield_transactions")
    .select("*")
    .eq("org_id", orgId)
    .eq("customer", customer)
    .order("created_at", { ascending: false });

  if (error || !txRows || txRows.length === 0) {
    return NextResponse.json({ error: "Identity not found" }, { status: 404 });
  }

  const transactions: Transaction[] = (txRows as TransactionRow[]).map(rowToTransaction);
  const devices = Array.from(new Set(transactions.map((t) => t.device)));
  const ips = Array.from(new Set(transactions.map((t) => t.ip)));
  const countries = Array.from(new Set(transactions.map((t) => t.country)));
  const scores = transactions.map((t) => t.riskScore);

  const txIds = transactions.map((t) => t.id);
  const { data: caseRows } = await supabase
    .from("fraudshield_cases")
    .select("tx_id, status, resolution, tx:fraudshield_transactions(*)")
    .eq("org_id", orgId)
    .in("tx_id", txIds);

  const cases: CaseRecord[] = ((caseRows as CaseRow[] | null) ?? [])
    .map(rowToCase)
    .filter((c): c is CaseRecord => c !== null);

  const orFilter = [
    devices.length > 0 ? `device.in.(${devices.join(",")})` : null,
    ips.length > 0 ? `ip.in.(${ips.join(",")})` : null,
  ]
    .filter(Boolean)
    .join(",");

  let relatedIdentities: RelatedIdentity[] = [];
  if (orFilter) {
    const { data: relatedRows } = await supabase
      .from("fraudshield_transactions")
      .select("*")
      .eq("org_id", orgId)
      .neq("customer", customer)
      .or(orFilter)
      .limit(200);

    const byCustomer = new Map<string, RelatedIdentity & { scores: number[] }>();
    for (const row of (relatedRows as TransactionRow[] | null) ?? []) {
      const tx = rowToTransaction(row);
      const sharedVia: RelatedIdentity["sharedVia"] = devices.includes(tx.device) ? "device" : "ip";
      const sharedValue = sharedVia === "device" ? tx.device : tx.ip;
      const key = `${tx.customer}:${sharedVia}:${sharedValue}`;
      const existing = byCustomer.get(key);
      if (existing) {
        existing.transactionCount += 1;
        existing.scores.push(tx.riskScore);
        existing.maxRiskScore = Math.max(existing.maxRiskScore, tx.riskScore);
      } else {
        byCustomer.set(key, {
          customer: tx.customer,
          sharedVia,
          sharedValue,
          transactionCount: 1,
          maxRiskScore: tx.riskScore,
          scores: [tx.riskScore],
        });
      }
    }
    relatedIdentities = Array.from(byCustomer.values()).map(({ scores: _scores, ...rest }) => rest);
  }

  const profile: IdentityProfile = {
    customer,
    stats: {
      transactionCount: transactions.length,
      avgRiskScore: Math.round(scores.reduce((s, n) => s + n, 0) / scores.length),
      maxRiskScore: Math.max(...scores),
      devices,
      ips,
      countries,
    },
    transactions,
    cases,
    relatedIdentities,
  };

  return NextResponse.json({ profile });
}
