import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { REPORT_DEFS } from "@/lib/mock";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireRole("export:reports");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const { id } = await params;
  const report = REPORT_DEFS.find((r) => r.id === id);

  if (!report) {
    return NextResponse.json({ error: "Unknown report" }, { status: 404 });
  }

  const exportedAt = new Date().toISOString();
  const supabase = await createClient();

  const { error } = await supabase.from("fraudshield_report_exports").insert({
    org_id: orgId,
    report_id: report.id,
    report_name: report.name,
    exported_at: exportedAt,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to log export" }, { status: 500 });
  }

  return NextResponse.json({ report, exportedAt });
}
