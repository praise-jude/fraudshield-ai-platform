import { NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";

export const ROLES = [
  "owner",
  "administrator",
  "fraud_analyst",
  "compliance_officer",
  "risk_manager",
  "customer_support",
  "auditor",
  "read_only",
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  "view:overview",
  "view:transactions",
  "view:cases",
  "manage:cases",
  "view:rules",
  "manage:rules",
  "view:reports",
  "export:reports",
  "view:audit_log",
  "simulate:transactions",
  "view:identities",
  "view:watchlist",
  "manage:watchlist",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

// Code-defined for now — a DB-driven, admin-editable permission matrix is a
// Phase 2+ upgrade (see plan doc). Owner and Administrator get everything.
const ALL_PERMISSIONS = new Set<Permission>(PERMISSIONS);

export const ROLE_PERMISSIONS: Record<Role, Set<Permission>> = {
  owner: ALL_PERMISSIONS,
  administrator: ALL_PERMISSIONS,
  fraud_analyst: new Set<Permission>([
    "view:overview",
    "view:transactions",
    "view:cases",
    "manage:cases",
    "view:rules",
    "simulate:transactions",
    "view:identities",
    "view:watchlist",
    "manage:watchlist",
  ]),
  risk_manager: new Set<Permission>([
    "view:overview",
    "view:transactions",
    "view:cases",
    "manage:cases",
    "view:rules",
    "manage:rules",
    "view:identities",
    "view:watchlist",
    "manage:watchlist",
  ]),
  compliance_officer: new Set<Permission>([
    "view:overview",
    "view:cases",
    "view:reports",
    "export:reports",
    "view:audit_log",
    "view:identities",
    "view:watchlist",
  ]),
  auditor: new Set<Permission>([
    "view:overview",
    "view:reports",
    "export:reports",
    "view:audit_log",
    "view:identities",
    "view:watchlist",
  ]),
  customer_support: new Set<Permission>(["view:overview", "view:cases"]),
  read_only: new Set<Permission>([
    "view:overview",
    "view:transactions",
    "view:cases",
    "view:rules",
    "view:reports",
    "view:identities",
    "view:watchlist",
  ]),
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.has(permission) ?? false;
}

// First permission a role holds, in priority order — used to pick a role's
// default landing view among the dashboard's nav items.
const VIEW_PRIORITY: Permission[] = [
  "view:overview",
  "view:transactions",
  "view:cases",
  "view:rules",
  "view:reports",
  "view:audit_log",
];

export function defaultViewFor(role: Role): Permission {
  return VIEW_PRIORITY.find((p) => hasPermission(role, p)) ?? "view:overview";
}

export interface AuthedUser {
  user: User;
  role: Role;
  orgId: string;
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
