import "server-only";
import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export function hashDevice(userAgent: string | null): string {
  return createHash("sha256")
    .update(userAgent ?? "unknown")
    .digest("hex")
    .slice(0, 32);
}

/**
 * Compares this login's device/country against the user's known-device
 * history. "New device" is per device-hash; "new country" is evaluated
 * across all of the user's known devices, not just this one.
 */
export async function recognizeLogin(
  supabase: SupabaseClient,
  userId: string,
  userAgent: string | null,
  ip: string,
  country: string | null
): Promise<{ isNewDevice: boolean; isNewCountry: boolean }> {
  const deviceHash = hashDevice(userAgent);

  const { data: devices } = await supabase
    .from("fraudshield_known_devices")
    .select("id, device_hash, last_country")
    .eq("user_id", userId);

  const existingDevice = devices?.find((d) => d.device_hash === deviceHash);
  const isNewDevice = !existingDevice;
  const isNewCountry =
    !!country && !!devices?.length && !devices.some((d) => d.last_country === country);

  if (existingDevice) {
    await supabase
      .from("fraudshield_known_devices")
      .update({ last_seen_at: new Date().toISOString(), last_ip: ip, last_country: country })
      .eq("id", existingDevice.id);
  } else {
    await supabase.from("fraudshield_known_devices").insert({
      user_id: userId,
      device_hash: deviceHash,
      user_agent: userAgent,
      last_ip: ip,
      last_country: country,
    });
  }

  return { isNewDevice, isNewCountry };
}
