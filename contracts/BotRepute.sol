// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BotRepute
 * @notice Decentralized Web3 Reputation & Credentials Protocol on Botchain.
 * @dev Allows organizations, DAOs, communities, creators, and users to issue, verify,
 *      and manage portable on-chain credentials and attestations without centralized manipulation.
 *
 * Trust Model Notice:
 * An on-chain attestation proves that a credential was cryptographically issued by the recorded issuer
 * to the recipient, and records its active/revoked/expired status. It does not claim or prove the objective
 * truth of arbitrary real-world claims. No single centralized score is assigned.
 */
contract BotRepute is ReentrancyGuard {
    // =========================================================================
    // DATA STRUCTURES
    // =========================================================================

    /**
     * @notice Structure representing an on-chain attestation / verifiable credential.
     * @param id Unique sequential identifier of the attestation
     * @param issuer The address that created and signed the attestation
     * @param recipient The wallet address receiving the credential
     * @param credentialType bytes32 identifier (e.g. keccak256("DEVELOPER"), keccak256("CONTRIBUTOR"))
     * @param title Human-readable short title of the credential
     * @param description Context, justification, or scope of the attestation
     * @param metadataURI Optional off-chain URI for decentralized metadata (IPFS/Arweave)
     * @param issuedAt Unix timestamp when issued
     * @param expiresAt Unix timestamp when credential expires (0 = no expiration)
     * @param revoked True if the issuing authority has revoked the attestation
     */
    struct Attestation {
        uint256 id;
        address issuer;
        address recipient;
        bytes32 credentialType;
        string title;
        string description;
        string metadataURI;
        uint256 issuedAt;
        uint256 expiresAt;
        bool revoked;
    }

    // =========================================================================
    // STATE STORAGE
    // =========================================================================

    /// @notice Global storage for all attestations mapped by ID
    mapping(uint256 => Attestation) public attestations;

    /// @notice Next available attestation ID (starts at 1)
    uint256 public nextAttestationId;

    /// @notice Attestation IDs issued to a specific recipient address
    mapping(address => uint256[]) private recipientAttestations;

    /// @notice Attestation IDs created by a specific issuer address
    mapping(address => uint256[]) private issuerAttestations;

    // =========================================================================
    // EVENTS
    // =========================================================================

    event AttestationIssued(
        uint256 indexed attestationId,
        address indexed issuer,
        address indexed recipient,
        bytes32 credentialType,
        string title,
        uint256 expiresAt
    );

    event AttestationRevoked(
        uint256 indexed attestationId,
        address indexed issuer
    );

    // =========================================================================
    // CUSTOM ERRORS
    // =========================================================================

    error InvalidRecipient();
    error EmptyTitle();
    error InvalidExpiration(uint256 expiresAt, uint256 currentTimestamp);
    error AttestationNotFound(uint256 attestationId);
    error UnauthorizedIssuer(address caller, address expectedIssuer);
    error AlreadyRevoked(uint256 attestationId);

    // =========================================================================
    // CONSTRUCTOR
    // =========================================================================

    constructor() {
        // Attestation IDs start at 1; ID 0 indicates non-existent attestation
        nextAttestationId = 1;
    }

    // =========================================================================
    // CORE FUNCTIONS
    // =========================================================================

    /**
     * @notice Issue a new verifiable credential attestation to a recipient.
     * @param recipient The wallet address of the credential recipient (must not be zero address)
     * @param credentialType bytes32 hash of category (e.g. keccak256("DEVELOPER") or custom)
     * @param title Title of the credential (cannot be empty)
     * @param description Description of what is being attested
     * @param metadataURI Off-chain metadata URI (e.g., ipfs://...)
     * @param expiresAt Timestamp for expiration, or 0 for permanent validity
     * @return attestationId The newly allocated unique attestation ID
     */
    function issueAttestation(
        address recipient,
        bytes32 credentialType,
        string calldata title,
        string calldata description,
        string calldata metadataURI,
        uint256 expiresAt
    ) external nonReentrant returns (uint256 attestationId) {
        if (recipient == address(0)) {
            revert InvalidRecipient();
        }
        if (bytes(title).length == 0) {
            revert EmptyTitle();
        }
        if (expiresAt != 0 && expiresAt <= block.timestamp) {
            revert InvalidExpiration(expiresAt, block.timestamp);
        }

        attestationId = nextAttestationId++;

        attestations[attestationId] = Attestation({
            id: attestationId,
            issuer: msg.sender,
            recipient: recipient,
            credentialType: credentialType,
            title: title,
            description: description,
            metadataURI: metadataURI,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            revoked: false
        });

        recipientAttestations[recipient].push(attestationId);
        issuerAttestations[msg.sender].push(attestationId);

        emit AttestationIssued(
            attestationId,
            msg.sender,
            recipient,
            credentialType,
            title,
            expiresAt
        );
    }

    /**
     * @notice Revoke an existing attestation.
     * @dev Only the original issuer can revoke an attestation they issued.
     *      Recipients or unrelated third parties cannot revoke it.
     * @param attestationId The ID of the attestation to revoke
     */
    function revokeAttestation(uint256 attestationId) external nonReentrant {
        if (attestationId == 0 || attestationId >= nextAttestationId) {
            revert AttestationNotFound(attestationId);
        }

        Attestation storage attestation = attestations[attestationId];

        if (attestation.issuer != msg.sender) {
            revert UnauthorizedIssuer(msg.sender, attestation.issuer);
        }
        if (attestation.revoked) {
            revert AlreadyRevoked(attestationId);
        }

        attestation.revoked = true;

        emit AttestationRevoked(attestationId, msg.sender);
    }

    // =========================================================================
    // VERIFICATION & READ FUNCTIONS
    // =========================================================================

    /**
     * @notice Verify whether an attestation is currently valid.
     * @dev An attestation is valid if it exists, is not revoked, and has not expired.
     *      Does NOT require connecting a wallet or paying gas.
     * @param attestationId The ID of the attestation to verify
     * @return isValid True if valid on-chain attestation, false otherwise
     */
    function isValidAttestation(uint256 attestationId) public view returns (bool isValid) {
        if (attestationId == 0 || attestationId >= nextAttestationId) {
            return false;
        }

        Attestation storage att = attestations[attestationId];

        if (att.revoked) {
            return false;
        }

        if (att.expiresAt != 0 && block.timestamp >= att.expiresAt) {
            return false;
        }

        return true;
    }

    /**
     * @notice Retrieve full attestation struct by ID.
     * @param attestationId Unique identifier of the attestation
     */
    function getAttestation(uint256 attestationId) external view returns (Attestation memory) {
        if (attestationId == 0 || attestationId >= nextAttestationId) {
            revert AttestationNotFound(attestationId);
        }
        return attestations[attestationId];
    }

    /**
     * @notice Retrieve all attestation IDs received by a specific wallet.
     * @param recipient Address of the recipient
     */
    function getRecipientAttestations(address recipient) external view returns (uint256[] memory) {
        return recipientAttestations[recipient];
    }

    /**
     * @notice Retrieve all attestation IDs issued by a specific wallet.
     * @param issuer Address of the issuing authority
     */
    function getIssuerAttestations(address issuer) external view returns (uint256[] memory) {
        return issuerAttestations[issuer];
    }

    /**
     * @notice Retrieve attestation IDs received by a wallet filtered by credential type.
     * @param recipient Address of the recipient
     * @param credentialType bytes32 credential category hash
     */
    function getRecipientAttestationsByType(
        address recipient,
        bytes32 credentialType
    ) external view returns (uint256[] memory) {
        uint256[] storage allIds = recipientAttestations[recipient];
        uint256 total = allIds.length;

        // First pass: count matching attestations
        uint256 matchCount = 0;
        for (uint256 i = 0; i < total; i++) {
            if (attestations[allIds[i]].credentialType == credentialType) {
                matchCount++;
            }
        }

        // Second pass: populate matching array
        uint256[] memory matching = new uint256[](matchCount);
        uint256 currentIndex = 0;
        for (uint256 i = 0; i < total; i++) {
            if (attestations[allIds[i]].credentialType == credentialType) {
                matching[currentIndex] = allIds[i];
                currentIndex++;
            }
        }

        return matching;
    }

    /**
     * @notice Helper to get total number of attestations ever issued.
     */
    function totalAttestations() external view returns (uint256) {
        return nextAttestationId - 1;
    }
}
