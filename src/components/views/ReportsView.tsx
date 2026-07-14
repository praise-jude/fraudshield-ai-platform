"use client";

import type { Report } from "@/lib/types";

interface ReportsViewProps {
  reports: Report[];
  onExport: (report: Report) => void;
}

export default function ReportsView({ reports, onExport }: ReportsViewProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((rep) => (
        <div
          key={rep.id}
          className="flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]"
        >
          <div className="flex h-[38px] w-[38px] items-center justify-center rounded-lg bg-[#FFF4E0]">
            <i className="fa-solid fa-file-lines text-[16px] text-[#FF9300]" />
          </div>
          <div>
            <div className="text-[14.5px] font-bold text-[#1F2937]">{rep.name}</div>
            <div className="mt-[3px] text-[12.5px] text-[#6B7280]">{rep.description}</div>
          </div>
          <div className="mt-auto flex gap-2">
            <div
              onClick={() => onExport(rep)}
              className="cursor-pointer rounded-lg border border-[#E5E7EB] px-3.5 py-2 text-[12px] font-bold text-[#374151]"
            >
              <i className="fa-solid fa-download mr-1.5" />
              Export
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
