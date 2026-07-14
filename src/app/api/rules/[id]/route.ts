import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { rowToRule, type RuleRow } from "@/lib/rows";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authed = await requireRole("manage:rules");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const update: Record<string, unknown> = {};
  if (typeof body.enabled === "boolean") update.enabled = body.enabled;
  if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim();
  if (typeof body.description === "string") update.description = body.description.trim();
  if (typeof body.ruleType === "string") update.rule_type = body.ruleType;
  if (body.config && typeof body.config === "object") update.config = body.config;

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fraudshield_rules")
    .update(update)
    .eq("org_id", orgId)
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 });
  }

  return NextResponse.json({ rule: rowToRule(data as RuleRow) });
}
