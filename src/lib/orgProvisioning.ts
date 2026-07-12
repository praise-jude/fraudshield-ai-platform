import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";

interface PendingOrgRegistration {
  orgName: string;
  orgType: string;
  businessRegistrationNumber: string | null;
  country: string;
  state: string | null;
  address: string | null;
  officialEmail: string;
  phone: string | null;
  website: string | null;
  fullName: string;
  jobTitle: string;
}

/**
 * Materializes the organization + owner profile for a newly-confirmed user,
 * using the registration details stashed in their auth user_metadata at
 * sign-up time. Idempotent — safe to call from both the sign-up route
 * (if email confirmation is disabled and a session exists immediately) and
 * /auth/callback (the normal path, once email confirmation completes).
 */
export async function ensureOrganizationProvisioned(
  supabase: SupabaseClient,
  user: User
): Promise<boolean> {
  const { data: existing } = await supabase
    .from("fraudshield_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (existing) return true;

  const pending = user.user_metadata?.pending_org_registration as PendingOrgRegistration | undefined;
  if (!pending) return false;

  const { error } = await supabase.rpc("fraudshield_register_organization", {
    p_org_name: pending.orgName,
    p_org_type: pending.orgType,
    p_business_registration_number: pending.businessRegistrationNumber,
    p_country: pending.country,
    p_state: pending.state,
    p_address: pending.address,
    p_official_email: pending.officialEmail,
    p_phone: pending.phone,
    p_website: pending.website,
    p_full_name: pending.fullName,
    p_job_title: pending.jobTitle,
  });

  return !error;
}
