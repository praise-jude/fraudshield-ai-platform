"use client";

import { riskBucket } from "@/lib/mock";
import type { Transaction } from "@/lib/types";

interface Kpi {
  label: string;
  value: string;
  sub: string;
  subColor: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

interface RiskRegion {
  name: string;
  count: number;
  pct: string;
  color: string;
}

interface RiskBucketDatum {
  label: string;
  color: string;
  count: number;
  pct: string;
}

interface OverviewViewProps {
  kpis: Kpi[];
  feedTransactions: Transaction[];
  liveOn: boolean;
  riskRegions: RiskRegion[];
  riskBuckets: RiskBucketDatum[];
  txCount: number;
}

export default function OverviewView({
  kpis,
  feedTransactions,
  liveOn,
  riskRegions,
  riskBuckets,
  txCount,
}: OverviewViewProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">
                {kpi.label}
              </span>
              <div
                className="flex h-[30px] w-[30px] items-center justify-center rounded-lg"
                style={{ background: kpi.iconBg }}
              >
                <i className={kpi.icon} style={{ color: kpi.iconColor, fontSize: 13 }} />
              </div>
            </div>
            <div className="text-[26px] font-extrabold text-[#1F2937]">{kpi.value}</div>
            <div className="mt-1 text-[12px] font-semibold" style={{ color: kpi.subColor }}>
              {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-[18px]">
            <div className="text-[15px] font-bold text-[#1F2937]">Live Transaction Feed</div>
            <div className="flex items-center gap-1.5">
              <span
                className={`h-[7px] w-[7px] rounded-full ${liveOn ? "animate-rm-pulse" : ""}`}
                style={{ background: liveOn ? "#22C55E" : "#9CA3AF" }}
              />
              <span className="text-[11px] font-semibold text-[#6B7280]">
                {liveOn ? "Live monitoring" : "Paused"}
              </span>
            </div>
          </div>
          <div className="max-h-[420px] overflow-y-auto">
            {feedTransactions.map((tx) => {
              const bucket = riskBucket(tx.riskScore);
              const bg = bucket.bg;
              const color = bucket.color;
              return (
                <div
                  key={tx.id}
                  className="animate-rm-fadein flex items-center gap-3.5 border-b border-[#F3F4F6] px-5 py-[13px]"
                >
                  <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-[#F3F4F6]">
                    <i className={tx.deviceIcon} style={{ color: "#6B7280", fontSize: 13 }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold text-[#1F2937]">{tx.customer}</div>
                    <div className="text-[11.5px] text-[#6B7280]">
                      {tx.country} &middot; {tx.device} &middot; {tx.time}
                    </div>
                  </div>
                  <div className="min-w-[92px] text-right text-[13px] font-bold text-[#1F2937]">
                    {tx.amountDisplay}
                  </div>
                  <div
                    className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: bg, color }}
                    title={tx.riskFactors.map((f) => `${f.label} (+${f.weight})`).join("\n")}
                  >
                    {tx.statusLabel}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
            <div className="mb-3.5 text-[15px] font-bold text-[#1F2937]">Top Risk Regions</div>
            <div className="flex flex-col gap-3">
              {riskRegions.map((region) => (
                <div key={region.name}>
                  <div className="mb-1.5 flex justify-between text-[12.5px]">
                    <span className="font-semibold text-[#374151]">{region.name}</span>
                    <span className="text-[#6B7280]">{region.count} flagged</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: region.pct, background: region.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
            <div className="mb-1.5 text-[15px] font-bold text-[#1F2937]">Risk Score Distribution</div>
            <div className="mb-4 text-[12px] text-[#6B7280]">
              Across last {txCount} transactions
            </div>
            <div className="flex flex-col gap-2.5">
              {riskBuckets.map((bucket) => (
                <div key={bucket.label} className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 flex-none rounded-[2px]"
                    style={{ background: bucket.color }}
                  />
                  <span className="w-16 flex-none text-[12.5px] text-[#374151]">{bucket.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F3F4F6]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: bucket.pct, background: bucket.color }}
                    />
                  </div>
                  <span className="w-[26px] flex-none text-right text-[12px] text-[#6B7280]">
                    {bucket.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function statusBg(score: number): string {
  if (score <= 30) return "#E9F9EE";
  if (score <= 60) return "#FEF6E5";
  if (score <= 80) return "#FFF1DC";
  return "#FDEBEB";
}

function statusColor(score: number): string {
  if (score <= 30) return "#22C55E";
  if (score <= 60) return "#B98900";
  if (score <= 80) return "#FF9300";
  return "#EF4444";
}
