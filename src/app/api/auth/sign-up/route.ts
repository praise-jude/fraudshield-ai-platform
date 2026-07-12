import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signUpSchema } from "@/lib/validation/auth";
import { ensureOrganizationProvisioned } from "@/lib/orgProvisioning";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = signUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data = parsed.data;

  const supabase = await createClient();
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.workEmail,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        pending_org_registration: {
          orgName: data.orgName,
          orgType: data.orgType,
          businessRegistrationNumber: data.businessRegistrationNumber ?? null,
          country: data.country,
          state: data.state ?? null,
          address: data.address ?? null,
          officialEmail: data.officialEmail,
          phone: data.phone ?? null,
          website: data.website || null,
          fullName: data.fullName,
          jobTitle: data.jobTitle,
        },
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // If email confirmation is disabled for this project, signUp returns an
  // active session immediately — provision the org right away in that case.
  // Otherwise this happens in /auth/callback once the user confirms.
  if (signUpData.session && signUpData.user) {
    await ensureOrganizationProvisioned(supabase, signUpData.user);
  }

  return NextResponse.json({ ok: true, needsEmailConfirmation: !signUpData.session });
}
