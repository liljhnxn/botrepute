import { keccak256, toHex } from "viem";

export interface CredentialTypeDefinition {
  id: string; // Plaintext identifier, e.g. "DEVELOPER"
  hash: `0x${string}`; // keccak256 hash as bytes32
  label: string; // Display label
  description: string;
  badgeColor: string; // Tailwind color classes
}

export const PREDEFINED_CREDENTIAL_TYPES: CredentialTypeDefinition[] = [
  {
    id: "DEVELOPER",
    hash: keccak256(toHex("DEVELOPER")),
    label: "Web3 Developer",
    description: "Built, audited, or deployed smart contracts, dApps, or protocol tools.",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "CONTRIBUTOR",
    hash: keccak256(toHex("CONTRIBUTOR")),
    label: "Core Contributor",
    description: "Active contributor to governance, codebases, documentation, or infrastructure.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "BUILDER",
    hash: keccak256(toHex("BUILDER")),
    label: "Ecosystem Builder",
    description: "Founded or launched protocols, products, or hackathon projects.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "CREATOR",
    hash: keccak256(toHex("CREATOR")),
    label: "Verified Creator",
    description: "Digital artist, media producer, or content creator on Botchain.",
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/30",
  },
  {
    id: "ISSUER",
    hash: keccak256(toHex("ISSUER")),
    label: "Accredited Issuer",
    description: "Recognized organization or entity issuing verified attestations.",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "COMMUNITY_MEMBER",
    hash: keccak256(toHex("COMMUNITY_MEMBER")),
    label: "Community Member",
    description: "Active participant in community events, testnets, or ambassadors.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
  {
    id: "DAO_MEMBER",
    hash: keccak256(toHex("DAO_MEMBER")),
    label: "DAO Member",
    description: "Verified tokenholder or delegate participating in on-chain governance.",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "VERIFIED_USER",
    hash: keccak256(toHex("VERIFIED_USER")),
    label: "Verified User",
    description: "Recognized on-chain actor passing decentralized verification.",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/30",
  },
  {
    id: "PROJECT_CONTRIBUTOR",
    hash: keccak256(toHex("PROJECT_CONTRIBUTOR")),
    label: "Project Contributor",
    description: "Contributed to specialized grant, bounties, or open-source repositories.",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
  },
];

export function getCredentialTypeInfo(typeHash: string): {
  label: string;
  badgeColor: string;
} {
  const match = PREDEFINED_CREDENTIAL_TYPES.find(
    (t) => t.hash.toLowerCase() === typeHash.toLowerCase()
  );

  if (match) {
    return {
      label: match.label,
      badgeColor: match.badgeColor,
    };
  }

  // Custom or non-standard hash
  return {
    label: `Custom (${typeHash.slice(0, 8)}...)`,
    badgeColor: "bg-slate-700/50 text-slate-300 border-slate-600/40",
  };
}

export function computeCredentialTypeHash(rawName: string): `0x${string}` {
  const normalized = rawName.trim().toUpperCase().replace(/\s+/g, "_");
  return keccak256(toHex(normalized));
}
