"use client";

import type { Rule } from "@/lib/types";

interface RulesViewProps {
  rules: Rule[];
  onToggle: (id: string, enabled: boolean) => void;
}

export default function RulesView({ rules, onToggle }: RulesViewProps) {
  return (
    <div className="flex max-w-[820px] flex-col gap-3.5">
      {rules.map((rule) => (
        <div
          key={rule.id}
          className="flex items-center gap-4.5 rounded-lg border border-[#E5E7EB] bg-white px-5.5 py-4.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
        >
          <div className="flex-1">
            <div className="text-[14px] font-bold text-[#1F2937]">{rule.name}</div>
            <div className="mt-[3px] text-[12.5px] text-[#6B7280]">{rule.description}</div>
          </div>
          <div
            onClick={() => onToggle(rule.id, !rule.enabled)}
            className="relative h-6 w-11 flex-none cursor-pointer rounded-full transition-colors duration-150"
            style={{ background: rule.enabled ? "#FF9300" : "#D1D5DB" }}
          >
            <div
              className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-[left] duration-150"
              style={{ left: rule.enabled ? "22px" : "2px" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
