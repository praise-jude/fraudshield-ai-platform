import type { RiskBucketMeta, Transaction } from "./types";

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

export function makeTransaction(): Transaction {
  const country = weightedPick(COUNTRY_DEFS);
  const device = weightedPick(DEVICE_DEFS);
  const currency = weightedPick(CURRENCIES);
  const amount = Math.round(currency.min + Math.random() * (currency.max - currency.min));

  let score = 5 + Math.random() * 20;
  if (country.risky) score += 38;
  if (device.risky) score += 28;
  if (currency.code !== "NGN" && amount > currency.max * 0.7) score += 12;
  if (currency.code === "NGN" && amount > 1500000) score += 15;
  score = Math.max(2, Math.min(99, Math.round(score)));

  const bucket = riskBucket(score);
  const now = new Date();

  return {
    id: makeTransactionId(),
    customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
    country: country.name,
    device: device.name,
    deviceIcon: device.icon,
    ip: randIp(country.risky || device.risky),
    currencySymbol: currency.symbol,
    amount,
    amountDisplay: currency.symbol + amount.toLocaleString("en-US"),
    riskScore: score,
    statusLabel: score > 80 ? "BLOCKED" : bucket.label.toUpperCase(),
    time: fmtTime(now),
    createdAt: now.getTime(),
  };
}

export function seedTransactions(n: number): Transaction[] {
  const arr: Transaction[] = [];
  for (let i = 0; i < n; i++) arr.push(makeTransaction());
  return arr;
}

export const REPORT_DEFS = [
  { id: "rep1", name: "Daily Fraud Report", description: "Summary of all flagged and blocked transactions in the last 24 hours." },
  { id: "rep2", name: "Weekly Report", description: "7-day rollup of fraud trends, risk regions, and prevented losses." },
  { id: "rep3", name: "Monthly Report", description: "Full monthly performance and detection-accuracy breakdown." },
  { id: "rep4", name: "Investigator Report", description: "Case-by-case detail log for compliance and audit review." },
  { id: "rep5", name: "Compliance Report", description: "Regulatory-ready export of all high-risk and blocked activity." },
  { id: "rep6", name: "Executive Summary", description: "High-level KPIs for leadership: prevented losses, trend lines." },
];

export const NAV_DEFS: { id: string; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "fa-solid fa-gauge-high" },
  { id: "transactions", label: "Transactions", icon: "fa-solid fa-arrow-right-arrow-left" },
  { id: "cases", label: "Case Management", icon: "fa-solid fa-folder-open" },
  { id: "rules", label: "Rules Engine", icon: "fa-solid fa-list-check" },
  { id: "reports", label: "Reports", icon: "fa-solid fa-file-lines" },
];
