"use client";

import { useEffect, useState } from "react";
import { riskBucket } from "@/lib/mock";
import { getIdentityProfile } from "@/lib/apiClient";
import type { IdentityProfile } from "@/lib/types";
import IdentityNetworkGraph from "./IdentityNetworkGraph";

interface IdentityProfilePanelProps {
  customer: string;
  onClose: () => void;
  onSelectIdentity: (customer: string) => void;
}

export default function IdentityProfilePanel({ customer, onClose, onSelectIdentity }: IdentityProfilePanelProps) {
  const [profile, setProfile] = useState<IdentityProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getIdentityProfile(customer)
      .then((data) => {
        if (!cancelled) setProfile(data.profile);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [customer]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-[640px] flex-col overflow-y-auto bg-white p-6 dark:bg-[#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">{customer}</h2>
          <button onClick={onClose} className="text-[#6B7280]">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {loading && <div className="text-sm text-[#6B7280]">Loading…</div>}
        {notFound && <div className="text-sm text-[#6B7280]">No activity found for this identity.</div>}

        {profile && (
          <div className="flex flex-col gap-6">
            <section className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-lg border border-[#E5E7EB] p-3 dark:border-white/10">
                <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#6B7280]">
                  Transactions
                </div>
                <div className="mt-1 text-[20px] font-extrabold text-[#1F2937] dark:text-white">
                  {profile.stats.transactionCount}
                </div>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] p-3 dark:border-white/10">
                <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#6B7280]">Avg risk</div>
                <div
                  className="mt-1 text-[20px] font-extrabold"
                  style={{ color: riskBucket(profile.stats.avgRiskScore).color }}
                >
                  {profile.stats.avgRiskScore}
                </div>
              </div>
              <div className="rounded-lg border border-[#E5E7EB] p-3 dark:border-white/10">
                <div className="text-[11px] font-semibold uppercase tracking-[0.03em] text-[#6B7280]">Peak risk</div>
                <div
                  className="mt-1 text-[20px] font-extrabold"
                  style={{ color: riskBucket(profile.stats.maxRiskScore).color }}
                >
                  {profile.stats.maxRiskScore}
                </div>
              </div>
            </section>

            <section className="text-[12.5px] text-[#6B7280]">
              <span className="font-semibold text-[#374151] dark:text-white/70">Devices: </span>
              {profile.stats.devices.join(", ")}
              <br />
              <span className="font-semibold text-[#374151] dark:text-white/70">IPs: </span>
              {profile.stats.ips.join(", ")}
              <br />
              <span className="font-semibold text-[#374151] dark:text-white/70">Countries: </span>
              {profile.stats.countries.join(", ")}
            </section>

            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Network ({profile.relatedIdentities.length} related identities)
              </h3>
              <div className="flex justify-center rounded-lg border border-[#E5E7EB] p-3 dark:border-white/10">
                <IdentityNetworkGraph profile={profile} onSelectIdentity={onSelectIdentity} />
              </div>
            </section>

            {profile.cases.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6B7280]">Linked cases</h3>
                <div className="flex flex-col gap-2">
                  {profile.cases.map((c) => (
                    <div key={c.txId} className="rounded-lg bg-[#F9FAFB] p-2.5 text-sm dark:bg-white/5">
                      <span className="font-semibold text-[#1F2937] dark:text-white">{c.tx.amountDisplay}</span>
                      <span className="ml-2 text-[#6B7280]">{c.status}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6B7280]">Transaction history</h3>
              <div className="flex flex-col gap-1.5">
                {profile.transactions.map((tx) => {
                  const bucket = riskBucket(tx.riskScore);
                  return (
                    <div key={tx.id} className="flex items-center justify-between border-b border-[#F3F4F6] py-2 text-sm dark:border-white/5">
                      <span className="text-[#374151] dark:text-white/80">
                        {tx.amountDisplay} · {tx.device} · {tx.time}
                      </span>
                      <span className="font-bold" style={{ color: bucket.color }}>
                        {tx.riskScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
