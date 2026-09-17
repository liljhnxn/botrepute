import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { BotRepute } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("BotRepute Protocol", function () {
  let botRepute: BotRepute;
  let owner: HardhatEthersSigner;
  let issuer: HardhatEthersSigner;
  let recipient: HardhatEthersSigner;
  let attacker: HardhatEthersSigner;

  const DEVELOPER_TYPE = ethers.keccak256(ethers.toUtf8Bytes("DEVELOPER"));
  const CONTRIBUTOR_TYPE = ethers.keccak256(ethers.toUtf8Bytes("CONTRIBUTOR"));
  const BUILDER_TYPE = ethers.keccak256(ethers.toUtf8Bytes("BUILDER"));

  beforeEach(async function () {
    [owner, issuer, recipient, attacker] = await ethers.getSigners();

    const BotReputeFactory = await ethers.getContractFactory("BotRepute");
    botRepute = (await BotReputeFactory.deploy()) as unknown as BotRepute;
    await botRepute.waitForDeployment();
  });

  describe("Deployment & Initialization", function () {
    it("should deploy with nextAttestationId set to 1", async function () {
      expect(await botRepute.nextAttestationId()).to.equal(1n);
      expect(await botRepute.totalAttestations()).to.equal(0n);
    });
  });

  describe("Issue Attestation", function () {
    it("should revert if recipient is zero address", async function () {
      await expect(
        botRepute
          .connect(issuer)
          .issueAttestation(
            ethers.ZeroAddress,
            DEVELOPER_TYPE,
            "Senior Solidity Dev",
            "Contributed to core protocol",
            "ipfs://QmExample1",
            0
          )
      ).to.be.revertedWithCustomError(botRepute, "InvalidRecipient");
    });

    it("should revert if title is empty", async function () {
      await expect(
        botRepute
          .connect(issuer)
          .issueAttestation(
            recipient.address,
            DEVELOPER_TYPE,
            "",
            "Contributed to core protocol",
            "ipfs://QmExample1",
            0
          )
      ).to.be.revertedWithCustomError(botRepute, "EmptyTitle");
    });

    it("should revert if expiration timestamp is in the past or now", async function () {
      const now = await time.latest();
      await expect(
        botRepute
          .connect(issuer)
          .issueAttestation(
            recipient.address,
            DEVELOPER_TYPE,
            "Senior Solidity Dev",
            "Expired test",
            "",
            now - 10
          )
      ).to.be.revertedWithCustomError(botRepute, "InvalidExpiration");
    });

    it("should successfully issue permanent attestation and emit event", async function () {
      const tx = await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          DEVELOPER_TYPE,
          "Lead Protocol Engineer",
          "Engineered decentralized AMM contracts",
          "ipfs://metadata-lead-eng",
          0
        );

      await expect(tx)
        .to.emit(botRepute, "AttestationIssued")
        .withArgs(
          1n,
          issuer.address,
          recipient.address,
          DEVELOPER_TYPE,
          "Lead Protocol Engineer",
          0n
        );

      const att = await botRepute.getAttestation(1);
      expect(att.id).to.equal(1n);
      expect(att.issuer).to.equal(issuer.address);
      expect(att.recipient).to.equal(recipient.address);
      expect(att.credentialType).to.equal(DEVELOPER_TYPE);
      expect(att.title).to.equal("Lead Protocol Engineer");
      expect(att.description).to.equal("Engineered decentralized AMM contracts");
      expect(att.metadataURI).to.equal("ipfs://metadata-lead-eng");
      expect(att.expiresAt).to.equal(0n);
      expect(att.revoked).to.be.false;
      expect(await botRepute.isValidAttestation(1)).to.be.true;
    });

    it("should update recipient and issuer histories properly", async function () {
      await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          DEVELOPER_TYPE,
          "Dev 1",
          "Desc 1",
          "",
          0
        );

      await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          CONTRIBUTOR_TYPE,
          "Contributor 1",
          "Desc 2",
          "",
          0
        );

      const recipientList = await botRepute.getRecipientAttestations(recipient.address);
      expect(recipientList.length).to.equal(2);
      expect(recipientList[0]).to.equal(1n);
      expect(recipientList[1]).to.equal(2n);

      const issuerList = await botRepute.getIssuerAttestations(issuer.address);
      expect(issuerList.length).to.equal(2);
      expect(issuerList[0]).to.equal(1n);
      expect(issuerList[1]).to.equal(2n);
    });
  });

  describe("Revocation & Permissions", function () {
    beforeEach(async function () {
      await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          DEVELOPER_TYPE,
          "Smart Contract Auditor",
          "Audited core vault contracts",
          "",
          0
        );
    });

    it("should revert if attestation does not exist", async function () {
      await expect(
        botRepute.connect(issuer).revokeAttestation(999)
      ).to.be.revertedWithCustomError(botRepute, "AttestationNotFound");
    });

    it("should revert if caller is recipient (recipient cannot revoke issuer credential)", async function () {
      await expect(
        botRepute.connect(recipient).revokeAttestation(1)
      ).to.be.revertedWithCustomError(botRepute, "UnauthorizedIssuer");
    });

    it("should revert if caller is an unauthorized attacker", async function () {
      await expect(
        botRepute.connect(attacker).revokeAttestation(1)
      ).to.be.revertedWithCustomError(botRepute, "UnauthorizedIssuer");
    });

    it("should allow original issuer to revoke and emit event", async function () {
      const tx = await botRepute.connect(issuer).revokeAttestation(1);

      await expect(tx)
        .to.emit(botRepute, "AttestationRevoked")
        .withArgs(1n, issuer.address);

      const att = await botRepute.getAttestation(1);
      expect(att.revoked).to.be.true;
      // Historical record remains intact
      expect(att.title).to.equal("Smart Contract Auditor");
      expect(att.issuer).to.equal(issuer.address);
      expect(att.recipient).to.equal(recipient.address);

      // isValidAttestation returns false
      expect(await botRepute.isValidAttestation(1)).to.be.false;
    });

    it("should revert if attempting to revoke an already revoked attestation", async function () {
      await botRepute.connect(issuer).revokeAttestation(1);

      await expect(
        botRepute.connect(issuer).revokeAttestation(1)
      ).to.be.revertedWithCustomError(botRepute, "AlreadyRevoked");
    });
  });

  describe("Expiration & Validity Logic", function () {
    it("should return true while before expiration and false after expiration", async function () {
      const now = await time.latest();
      const expiration = now + 3600; // 1 hour in future

      await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          BUILDER_TYPE,
          "Hackathon Winner 2026",
          "First place in Botchain Track",
          "",
          expiration
        );

      // Valid right now
      expect(await botRepute.isValidAttestation(1)).to.be.true;

      // Advance time by 30 minutes (still valid)
      await time.increase(1800);
      expect(await botRepute.isValidAttestation(1)).to.be.true;

      // Advance time beyond expiration
      await time.increase(3600);
      expect(await botRepute.isValidAttestation(1)).to.be.false;
    });

    it("should return false for non-existent attestation ID 0 or out of bounds", async function () {
      expect(await botRepute.isValidAttestation(0)).to.be.false;
      expect(await botRepute.isValidAttestation(99)).to.be.false;
    });
  });

  describe("Credential Type Filtering", function () {
    it("should correctly filter recipient attestations by credential type", async function () {
      // Issue 2 developer credentials and 1 contributor credential
      await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          DEVELOPER_TYPE,
          "Dev 1",
          "Desc",
          "",
          0
        );
      await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          CONTRIBUTOR_TYPE,
          "Contributor 1",
          "Desc",
          "",
          0
        );
      await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          DEVELOPER_TYPE,
          "Dev 2",
          "Desc",
          "",
          0
        );

      const devAttestations = await botRepute.getRecipientAttestationsByType(
        recipient.address,
        DEVELOPER_TYPE
      );
      expect(devAttestations.length).to.equal(2);
      expect(devAttestations[0]).to.equal(1n);
      expect(devAttestations[1]).to.equal(3n);

      const contribAttestations = await botRepute.getRecipientAttestationsByType(
        recipient.address,
        CONTRIBUTOR_TYPE
      );
      expect(contribAttestations.length).to.equal(1);
      expect(contribAttestations[0]).to.equal(2n);

      const builderAttestations = await botRepute.getRecipientAttestationsByType(
        recipient.address,
        BUILDER_TYPE
      );
      expect(builderAttestations.length).to.equal(0);
    });
  });

  describe("Public Verification & View Methods", function () {
    it("should allow any arbitrary signer/address to verify and read attestation", async function () {
      await botRepute
        .connect(issuer)
        .issueAttestation(
          recipient.address,
          DEVELOPER_TYPE,
          "Public Credential",
          "Anyone can inspect",
          "",
          0
        );

      // Anonymous / attacker caller can verify and read
      expect(await botRepute.connect(attacker).isValidAttestation(1)).to.be.true;
      const data = await botRepute.connect(attacker).getAttestation(1);
      expect(data.title).to.equal("Public Credential");
      expect(data.issuer).to.equal(issuer.address);
      expect(data.recipient).to.equal(recipient.address);
    });
  });
});
