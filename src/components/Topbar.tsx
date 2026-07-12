"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  title: string;
  activeAlertsCount: number;
  userName: string;
  userInitials: string;
}

export default function Topbar({ title, activeAlertsCount, userName, userInitials }: TopbarProps) {
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  async function handleSignOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/auth/sign-in");
    router.refresh();
  }

  return (
    <div className="flex h-16 flex-none items-center justify-between border-b border-[#E5E7EB] bg-white px-7 dark:border-white/10 dark:bg-[#111827]">
      <div className="text-[18px] font-bold text-[#1F2937] dark:text-white">{title}</div>
      <div className="flex items-center gap-4.5">
        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="text-[16px] text-[#4B5563] dark:text-white/60"
          >
            <i className={`fa-solid ${theme === "dark" || resolvedTheme === "dark" ? "fa-sun" : "fa-moon"}`} />
          </button>
        )}
        <div className="relative">
          <i className="fa-solid fa-bell text-[16px] text-[#4B5563] dark:text-white/60" />
          {activeAlertsCount > 0 && (
            <span className="absolute -right-[5px] -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white">
              {activeAlertsCount}
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#000F9A] text-[13px] font-bold text-white">
              {userInitials}
            </div>
            <div className="text-[13px] font-semibold text-[#1F2937] dark:text-white">{userName}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleSignOut}>
              <i className="fa-solid fa-right-from-bracket mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
