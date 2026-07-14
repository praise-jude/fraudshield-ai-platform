"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RuleType } from "@/lib/types";

export interface RuleFormState {
  name: string;
  description: string;
  ruleType: RuleType;
  configText: string; // raw text for the type-specific primary field(s)
  configText2: string; // secondary field, only used by velocity_count
}

export const RULE_TYPE_OPTIONS: { value: RuleType; label: string }[] = [
  { value: "amount_threshold", label: "Amount threshold" },
  { value: "country_risk", label: "High-risk countries" },
  { value: "device_risk", label: "Risky device types" },
  { value: "velocity_count", label: "Velocity (transaction count)" },
];

export function configToFormText(ruleType: RuleType | null, config: Record<string, unknown> | null) {
  if (!ruleType || !config) return { configText: "", configText2: "" };
  if (ruleType === "amount_threshold") return { configText: String(config.threshold ?? ""), configText2: "" };
  if (ruleType === "country_risk")
    return { configText: Array.isArray(config.countries) ? config.countries.join(", ") : "", configText2: "" };
  if (ruleType === "device_risk")
    return { configText: Array.isArray(config.devices) ? config.devices.join(", ") : "", configText2: "" };
  if (ruleType === "velocity_count")
    return { configText: String(config.maxCount ?? ""), configText2: String(config.windowMinutes ?? "") };
  return { configText: "", configText2: "" };
}

export function formTextToConfig(ruleType: RuleType, configText: string, configText2: string): Record<string, unknown> {
  if (ruleType === "amount_threshold") return { threshold: Number(configText) || 0 };
  if (ruleType === "country_risk")
    return { countries: configText.split(",").map((s) => s.trim()).filter(Boolean) };
  if (ruleType === "device_risk")
    return { devices: configText.split(",").map((s) => s.trim()).filter(Boolean) };
  if (ruleType === "velocity_count")
    return { maxCount: Number(configText) || 0, windowMinutes: Number(configText2) || 0 };
  return {};
}

interface Props {
  state: RuleFormState;
  onChange: (next: RuleFormState) => void;
}

export default function RuleConfigFields({ state, onChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label>Rule name</Label>
          <Input value={state.name} onChange={(e) => onChange({ ...state, name: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Description</Label>
          <Input value={state.description} onChange={(e) => onChange({ ...state, description: e.target.value })} />
        </div>
      </div>

      {state.ruleType === "amount_threshold" && (
        <div className="flex flex-col gap-1.5">
          <Label>Amount threshold (₦)</Label>
          <Input
            type="number"
            value={state.configText}
            onChange={(e) => onChange({ ...state, configText: e.target.value })}
            placeholder="500000"
          />
        </div>
      )}
      {state.ruleType === "country_risk" && (
        <div className="flex flex-col gap-1.5">
          <Label>High-risk countries (comma-separated)</Label>
          <Input
            value={state.configText}
            onChange={(e) => onChange({ ...state, configText: e.target.value })}
            placeholder="Russia, Unknown (VPN)"
          />
        </div>
      )}
      {state.ruleType === "device_risk" && (
        <div className="flex flex-col gap-1.5">
          <Label>Risky device types (comma-separated)</Label>
          <Input
            value={state.configText}
            onChange={(e) => onChange({ ...state, configText: e.target.value })}
            placeholder="Emulator, Unknown"
          />
        </div>
      )}
      {state.ruleType === "velocity_count" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Max transactions</Label>
            <Input
              type="number"
              value={state.configText}
              onChange={(e) => onChange({ ...state, configText: e.target.value })}
              placeholder="5"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Window (minutes)</Label>
            <Input
              type="number"
              value={state.configText2}
              onChange={(e) => onChange({ ...state, configText2: e.target.value })}
              placeholder="2"
            />
          </div>
        </div>
      )}
    </div>
  );
}
