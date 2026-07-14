"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { riskBucket } from "@/lib/mock";
import { addCaseNote, getCaseDetail } from "@/lib/apiClient";
import type { CaseDetail, CaseResolution } from "@/lib/types";

interface CaseDetailPanelProps {
  txId: string;
  onClose: () => void;
  onAdvance: (txId: string, resolution?: CaseResolution) => void;
}

const RESOLUTION_OPTIONS: { value: CaseResolution; label: string }[] = [
  { value: "confirmed_fraud", label: "Confirmed fraud" },
  { value: "false_positive", label: "False positive" },
  { value: "resolved_legitimate", label: "Resolved — legitimate" },
];

const EVENT_LABELS: Record<string, string> = {
  case_created: "Case opened",
  status_changed: "Status changed",
  note_added: "Note added",
};

export default function CaseDetailPanel({ txId, onClose, onAdvance }: CaseDetailPanelProps) {
  const [detail, setDetail] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState("");
  const [resolution, setResolution] = useState<CaseResolution>("resolved_legitimate");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCaseDetail(txId).then((data) => {
      if (!cancelled) {
        setDetail(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [txId]);

  async function handleAddNote() {
    if (!noteText.trim()) return;
    const { note } = await addCaseNote(txId, noteText.trim());
    setNoteText("");
    setDetail((prev) => (prev ? { ...prev, notes: [note, ...prev.notes] } : prev));
  }

  function handleResolve() {
    onAdvance(txId, resolution);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-white p-6 dark:bg-[#111827]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1F2937] dark:text-white">Case detail</h2>
          <button onClick={onClose} className="text-[#6B7280]">
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {loading || !detail ? (
          <div className="text-sm text-[#6B7280]">Loading…</div>
        ) : (
          <div className="flex flex-col gap-6">
            <section>
              <div className="text-[15px] font-bold text-[#1F2937] dark:text-white">
                {detail.case.tx.customer} · {detail.case.tx.amountDisplay}
              </div>
              <div className="mt-0.5 text-[12.5px] text-[#6B7280]">
                {detail.case.tx.country} · {detail.case.tx.device} · {detail.case.tx.ip}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {detail.case.tx.riskFactors.map((f) => (
                  <span
                    key={f.code}
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{ background: riskBucket(detail.case.tx.riskScore).bg, color: riskBucket(detail.case.tx.riskScore).color }}
                  >
                    {f.label} (+{f.weight})
                  </span>
                ))}
              </div>
            </section>

            {detail.case.status === "new" && (
              <section className="rounded-lg border border-[#E5E7EB] p-3 dark:border-white/10">
                <Button className="w-full bg-[#FF9300] hover:bg-[#000F9A]" onClick={() => onAdvance(txId)}>
                  Start investigating
                </Button>
              </section>
            )}
            {detail.case.status === "investigating" && (
              <section className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] p-3 dark:border-white/10">
                <Select value={resolution} onValueChange={(v) => setResolution(v as CaseResolution)}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTION_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="bg-[#FF9300] hover:bg-[#000F9A]" onClick={handleResolve}>
                  Resolve
                </Button>
              </section>
            )}

            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6B7280]">Notes</h3>
              <div className="mb-2 flex gap-2">
                <input
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add an investigation note…"
                  className="flex-1 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm dark:border-white/10 dark:bg-[#0B0F1A] dark:text-white"
                />
                <Button size="sm" onClick={handleAddNote}>
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {detail.notes.map((n) => (
                  <div key={n.id} className="rounded-lg bg-[#F9FAFB] p-3 text-sm dark:bg-white/5">
                    <div className="text-[#1F2937] dark:text-white">{n.note}</div>
                    <div className="mt-1 text-[11px] text-[#9CA3AF]">
                      {n.authorName} · {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
                {detail.notes.length === 0 && <p className="text-sm text-[#9CA3AF]">No notes yet.</p>}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6B7280]">Timeline</h3>
              <div className="flex flex-col gap-2">
                {detail.events.map((ev) => (
                  <div key={ev.id} className="flex justify-between text-sm">
                    <span className="text-[#374151] dark:text-white/80">
                      {EVENT_LABELS[ev.eventType] ?? ev.eventType}
                      {ev.actorName ? ` · ${ev.actorName}` : ""}
                    </span>
                    <span className="text-[#9CA3AF]">{new Date(ev.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#6B7280]">
                Linked activity ({detail.linkedActivity.length})
              </h3>
              <div className="flex flex-col gap-2">
                {detail.linkedActivity.map((la) => (
                  <div key={la.transaction.id} className="rounded-lg border border-[#E5E7EB] p-2.5 text-sm dark:border-white/10">
                    <div className="text-[#1F2937] dark:text-white">
                      {la.transaction.customer} · {la.transaction.amountDisplay}
                    </div>
                    <div className="text-[11px] text-[#9CA3AF]">
                      Same {la.matchType}: {la.matchValue}
                    </div>
                  </div>
                ))}
                {detail.linkedActivity.length === 0 && (
                  <p className="text-sm text-[#9CA3AF]">No related activity found.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
