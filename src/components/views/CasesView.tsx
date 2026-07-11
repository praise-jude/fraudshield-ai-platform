"use client";

import { riskBucket } from "@/lib/mock";
import type { CaseRecord } from "@/lib/types";

interface CasesViewProps {
  cases: CaseRecord[];
  onAdvance: (txId: string, currentStatus: CaseRecord["status"]) => void;
}

const STATUS_META: Record<
  CaseRecord["status"],
  { label: string; bg: string; color: string; next: CaseRecord["status"]; action: string }
> = {
  new: { label: "NEW", bg: "#FDEBEB", color: "#EF4444", next: "investigating", action: "Investigate" },
  investigating: {
    label: "INVESTIGATING",
    bg: "#FEF6E5",
    color: "#B98900",
    next: "resolved",
    action: "Resolve",
  },
  resolved: { label: "RESOLVED", bg: "#E9F9EE", color: "#22C55E", next: "resolved", action: "Closed" },
};

export default function CasesView({ cases, onAdvance }: CasesViewProps) {
  return (
    <div className="flex flex-col gap-3.5">
      {cases.map((c) => {
        const meta = STATUS_META[c.status];
        const bucket = riskBucket(c.tx.riskScore);
        return (
          <div
            key={c.txId}
            className="flex items-center gap-4.5 rounded-lg border border-[#E5E7EB] bg-white px-5.5 py-4.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
          >
            <div
              className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-lg"
              style={{ background: bucket.bg }}
            >
              <i
                className="fa-solid fa-triangle-exclamation"
                style={{ color: bucket.color, fontSize: 16 }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold text-[#1F2937]">
                {c.tx.customer} &middot; {c.tx.amountDisplay}
              </div>
              <div className="mt-0.5 text-[12.5px] text-[#6B7280]">
                {c.tx.country} &middot; {c.tx.device} &middot; {c.tx.ip}
              </div>
            </div>
            <div className="min-w-[80px] text-right">
              <div className="text-[11px] font-semibold text-[#9CA3AF]">RISK SCORE</div>
              <div className="text-[16px] font-extrabold" style={{ color: bucket.color }}>
                {c.tx.riskScore}
              </div>
            </div>
            <div
              className="whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-bold"
              style={{ background: meta.bg, color: meta.color }}
            >
              {meta.label}
            </div>
            <div
              onClick={() => onAdvance(c.txId, c.status)}
              className="cursor-pointer whitespace-nowrap rounded-full bg-[#FF9300] px-4 py-2.5 text-[12.5px] font-bold text-white"
            >
              {meta.action}
            </div>
          </div>
        );
      })}
    </div>
  );
}
