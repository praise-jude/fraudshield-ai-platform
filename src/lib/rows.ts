import type {
  CaseNote,
  CaseEvent,
  CaseRecord,
  CaseResolution,
  Rule,
  RuleType,
  Transaction,
  WatchlistEntry,
  WatchlistEntryType,
  WatchlistType,
} from "./types";

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
  risk_factors: Transaction["riskFactors"] | null;
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
    riskFactors: row.risk_factors ?? [],
    time: d.toTimeString().slice(0, 8),
    createdAt: d.getTime(),
  };
}

export function transactionToRow(tx: Transaction, orgId: string) {
  return {
    id: tx.id,
    org_id: orgId,
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
    risk_factors: tx.riskFactors,
    created_at: new Date(tx.createdAt).toISOString(),
  };
}

export interface RuleRow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rule_type: RuleType | null;
  config: Record<string, unknown> | null;
}

export function rowToRule(row: RuleRow): Rule {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    enabled: row.enabled,
    ruleType: row.rule_type,
    config: row.config,
  };
}

export interface CaseNoteRow {
  id: number;
  tx_id: string;
  author_name: string;
  note: string;
  created_at: string;
}

export function rowToCaseNote(row: CaseNoteRow): CaseNote {
  return { id: row.id, txId: row.tx_id, authorName: row.author_name, note: row.note, createdAt: row.created_at };
}

export interface CaseEventRow {
  id: number;
  tx_id: string;
  event_type: string;
  actor_name: string | null;
  detail: Record<string, unknown> | null;
  created_at: string;
}

export function rowToCaseEvent(row: CaseEventRow): CaseEvent {
  return {
    id: row.id,
    txId: row.tx_id,
    eventType: row.event_type,
    actorName: row.actor_name,
    detail: row.detail,
    createdAt: row.created_at,
  };
}

export interface WatchlistRow {
  id: number;
  list_type: WatchlistType;
  entry_type: WatchlistEntryType;
  value: string;
  reason: string | null;
  created_by_name: string | null;
  created_at: string;
}

export function rowToWatchlistEntry(row: WatchlistRow): WatchlistEntry {
  return {
    id: row.id,
    listType: row.list_type,
    entryType: row.entry_type,
    value: row.value,
    reason: row.reason,
    createdByName: row.created_by_name,
    createdAt: row.created_at,
  };
}

export interface CaseRow {
  tx_id: string;
  status: CaseRecord["status"];
  resolution: CaseResolution | null;
  tx: TransactionRow | TransactionRow[] | null;
}

export function rowToCase(row: CaseRow): CaseRecord | null {
  const txRow = Array.isArray(row.tx) ? row.tx[0] : row.tx;
  if (!txRow) return null;
  return { txId: row.tx_id, status: row.status, resolution: row.resolution, tx: rowToTransaction(txRow) };
}
