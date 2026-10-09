import { createPublicClient, http } from "viem";
import { botchain } from "@/config/botchain";
import { BOTREPUTE_ABI, BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";

export const publicClient = createPublicClient({
  chain: botchain,
  transport: http(botchain.rpcUrls.default.http[0]),
});

export interface AttestationData {
  id: bigint;
  issuer: `0x${string}`;
  recipient: `0x${string}`;
  credentialType: `0x${string}`;
  title: string;
  description: string;
  metadataURI: string;
  issuedAt: bigint;
  expiresAt: bigint;
  revoked: boolean;
}

/**
 * Fetch attestation details directly from RPC without requiring a wallet connection
 */
export async function fetchPublicAttestation(
  attestationId: bigint
): Promise<{ attestation: AttestationData | null; isValid: boolean }> {
  try {
    const [attestation, isValid] = await Promise.all([
      publicClient.readContract({
        address: BOTREPUTE_CONTRACT_ADDRESS,
        abi: BOTREPUTE_ABI,
        functionName: "getAttestation",
        args: [attestationId],
      }) as Promise<AttestationData>,
      publicClient.readContract({
        address: BOTREPUTE_CONTRACT_ADDRESS,
        abi: BOTREPUTE_ABI,
        functionName: "isValidAttestation",
        args: [attestationId],
      }) as Promise<boolean>,
    ]);

    return { attestation, isValid };
  } catch (error) {
    console.warn(`Failed to fetch attestation #${attestationId}:`, error);
    return { attestation: null, isValid: false };
  }
}

/**
 * Fetch all attestations for a given recipient address using the public client
 */
export async function fetchPublicRecipientAttestations(
  recipient: `0x${string}`
): Promise<AttestationData[]> {
  try {
    const ids = (await publicClient.readContract({
      address: BOTREPUTE_CONTRACT_ADDRESS,
      abi: BOTREPUTE_ABI,
      functionName: "getRecipientAttestations",
      args: [recipient],
    })) as bigint[];

    if (!ids || ids.length === 0) return [];

    const attestations = await Promise.all(
      ids.map(async (id) => {
        try {
          return (await publicClient.readContract({
            address: BOTREPUTE_CONTRACT_ADDRESS,
            abi: BOTREPUTE_ABI,
            functionName: "getAttestation",
            args: [id],
          })) as AttestationData;
        } catch {
          return null;
        }
      })
    );

    return attestations.filter((a): a is AttestationData => a !== null);
  } catch (error) {
    console.warn(`Failed to fetch recipient attestations for ${recipient}:`, error);
    return [];
  }
}

/**
 * Fetch all attestations issued by a given issuer address using public client
 */
export async function fetchPublicIssuerAttestations(
  issuer: `0x${string}`
): Promise<AttestationData[]> {
  try {
    const ids = (await publicClient.readContract({
      address: BOTREPUTE_CONTRACT_ADDRESS,
      abi: BOTREPUTE_ABI,
      functionName: "getIssuerAttestations",
      args: [issuer],
    })) as bigint[];

    if (!ids || ids.length === 0) return [];

    const attestations = await Promise.all(
      ids.map(async (id) => {
        try {
          return (await publicClient.readContract({
            address: BOTREPUTE_CONTRACT_ADDRESS,
            abi: BOTREPUTE_ABI,
            functionName: "getAttestation",
            args: [id],
          })) as AttestationData;
        } catch {
          return null;
        }
      })
    );

    return attestations.filter((a): a is AttestationData => a !== null);
  } catch (error) {
    console.warn(`Failed to fetch issuer attestations for ${issuer}:`, error);
    return [];
  }
}
