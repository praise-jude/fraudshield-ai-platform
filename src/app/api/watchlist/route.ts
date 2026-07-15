import { NextResponse } from "next/server";
import { requireRole, isAuthedUser } from "@/lib/authGuard";
import { createClient } from "@/lib/supabase/server";
import { rowToWatchlistEntry, type WatchlistRow } from "@/lib/rows";
import type { WatchlistEntryType, WatchlistType } from "@/lib/types";

const VALID_LIST_TYPES: WatchlistType[] = ["blacklist", "whitelist"];
const VALID_ENTRY_TYPES: WatchlistEntryType[] = ["customer", "device", "ip"];

export async function GET() {
  const authed = await requireRole("view:watchlist");
  if (!isAuthedUser(authed)) return authed;
  const { orgId } = authed;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fraudshield_watchlist")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load watchlist" }, { status: 500 });
  }

  return NextResponse.json({ entries: ((data as WatchlistRow[] | null) ?? []).map(rowToWatchlistEntry) });
}

export async function POST(request: Request) {
  const authed = await requireRole("manage:watchlist");
  if (!isAuthedUser(authed)) return authed;
  const { orgId, user } = authed;

  const body = await request.json().catch(() => null);
  const listType = body?.listType;
  const entryType = body?.entryType;
  const value = typeof body?.value === "string" ? body.value.trim() : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim() : null;

  if (!VALID_LIST_TYPES.includes(listType) || !VALID_ENTRY_TYPES.includes(entryType) || !value) {
    return NextResponse.json({ error: "listType, entryType, and value are required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fraudshield_watchlist")
    .insert({
      org_id: orgId,
      list_type: listType,
      entry_type: entryType,
      value,
      reason,
      created_by_user_id: user.id,
      created_by_name: user.email ?? "Unknown",
    })
    .select("*")
    .single();

  if (error || !data) {
    const isDuplicate = error?.code === "23505";
    return NextResponse.json(
      { error: isDuplicate ? "This entry is already on the list" : "Failed to add entry" },
      { status: isDuplicate ? 409 : 500 }
    );
  }

  return NextResponse.json({ entry: rowToWatchlistEntry(data as WatchlistRow) });
}
