"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { fetchPublicIssuerAttestations, AttestationData } from "@/lib/publicClient";
import { BOTREPUTE_ABI, BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";
import { CredentialCard } from "@/components/CredentialCard";
import { TrustBanner } from "@/components/TrustBanner";
import { BackButton } from "@/components/BackButton";
import { formatAddress } from "@/lib/botns";
import { getAttestationStatus, parseContractError } from "@/lib/utils";
import {
  Layers,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  PlusCircle,
  RefreshCw,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Building,
} from "lucide-react";

export default function IssuerDashboardPage() {
  const { address, isConnected } = useAccount();

  const [issuedAttestations, setIssuedAttestations] = useState<AttestationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [revokingId, setRevokingId] = useState<bigint | null>(null);

  const {
    data: revokeHash,
    writeContract: revokeWrite,
    isPending: isRevokePending,
    error: revokeError,
  } = useWriteContract();

  const { isLoading: isRevokeConfirming, isSuccess: isRevokeSuccess } =
    useWaitForTransactionReceipt({ hash: revokeHash });

  const loadData = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const data = await fetchPublicIssuerAttestations(address);
      // Sort newest first
      setIssuedAttestations(data.reverse());
    } catch (err) {
      console.error("Error loading issuer attestations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      loadData();
    }
  }, [address]);

  useEffect(() => {
    if (isRevokeSuccess) {
      loadData();
      setRevokingId(null);
    }
  }, [isRevokeSuccess]);

  const handleRevoke = (id: bigint) => {
    setRevokingId(id);
    revokeWrite({
      address: BOTREPUTE_CONTRACT_ADDRESS,
      abi: BOTREPUTE_ABI,
      functionName: "revokeAttestation",
      args: [id],
    });
  };

  const stats = {
    total: issuedAttestations.length,
    active: issuedAttestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "VERIFIED"
    ).length,
    expired: issuedAttestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "EXPIRED"
    ).length,
    revoked: issuedAttestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "REVOKED"
    ).length,
  };

  if (!isConnected || !address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400 mx-auto mb-4">
          <Building className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Issuer Wallet</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Connect the wallet or multi-sig organization address that issued credentials to access management and revocation tools.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <BackButton />
      </div>

      {/* Dashboard Top */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-md shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-purpleGlow">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Issuer Management Hub
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/30">
                  Authorized Issuer
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 break-all">
                {address}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/issue"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-cyanGlow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Issue New Credential</span>
            </Link>

            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Issuer Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Total Issued</span>
            <span className="text-2xl font-bold font-mono text-white mt-0.5 block">{stats.total}</span>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] text-emerald-400/80 uppercase font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Active
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

      {/* Revocation Success or Error alert */}
      {revokeError && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{parseContractError(revokeError)}</span>
        </div>
      )}

      {isRevokeSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>Attestation successfully revoked on BOT Chain Mainnet!</span>
        </div>
      )}

      {/* Issuance Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Issued Credentials</span>
            <span className="text-xs text-slate-500 font-mono">({issuedAttestations.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Click 'Revoke' to cancel a previously issued attestation.
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-500 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
            <span>Loading issuer records...</span>
          </div>
        ) : issuedAttestations.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Credentials Issued Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              Issue your first attestation to recognize a developer, DAO member, or creator on Botchain.
            </p>
            <Link
              href="/issue"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-colors"
            >
              <span>Issue Credential Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issuedAttestations.map((att) => (
              <CredentialCard
                key={att.id.toString()}
                attestation={att}
                showRevokeButton={true}
                onRevoke={handleRevoke}
                isRevoking={revokingId === att.id && (isRevokePending || isRevokeConfirming)}
              />
            ))}
          </div>
        )}
      </div>

      <TrustBanner variant="full" />
    </div>
  );
}
