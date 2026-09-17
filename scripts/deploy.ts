import hre from "hardhat";
const { ethers, network } = hre;
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("==================================================");
  console.log("Deploying BotRepute Protocol to Botchain Testnet");
  console.log("==================================================");

  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer available. Please check your BOTCHAIN_PRIVATE_KEY configuration.");
  }

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer Address: ${deployer.address}`);
  console.log(`Deployer Balance: ${ethers.formatEther(balance)} BOHR`);
  console.log(`Network: ${network.name}`);

  const chainId = (await ethers.provider.getNetwork()).chainId;
  console.log(`Chain ID: ${chainId}`);

  // Deploy BotRepute
  const BotReputeFactory = await ethers.getContractFactory("BotRepute");
  console.log("Deploying contract...");
  const botRepute = await BotReputeFactory.deploy();
  await botRepute.waitForDeployment();

  const contractAddress = await botRepute.getAddress();
  const explorerUrl = process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL || "https://scan.bohr.life";

  console.log("\n==================================================");
  console.log("DEPLOYMENT SUCCESSFUL!");
  console.log("==================================================");
  console.log(`BotRepute Contract Address: ${contractAddress}`);
  console.log(`Network:                   ${network.name}`);
  console.log(`Chain ID:                  ${chainId}`);
  console.log(`Explorer URL:              ${explorerUrl}/address/${contractAddress}`);
  console.log("==================================================\n");

  // Automatically update the frontend contract address config file
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
        chainId: Number(chainId),
        network: network.name,
        deployedAt: new Date().toISOString(),
      },
      null,
      2
    )
  );

  console.log(`Saved deployment info to ${deployedConfigPath}`);
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
