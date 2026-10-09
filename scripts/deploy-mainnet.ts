import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const rpcUrl = process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai";
  const chainId = Number(process.env.NEXT_PUBLIC_BOTCHAIN_CHAIN_ID || 677);
  const explorerUrl = process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.botchain.ai";

  console.log("==================================================");
  console.log("BOTREPUTE PROTOCOL MAINNET DEPLOYMENT (LOW GAS)");
  console.log("==================================================");
  console.log(`Network Name:     BOT Chain Mainnet`);
  console.log(`Chain ID:         ${chainId}`);
  console.log(`RPC Endpoint:     ${rpcUrl}`);

  const rawKey = (process.env.BOTCHAIN_PRIVATE_KEY || "").trim();
  if (!rawKey) {
    throw new Error("❌ Error: BOTCHAIN_PRIVATE_KEY is missing in .env!");
  }
  const formattedKey = rawKey.startsWith("0x") ? rawKey : `0x${rawKey}`;

  // Use staticNetwork to prevent duplicate RPC calls
  const network = new ethers.Network("botchainMainnet", chainId);
  const provider = new ethers.JsonRpcProvider(rpcUrl, network, { staticNetwork: network });
  const wallet = new ethers.Wallet(formattedKey, provider);

  console.log(`Deployer Address: ${wallet.address}`);

  const [balance, feeData] = await Promise.all([
    provider.getBalance(wallet.address),
    provider.getFeeData(),
  ]);

  console.log(`Deployer Balance: ${ethers.formatEther(balance)} BOT`);
  
  // Use 20 gwei (the network floor minimum fee)
  const gasPrice = feeData.gasPrice || 20000000000n;
  console.log(`Gas Price:        ${ethers.formatUnits(gasPrice, "gwei")} gwei`);

  // Load compiled BotRepute artifact
  const artifactPath = path.join(
    process.cwd(),
    "artifacts/contracts/BotRepute.sol/BotRepute.json"
  );
  if (!fs.existsSync(artifactPath)) {
    throw new Error("Artifact not found! Please run 'npm run compile' first.");
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));

  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  // Estimate gas for deployment
  const deployTx = await factory.getDeployTransaction();
  const estimatedGas = await provider.estimateGas({
    from: wallet.address,
    data: deployTx.data,
  });

  // Add 10% safety buffer to estimated gas
  const gasLimit = (estimatedGas * 110n) / 100n;
  const maxCost = gasLimit * gasPrice;

  console.log(`Estimated Gas:    ${estimatedGas.toString()} units`);
  console.log(`Gas Limit Set:    ${gasLimit.toString()} units`);
  console.log(`Max Expected Fee: ${ethers.formatEther(maxCost)} BOT`);

  if (balance < maxCost) {
    throw new Error(
      `Insufficient funds for deployment: balance is ${ethers.formatEther(balance)} BOT, but requires ${ethers.formatEther(maxCost)} BOT.`
    );
  }

  console.log("\nDeploying BotRepute contract with lowest fee...");
  const contract = await factory.deploy({
    gasPrice,
    gasLimit,
  });

  const deploymentTx = contract.deploymentTransaction();
  if (deploymentTx) {
    console.log(`Transaction Hash: ${deploymentTx.hash}`);
    console.log(`View on Explorer: ${explorerUrl}/tx/${deploymentTx.hash}`);
  }

  console.log("Waiting for confirmation on BOT Chain Mainnet...");
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const receipt = await provider.getTransactionReceipt(deploymentTx!.hash);
  const actualFee = receipt ? receipt.gasUsed * receipt.gasPrice : maxCost;

  console.log("\n==================================================");
  console.log("DEPLOYMENT SUCCESSFUL!");
  console.log("==================================================");
  console.log(`BotRepute Address:  ${contractAddress}`);
  console.log(`Gas Used:           ${receipt?.gasUsed.toString()} units`);
  console.log(`Actual Fee Paid:    ${ethers.formatEther(actualFee)} BOT`);
  console.log(`Explorer Link:      ${explorerUrl}/address/${contractAddress}`);
  console.log("==================================================\n");

  // 1. Update src/config/deployedAddress.json
  const configDir = path.join(process.cwd(), "src/config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const deployedConfigPath = path.join(configDir, "deployedAddress.json");
  fs.writeFileSync(
    deployedConfigPath,
    JSON.stringify(
      {
        contractAddress,
        chainId,
        network: "botchainMainnet",
        txHash: deploymentTx?.hash,
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );
  console.log(`✓ Saved deployment info to ${deployedConfigPath}`);

  // 2. Update .env
  const envPath = path.join(process.cwd(), ".env");
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, "utf-8");
    envContent = envContent.replace(
      /NEXT_PUBLIC_BOTREPUTE_CONTRACT_ADDRESS=.*/,
      `NEXT_PUBLIC_BOTREPUTE_CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(envPath, envContent);
    console.log(`✓ Updated .env with new contract address: ${contractAddress}`);
  }

  // 3. Update src/config/contract.ts fallback address
  const contractTsPath = path.join(process.cwd(), "src/config/contract.ts");
  if (fs.existsSync(contractTsPath)) {
    let tsContent = fs.readFileSync(contractTsPath, "utf-8");
    tsContent = tsContent.replace(
      /("0x[a-fA-F0-9]{40}" as `0x\${string}`\);)/,
      `("${contractAddress}" as \`0x\${string}\`);`
    );
    fs.writeFileSync(contractTsPath, tsContent);
    console.log(`✓ Updated src/config/contract.ts fallback address`);
  }

  console.log("\nDeployment and configuration complete!");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
