export type View = "overview" | "transactions" | "cases" | "rules" | "reports" | "audit";

export interface RiskFactor {
  code: string;
  label: string;
  weight: number;
}

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
  riskFactors: RiskFactor[];
  time: string;
  createdAt: number;
}

export interface RiskBucketMeta {
  label: "Low" | "Medium" | "High" | "Critical";
  color: string;
  bg: string;
}

export type CaseResolution = "confirmed_fraud" | "false_positive" | "resolved_legitimate";

export interface CaseRecord {
  txId: string;
  tx: Transaction;
  status: "new" | "investigating" | "resolved";
  resolution?: CaseResolution | null;
}

export type RuleType = "amount_threshold" | "country_risk" | "device_risk" | "velocity_count";

export interface Rule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  ruleType: RuleType | null;
  config: Record<string, unknown> | null;
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

export interface CaseNote {
  id: number;
  txId: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface CaseEvent {
  id: number;
  txId: string;
  eventType: string;
  actorName: string | null;
  detail: Record<string, unknown> | null;
  createdAt: string;
}

export interface LinkedActivity {
  matchType: "customer" | "device" | "ip";
  matchValue: string;
  transaction: Transaction;
}

export interface CaseDetail {
  case: CaseRecord;
  notes: CaseNote[];
  events: CaseEvent[];
  linkedActivity: LinkedActivity[];
}
