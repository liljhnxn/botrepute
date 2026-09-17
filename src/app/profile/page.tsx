"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { fetchPublicRecipientAttestations, fetchPublicIssuerAttestations, AttestationData } from "@/lib/publicClient";
import { BOTREPUTE_ABI, BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";
import { CredentialCard } from "@/components/CredentialCard";
import { TrustBanner } from "@/components/TrustBanner";
import { BackButton } from "@/components/BackButton";
import { formatAddress } from "@/lib/botns";
import { getAttestationStatus, parseContractError } from "@/lib/utils";
import {
  Award,
  Layers,
  ShieldCheck,
  Search,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  User,
  Activity,
} from "lucide-react";

export default function ConnectedProfilePage() {
  const { address, isConnected } = useAccount();

  const [activeTab, setActiveTab] = useState<"received" | "issued">("received");
  const [receivedAttestations, setReceivedAttestations] = useState<AttestationData[]>([]);
  const [issuedAttestations, setIssuedAttestations] = useState<AttestationData[]>([]);
  const [loading, setLoading] = useState(false);

  // Revocation handling
  const [revokingId, setRevokingId] = useState<bigint | null>(null);

  const {
    data: revokeTxHash,
    writeContract: revokeWrite,
    isPending: isRevokePending,
    error: revokeError,
  } = useWriteContract();

  const { isLoading: isRevokeConfirming, isSuccess: isRevokeSuccess } =
    useWaitForTransactionReceipt({ hash: revokeTxHash });

  const loadData = async () => {
    if (!address) return;
    setLoading(true);
    try {
      const [received, issued] = await Promise.all([
        fetchPublicRecipientAttestations(address),
        fetchPublicIssuerAttestations(address),
      ]);
      setReceivedAttestations(received);
      setIssuedAttestations(issued);
    } catch (err) {
      console.error("Failed to load profile credentials:", err);
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

  // Compute stats for received credentials
  const stats = {
    total: receivedAttestations.length,
    active: receivedAttestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "VERIFIED"
    ).length,
    expired: receivedAttestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "EXPIRED"
    ).length,
    revoked: receivedAttestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "REVOKED"
    ).length,
  };

  const issuedStats = {
    total: issuedAttestations.length,
    active: issuedAttestations.filter(
      (a) => getAttestationStatus(a.revoked, a.expiresAt) === "VERIFIED"
    ).length,
    revoked: issuedAttestations.filter((a) => a.revoked).length,
  };

  if (!isConnected || !address) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          Connect your Web3 wallet to view your portable credentials, manage credentials you have issued, and track reputation stats.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <BackButton />
      </div>

      {/* Profile Header */}
      <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 backdrop-blur-md shadow-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-cyanGlow">
              {address.slice(2, 4).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white font-mono">
                  {formatAddress(address, 6)}
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/30">
                  Connected
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 break-all">
                {address}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/issue"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-cyanGlow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Issue Credential</span>
            </Link>

            <Link
              href={`/profile/${address}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>View Public Profile</span>
            </Link>

            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Credential Statistics Grid */}
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

      {/* Revocation error alert */}
      {revokeError && (
        <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{parseContractError(revokeError)}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("received")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "received"
              ? "bg-slate-800 text-cyan-400 border border-cyan-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>My Credentials ({receivedAttestations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("issued")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === "issued"
              ? "bg-slate-800 text-purple-400 border border-purple-500/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Credentials I Issued ({issuedAttestations.length})</span>
        </button>
      </div>

      {/* Content Stream */}
      {loading ? (
        <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Reading Botchain attestations...</span>
        </div>
      ) : activeTab === "received" ? (
        receivedAttestations.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Credentials Received Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              When DAOs, communities, or projects issue attestations to your wallet address, they will appear here.
            </p>
            <Link
              href="/issue"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold transition-colors"
            >
              <span>Issue Your First Test Credential</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {receivedAttestations.map((att) => (
              <CredentialCard
                key={att.id.toString()}
                attestation={att}
              />
            ))}
          </div>
        )
      ) : (
        issuedAttestations.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No Credentials Issued Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
              You haven't issued any on-chain attestations from this wallet address yet.
            </p>
            <Link
              href="/issue"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors"
            >
              <span>Issue a Credential</span>
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
        )
      )}

      <TrustBanner variant="full" />
    </div>
  );
}
