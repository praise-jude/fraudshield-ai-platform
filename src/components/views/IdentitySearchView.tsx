"use client";

import { useEffect, useState } from "react";
import { riskBucket } from "@/lib/mock";
import { searchIdentities } from "@/lib/apiClient";
import type { IdentitySummary } from "@/lib/types";

interface IdentitySearchViewProps {
  onSelectIdentity: (customer: string) => void;
}

const MATCH_LABELS: Record<IdentitySummary["matchedOn"], string> = {
  customer: "Name match",
  device: "Device match",
  ip: "IP match",
};

export default function IdentitySearchView({ onSelectIdentity }: IdentitySearchViewProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IdentitySummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(() => {
      setLoading(true);
      searchIdentities(query.trim())
        .then((data) => setResults(data.results))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex max-w-[720px] flex-col gap-4">
      <div className="relative">
        <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#9CA3AF]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, device, or IP address…"
          className="w-full rounded-lg border border-[#E5E7EB] py-3 pl-9 pr-3.5 font-sans text-[14px] outline-none dark:border-white/10 dark:bg-[#111827] dark:text-white"
        />
      </div>

      {loading && <div className="text-sm text-[#6B7280]">Searching…</div>}

      {!loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="text-sm text-[#9CA3AF]">No identities found for &quot;{query}&quot;.</div>
      )}

      <div className="flex flex-col gap-2.5">
        {results.map((r) => {
          const bucket = riskBucket(r.maxRiskScore);
          return (
            <div
              key={r.customer}
              onClick={() => onSelectIdentity(r.customer)}
              className="flex cursor-pointer items-center gap-4 rounded-lg border border-[#E5E7EB] bg-white px-5 py-3.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#111827]"
            >
              <div
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full"
                style={{ background: bucket.bg }}
              >
                <i className="fa-solid fa-user" style={{ color: bucket.color, fontSize: 14 }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-bold text-[#1F2937] dark:text-white">{r.customer}</div>
                <div className="text-[12px] text-[#6B7280]">
                  {r.transactionCount} transactions · last seen {r.lastSeen} · {MATCH_LABELS[r.matchedOn]}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold text-[#9CA3AF]">PEAK RISK</div>
                <div className="text-[16px] font-extrabold" style={{ color: bucket.color }}>
                  {r.maxRiskScore}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
