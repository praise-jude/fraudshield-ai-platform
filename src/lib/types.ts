export type View = "overview" | "transactions" | "cases" | "rules" | "reports" | "audit";

export interface Transaction {
  id: string;
  customer: string;
  country: string;
  device: string;
  deviceIcon: string;
  ip: string;
  currencySymbol: string;
  amount: number;
  amountDisplay: string;
  riskScore: number;
  statusLabel: string;
  time: string;
  createdAt: number;
}

export interface RiskBucketMeta {
  label: "Low" | "Medium" | "High" | "Critical";
  color: string;
  bg: string;
}

export interface CaseRecord {
  txId: string;
  tx: Transaction;
  status: "new" | "investigating" | "resolved";
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Report {
  id: string;
  name: string;
  description: string;
}

export interface AuditLogEntry {
  id: number;
  eventType: string;
  userId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  country: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}
