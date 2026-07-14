"use client";

import type { AuditLogEntry } from "@/lib/types";

interface AuditLogViewProps {
  entries: AuditLogEntry[];
  loading: boolean;
}

const EVENT_LABELS: Record<string, string> = {
  login_success: "Sign in",
  login_failed: "Failed sign in",
  account_lockout: "Account locked out",
  logout: "Sign out",
  email_verified: "Email verified",
  organization_created: "Organization created",
  new_device_login: "New device detected",
  new_country_login: "New country detected",
};

export default function AuditLogView({ entries, loading }: AuditLogViewProps) {
  if (loading) {
    return <div className="text-sm text-[#6B7280]">Loading audit log…</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-[#E5E7EB] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#111827]">
      <div className="grid min-w-[600px] grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr] gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.03em] text-[#6B7280] dark:border-white/10 dark:bg-white/5">
        <div>Event</div>
        <div>IP address</div>
        <div>Country</div>
        <div>Time</div>
        <div>Details</div>
      </div>
      <div className="max-h-[560px] overflow-y-auto">
        {entries.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-[#6B7280]">No events recorded yet.</div>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="grid min-w-[600px] grid-cols-[1.2fr_1fr_1fr_1fr_1.4fr] items-center gap-3 border-b border-[#F3F4F6] px-5 py-3.5 text-[13px] dark:border-white/5"
          >
            <div className="font-semibold text-[#1F2937] dark:text-white">
              {EVENT_LABELS[entry.eventType] ?? entry.eventType}
            </div>
            <div className="text-[#6B7280]">{entry.ipAddress ?? "—"}</div>
            <div className="text-[#6B7280]">{entry.country ?? "—"}</div>
            <div className="text-[#6B7280]">{new Date(entry.createdAt).toLocaleString()}</div>
            <div className="truncate text-[12px] text-[#9CA3AF]" title={entry.userAgent ?? ""}>
              {entry.userAgent ?? "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
