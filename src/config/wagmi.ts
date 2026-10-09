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
    [botchain.id]: http(botchain.rpcUrls.default.http[0]),
  },
  ssr: true,
});
