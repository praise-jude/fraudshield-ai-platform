import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import type { AuditLogEntry } from "@/lib/types";

export async function GET() {
  const authed = await requireRole("view:audit_log");
  if (!isAuthedUser(authed)) return authed;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fraudshield_audit_logs")
    .select("id, event_type, user_id, ip_address, user_agent, country, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "Failed to load audit log" }, { status: 500 });
  }

  const entries: AuditLogEntry[] = (data ?? []).map((row) => ({
    id: row.id,
    eventType: row.event_type,
    userId: row.user_id,
    ipAddress: row.ip_address,
    userAgent: row.user_agent,
    country: row.country,
    metadata: row.metadata,
    createdAt: row.created_at,
  }));

  return NextResponse.json({ entries });
}
