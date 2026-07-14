import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureOrganizationProvisioned } from "@/lib/orgProvisioning";
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

  let { data: profile } = await supabase
    .from("fraudshield_profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // A session can exist with no profile row if org-provisioning never ran
    // for this user (e.g. the RPC failed, or the schema didn't exist yet at
    // confirmation time). Self-heal using the registration data stashed in
    // their user_metadata at sign-up, rather than relying solely on
    // /auth/callback having run it successfully.
    const provisioned = await ensureOrganizationProvisioned(supabase, user);
    if (provisioned) {
      ({ data: profile } = await supabase
        .from("fraudshield_profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .maybeSingle());
    }
  }

  if (!profile) {
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
