# BotRepute Protocol — Whitepaper & Pitch Deck
**"Reputation You Can Verify"**

*Decentralized Web3 Reputation & Cryptographic Attestation Protocol on BOT Chain Mainnet*

---

## Executive Summary

Web3 currently suffers from a fundamental trust deficit. Traditional identity and reputation approaches attempt to quantify credibility through opaque, arbitrary numerical scores (e.g., *"Reputation Score: 85/100"*), which are easily gamed, centralized, and lack verifiable context. Meanwhile, professional accomplishments, DAO contributions, hackathon honors, and security audit accreditations remain trapped in siloed Web2 platforms like Discord, Twitter, and LinkedIn.

**BotRepute** introduces a decentralized, cryptographic attestation protocol deployed on **BOT Chain Mainnet (Chain ID 677)**. Instead of calculating synthetic scores, BotRepute anchors portable, tamper-proof credentials directly to recipient wallet addresses. Each credential is cryptographically signed by an authenticated issuer, timestamped on-chain, verifiable with zero gas or wallet connection, and governed by transparent lifecycle controls (Active, Expired, or Revoked).

---

## 1. Problem Statement

1. **Opaque & Gameable Reputation Scores**: Existing Web3 reputation protocols rely on subjective formulas and centralized oracles that can be sybil-attacked, bought, or manipulated.
2. **Fragmented Credentials**: High-value Web3 achievements—such as smart contract audits, core protocol contributions, and community leadership—are scattered across Discord servers, GitHub PRs, and off-chain databases.
3. **High Verification Friction**: In many protocols, verifying a user's credentials requires connecting a web3 wallet, signing transactions, or paying gas fees, preventing mainstream adoption by recruiters, Web2 platforms, and casual observers.
4. **Lack of Lifecycle Governance**: Static NFTs or simple tokens cannot handle credential expiration (e.g., a 1-year security auditor certificate) or legitimate revocation (e.g., when a role or affiliation is terminated).

---

## 2. The BotRepute Solution

BotRepute provides an open, non-custodial protocol for creating, managing, and verifying portable Web3 credentials:

* **Cryptographic Attestations Over Arbitrary Scores**: Trust is derived strictly from the cryptographically verified identity of the issuer, not an opaque algorithm.
* **Zero-Wallet Public Verification**: Anyone—recruiters, dApps, or community managers—can inspect, audit, and verify any attestation at `/verify?id=[ID]` without connecting a wallet or spending gas.
* **Issuer-Controlled Revocation**: Only the authentic issuing address can revoke an active attestation. No third party or platform admin can falsify, tamper with, or delete historical records.
* **Time-Bound Validity**: Native support for both permanent credentials (milestones, hackathon wins) and time-expiring accreditations (annual licenses, security clearance).
* **Instant QR Code Sharing**: Built-in QR code generator enables frictionless cross-device, offline, and real-world credential scanning.
* **BotNS (.bot) Identity Ready**: Pre-architected identity resolution layer to seamlessly resolve Botchain `.bot` domain names and wallet identities.

---

## 3. Cryptographic Trust & Veracity Model

> **Attestation Validity vs. Real-World Truth**  
> BotRepute clearly distinguishes between:
> 1. **Cryptographic Validity**: The protocol mathematically proves that the recorded issuer address created and signed the attestation for the recipient address, and that the credential is active, unrevoked, and unexpired.
> 2. **Issuer Trust**: Trust is rooted in the reputation of the issuer. If a reputable security firm attests that a developer passed an audit, relying parties evaluate the reputation of that firm. BotRepute guarantees that the claim cannot be forged or tampered with.

---

## 4. Technical Architecture

### 4.1 Smart Contract: `BotRepute.sol`
Deployed on BOT Chain Mainnet (`Chain ID 677`), the contract manages the complete lifecycle of on-chain attestations with gas-optimized storage and strict security constraints.

```solidity
struct Attestation {
    uint256 id;             // Unique sequential identifier (starts at 1)
    address issuer;         // Msg.sender who signed the attestation
    address recipient;      // Wallet receiving the credential
    bytes32 credentialType; // keccak256 hash of credential category
    string title;           // Short title (e.g., "Senior Smart Contract Auditor")
    string description;     // Scope, milestone, or context
    string metadataURI;     // Optional IPFS/Arweave URI for rich schemas
    uint256 issuedAt;       // Unix timestamp of issuance
    uint256 expiresAt;      // Expiration timestamp (0 = permanent)
    bool revoked;           // Revocation state flag
}
```

### 4.2 Security & Efficiency
* **Reentrancy Protection**: Built with OpenZeppelin's `ReentrancyGuard` on all state-mutating functions.
* **Custom Errors**: Utilizes custom Solidity errors (`InvalidRecipient`, `EmptyTitle`, `InvalidExpiration`, `UnauthorizedIssuer`, `AlreadyRevoked`) for maximum gas savings.
* **Zero Admin Backdoor**: Immutable architecture with no owner key capable of revoking or altering user attestations.
* **Privacy by Design**: No personal identifiable information (PII) is collected or stored on-chain.

---

## 5. Ecosystem & Use Cases

1. **DAO Governance & Working Groups**: Issue proof of committee membership, governance roles, and milestone delivery.
2. **Web3 Talent & Developer Recruitment**: Verifiable portfolio of completed bounties, code audits, and hackathon wins verifiable by HR without gas.
3. **Event & Hackathon Badging**: Instant issuance of verifiable proof of participation, judging, and placement.
4. **Security & Auditing Credentials**: Accredited firms issue time-bound security certifications that automatically expire or can be revoked if terms are breached.
5. **Community Sybil-Resistance**: Whitelisting and gated access for authenticated bot, builder, or creator roles across the Botchain ecosystem.

---

## 6. Tokenomics & Network Alignment

* **Native Settlement**: Powered by Botchain (BOT native token).
* **Low-Cost Issuance**: Highly optimized calldata and storage layouts ensure minimal gas cost for issuers.
* **Free Public Reads**: Verification queries (`isValidAttestation`, `getAttestation`) are pure view calls with zero protocol fees.

---

## 7. Product Roadmap

* **Phase 1: Core Protocol & Mainnet (Completed)**
  * [x] Core `BotRepute.sol` smart contract deployed on BOT Chain Mainnet.
  * [x] Zero-wallet public verification portal (`/verify`).
  * [x] Interactive credential cards with dynamic QR code generation.
  * [x] Issuer management dashboard with live revocation control.
  * [x] Public wallet reputation profiles (`/profile/[address]`).

* **Phase 2: Ecosystem Integrations (Q2 2026)**
  * Direct integration hooks with BotDAO, BotLaunch, BotProof, and BotRent.
  * Native BotNS (.bot) name resolution integration.
  * Decentralized JSON-LD schema support on IPFS / Arweave.

* **Phase 3: Programmable Credentials (Q3 2026)**
  * ERC-5192 Soulbound Token (SBT) minting wrapper.
  * Cross-chain attestation verification via light client proofs.
  * Automated credential issuance oracles for GitHub and on-chain milestones.

---

## 8. Deployment & Network Verification

| Parameter | Value |
|---|---|
| **Protocol Name** | BotRepute |
| **Network** | BOT Chain Mainnet |
| **Chain ID** | `677` |
| **Smart Contract Address** | `0x3ec80F1940CeBa9B85112a3f90a55Cc0c7b1a2ad` |
| **RPC Endpoint** | `https://rpc.botchain.ai` |
| **Block Explorer** | `https://scan.botchain.ai` |
| **Explorer Verification** | [View on BotScan](https://scan.botchain.ai/address/0x3ec80F1940CeBa9B85112a3f90a55Cc0c7b1a2ad) |
| **Source Code Repository** | [https://github.com/liljhnxn/botrepute](https://github.com/liljhnxn/botrepute) |

---
*© 2026 BotRepute Protocol. Secured by Botchain.*
