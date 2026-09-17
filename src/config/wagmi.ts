import { http, createConfig } from "wagmi";
import { injected } from "@wagmi/core";
import { botchain } from "./botchain";

export const config = createConfig({
  chains: [botchain],
  connectors: [
    injected({
      target: "metaMask",
    }),
    injected(),
  ],
  transports: {
    [botchain.id]: http(process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.bohr.life"),
  },
  ssr: true,
});
