import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/DashboardClient";
import type { Role } from "@/lib/permissions";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  const { data: profile } = await supabase
    .from("fraudshield_profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // Auth succeeded but org provisioning hasn't completed yet (e.g. email not
    // confirmed via /auth/callback) — send them back into the sign-in flow.
    redirect("/auth/sign-in?error=incomplete_registration");
  }

  const userName = profile.full_name || user.email || "User";
  const userInitials = userName
    .split(" ")
    .map((p: string) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return <DashboardClient role={profile.role as Role} userName={userName} userInitials={userInitials} />;
}
