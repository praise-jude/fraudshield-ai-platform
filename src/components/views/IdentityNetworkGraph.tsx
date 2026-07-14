"use client";

import { riskBucket } from "@/lib/mock";
import type { IdentityProfile } from "@/lib/types";

interface IdentityNetworkGraphProps {
  profile: IdentityProfile;
  onSelectIdentity: (customer: string) => void;
}

const SIZE = 320;
const CENTER = SIZE / 2;
const MIDDLE_RADIUS = 90;
const OUTER_RADIUS = 145;

function ringPositions(count: number, radius: number) {
  if (count === 0) return [];
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return { x: CENTER + radius * Math.cos(angle), y: CENTER + radius * Math.sin(angle) };
  });
}

export default function IdentityNetworkGraph({ profile, onSelectIdentity }: IdentityNetworkGraphProps) {
  const linkNodes = [...profile.stats.devices, ...profile.stats.ips].slice(0, 8);
  const linkPositions = ringPositions(linkNodes.length, MIDDLE_RADIUS);

  const related = profile.relatedIdentities.slice(0, 10);
  const relatedPositions = ringPositions(related.length, OUTER_RADIUS);

  const centerBucket = riskBucket(profile.stats.maxRiskScore);

  if (linkNodes.length === 0 && related.length === 0) {
    return <p className="text-sm text-[#9CA3AF]">No shared devices or IP addresses with other identities.</p>;
  }

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Identity relationship graph">
      {/* edges: center -> link nodes */}
      {linkPositions.map((pos, i) => (
        <line key={`edge-center-${i}`} x1={CENTER} y1={CENTER} x2={pos.x} y2={pos.y} stroke="#E5E7EB" strokeWidth={2} />
      ))}
      {/* edges: link nodes -> related identities that share them */}
      {related.map((rel, i) => {
        const linkIndex = linkNodes.indexOf(rel.sharedValue);
        const from = linkIndex >= 0 ? linkPositions[linkIndex] : { x: CENTER, y: CENTER };
        const to = relatedPositions[i];
        return (
          <line
            key={`edge-related-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="#E5E7EB"
            strokeWidth={2}
            strokeDasharray="3 3"
          />
        );
      })}

      {/* center node: the searched identity */}
      <circle cx={CENTER} cy={CENTER} r={22} fill={centerBucket.bg} stroke={centerBucket.color} strokeWidth={2} />
      <text x={CENTER} y={CENTER + 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={centerBucket.color}>
        {profile.customer.split(" ")[0]}
      </text>

      {/* middle ring: devices/IPs used */}
      {linkNodes.map((val, i) => {
        const pos = linkPositions[i];
        return (
          <g key={`link-${i}`}>
            <circle cx={pos.x} cy={pos.y} r={14} fill="#F3F4F6" stroke="#9CA3AF" strokeWidth={1.5}>
              <title>{val}</title>
            </circle>
            <text x={pos.x} y={pos.y + 26} textAnchor="middle" fontSize={9} fill="#6B7280">
              {val.length > 12 ? val.slice(0, 11) + "…" : val}
            </text>
          </g>
        );
      })}

      {/* outer ring: related identities */}
      {related.map((rel, i) => {
        const pos = relatedPositions[i];
        const bucket = riskBucket(rel.maxRiskScore);
        return (
          <g
            key={`related-${i}`}
            className="cursor-pointer"
            onClick={() => onSelectIdentity(rel.customer)}
          >
            <circle cx={pos.x} cy={pos.y} r={16} fill={bucket.bg} stroke={bucket.color} strokeWidth={2}>
              <title>
                {rel.customer} — shares {rel.sharedVia} {rel.sharedValue} — {rel.transactionCount} transactions
              </title>
            </circle>
            <text x={pos.x} y={pos.y + 28} textAnchor="middle" fontSize={9} fontWeight={600} fill="#374151">
              {rel.customer.split(" ")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
