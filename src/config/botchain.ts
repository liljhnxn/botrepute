import { defineChain } from "viem";

const rpcUrl =
  process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL && !process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL.includes("bohr")
    ? process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL
    : "https://rpc.botchain.ai";

const explorerUrl =
  process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL && !process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL.includes("bohr")
    ? process.env.NEXT_PUBLIC_BOTCHAIN_EXPLORER_URL
    : "https://scan.botchain.ai";

export const botchain = defineChain({
  id: 677,
  name: "BOT Chain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
    public: {
      http: [rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "BotScan",
      url: explorerUrl,
    },
  },
});
