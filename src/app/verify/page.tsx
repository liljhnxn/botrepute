"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { isAddress } from "viem";
import { fetchPublicAttestation, AttestationData } from "@/lib/publicClient";
import { BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";
import { botchain } from "@/config/botchain";
import { CredentialStatusBadge } from "@/components/CredentialStatusBadge";
import { QRCodeModal } from "@/components/QRCodeModal";
import { TrustBanner } from "@/components/TrustBanner";
import { BackButton } from "@/components/BackButton";
import { getCredentialTypeInfo } from "@/lib/credentialTypes";
import { formatDate, getAttestationStatus, getExplorerUrl } from "@/lib/utils";
import { formatAddress } from "@/lib/botns";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  QrCode,
  Calendar,
  Clock,
  User,
  Building,
  Hash,
  Layers,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";

  const [searchId, setSearchId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [queriedId, setQueriedId] = useState<bigint | null>(null);
  const [attestation, setAttestation] = useState<AttestationData | null>(null);
  const [isValid, setIsValid] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedContract, setCopiedContract] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const performVerification = async (queryStr: string) => {
    const trimmed = queryStr.trim();
    if (!trimmed) {
      setError("Please enter a valid Attestation ID or wallet address.");
      setAttestation(null);
      return;
    }

    // If user enters an EVM wallet address, seamlessly route to their reputation profile!
    if (isAddress(trimmed)) {
      router.push(`/profile/${trimmed}`);
      return;
    }

    // Clean numeric ID (strip leading # or id:)
    const cleaned = trimmed.replace(/^[#id:]+/i, "").trim();

    if (!cleaned || isNaN(Number(cleaned)) || Number(cleaned) <= 0) {
      setError("Please enter a valid positive numerical Attestation ID or 0x wallet address.");
      setAttestation(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idBigInt = BigInt(cleaned);
      setQueriedId(idBigInt);
      const result = await fetchPublicAttestation(idBigInt);

      if (!result.attestation || result.attestation.id === 0n) {
        setError(`Attestation #${cleaned} was not found on Botchain Testnet.`);
        setAttestation(null);
      } else {
        setAttestation(result.attestation);
        setIsValid(result.isValid);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to query the Botchain RPC.");
      setAttestation(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      performVerification(initialId);
    }
  }, [initialId]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performVerification(searchId);
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(BOTREPUTE_CONTRACT_ADDRESS);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const status = attestation
    ? getAttestationStatus(attestation.revoked, attestation.expiresAt)
    : "VERIFIED";

  const typeInfo = attestation
    ? getCredentialTypeInfo(attestation.credentialType)
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <BackButton />
      </div>

      {/* Title & Introduction */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero-Wallet Public Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Verify On-Chain Credential
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Query the Botchain Testnet ledger directly. Verifications are cryptographic, instantaneous, and free.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-6 shadow-card backdrop-blur-md">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Enter Attestation ID (e.g. 1) or Wallet Address (0x...)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-cyanGlow transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Querying Botchain...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Verify / Search</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Verification Result Section */}
      {attestation && queriedId && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-card backdrop-blur-md space-y-6">
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-xl ${
                  status === "VERIFIED"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : status === "EXPIRED"
                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                }`}
              >
                {status === "VERIFIED" ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : status === "EXPIRED" ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">
                    {status === "VERIFIED"
                      ? "Valid On-Chain Attestation"
                      : status === "EXPIRED"
                      ? "Expired Attestation"
                      : "Revoked Attestation"}
                  </span>
                  <CredentialStatusBadge status={status} size="sm" />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {status === "VERIFIED"
                    ? "This attestation is currently active, unrevoked, and cryptographically verified on Botchain."
                    : status === "EXPIRED"
                    ? "This attestation's validity timestamp has elapsed."
                    : "The issuing authority has cryptographically revoked this credential on-chain."}
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowQR(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shrink-0"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Share QR Code</span>
            </button>
          </div>

          {/* Credential Main Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${typeInfo?.badgeColor}`}
              >
                {typeInfo?.label}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Attestation #{queriedId.toString()}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {attestation.title}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              {attestation.description || "No public description specified."}
            </p>
          </div>

          {/* Recipient & Issuer Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Recipient Address</span>
              </div>
              <p className="font-mono text-xs sm:text-sm font-semibold text-white break-all">
                {attestation.recipient}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href={`/profile/${attestation.recipient}`}
                  className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>View Reputation Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <Building className="w-3.5 h-3.5 text-purple-400" />
                <span>Issuer Address</span>
              </div>
              <p className="font-mono text-xs sm:text-sm font-semibold text-white break-all">
                {attestation.issuer}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <Link
                  href={`/profile/${attestation.issuer}`}
                  className="text-xs text-purple-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>View Issuer Profile</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Timestamps & Technical Evidence */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Issue Date
              </span>
              <span className="font-mono text-slate-200 font-semibold">
                {formatDate(attestation.issuedAt)}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Expiration Date
              </span>
              <span className="font-mono text-slate-200 font-semibold">
                {formatDate(attestation.expiresAt)}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block mb-1 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                Network
              </span>
              <span className="font-mono text-cyan-400 font-semibold">
                {botchain.name} (Chain 968)
              </span>
            </div>
          </div>

          {/* Contract Address & Explorer */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-500">Smart Contract Address</span>
              <p className="font-mono text-slate-300">{BOTREPUTE_CONTRACT_ADDRESS}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyContractAddress}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                {copiedContract ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copiedContract ? "Copied" : "Copy"}</span>
              </button>

              <a
                href={getExplorerUrl("address", BOTREPUTE_CONTRACT_ADDRESS)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 transition-colors"
              >
                <span>BohrScan</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Trust Banner inside Verification */}
          <TrustBanner variant="inline" />
        </div>
      )}

      {/* Trust Notice for the Verification Page */}
      <TrustBanner variant="full" />

      {/* QR Modal */}
      {attestation && queriedId && (
        <QRCodeModal
          attestationId={queriedId}
          title={attestation.title}
          isOpen={showQR}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-500">
          Loading verification portal...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
