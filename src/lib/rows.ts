import type { Transaction } from "./types";

export interface TransactionRow {
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

export function rowToTransaction(row: TransactionRow): Transaction {
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

export function transactionToRow(tx: Transaction) {
  return {
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
  };
}
