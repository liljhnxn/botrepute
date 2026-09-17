"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CredentialStatusBadge } from "./CredentialStatusBadge";
import { QRCodeModal } from "./QRCodeModal";
import { getCredentialTypeInfo } from "@/lib/credentialTypes";
import { formatDate, getAttestationStatus, getExplorerUrl } from "@/lib/utils";
import { formatAddress } from "@/lib/botns";
import {
  ExternalLink,
  QrCode,
  Calendar,
  Clock,
  ShieldCheck,
  User,
  Building,
  Hash,
} from "lucide-react";

export interface CredentialCardProps {
  attestation: {
    id: number | bigint;
    issuer: string;
    recipient: string;
    credentialType: string;
    title: string;
    description: string;
    metadataURI?: string;
    issuedAt: number | bigint;
    expiresAt: number | bigint;
    revoked: boolean;
  };
  showRevokeButton?: boolean;
  onRevoke?: (id: bigint) => void;
  isRevoking?: boolean;
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
  attestation,
  showRevokeButton = false,
  onRevoke,
  isRevoking = false,
}) => {
  const [showQR, setShowQR] = useState(false);

  const status = getAttestationStatus(attestation.revoked, attestation.expiresAt);
  const typeInfo = getCredentialTypeInfo(attestation.credentialType);

  const idNumber = BigInt(attestation.id);

  return (
    <>
      <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 p-5 shadow-card hover:shadow-cyanGlow flex flex-col justify-between overflow-hidden">
        {/* Subtle accent corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

        <div>
          {/* Header row: Credential Type Badge + Status + Attestation ID */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${typeInfo.badgeColor}`}
              >
                {typeInfo.label}
              </span>
              <CredentialStatusBadge status={status} size="sm" />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
              <Hash className="w-3.5 h-3.5 text-slate-500" />
              <span>{idNumber.toString()}</span>
            </div>
          </div>

          {/* Title and Description */}
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors mb-2">
            {attestation.title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {attestation.description || "No public description provided."}
          </p>

          {/* Recipient and Issuer Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 mb-4 text-xs">
            <div>
              <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                <User className="w-3 h-3 text-cyan-400" />
                <span>Recipient</span>
              </div>
              <Link
                href={`/profile/${attestation.recipient}`}
                className="font-mono text-slate-200 hover:text-cyan-400 hover:underline font-medium truncate block"
              >
                {formatAddress(attestation.recipient)}
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                <Building className="w-3 h-3 text-purple-400" />
                <span>Issuer</span>
              </div>
              <Link
                href={`/profile/${attestation.issuer}`}
                className="font-mono text-slate-200 hover:text-purple-400 hover:underline font-medium truncate block"
              >
                {formatAddress(attestation.issuer)}
              </Link>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-1.5 text-xs text-slate-400 mb-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                Issued
              </span>
              <span className="font-mono text-slate-300">
                {formatDate(attestation.issuedAt)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                Expires
              </span>
              <span
                className={`font-mono ${
                  status === "EXPIRED" ? "text-amber-400 font-semibold" : "text-slate-300"
                }`}
              >
                {formatDate(attestation.expiresAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link
              href={`/verify?id=${idNumber.toString()}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify</span>
            </Link>

            <button
              onClick={() => setShowQR(true)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50 transition-colors"
              title="Show QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>

            <a
              href={getExplorerUrl("address", attestation.recipient)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50 transition-colors"
              title="View on Explorer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {showRevokeButton && !attestation.revoked && onRevoke && (
            <button
              onClick={() => onRevoke(idNumber)}
              disabled={isRevoking}
              className="px-2.5 py-1 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-md transition-colors disabled:opacity-50"
            >
              {isRevoking ? "Revoking..." : "Revoke"}
            </button>
          )}
        </div>
      </div>

      <QRCodeModal
        attestationId={idNumber}
        title={attestation.title}
        isOpen={showQR}
        onClose={() => setShowQR(false)}
      />
    </>
  );
};
