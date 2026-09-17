import deployedAddress from "./deployedAddress.json";

export const BOTREPUTE_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_BOTREPUTE_CONTRACT_ADDRESS as `0x${string}`) ||
  ((deployedAddress as { contractAddress?: string })?.contractAddress as `0x${string}`) ||
  ("0x0545d136b49c3de637ca8e1764E8bf9e563A866F" as `0x${string}`);

export const BOTREPUTE_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "uint256", name: "attestationId", type: "uint256" }],
    name: "AlreadyRevoked",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "attestationId", type: "uint256" }],
    name: "AttestationNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyTitle",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
      { internalType: "uint256", name: "currentTimestamp", type: "uint256" },
    ],
    name: "InvalidExpiration",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidRecipient",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrancyGuardReentrantCall",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "caller", type: "address" },
      { internalType: "address", name: "expectedIssuer", type: "address" },
    ],
    name: "UnauthorizedIssuer",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "attestationId", type: "uint256" },
      { indexed: true, internalType: "address", name: "issuer", type: "address" },
      { indexed: true, internalType: "address", name: "recipient", type: "address" },
      { indexed: false, internalType: "bytes32", name: "credentialType", type: "bytes32" },
      { indexed: false, internalType: "string", name: "title", type: "string" },
      { indexed: false, internalType: "uint256", name: "expiresAt", type: "uint256" },
    ],
    name: "AttestationIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "attestationId", type: "uint256" },
      { indexed: true, internalType: "address", name: "issuer", type: "address" },
    ],
    name: "AttestationRevoked",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "attestations",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "address", name: "issuer", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "bytes32", name: "credentialType", type: "bytes32" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "metadataURI", type: "string" },
      { internalType: "uint256", name: "issuedAt", type: "uint256" },
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
      { internalType: "bool", name: "revoked", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "attestationId", type: "uint256" }],
    name: "getAttestation",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "issuer", type: "address" },
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "bytes32", name: "credentialType", type: "bytes32" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "metadataURI", type: "string" },
          { internalType: "uint256", name: "issuedAt", type: "uint256" },
          { internalType: "uint256", name: "expiresAt", type: "uint256" },
          { internalType: "bool", name: "revoked", type: "bool" },
        ],
        internalType: "struct BotRepute.Attestation",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "issuer", type: "address" }],
    name: "getIssuerAttestations",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "recipient", type: "address" }],
    name: "getRecipientAttestations",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "bytes32", name: "credentialType", type: "bytes32" },
    ],
    name: "getRecipientAttestationsByType",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "bytes32", name: "credentialType", type: "bytes32" },
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "metadataURI", type: "string" },
      { internalType: "uint256", name: "expiresAt", type: "uint256" },
    ],
    name: "issueAttestation",
    outputs: [{ internalType: "uint256", name: "attestationId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "attestationId", type: "uint256" }],
    name: "isValidAttestation",
    outputs: [{ internalType: "bool", name: "isValid", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextAttestationId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "attestationId", type: "uint256" }],
    name: "revokeAttestation",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalAttestations",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;
