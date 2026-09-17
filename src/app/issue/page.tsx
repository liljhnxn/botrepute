"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress, decodeEventLog } from "viem";
import { BOTREPUTE_ABI, BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";
import {
  PREDEFINED_CREDENTIAL_TYPES,
  computeCredentialTypeHash,
} from "@/lib/credentialTypes";
import { parseContractError, getExplorerUrl } from "@/lib/utils";
import { TrustBanner } from "@/components/TrustBanner";
import { BackButton } from "@/components/BackButton";
import {
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Clock,
  ArrowRight,
  Shield,
  HelpCircle,
} from "lucide-react";

export default function IssueCredentialPage() {
  const { address: connectedAddress, isConnected } = useAccount();

  // Form State
  const [recipient, setRecipient] = useState("");
  const [selectedType, setSelectedType] = useState(PREDEFINED_CREDENTIAL_TYPES[0].id);
  const [customType, setCustomType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const [isPermanent, setIsPermanent] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");

  // Validation state
  const [formError, setFormError] = useState("");

  // Wagmi Contract Write
  const {
    data: hash,
    writeContract,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  // Wait for receipt
  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Extract Attestation ID from receipt logs
  let newlyIssuedId: bigint | null = null;
  if (receipt?.logs) {
    for (const log of receipt.logs) {
      try {
        const decoded = decodeEventLog({
          abi: BOTREPUTE_ABI,
          data: log.data,
          topics: log.topics,
        });
        if (decoded.eventName === "AttestationIssued" && (decoded.args as any).attestationId) {
          newlyIssuedId = (decoded.args as any).attestationId;
          break;
        }
      } catch {
        // Not matching event
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isConnected) {
      setFormError("Please connect your wallet to issue an on-chain credential.");
      return;
    }

    if (!recipient || !isAddress(recipient)) {
      setFormError("Please enter a valid Ethereum/Botchain recipient address (0x...).");
      return;
    }

    if (!title.trim()) {
      setFormError("Credential title cannot be empty.");
      return;
    }

    let credentialTypeHash: `0x${string}`;
    if (selectedType === "OTHER") {
      if (!customType.trim()) {
        setFormError("Please specify a custom credential type or pick a preset.");
        return;
      }
      credentialTypeHash = computeCredentialTypeHash(customType);
    } else {
      const found = PREDEFINED_CREDENTIAL_TYPES.find((t) => t.id === selectedType);
      credentialTypeHash = found
        ? found.hash
        : computeCredentialTypeHash(selectedType);
    }

    let expiresAtTimestamp = 0n;
    if (!isPermanent) {
      if (!expirationDate) {
        setFormError("Please select an expiration date and time.");
        return;
      }
      const expEpoch = Math.floor(new Date(expirationDate).getTime() / 1000);
      const currentEpoch = Math.floor(Date.now() / 1000);
      if (expEpoch <= currentEpoch) {
        setFormError("Expiration date must be in the future.");
        return;
      }
      expiresAtTimestamp = BigInt(expEpoch);
    }

    try {
      writeContract({
        address: BOTREPUTE_CONTRACT_ADDRESS,
        abi: BOTREPUTE_ABI,
        functionName: "issueAttestation",
        args: [
          recipient as `0x${string}`,
          credentialTypeHash,
          title.trim(),
          description.trim(),
          metadataURI.trim(),
          expiresAtTimestamp,
        ],
      });
    } catch (err) {
      console.error("Issuance invocation error:", err);
    }
  };

  const resetForm = () => {
    setRecipient("");
    setTitle("");
    setDescription("");
    setMetadataURI("");
    setIsPermanent(true);
    setExpirationDate("");
    resetWrite();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <BackButton />

      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5" />
          <span>Protocol Minting</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Issue Verifiable Credential
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl">
          Anchor a tamper-proof reputation attestation to any Web3 wallet. Signed cryptographically with your connected address.
        </p>
      </div>

      {/* Success Confirmation Card */}
      {isConfirmed && hash && (
        <div className="mb-8 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 shadow-emeraldGlow animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Credential Successfully Issued!
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  The attestation has been confirmed on Botchain Testnet block #{receipt?.blockNumber?.toString() || "latest"}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/80 text-xs font-mono">
                {newlyIssuedId && (
                  <div>
                    <span className="text-slate-500 block">ATTESTATION ID</span>
                    <span className="text-cyan-400 font-bold text-sm block">#{newlyIssuedId.toString()}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block">RECIPIENT</span>
                  <span className="text-slate-200 truncate block">{recipient}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">TRANSACTION HASH</span>
                  <a
                    href={getExplorerUrl("tx", hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline truncate block flex items-center gap-1"
                  >
                    <span>{hash.slice(0, 10)}...{hash.slice(-6)}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {newlyIssuedId && (
                  <Link
                    href={`/verify?id=${newlyIssuedId.toString()}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow-cyanGlow"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Verify Attestation #{newlyIssuedId.toString()}</span>
                  </Link>
                )}

                <Link
                  href={`/profile/${recipient}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-colors"
                >
                  <span>View Recipient Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  onClick={resetForm}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Issue Another Credential
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Form Box */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-card backdrop-blur-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Recipient Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Recipient Wallet Address <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="0x82a5...91AF"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.trim())}
              disabled={isWritePending || isConfirming}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              required
            />
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span>The recipient wallet that will permanently hold this verifiable badge.</span>
            </p>
          </div>

          {/* Credential Category / Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Credential Type <span className="text-rose-400">*</span>
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                disabled={isWritePending || isConfirming}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              >
                {PREDEFINED_CREDENTIAL_TYPES.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({t.id})
                  </option>
                ))}
                <option value="OTHER">Custom / Other Category</option>
              </select>
            </div>

            {selectedType === "OTHER" ? (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Custom Credential Identifier <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. HACKATHON_JUDGE"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  disabled={isWritePending || isConfirming}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 uppercase font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
                  required
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Category Description
                </label>
                <div className="px-4 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-400">
                  {PREDEFINED_CREDENTIAL_TYPES.find((t) => t.id === selectedType)?.description}
                </div>
              </div>
            )}
          </div>

          {/* Credential Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Credential Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Lead Smart Contract Auditor, BotDAO Governance Delegate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isWritePending || isConfirming}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Attestation Context & Justification
            </label>
            <textarea
              rows={3}
              placeholder="Describe the scope, milestone, role, or reason this credential was earned..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isWritePending || isConfirming}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
          </div>

          {/* Expiration Configuration */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Expiration Policy
                </h4>
                <p className="text-[11px] text-slate-400">
                  Choose whether this attestation has permanent validity or auto-expires.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPermanent(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isPermanent
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Permanent
                </button>
                <button
                  type="button"
                  onClick={() => setIsPermanent(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    !isPermanent
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  Set Expiration
                </button>
              </div>
            </div>

            {!isPermanent && (
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-xs text-slate-300 mb-1 font-medium">
                  Expiration Date & Time (UTC)
                </label>
                <input
                  type="datetime-local"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  disabled={isWritePending || isConfirming}
                  className="w-full sm:w-72 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                  required={!isPermanent}
                />
              </div>
            )}
          </div>

          {/* Metadata URI (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Metadata URI <span className="text-slate-500 text-[10px] font-normal">(Optional IPFS/Arweave)</span>
              </label>
              <span className="text-[11px] text-slate-500">No private documents</span>
            </div>
            <input
              type="text"
              placeholder="ipfs://bafy... or https://..."
              value={metadataURI}
              onChange={(e) => setMetadataURI(e.target.value.trim())}
              disabled={isWritePending || isConfirming}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Do NOT store sensitive personal documents, passports, or private records on-chain.
            </p>
          </div>

          {/* Validation & Error Alerts */}
          {formError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          {writeError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{parseContractError(writeError)}</span>
            </div>
          )}

          {/* Submit CTA */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              {connectedAddress ? (
                <span>
                  Issuing as: <span className="font-mono text-slate-200">{connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}</span>
                </span>
              ) : (
                <span className="text-amber-400">Please connect your wallet first.</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isWritePending || isConfirming || !isConnected}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-cyanGlow transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWritePending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Confirm in wallet...</span>
                </>
              ) : isConfirming ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transaction pending on Botchain...</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4" />
                  <span>Issue Credential</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8">
        <TrustBanner variant="full" />
      </div>
    </div>
  );
}
