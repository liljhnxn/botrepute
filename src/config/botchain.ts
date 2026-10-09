import { defineChain } from "viem";

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
      http: ["https://rpc.botchain.ai"],
    },
    public: {
      http: ["https://rpc.botchain.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "BotScan",
      url: "https://scan.botchain.ai",
    },
  },
});
