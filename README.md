# BotRepute — Decentralized Web3 Reputation & Credentials Protocol

> **"Reputation You Can Verify."**  
> *Build a portable Web3 reputation from verifiable on-chain credentials secured by BOT Chain Mainnet.*

---

## 1. Overview

**BotRepute** is a decentralized protocol engineered on **BOT Chain Mainnet (Chain ID 677)** allowing organizations, DAOs, communities, creators, and builders to issue, verify, revoke, and manage transparent on-chain credentials and attestations.

Unlike legacy Web3 reputation systems that fabricate opaque, arbitrary scores (e.g., *"Reputation: 94/100"*), BotRepute focuses exclusively on **verifiable cryptographic attestations**. Every credential is anchored directly to the recipient's wallet address, linked to a cryptographically authenticated issuer, and subject to transparent status tracking (Active, Expired, or Revoked).

---

## 2. Core Features

- **Decentralized Verifiable Credentials**: Issue portable attestations for developer roles, DAO contributions, hackathon wins, community leadership, and verified actions.
- **Zero-Wallet Public Verification**: Anyone (recruiters, dApps, community managers) can inspect and verify an attestation on `/verify` without connecting a wallet or paying gas.
- **Dynamic Credential Types**: Extensible `bytes32` identifiers (`DEVELOPER`, `CONTRIBUTOR`, `BUILDER`, `CREATOR`, `DAO_MEMBER`, `COMMUNITY_MEMBER`, `VERIFIED_USER`, `PROJECT_CONTRIBUTOR`) with custom category hashing support.
- **Issuer-Controlled Revocation**: Only the authentic issuer can revoke an issued credential. Recipients or third parties cannot falsify or remove historical attestations.
- **Time-Based Expiration**: Support for both permanent credentials and time-bound accreditations with automatic on-chain validity checking.
- **QR Code Verification**: Instant QR code generation linking directly to `/verify?id=[ID]` for real-world or cross-device credential scanning.
- **BotNS Identity Resolution Ready**: Pre-architected identity resolution abstraction (`resolveIdentity(address)`) designed for seamless `.bot` namespace integration.
- **Live Activity Feed**: Real-time stream of mints, active credentials, and revocations on BOT Chain Mainnet without synthetic data.

---

## 3. Cryptographic Trust & Veracity Model

> [!IMPORTANT]
> **Understanding On-Chain Attestations vs. Objective Truth**  
> BotRepute strictly distinguishes between:
> 1. **On-Chain Attestation Validity**: Proves that the recorded issuer address cryptographically issued the attestation to the recipient address and that it has not been revoked or expired.
> 2. **Real-World Veracity**: The protocol does *not* claim to be an omniscient oracle of subjective truth. If Alice attests that *"Bob is a Web3 Developer"*, BotRepute proves *Alice made that claim on-chain*; it does not claim the blockchain magically audits Bob's programming capabilities.

No arbitrary single score is ever calculated. Trust is derived from the **reputation of the issuer**.

---

## 4. Architecture & Data Structures

### Smart Contract: `contracts/BotRepute.sol`

```solidity
struct Attestation {
    uint256 id;             // Unique sequential identifier (starts at 1)
    address issuer;         // Msg.sender who signed the attestation
    address recipient;      // Wallet receiving the credential
    bytes32 credentialType; // keccak256 hash of credential category
    string title;           // Credential title (e.g., "Lead Smart Contract Auditor")
    string description;     // Scope, milestone, or details
    string metadataURI;     // Optional IPFS/Arweave URI for off-chain schema
    uint256 issuedAt;       // Block timestamp of creation
    uint256 expiresAt;      // Expiration timestamp (0 = permanent)
    bool revoked;           // True if revoked by issuer
}
```

### Key Contract Methods

| Function | Type | Description |
|---|---|---|
| `issueAttestation(...)` | Non-Reentrant Write | Issues a credential, stores records, and emits `AttestationIssued`. |
| `revokeAttestation(uint256 id)` | Non-Reentrant Write | Allows only the original issuer to revoke an active credential. |
| `isValidAttestation(uint256 id)` | Public View | Returns `true` if exists, `!revoked`, and unexpired. |
| `getAttestation(uint256 id)` | External View | Returns complete struct data. |
| `getRecipientAttestations(address)` | External View | Returns all attestation IDs received by wallet. |
| `getIssuerAttestations(address)` | External View | Returns all attestation IDs issued by wallet. |
| `getRecipientAttestationsByType(...)` | External View | Filters recipient credentials by `bytes32 credentialType`. |

---

## 5. Security & Privacy Considerations

- **No Centralized Admin Control**: There is no owner backdoor or admin role capable of altering, rewriting, or deleting historical attestations.
- **Reentrancy Protection**: Uses OpenZeppelin's `ReentrancyGuard` on state-mutating functions.
- **Gas Optimized**: Custom Solidity errors (`InvalidRecipient()`, `EmptyTitle()`, `InvalidExpiration()`, `UnauthorizedIssuer()`, `AlreadyRevoked()`).
- **Privacy by Design**: No private documents, government IDs, passports, home addresses, or phone numbers are ever collected or stored on-chain. Users are explicitly warned that all on-chain data is publicly visible on Botchain.

---

## 6. Tech Stack

- **Smart Contracts**: Solidity `^0.8.24`, Hardhat, OpenZeppelin Contracts v5, TypeChain.
- **Frontend Framework**: Next.js 14 (App Router), React 18, TypeScript.
- **Styling**: Vanilla CSS & Tailwind CSS (Dark Cyber/Slate Web3 design system).
- **Web3 Engine**: Viem 2.x, Wagmi 2.x, TanStack React Query 5.x.
- **Icons & QR**: Lucide React, `qrcode`.

---

## 7. BOT Chain Mainnet Configuration

| Parameter | Value |
|---|---|
| **Network Name** | BOT Chain Mainnet |
| **Chain ID** | `677` |
| **Native Currency** | BOT (18 decimals) |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | `https://scan.botchain.ai` |
| **Contract Address** | `0x3ec80F1940CeBa9B85112a3f90a55Cc0c7b1a2ad` |

---

## 8. Environment Variables

Create `.env` or configure your hosting environment:

```bash
# BOT Chain Mainnet Configuration
NEXT_PUBLIC_BOTCHAIN_CHAIN_ID=677
NEXT_PUBLIC_BOTCHAIN_RPC_URL=https://rpc.botchain.ai
NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL=https://scan.botchain.ai

# Deployed BotRepute Contract Address
NEXT_PUBLIC_BOTREPUTE_CONTRACT_ADDRESS=0x3ec80F1940CeBa9B85112a3f90a55Cc0c7b1a2ad

# Deployment Private Key (Never commit private keys!)
BOTCHAIN_PRIVATE_KEY=
```

---

## 9. Installation & Development

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Compile Smart Contracts
```bash
npx hardhat compile
```

### 3. Run Automated Tests
```bash
npx hardhat test
```

### 4. Run Frontend Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 10. Deployment to BOT Chain Mainnet

Ensure `BOTCHAIN_PRIVATE_KEY` is configured in `.env`:

```bash
npm run deploy:mainnet
```

The script deploys `BotRepute.sol` with the minimum network fee floor (`20.0 Gwei`), logs block explorer links, and automatically updates `src/config/deployedAddress.json`.

---

## 11. Limitations & Roadmap

### Known Limitations
- **Metadata Storage**: Off-chain metadata currently relies on external IPFS/Arweave gateways specified by the issuer.
- **BotNS Name Resolution**: Prepared as an abstraction; will dynamically link to the Botchain `.bot` naming registry once live.

### Roadmap
- [x] On-chain verifiable credential struct and sequential IDs
- [x] Zero-wallet public verification portal (`/verify`)
- [x] Reusable credential card with QR code sharing
- [x] Issuer management dashboard with revocation controls
- [x] Public wallet reputation profiles (`/profile/[address]`)
- [x] Deployed and verified on BOT Chain Mainnet (`0x3ec80F1940CeBa9B85112a3f90a55Cc0c7b1a2ad`)
- [ ] Direct integration hooks for BotDAO, BotLaunch, BotProof, and BotRent
- [ ] Schema validation for decentralized JSON-LD credential metadata
- [ ] Soulbound token (SBT) minting badge representation for EVM wallets
