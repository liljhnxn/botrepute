"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { isAddress } from "viem";
import { fetchPublicRecipientAttestations, AttestationData } from "@/lib/publicClient";
import { CredentialCard } from "@/components/CredentialCard";
import { TrustBanner } from "@/components/TrustBanner";
import { BackButton } from "@/components/BackButton";
import { formatAddress } from "@/lib/botns";
import { getAttestationStatus, getExplorerUrl } from "@/lib/utils";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Award,
  AlertCircle,
  Filter,
} from "lucide-react";

export default function PublicProfilePage() {
  const params = useParams();
  const addressParam = (params?.address as string) || "";

  const [attestations, setAttestations] = useState<AttestationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "VERIFIED" | "EXPIRED" | "REVOKED">("ALL");
  const [copied, setCopied] = useState(false);

  const isValidWalletAddress = isAddress(addressParam);

  const loadData = async () => {
    if (!isValidWalletAddress) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPublicRecipientAttestations(
        addressParam as `0x${string}`
      );
      setAttestations(data);
    } catch (err) {
      console.error("Error loading public profile:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [addressParam]);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressParam);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isValidWalletAddress) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />
          <h2 className="text-lg font-bold text-white mb-1">Invalid Wallet Address</h2>
          <p className="text-xs text-rose-300 mb-4">
            "{addressParam}" is not a valid EVM address format (0x...).
          </p>
          <Link
            href="/search"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const stats = {
    total: attestations.length,
    active: attestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "VERIFIED"
    ).length,
    expired: attestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "EXPIRED"
    ).length,
    revoked: attestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "REVOKED"
    ).length,
  };

  const filteredAttestations = attestations.filter((a) => {
    if (filterStatus === "ALL") return true;
    return getAttestationStatus(a.revoked, a.expiresAt) === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <BackButton />
      </div>

      {/* Public Profile Header */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-md shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-2xl shadow-purpleGlow">
              {addressParam.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {formatAddress(addressParam, 6)}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                  Public Wallet Profile
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 break-all">
                {addressParam}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{copied ? "Copied" : "Copy Address"}</span>
            </button>

            <a
              href={getExplorerUrl("address", addressParam)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>BohrScan</span>
            </a>

            <button
              onClick={loadData}
              disabled={loading}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Statistics Bar - Verifiable counts only (No fabricated single score!) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Total Credentials</span>
            <span className="text-2xl font-bold font-mono text-white mt-0.5 block">{stats.total}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-emerald-400/80 uppercase font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active / Valid
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 block">{stats.active}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-amber-400/80 uppercase font-semibold flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" /> Expired
            </span>
            <span className="text-2xl font-bold font-mono text-amber-400 mt-0.5 block">{stats.expired}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-rose-400/80 uppercase font-semibold flex items-center gap-1">
              <XCircle className="w-3 h-3 text-rose-400" /> Revoked
            </span>
            <span className="text-2xl font-bold font-mono text-rose-400 mt-0.5 block">{stats.revoked}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Filter Status:
          </span>
          <div className="flex items-center gap-1.5">
            {(["ALL", "VERIFIED", "EXPIRED", "REVOKED"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  filterStatus === s
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredAttestations.length} of {attestations.length} attestations
        </span>
      </div>

      {/* Credentials Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Reading recipient attestations from Botchain...</span>
        </div>
      ) : filteredAttestations.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Credentials Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            This wallet address currently holds no {filterStatus !== "ALL" ? filterStatus.toLowerCase() : ""} on-chain attestations on Botchain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttestations.map((att) => (
            <CredentialCard
              key={att.id.toString()}
              attestation={att}
            />
          ))}
        </div>
      )}

      <TrustBanner variant="full" />
    </div>
  );
}
