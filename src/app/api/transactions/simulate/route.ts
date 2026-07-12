import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { requireSession } from "@/lib/authToken";
import { makeTransaction } from "@/lib/mock";
import { transactionToRow } from "@/lib/rows";
import type { CaseRecord } from "@/lib/types";

export async function POST(request: Request) {
  const unauthorized = requireSession(request);
  if (unauthorized) return unauthorized;

  const transaction = makeTransaction();

  const { error: txError } = await supabaseServer
    .from("fraudshield_transactions")
    .insert(transactionToRow(transaction));
  if (txError) {
    console.error("insert transaction failed", txError);
    return NextResponse.json({ error: "Failed to record transaction" }, { status: 500 });
  }

  let caseRecord: CaseRecord | null = null;
  if (transaction.riskScore > 60) {
    const { error: caseError } = await supabaseServer
      .from("fraudshield_cases")
      .insert({ tx_id: transaction.id, status: "new" });
    if (!caseError) {
      caseRecord = { txId: transaction.id, tx: transaction, status: "new" };
    }
  }

  return NextResponse.json({ transaction, case: caseRecord });
}
