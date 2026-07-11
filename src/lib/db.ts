import { supabase } from "./supabaseClient";
import type { CaseRecord, Rule, Transaction } from "./types";

interface CaseRow {
  tx_id: string;
  status: CaseRecord["status"];
  tx: TransactionRow | TransactionRow[] | null;
}

interface TransactionRow {
  id: string;
  customer: string;
  country: string;
  device: string;
  device_icon: string;
  ip: string;
  currency_symbol: string;
  amount: number;
  amount_display: string;
  risk_score: number;
  status_label: string;
  created_at: string;
}

function rowToTransaction(row: TransactionRow): Transaction {
  const d = new Date(row.created_at);
  return {
    id: row.id,
    customer: row.customer,
    country: row.country,
    device: row.device,
    deviceIcon: row.device_icon,
    ip: row.ip,
    currencySymbol: row.currency_symbol,
    amount: Number(row.amount),
    amountDisplay: row.amount_display,
    riskScore: row.risk_score,
    statusLabel: row.status_label,
    time: d.toTimeString().slice(0, 8),
    createdAt: d.getTime(),
  };
}

export async function fetchTransactions(limit = 60): Promise<Transaction[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("fraudshield_transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return (data as TransactionRow[]).map(rowToTransaction);
}

export async function fetchCases(): Promise<CaseRecord[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("fraudshield_cases")
    .select("tx_id, status, tx:fraudshield_transactions(*)")
    .order("created_at", { ascending: false })
    .limit(20);
  if (error || !data) return [];
  return (data as unknown as CaseRow[])
    .map((row) => {
      const txRow = Array.isArray(row.tx) ? row.tx[0] : row.tx;
      if (!txRow) return null;
      return {
        txId: row.tx_id,
        status: row.status,
        tx: rowToTransaction(txRow),
      };
    })
    .filter((c): c is CaseRecord => c !== null);
}

export async function fetchRules(): Promise<Rule[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("fraudshield_rules")
    .select("id, name, description, enabled")
    .order("id", { ascending: true });
  if (error || !data) return [];
  return data as Rule[];
}

export async function insertTransaction(tx: Transaction): Promise<void> {
  if (!supabase) return;
  await supabase.from("fraudshield_transactions").insert({
    id: tx.id,
    customer: tx.customer,
    country: tx.country,
    device: tx.device,
    device_icon: tx.deviceIcon,
    ip: tx.ip,
    currency_symbol: tx.currencySymbol,
    amount: tx.amount,
    amount_display: tx.amountDisplay,
    risk_score: tx.riskScore,
    status_label: tx.statusLabel,
    created_at: new Date(tx.createdAt).toISOString(),
  });
}

export async function insertTransactions(txs: Transaction[]): Promise<void> {
  if (!supabase || txs.length === 0) return;
  await supabase.from("fraudshield_transactions").insert(
    txs.map((tx) => ({
      id: tx.id,
      customer: tx.customer,
      country: tx.country,
      device: tx.device,
      device_icon: tx.deviceIcon,
      ip: tx.ip,
      currency_symbol: tx.currencySymbol,
      amount: tx.amount,
      amount_display: tx.amountDisplay,
      risk_score: tx.riskScore,
      status_label: tx.statusLabel,
      created_at: new Date(tx.createdAt).toISOString(),
    }))
  );
}

export async function insertCase(txId: string, status: CaseRecord["status"]): Promise<void> {
  if (!supabase) return;
  await supabase.from("fraudshield_cases").insert({ tx_id: txId, status });
}

export async function updateCaseStatus(txId: string, status: CaseRecord["status"]): Promise<void> {
  if (!supabase) return;
  await supabase.from("fraudshield_cases").update({ status }).eq("tx_id", txId);
}

export async function updateRuleEnabled(id: string, enabled: boolean): Promise<void> {
  if (!supabase) return;
  await supabase.from("fraudshield_rules").update({ enabled }).eq("id", id);
}
