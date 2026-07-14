import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { rowToRule, type RuleRow } from "@/lib/rows";
import type { RuleType } from "@/lib/types";

const VALID_RULE_TYPES: RuleType[] = ["amount_threshold", "country_risk", "device_risk", "velocity_count"];

export async function POST(request: Request) {
  const authed = await requireRole("manage:rules");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const ruleType = body?.ruleType;
  const config = body?.config;

  if (!name || !VALID_RULE_TYPES.includes(ruleType)) {
    return NextResponse.json({ error: "name and a valid ruleType are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fraudshield_rules")
    .insert({
      org_id: orgId,
      name,
      description,
      enabled: true,
      rule_type: ruleType,
      config: config && typeof config === "object" ? config : {},
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to create rule" }, { status: 500 });
  }

  return NextResponse.json({ rule: rowToRule(data as RuleRow) });
}
