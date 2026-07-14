import type { RiskBucketMeta, RiskFactor, Rule, Transaction } from "./types";
import type { Permission } from "./permissions";

interface WeightedDef {
  weight: number;
}

function weightedPick<T extends WeightedDef>(defs: T[]): T {
  const total = defs.reduce((s, d) => s + d.weight, 0);
  let r = Math.random() * total;
  for (const d of defs) {
    if (r < d.weight) return d;
    r -= d.weight;
  }
  return defs[0];
}

const CUSTOMERS = [
  "Ada N.",
  "Chinedu O.",
  "Grace M.",
  "Tunde A.",
  "Fatima B.",
  "Emeka U.",
  "Blessing K.",
  "Ifeoma C.",
  "Segun T.",
  "Rita D.",
];

const COUNTRY_DEFS = [
  { name: "Nigeria", risky: false, weight: 5 },
  { name: "Ghana", risky: false, weight: 2 },
  { name: "Kenya", risky: false, weight: 2 },
  { name: "United States", risky: false, weight: 2 },
  { name: "United Kingdom", risky: false, weight: 1 },
  { name: "Russia", risky: true, weight: 1 },
  { name: "Unknown (VPN)", risky: true, weight: 1 },
];

const DEVICE_DEFS = [
  { name: "Android", icon: "fa-solid fa-mobile-screen", risky: false, weight: 4 },
  { name: "iOS", icon: "fa-solid fa-mobile-screen", risky: false, weight: 4 },
  { name: "Web / Chrome", icon: "fa-solid fa-desktop", risky: false, weight: 3 },
  { name: "Emulator", icon: "fa-solid fa-robot", risky: true, weight: 1 },
  { name: "Unknown", icon: "fa-solid fa-question", risky: true, weight: 1 },
];

const CURRENCIES = [
  { code: "NGN", symbol: "₦", weight: 6, min: 2000, max: 3000000 },
  { code: "USD", symbol: "$", weight: 2, min: 20, max: 8000 },
  { code: "GBP", symbol: "£", weight: 1, min: 20, max: 6000 },
];

function randIp(risky: boolean): string {
  if (risky) {
    return (
      (Math.random() > 0.5 ? "185.220.10" : "45.9.148") +
      "." +
      (1 + Math.floor(Math.random() * 254))
    );
  }
  return (
    "102." +
    (89 + Math.floor(Math.random() * 6)) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255)
  );
}

export function riskBucket(score: number): RiskBucketMeta {
  if (score <= 30) return { label: "Low", color: "#22C55E", bg: "#E9F9EE" };
  if (score <= 60) return { label: "Medium", color: "#B98900", bg: "#FEF6E5" };
  if (score <= 80) return { label: "High", color: "#FF9300", bg: "#FFF1DC" };
  return { label: "Critical", color: "#EF4444", bg: "#FDEBEB" };
}

function fmtTime(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

let TX_SEQ = 1;

function makeTransactionId(): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return "TX" + Date.now().toString(36) + rand + TX_SEQ++;
}

/** The randomly-generated shape of a transaction, before any scoring is applied. */
export interface RawTransaction {
  id: string;
  customer: string;
  country: string;
  countryRisky: boolean;
  device: string;
  deviceIcon: string;
  deviceRisky: boolean;
  ip: string;
  currencyCode: string;
  currencySymbol: string;
  amount: number;
  amountDisplay: string;
  time: string;
  createdAt: number;
}

export function generateRawTransaction(): RawTransaction {
  const country = weightedPick(COUNTRY_DEFS);
  const device = weightedPick(DEVICE_DEFS);
  const currency = weightedPick(CURRENCIES);
  const amount = Math.round(currency.min + Math.random() * (currency.max - currency.min));
  const now = new Date();

  return {
    id: makeTransactionId(),
    customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
    country: country.name,
    countryRisky: country.risky,
    device: device.name,
    deviceIcon: device.icon,
    deviceRisky: device.risky,
    ip: randIp(country.risky || device.risky),
    currencyCode: currency.code,
    currencySymbol: currency.symbol,
    amount,
    amountDisplay: currency.symbol + amount.toLocaleString("en-US"),
    time: fmtTime(now),
    createdAt: now.getTime(),
  };
}

interface ScoredTransaction {
  score: number;
  statusLabel: string;
  factors: RiskFactor[];
}

/**
 * Explainable, rule-driven scoring. Two kinds of factors:
 *  - base factors (always evaluated): a small baseline variance, plus fixed
 *    penalties for a risky country/device pick — these apply regardless of
 *    configured rules, so scoring is never a no-op with zero rules enabled.
 *  - rule factors: each enabled org rule is evaluated against the raw
 *    transaction (and, for velocity, recent same-customer activity) and adds
 *    its own factor when triggered. Toggling/editing a rule genuinely
 *    changes scoring output.
 */
export function scoreTransaction(
  raw: RawTransaction,
  rules: Rule[],
  recentSameCustomerCount: number
): ScoredTransaction {
  const factors: RiskFactor[] = [];

  const baseline = Math.round(5 + Math.random() * 20);
  factors.push({ code: "baseline", label: "Baseline model variance", weight: baseline });

  if (raw.countryRisky) {
    factors.push({ code: "high_risk_country", label: `Originates from ${raw.country}`, weight: 38 });
  }
  if (raw.deviceRisky) {
    factors.push({ code: "unrecognized_device", label: `Unrecognized device type: ${raw.device}`, weight: 28 });
  }

  for (const rule of rules) {
    if (!rule.enabled || !rule.ruleType) continue;
    const config = rule.config ?? {};

    if (rule.ruleType === "amount_threshold" && raw.currencyCode === "NGN") {
      const threshold = Number(config.threshold ?? Infinity);
      if (raw.amount > threshold) {
        factors.push({
          code: `rule:${rule.id}`,
          label: `${rule.name}: ${raw.amountDisplay} exceeds ₦${threshold.toLocaleString("en-US")}`,
          weight: 25,
        });
      }
    } else if (rule.ruleType === "country_risk") {
      const countries = Array.isArray(config.countries) ? (config.countries as string[]) : [];
      if (countries.includes(raw.country)) {
        factors.push({ code: `rule:${rule.id}`, label: `${rule.name}: ${raw.country}`, weight: 30 });
      }
    } else if (rule.ruleType === "device_risk") {
      const devices = Array.isArray(config.devices) ? (config.devices as string[]) : [];
      if (devices.includes(raw.device)) {
        factors.push({ code: `rule:${rule.id}`, label: `${rule.name}: ${raw.device}`, weight: 20 });
      }
    } else if (rule.ruleType === "velocity_count") {
      const maxCount = Number(config.maxCount ?? Infinity);
      const windowMinutes = Number(config.windowMinutes ?? 0);
      if (recentSameCustomerCount >= maxCount) {
        factors.push({
          code: `rule:${rule.id}`,
          label: `${rule.name}: ${recentSameCustomerCount} transactions in ${windowMinutes}m`,
          weight: 35,
        });
      }
    }
  }

  const score = Math.max(2, Math.min(99, factors.reduce((sum, f) => sum + f.weight, 0)));
  const bucket = riskBucket(score);

  return {
    score,
    statusLabel: score > 80 ? "BLOCKED" : bucket.label.toUpperCase(),
    factors,
  };
}

export function assembleTransaction(raw: RawTransaction, scored: ScoredTransaction): Transaction {
  return {
    id: raw.id,
    customer: raw.customer,
    country: raw.country,
    device: raw.device,
    deviceIcon: raw.deviceIcon,
    ip: raw.ip,
    currencySymbol: raw.currencySymbol,
    amount: raw.amount,
    amountDisplay: raw.amountDisplay,
    riskScore: scored.score,
    statusLabel: scored.statusLabel,
    riskFactors: scored.factors,
    time: raw.time,
    createdAt: raw.createdAt,
  };
}

/** Convenience for callers that don't need to inspect the raw shape separately. */
export function makeTransaction(rules: Rule[] = [], recentSameCustomerCount = 0): Transaction {
  const raw = generateRawTransaction();
  const scored = scoreTransaction(raw, rules, recentSameCustomerCount);
  return assembleTransaction(raw, scored);
}

export function seedTransactions(n: number, rules: Rule[] = []): Transaction[] {
  const perCustomerCount = new Map<string, number>();
  const arr: Transaction[] = [];
  for (let i = 0; i < n; i++) {
    const raw = generateRawTransaction();
    const recentCount = (perCustomerCount.get(raw.customer) ?? 0) + 1;
    perCustomerCount.set(raw.customer, recentCount);
    const scored = scoreTransaction(raw, rules, recentCount);
    arr.push(assembleTransaction(raw, scored));
  }
  return arr;
}

export const DEFAULT_RULES: Array<Pick<Rule, "name" | "description" | "enabled" | "ruleType" | "config">> = [
  {
    name: "Large transaction amount",
    description: "Flags NGN transactions above a configured amount threshold.",
    enabled: true,
    ruleType: "amount_threshold",
    config: { threshold: 500000 },
  },
  {
    name: "High-risk country",
    description: "Flags transactions originating from configured high-risk countries.",
    enabled: true,
    ruleType: "country_risk",
    config: { countries: ["Russia", "Unknown (VPN)"] },
  },
  {
    name: "Unrecognized device",
    description: "Flags transactions from configured risky device types.",
    enabled: true,
    ruleType: "device_risk",
    config: { devices: ["Emulator", "Unknown"] },
  },
  {
    name: "Velocity check",
    description: "Flags a customer exceeding a configured transaction count within a time window.",
    enabled: true,
    ruleType: "velocity_count",
    config: { windowMinutes: 2, maxCount: 5 },
  },
];

export const REPORT_DEFS = [
  { id: "rep1", name: "Daily Fraud Report", description: "Summary of all flagged and blocked transactions in the last 24 hours." },
  { id: "rep2", name: "Weekly Report", description: "7-day rollup of fraud trends, risk regions, and prevented losses." },
  { id: "rep3", name: "Monthly Report", description: "Full monthly performance and detection-accuracy breakdown." },
  { id: "rep4", name: "Investigator Report", description: "Case-by-case detail log for compliance and audit review." },
  { id: "rep5", name: "Compliance Report", description: "Regulatory-ready export of all high-risk and blocked activity." },
  { id: "rep6", name: "Executive Summary", description: "High-level KPIs for leadership: prevented losses, trend lines." },
];

export const NAV_DEFS: { id: string; label: string; icon: string; permission: Permission }[] = [
  { id: "overview", label: "Overview", icon: "fa-solid fa-gauge-high", permission: "view:overview" },
  { id: "transactions", label: "Transactions", icon: "fa-solid fa-arrow-right-arrow-left", permission: "view:transactions" },
  { id: "cases", label: "Case Management", icon: "fa-solid fa-folder-open", permission: "view:cases" },
  { id: "rules", label: "Rules Engine", icon: "fa-solid fa-list-check", permission: "view:rules" },
  { id: "reports", label: "Reports", icon: "fa-solid fa-file-lines", permission: "view:reports" },
  { id: "audit", label: "Audit Log", icon: "fa-solid fa-clipboard-list", permission: "view:audit_log" },
];
