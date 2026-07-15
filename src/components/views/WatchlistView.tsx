"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WatchlistEntry, WatchlistEntryType, WatchlistType } from "@/lib/types";

interface WatchlistViewProps {
  entries: WatchlistEntry[];
  canManage: boolean;
  onAdd: (fields: { listType: WatchlistType; entryType: WatchlistEntryType; value: string; reason?: string }) => void;
  onRemove: (id: number) => void;
}

const ENTRY_TYPE_OPTIONS: { value: WatchlistEntryType; label: string }[] = [
  { value: "customer", label: "Customer name" },
  { value: "device", label: "Device" },
  { value: "ip", label: "IP address" },
];

const EMPTY_FORM = { entryType: "customer" as WatchlistEntryType, value: "", reason: "" };

function ListSection({
  listType,
  title,
  description,
  accentColor,
  entries,
  canManage,
  onAdd,
  onRemove,
}: {
  listType: WatchlistType;
  title: string;
  description: string;
  accentColor: string;
  entries: WatchlistEntry[];
  canManage: boolean;
  onAdd: WatchlistViewProps["onAdd"];
  onRemove: WatchlistViewProps["onRemove"];
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  function submit() {
    if (!form.value.trim()) return;
    onAdd({ listType, entryType: form.entryType, value: form.value.trim(), reason: form.reason.trim() || undefined });
    setForm(EMPTY_FORM);
    setAdding(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="text-[15px] font-bold text-[#1F2937] dark:text-white">{title}</div>
        <div className="text-[12.5px] text-[#6B7280]">{description}</div>
      </div>

      {entries.length === 0 && !adding && (
        <div className="rounded-lg border border-dashed border-[#E5E7EB] px-4 py-6 text-center text-[13px] text-[#9CA3AF] dark:border-white/10">
          No entries yet.
        </div>
      )}

      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E5E7EB] bg-white px-5 py-3.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#111827]"
        >
          <div
            className="flex h-9 w-9 flex-none items-center justify-center rounded-lg"
            style={{ background: accentColor + "22" }}
          >
            <i className="fa-solid fa-ban" style={{ color: accentColor, fontSize: 14 }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[13.5px] font-bold text-[#1F2937] dark:text-white">{entry.value}</div>
            <div className="text-[12px] text-[#6B7280]">
              {ENTRY_TYPE_OPTIONS.find((o) => o.value === entry.entryType)?.label}
              {entry.reason && <> &middot; {entry.reason}</>}
              {entry.createdByName && <> &middot; added by {entry.createdByName}</>}
            </div>
          </div>
          {canManage && (
            <button
              onClick={() => onRemove(entry.id)}
              className="text-[12px] font-semibold text-[#EF4444] hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      {canManage &&
        (adding ? (
          <div className="flex flex-col gap-3 rounded-lg border border-dashed px-5.5 py-4.5" style={{ borderColor: accentColor }}>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label>Type</Label>
                <Select
                  value={form.entryType}
                  onValueChange={(v) => setForm({ ...form, entryType: v as WatchlistEntryType })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTRY_TYPE_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Value</Label>
                <Input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Reason (optional)</Label>
              <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <div className="flex gap-2">
              <Button style={{ background: accentColor }} className="hover:opacity-90" onClick={submit}>
                Add to {title.toLowerCase()}
              </Button>
              <Button variant="outline" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="rounded-lg border border-dashed border-[#D1D5DB] py-3 text-[13px] font-semibold text-[#6B7280] hover:text-[#374151]"
          >
            <i className="fa-solid fa-plus mr-2" />
            Add to {title.toLowerCase()}
          </button>
        ))}
    </div>
  );
}

export default function WatchlistView({ entries, canManage, onAdd, onRemove }: WatchlistViewProps) {
  const blacklist = entries.filter((e) => e.listType === "blacklist");
  const whitelist = entries.filter((e) => e.listType === "whitelist");

  return (
    <div className="flex max-w-[820px] flex-col gap-8">
      <ListSection
        listType="blacklist"
        title="Blacklist"
        description="Customers, devices, or IPs that are always flagged, regardless of other rules."
        accentColor="#EF4444"
        entries={blacklist}
        canManage={canManage}
        onAdd={onAdd}
        onRemove={onRemove}
      />
      <ListSection
        listType="whitelist"
        title="Whitelist"
        description="Customers, devices, or IPs that are always treated as trusted, lowering their risk score."
        accentColor="#22C55E"
        entries={whitelist}
        canManage={canManage}
        onAdd={onAdd}
        onRemove={onRemove}
      />
    </div>
  );
}
