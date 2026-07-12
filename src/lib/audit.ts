import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Best-effort IP geolocation via a free-tier API — good enough for a demo's
 * new-country detection and audit trail. Swap for a paid provider
 * (MaxMind/IPQualityScore) for production-grade reliability and rate limits.
 */
export async function geolocateIp(ip: string): Promise<string | null> {
  if (!ip || ip === "unknown" || ip.startsWith("127.") || ip === "::1") return null;
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=status,countryCode`, {
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.status === "success" ? data.countryCode : null;
  } catch {
    return null;
  }
}

export async function logAuditEvent(
  supabase: SupabaseClient,
  params: {
    orgId?: string | null;
    userId?: string | null;
    eventType: string;
    request: Request;
    country?: string | null;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  const ip = getClientIp(params.request);
  await supabase.from("fraudshield_audit_logs").insert({
    org_id: params.orgId ?? null,
    user_id: params.userId ?? null,
    event_type: params.eventType,
    ip_address: ip,
    user_agent: params.request.headers.get("user-agent"),
    country: params.country ?? null,
    metadata: params.metadata ?? null,
  });
}
