"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Toast from "@/components/Toast";
import OverviewView from "@/components/views/OverviewView";
import TransactionsView from "@/components/views/TransactionsView";
import CasesView from "@/components/views/CasesView";
import RulesView from "@/components/views/RulesView";
import ReportsView from "@/components/views/ReportsView";
import AuditLogView from "@/components/views/AuditLogView";
import {
  advanceCase,
  exportReport,
  getAuditLogs,
  getBootstrap,
  simulateTransaction,
  toggleRule,
} from "@/lib/apiClient";
import { NAV_DEFS, REPORT_DEFS, riskBucket } from "@/lib/mock";
import { hasPermission, type Role } from "@/lib/permissions";
import type { AuditLogEntry, CaseRecord, Report, Rule, Transaction, View } from "@/lib/types";

interface DashboardClientProps {
  role: Role;
  userName: string;
  userInitials: string;
}

const VIEW_TITLES: Record<View, string> = {
  overview: "Overview",
  transactions: "Transactions",
  cases: "Case Management",
  rules: "Rules Engine",
  reports: "Reports",
  audit: "Audit Log",
};

export default function DashboardClient({ role, userName, userInitials }: DashboardClientProps) {
  const visibleNav = useMemo(() => NAV_DEFS.filter((item) => hasPermission(role, item.permission)), [role]);
  const canSimulate = hasPermission(role, "simulate:transactions");

  const [activeView, setActiveView] = useState<View>((visibleNav[0]?.id as View) ?? "overview");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [rules, setRules] = useState<Rule[]>([]);
  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [txSearch, setTxSearch] = useState("");
  const [txRiskFilter, setTxRiskFilter] = useState("all");
  const [liveOn, setLiveOn] = useState(canSimulate);
  const [toastMessage, setToastMessage] = useState("");

  const liveOnRef = useRef(liveOn);
  liveOnRef.current = liveOn;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getBootstrap().then((data) => {
      if (cancelled) return;
      setTransactions(data.transactions);
      setCases(data.cases);
      setRules(data.rules);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (activeView !== "audit") return;
    let cancelled = false;
    setAuditLoading(true);
    getAuditLogs()
      .then((data) => {
        if (!cancelled) setAuditEntries(data.entries);
      })
      .finally(() => {
        if (!cancelled) setAuditLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeView]);

  useEffect(() => {
    if (!canSimulate) return;
    const timer = setInterval(() => {
      if (!liveOnRef.current) return;
      void simulateTransaction().then(({ transaction, case: newCase }) => {
        setTransactions((prev) => [transaction, ...prev].slice(0, 60));
        if (newCase) {
          setCases((prev) => [newCase, ...prev].slice(0, 20));
        }
      });
    }, 3200);
    return () => clearInterval(timer);
  }, [canSimulate]);

  const showToast = useCallback((msg: string) => {
    clearTimeout(toastTimer.current);
    setToastMessage(msg);
    toastTimer.current = setTimeout(() => setToastMessage(""), 2400);
  }, []);

  const handleAdvanceCase = useCallback((txId: string) => {
    void advanceCase(txId).then(({ status }) => {
      setCases((prev) => prev.map((c) => (c.txId === txId ? { ...c, status } : c)));
    });
  }, []);

  const handleToggleRule = useCallback((id: string, enabled: boolean) => {
    void toggleRule(id, enabled);
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled } : r)));
  }, []);

  const handleExportReport = useCallback(
    (report: Report) => {
      void exportReport(report.id).then(() => showToast(`${report.name} exported`));
    },
    [showToast]
  );

  const txCount = transactions.length;
  const safeCount = transactions.filter((t) => t.riskScore <= 30).length;
  const blockedCount = transactions.filter((t) => t.riskScore > 80).length;
  const fraudPrevented = transactions
    .filter((t) => t.riskScore > 80)
    .reduce((sum, t) => sum + (t.currencySymbol === "₦" ? t.amount / 1600 : t.amount), 0);

  const kpis = useMemo(
    () => [
      {
        label: "Total Transactions",
        value: txCount.toLocaleString(),
        sub: "Last 24 hours",
        subColor: "#6B7280",
        icon: "fa-solid fa-arrow-right-arrow-left",
        iconBg: "#EAF0FF",
        iconColor: "#000F9A",
      },
      {
        label: "Safe",
        value: safeCount.toLocaleString(),
        sub: ((safeCount / Math.max(txCount, 1)) * 100).toFixed(0) + "% of total",
        subColor: "#22C55E",
        icon: "fa-solid fa-circle-check",
        iconBg: "#E9F9EE",
        iconColor: "#22C55E",
      },
      {
        label: "Blocked",
        value: blockedCount.toLocaleString(),
        sub: "Auto-blocked",
        subColor: "#EF4444",
        icon: "fa-solid fa-ban",
        iconBg: "#FDEBEB",
        iconColor: "#EF4444",
      },
      {
        label: "Fraud Prevented",
        value: "$" + Math.round(fraudPrevented).toLocaleString(),
        sub: "Estimated savings",
        subColor: "#FF9300",
        icon: "fa-solid fa-sack-dollar",
        iconBg: "#FFF1DC",
        iconColor: "#FF9300",
      },
    ],
    [txCount, safeCount, blockedCount, fraudPrevented]
  );

  const feedTransactions = useMemo(() => transactions.slice(0, 10), [transactions]);

  const riskRegions = useMemo(() => {
    const regionCounts: Record<string, number> = {};
    transactions.forEach((t) => {
      regionCounts[t.country] = (regionCounts[t.country] || 0) + (t.riskScore > 60 ? 1 : 0);
    });
    const regions = Object.entries(regionCounts)
      .filter(([, c]) => c > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count, pct: Math.min(100, count * 22) + "%", color: "#FF9300" }));
    return regions.length ? regions : [{ name: "No flagged regions yet", count: 0, pct: "4%", color: "#E5E7EB" }];
  }, [transactions]);

  const riskBuckets = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    transactions.forEach((t) => {
      counts[riskBucket(t.riskScore).label]++;
    });
    return [
      { label: "Low", color: "#22C55E", count: counts.Low },
      { label: "Medium", color: "#EAB308", count: counts.Medium },
      { label: "High", color: "#FF9300", count: counts.High },
      { label: "Critical", color: "#EF4444", count: counts.Critical },
    ].map((b) => ({ ...b, pct: Math.round((b.count / Math.max(txCount, 1)) * 100) + "%" }));
  }, [transactions, txCount]);

  const filteredTransactions = useMemo(() => {
    const search = txSearch.toLowerCase();
    return transactions.filter((t) => {
      const matchesSearch = !search || t.customer.toLowerCase().includes(search) || t.ip.includes(search);
      const bucket = riskBucket(t.riskScore).label.toLowerCase();
      const matchesFilter = txRiskFilter === "all" || bucket === txRiskFilter;
      return matchesSearch && matchesFilter;
    });
  }, [transactions, txSearch, txRiskFilter]);

  const activeAlertsCount = cases.filter((c) => c.status !== "resolved").length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F3F4F6] text-[#1F2937] dark:bg-[#0B0F1A] dark:text-white">
      <Sidebar
        navItems={visibleNav}
        activeView={activeView}
        onNavigate={setActiveView}
        liveOn={liveOn}
        onToggleLive={() => setLiveOn((v) => !v)}
      />

      <div className="flex h-screen min-w-0 flex-1 flex-col">
        <Topbar
          title={VIEW_TITLES[activeView]}
          activeAlertsCount={activeAlertsCount}
          userName={userName}
          userInitials={userInitials}
        />

        <div className="flex-1 overflow-y-auto p-7">
          {activeView === "overview" && (
            <OverviewView
              kpis={kpis}
              feedTransactions={feedTransactions}
              liveOn={liveOn}
              riskRegions={riskRegions}
              riskBuckets={riskBuckets}
              txCount={txCount}
            />
          )}
          {activeView === "transactions" && (
            <TransactionsView
              transactions={filteredTransactions}
              txCount={txCount}
              search={txSearch}
              onSearchChange={setTxSearch}
              riskFilter={txRiskFilter}
              onRiskFilterChange={setTxRiskFilter}
            />
          )}
          {activeView === "cases" && <CasesView cases={cases} onAdvance={handleAdvanceCase} />}
          {activeView === "rules" && <RulesView rules={rules} onToggle={handleToggleRule} />}
          {activeView === "reports" && (
            <ReportsView reports={REPORT_DEFS as Report[]} onExport={handleExportReport} />
          )}
          {activeView === "audit" && <AuditLogView entries={auditEntries} loading={auditLoading} />}
        </div>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
