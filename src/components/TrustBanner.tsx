import React from "react";
import { ShieldAlert, Info } from "lucide-react";

interface TrustBannerProps {
  variant?: "inline" | "full";
  className?: string;
}

export const TrustBanner: React.FC<TrustBannerProps> = ({ variant = "full", className = "" }) => {
  if (variant === "inline") {
    return (
      <div className={`flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 ${className}`}>
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-200">On-Chain Attestation Notice:</span> A verified badge proves this credential was cryptographically issued on Botchain by the indicated issuer and has not been revoked or expired. It does not independently prove the factual accuracy of off-chain claims.
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-card ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            BotRepute Cryptographic Trust Model
          </h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            BotRepute provides cryptographic proof of <strong className="text-slate-200">issuance, non-repudiation, and validity</strong> on Botchain Testnet. An attestation confirms that the recorded issuer granted this credential to the recipient and that it is currently unrevoked. The protocol does not fabricate subjective scores or independently audit off-chain claims.
          </p>
        </div>
      </div>
    </div>
  );
};
