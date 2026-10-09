import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number | bigint): string {
  const num = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  if (!num || num === 0) return "Never (Permanent)";
  const date = new Date(num * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatTimeAgo(timestamp: number | bigint): string {
  const num = typeof timestamp === "bigint" ? Number(timestamp) : timestamp;
  if (!num || num === 0) return "Permanent";
  const now = Math.floor(Date.now() / 1000);
  const diff = now - num;

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function getAttestationStatus(
  revoked: boolean,
  expiresAt: number | bigint
): "VERIFIED" | "EXPIRED" | "REVOKED" {
  if (revoked) return "REVOKED";
  const exp = typeof expiresAt === "bigint" ? Number(expiresAt) : expiresAt;
  if (exp !== 0 && Date.now() / 1000 >= exp) return "EXPIRED";
  return "VERIFIED";
}

export function parseContractError(error: any): string {
  if (!error) return "An unknown error occurred.";

  const message = error?.message || error?.toString() || "";

  if (message.includes("User rejected") || message.includes("User denied")) {
    return "Transaction was rejected in your wallet.";
  }
  if (message.includes("InvalidRecipient")) {
    return "Recipient address cannot be the zero address (0x0).";
  }
  if (message.includes("EmptyTitle")) {
    return "Credential title cannot be empty.";
  }
  if (message.includes("InvalidExpiration")) {
    return "Expiration date must be in the future, or set to 0 for no expiration.";
  }
  if (message.includes("UnauthorizedIssuer")) {
    return "Only the original issuer of this credential has permission to revoke it.";
  }
  if (message.includes("AlreadyRevoked")) {
    return "This credential has already been revoked.";
  }
  if (message.includes("AttestationNotFound")) {
    return "Attestation ID not found on Botchain.";
  }
  if (message.includes("insufficient funds")) {
    return "Insufficient BOT balance for transaction gas fees.";
  }

  // Shorten lengthy viem revert errors
  if (error?.shortMessage) return error.shortMessage;
  return message.slice(0, 150);
}

export function getExplorerUrl(
  type: "address" | "tx" | "token",
  value: string
): string {
  const envUrl = process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL;
  const base =
    envUrl && !envUrl.includes("bohr")
      ? envUrl
      : "https://scan.botchain.ai";
  return `${base}/${type}/${value}`;
}
