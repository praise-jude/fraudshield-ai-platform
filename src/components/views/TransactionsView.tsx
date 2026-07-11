"use client";

import { riskBucket } from "@/lib/mock";
import type { Transaction } from "@/lib/types";

interface TransactionsViewProps {
  transactions: Transaction[];
  txCount: number;
  search: string;
  onSearchChange: (value: string) => void;
  riskFilter: string;
  onRiskFilterChange: (value: string) => void;
}

export default function TransactionsView({
  transactions,
  txCount,
  search,
  onSearchChange,
  riskFilter,
  onRiskFilterChange,
}: TransactionsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="relative max-w-[320px] flex-1">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-[13px] text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search customer or IP..."
            className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-9 pr-3.5 font-sans text-[13px] outline-none"
          />
        </div>
        <select
          value={riskFilter}
          onChange={(e) => onRiskFilterChange(e.target.value)}
          className="rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2.5 font-sans text-[13px] text-[#374151]"
        >
          <option value="all">All risk levels</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <div className="ml-auto text-[12.5px] text-[#6B7280]">
          {transactions.length} of {txCount} transactions
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr_0.8fr_0.9fr] gap-3 border-b border-[#E5E7EB] bg-[#F9FAFB] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.03em] text-[#6B7280]">
          <div>Customer</div>
          <div>Country</div>
          <div>Device / IP</div>
          <div>Amount</div>
          <div>Risk</div>
          <div>Status</div>
        </div>
        <div className="max-h-[560px] overflow-y-auto">
          {transactions.map((tx) => {
            const bucket = riskBucket(tx.riskScore);
            return (
              <div
                key={tx.id}
                className="grid grid-cols-[1.6fr_1fr_1fr_1fr_0.8fr_0.9fr] items-center gap-3 border-b border-[#F3F4F6] px-5 py-3.5 text-[13px]"
              >
                <div>
                  <div className="font-semibold text-[#1F2937]">{tx.customer}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{tx.time}</div>
                </div>
                <div className="text-[#374151]">{tx.country}</div>
                <div className="text-[12px] text-[#6B7280]">
                  {tx.device}
                  <br />
                  {tx.ip}
                </div>
                <div className="font-bold text-[#1F2937]">{tx.amountDisplay}</div>
                <div className="font-bold" style={{ color: bucket.color }}>
                  {tx.riskScore}
                </div>
                <div>
                  <span
                    className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold"
                    style={{ background: bucket.bg, color: bucket.color }}
                  >
                    {tx.statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
