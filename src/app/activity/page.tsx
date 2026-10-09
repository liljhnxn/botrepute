"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { publicClient, AttestationData } from "@/lib/publicClient";
import { BOTREPUTE_ABI, BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";
import { CredentialStatusBadge } from "@/components/CredentialStatusBadge";
import { TrustBanner } from "@/components/TrustBanner";
import { formatAddress } from "@/lib/botns";
import { formatDate, getAttestationStatus, getExplorerUrl } from "@/lib/utils";
import { getCredentialTypeInfo } from "@/lib/credentialTypes";
import { BackButton } from "@/components/BackButton";
import {
  Activity,
  Award,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Clock,
  ArrowRight,
  Hash,
  Filter,
} from "lucide-react";

export default function ActivityPage() {
  const [attestations, setAttestations] = useState<AttestationData[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const loadRecentActivity = async () => {
    setLoading(true);
    try {
      // Query total attestations on chain
      const nextId = (await publicClient.readContract({
        address: BOTREPUTE_CONTRACT_ADDRESS,
        abi: BOTREPUTE_ABI,
        functionName: "nextAttestationId",
      })) as bigint;

      const total = Number(nextId) - 1;
      setTotalCount(total > 0 ? total : 0);

      if (total <= 0) {
        setAttestations([]);
        setLoading(false);
        return;
      }

      // Fetch the last N attestations (up to 20)
      const countToFetch = Math.min(total, 20);
      const ids: bigint[] = [];
      for (let i = total; i > total - countToFetch; i--) {
        ids.push(BigInt(i));
      }

      const fetched = await Promise.all(
        ids.map(async (id) => {
          try {
            return (await publicClient.readContract({
              address: BOTREPUTE_CONTRACT_ADDRESS,
              abi: BOTREPUTE_ABI,
              functionName: "getAttestation",
              args: [id],
            })) as AttestationData;
          } catch {
            return null;
          }
        })
      );

      setAttestations(fetched.filter((a): a is AttestationData => a !== null));
    } catch (err) {
      console.warn("Could not query activity feed from RPC:", err);
      setAttestations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentActivity();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <BackButton />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Botchain Ledger Stream</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live Protocol Activity
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time on-chain attestations and credential status transitions. No synthetic or mock transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Total Minted: <strong className="text-cyan-400">{totalCount}</strong>
          </div>

          <button
            onClick={loadRecentActivity}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh Activity"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Activity Timeline List */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Syncing Botchain activity log...</span>
        </div>
      ) : attestations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Activity className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No On-Chain Activity Recorded Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
            Be the first to issue an on-chain credential on BOT Chain Mainnet!
          </p>
          <Link
            href="/issue"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
          >
            <span>Issue Attestation #1</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {attestations.map((att) => {
            const status = getAttestationStatus(att.revoked, att.expiresAt);
            const typeInfo = getCredentialTypeInfo(att.credentialType);
            const idStr = att.id.toString();

            return (
              <div
                key={idStr}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-slate-400 font-semibold">
                        #{idStr}
                      </span>
                      <span className="font-bold text-white text-sm sm:text-base">
                        {att.title}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${typeInfo.badgeColor}`}
                      >
                        {typeInfo.label}
                      </span>
                      <CredentialStatusBadge status={status} size="sm" />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400 font-mono">
                      <span>
                        Recipient:{" "}
                        <Link
                          href={`/profile/${att.recipient}`}
                          className="text-cyan-400 hover:underline"
                        >
                          {formatAddress(att.recipient)}
                        </Link>
                      </span>
                      <span>•</span>
                      <span>
                        Issuer:{" "}
                        <Link
                          href={`/profile/${att.issuer}`}
                          className="text-purple-400 hover:underline"
                        >
                          {formatAddress(att.issuer)}
                        </Link>
                      </span>
                      <span>•</span>
                      <span className="text-slate-500 font-sans">
                        {formatDate(att.issuedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <Link
                    href={`/verify?id=${idStr}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </Link>

                  <a
                    href={getExplorerUrl("address", att.recipient)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="View on Mainnet Explorer"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TrustBanner variant="full" />
    </div>
  );
}
