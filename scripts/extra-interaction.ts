import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

dotenv.config();

async function main() {
  const rpcUrl = process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
  const chainId = 677;
  const contractAddress = (
    process.env.NEXT_PUBLIC_BOTREPUTE_CONTRACT_ADDRESS ||
    "0x3ec80F1940CeBa9B85112a3f90a55Cc0c7b1a2ad"
  ).trim();

  const rawKey = (process.env.BOTCHAIN_PRIVATE_KEY || "").trim();
  const formattedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;

  const network = new ethers.Network("botchainMainnet", chainId);
  const provider = new ethers.JsonRpcProvider(rpcUrl, network, { staticNetwork: network });

  const walletA = new ethers.Wallet(formattedKey, provider);

  // Generate a fresh wallet with a completely distinct prefix (not starting with 0x8 or 0x6)
  let walletNew: any;
  while (true) {
    const candidate = ethers.Wallet.createRandom(provider);
    const prefix = candidate.address.slice(2, 4).toLowerCase();
    if (!prefix.startsWith("8") && !prefix.startsWith("6")) {
      walletNew = candidate;
      break;
    }
  }

  console.log("==================================================");
  console.log("EXTRA CONTRACT INTERACTION WITH DISTINCT PREFIX");
  console.log("==================================================");
  console.log(`Primary Wallet A: ${walletA.address}`);
  console.log(`New Distinct Wallet: ${walletNew.address} (Prefix: ${walletNew.address.slice(0, 6)})`);

  const gasPrice = 20000000000n; // 20.0 Gwei floor price

  // Fund the new wallet with 0.009 BOT for gas headroom
  const fundAmount = ethers.parseEther("0.009");
  console.log(`\nFunding new wallet with ${ethers.formatEther(fundAmount)} BOT...`);
  const fundTx = await walletA.sendTransaction({
    to: walletNew.address,
    value: fundAmount,
    gasPrice,
  });
  console.log(`  Funding tx: ${fundTx.hash}`);
  await fundTx.wait();

  // Load ABI
  const artifactPath = path.join(
    process.cwd(),
    "artifacts/contracts/BotRepute.sol/BotRepute.json"
  );
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
  const contract = new ethers.Contract(contractAddress, artifact.abi, walletNew);

  const credentialType = ethers.keccak256(ethers.toUtf8Bytes("CONTRIBUTOR"));

  console.log(`\nExecuting contract interaction from ${walletNew.address}...`);
  const tx = await contract.issueAttestation(
    walletA.address,
    credentialType,
    "Protocol Pioneer",
    "Verified ecosystem pioneer attestation",
    "ipfs://pioneer01",
    0n,
    { gasPrice }
  );
  console.log(`  Tx Hash: ${tx.hash}`);
  const receipt = await tx.wait();
  console.log(`  Mined in block ${receipt.blockNumber}, gas used: ${receipt.gasUsed.toString()} units`);

  // Sweep remaining balance back to Wallet A
  const remaining = await provider.getBalance(walletNew.address);
  const sweepGas = 21000n * gasPrice;
  if (remaining > sweepGas) {
    const toSweep = remaining - sweepGas;
    console.log(`\nSweeping ${ethers.formatEther(toSweep)} BOT back to Wallet A...`);
    const sweepTx = await walletNew.sendTransaction({
      to: walletA.address,
      value: toSweep,
      gasPrice,
    });
    await sweepTx.wait();
    console.log(`  Swept: ${sweepTx.hash}`);
  }

  const finalBalA = await provider.getBalance(walletA.address);
  console.log("\n==================================================");
  console.log("INTERACTION COMPLETE!");
  console.log("==================================================");
  console.log(`From (New Address): ${walletNew.address}`);
  console.log(`To (Contract):      ${contractAddress}`);
  console.log(`Tx Link on BotScan: https://scan.botchain.ai/tx/${tx.hash}`);
  console.log(`Final Primary Wallet Balance: ${ethers.formatEther(finalBalA)} BOT`);
  console.log("==================================================");
}

main().catch((err) => {
  console.error("Execution failed:", err);
  process.exit(1);
});
