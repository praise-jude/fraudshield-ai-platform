import type { AuditLogEntry, CaseRecord, Report, Rule, Transaction } from "./types";

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

export function advanceCase(txId: string): Promise<{ txId: string; status: CaseRecord["status"] }> {
  return fetch(`/api/cases/${encodeURIComponent(txId)}`, { method: "PATCH" }).then((res) =>
    json<{ txId: string; status: CaseRecord["status"] }>(res)
  );
}

export function toggleRule(id: string, enabled: boolean): Promise<{ id: string; enabled: boolean }> {
  return fetch(`/api/rules/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  }).then((res) => json<{ id: string; enabled: boolean }>(res));
}

export function exportReport(id: string): Promise<{ report: Report; exportedAt: string }> {
  return fetch(`/api/reports/${encodeURIComponent(id)}/export`, { method: "POST" }).then((res) =>
    json<{ report: Report; exportedAt: string }>(res)
  );
}

export function getAuditLogs(): Promise<{ entries: AuditLogEntry[] }> {
  return fetch("/api/audit-logs").then((res) => json<{ entries: AuditLogEntry[] }>(res));
}
