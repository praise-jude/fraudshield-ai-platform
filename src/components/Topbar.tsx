"use client";

interface TopbarProps {
  title: string;
  activeAlertsCount: number;
}

export default function Topbar({ title, activeAlertsCount }: TopbarProps) {
  return (
    <div className="flex h-16 flex-none items-center justify-between border-b border-[#E5E7EB] bg-white px-7">
      <div className="text-[18px] font-bold text-[#1F2937]">{title}</div>
      <div className="flex items-center gap-4.5">
        <div className="relative">
          <i className="fa-solid fa-bell text-[16px] text-[#4B5563]" />
          {activeAlertsCount > 0 && (
            <span className="absolute -right-[5px] -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white">
              {activeAlertsCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#000F9A] text-[13px] font-bold text-white">
            AO
          </div>
          <div className="text-[13px] font-semibold text-[#1F2937]">Adaeze O.</div>
        </div>
      </div>
    </div>
  );
}
