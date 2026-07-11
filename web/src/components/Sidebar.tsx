"use client";

import { NAV_DEFS } from "@/lib/mock";
import type { View } from "@/lib/types";

interface SidebarProps {
  activeView: View;
  onNavigate: (view: View) => void;
  liveOn: boolean;
  onToggleLive: () => void;
}

export default function Sidebar({ activeView, onNavigate, liveOn, onToggleLive }: SidebarProps) {
  return (
    <div className="flex w-[240px] flex-none flex-col gap-7 bg-[#030712] p-4 py-6">
      <div className="flex items-center gap-2.5 px-2">
        <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-lg bg-[#FF9300]">
          <i className="fa-solid fa-shield-halved text-[16px] text-white" />
        </div>
        <div className="text-[16px] font-extrabold leading-tight text-white">
          FraudShield <span className="text-[#FF9300]">AI</span>
        </div>
      </div>

      <div className="flex flex-col gap-0.5">
        {NAV_DEFS.map((item) => {
          const active = item.id === activeView;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id as View)}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150"
              style={{ background: active ? "#FF9300" : "transparent" }}
            >
              <i
                className={item.icon}
                style={{ color: active ? "#fff" : "rgba(255,255,255,0.65)" }}
                aria-hidden
              />
              <span
                className="text-[14px]"
                style={{
                  color: active ? "#fff" : "rgba(255,255,255,0.65)",
                  fontWeight: active ? 700 : 500,
                }}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-auto flex flex-col gap-2 rounded-[10px] bg-white/[0.06] px-3 py-3.5">
        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${liveOn ? "animate-rm-pulse" : ""}`}
            style={{ background: liveOn ? "#22C55E" : "#9CA3AF" }}
          />
          <span className="text-[12px] font-semibold text-white/75">
            {liveOn ? "Live monitoring" : "Paused"}
          </span>
        </div>
        <div
          onClick={onToggleLive}
          className="cursor-pointer text-[12px] font-semibold text-[#FF9300]"
        >
          {liveOn ? "Pause feed" : "Resume feed"}
        </div>
      </div>
    </div>
  );
}
