import type {
  AuditLogEntry,
  CaseDetail,
  CaseNote,
  CaseRecord,
  CaseResolution,
  Report,
  Rule,
  RuleType,
  Transaction,
} from "./types";

interface BootstrapResponse {
  transactions: Transaction[];
  cases: CaseRecord[];
  rules: Rule[];
}

interface SimulateResponse {
  transaction: Transaction;
  case: CaseRecord | null;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export function getBootstrap(): Promise<BootstrapResponse> {
  return fetch("/api/bootstrap").then((res) => json<BootstrapResponse>(res));
}

export function simulateTransaction(): Promise<SimulateResponse> {
  return fetch("/api/transactions/simulate", { method: "POST" }).then((res) =>
    json<SimulateResponse>(res)
  );
}

export function advanceCase(
  txId: string,
  resolution?: CaseResolution
): Promise<{ txId: string; status: CaseRecord["status"]; resolution: CaseResolution | null }> {
  return fetch(`/api/cases/${encodeURIComponent(txId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resolution }),
  }).then((res) => json<{ txId: string; status: CaseRecord["status"]; resolution: CaseResolution | null }>(res));
}

export function getCaseDetail(txId: string): Promise<CaseDetail> {
  return fetch(`/api/cases/${encodeURIComponent(txId)}`).then((res) => json<CaseDetail>(res));
}

export function addCaseNote(txId: string, note: string): Promise<{ note: CaseNote }> {
  return fetch(`/api/cases/${encodeURIComponent(txId)}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  }).then((res) => json<{ note: CaseNote }>(res));
}

export function toggleRule(id: string, enabled: boolean): Promise<{ rule: Rule }> {
  return fetch(`/api/rules/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  }).then((res) => json<{ rule: Rule }>(res));
}

export function updateRule(
  id: string,
  fields: { name?: string; description?: string; ruleType?: RuleType; config?: Record<string, unknown> }
): Promise<{ rule: Rule }> {
  return fetch(`/api/rules/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  }).then((res) => json<{ rule: Rule }>(res));
}

export function createRule(fields: {
  name: string;
  description: string;
  ruleType: RuleType;
  config: Record<string, unknown>;
}): Promise<{ rule: Rule }> {
  return fetch("/api/rules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(fields),
  }).then((res) => json<{ rule: Rule }>(res));
}

export function exportReport(id: string): Promise<{ report: Report; exportedAt: string }> {
  return fetch(`/api/reports/${encodeURIComponent(id)}/export`, { method: "POST" }).then((res) =>
    json<{ report: Report; exportedAt: string }>(res)
  );
}

export function getAuditLogs(): Promise<{ entries: AuditLogEntry[] }> {
  return fetch("/api/audit-logs").then((res) => json<{ entries: AuditLogEntry[] }>(res));
}
