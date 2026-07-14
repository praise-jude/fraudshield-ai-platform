"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RuleConfigFields, {
  RULE_TYPE_OPTIONS,
  configToFormText,
  formTextToConfig,
  type RuleFormState,
} from "./RuleConfigFields";
import type { Rule, RuleType } from "@/lib/types";

interface RulesViewProps {
  rules: Rule[];
  onToggle: (id: string, enabled: boolean) => void;
  onUpdate: (id: string, fields: { name: string; description: string; ruleType: RuleType; config: Record<string, unknown> }) => void;
  onCreate: (fields: { name: string; description: string; ruleType: RuleType; config: Record<string, unknown> }) => void;
}

const EMPTY_FORM: RuleFormState = {
  name: "",
  description: "",
  ruleType: "amount_threshold",
  configText: "",
  configText2: "",
};

export default function RulesView({ rules, onToggle, onUpdate, onCreate }: RulesViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<RuleFormState>(EMPTY_FORM);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<RuleFormState>(EMPTY_FORM);

  function startEdit(rule: Rule) {
    setEditingId(rule.id);
    setEditForm({
      name: rule.name,
      description: rule.description,
      ruleType: rule.ruleType ?? "amount_threshold",
      ...configToFormText(rule.ruleType, rule.config),
    });
  }

  function saveEdit(id: string) {
    onUpdate(id, {
      name: editForm.name,
      description: editForm.description,
      ruleType: editForm.ruleType,
      config: formTextToConfig(editForm.ruleType, editForm.configText, editForm.configText2),
    });
    setEditingId(null);
  }

  function saveCreate() {
    onCreate({
      name: createForm.name || "New rule",
      description: createForm.description,
      ruleType: createForm.ruleType,
      config: formTextToConfig(createForm.ruleType, createForm.configText, createForm.configText2),
    });
    setCreating(false);
    setCreateForm(EMPTY_FORM);
  }

  return (
    <div className="flex max-w-[820px] flex-col gap-3.5">
      {rules.map((rule) => {
        const isEditing = editingId === rule.id;
        return (
          <div
            key={rule.id}
            className="flex flex-col gap-3 rounded-lg border border-[#E5E7EB] bg-white px-5.5 py-4.5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#111827]"
          >
            <div className="flex items-center gap-4.5">
              <div className="flex-1">
                <div className="text-[14px] font-bold text-[#1F2937] dark:text-white">{rule.name}</div>
                <div className="mt-[3px] text-[12.5px] text-[#6B7280]">{rule.description}</div>
                {rule.ruleType && (
                  <div className="mt-1 text-[11px] font-medium text-[#9CA3AF]">
                    {RULE_TYPE_OPTIONS.find((o) => o.value === rule.ruleType)?.label}
                    {" · "}
                    {JSON.stringify(rule.config)}
                  </div>
                )}
              </div>
              <button
                onClick={() => (isEditing ? setEditingId(null) : startEdit(rule))}
                className="text-[12px] font-semibold text-[#FF9300]"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
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

            {isEditing && (
              <div className="border-t border-[#E5E7EB] pt-3 dark:border-white/10">
                <RuleConfigFields state={editForm} onChange={setEditForm} />
                <Button className="mt-3 bg-[#FF9300] hover:bg-[#000F9A]" onClick={() => saveEdit(rule.id)}>
                  Save rule
                </Button>
              </div>
            )}
          </div>
        );
      })}

      {creating ? (
        <div className="flex flex-col gap-3 rounded-lg border border-dashed border-[#FF9300] bg-white px-5.5 py-4.5 dark:bg-[#111827]">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#374151] dark:text-white/70">Rule type</label>
            <Select
              value={createForm.ruleType}
              onValueChange={(v) => setCreateForm({ ...createForm, ruleType: v as RuleType })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RULE_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <RuleConfigFields state={createForm} onChange={setCreateForm} />
          <div className="flex gap-2">
            <Button className="bg-[#FF9300] hover:bg-[#000F9A]" onClick={saveCreate}>
              Create rule
            </Button>
            <Button variant="outline" onClick={() => setCreating(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="rounded-lg border border-dashed border-[#D1D5DB] py-3 text-[13px] font-semibold text-[#6B7280] hover:border-[#FF9300] hover:text-[#FF9300]"
        >
          <i className="fa-solid fa-plus mr-2" />
          Add rule
        </button>
      )}
    </div>
  );
}
