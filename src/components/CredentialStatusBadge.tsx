import React from "react";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: "VERIFIED" | "EXPIRED" | "REVOKED";
  size?: "sm" | "md" | "lg";
}

export const CredentialStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  switch (status) {
    case "VERIFIED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}
          title="Valid on-chain attestation: Active and unrevoked"
        >
          <CheckCircle2 className={`${iconSizes[size]} text-emerald-400`} />
          <span>VERIFIED</span>
        </span>
      );
    case "EXPIRED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses[size]}`}
          title="Attestation validity period has elapsed"
        >
          <AlertTriangle className={`${iconSizes[size]} text-amber-400`} />
          <span>EXPIRED</span>
        </span>
      );
    case "REVOKED":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 ${sizeClasses[size]}`}
          title="Attestation has been revoked by original issuer"
        >
          <XCircle className={`${iconSizes[size]} text-rose-400`} />
          <span>REVOKED</span>
        </span>
      );
  }
};
