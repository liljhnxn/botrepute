import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NetworkWarning } from "@/components/NetworkWarning";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "BotRepute | Decentralized Web3 Reputation & Credentials Protocol",
  description:
    "Reputation You Can Verify. Build a portable Web3 reputation from verifiable on-chain credentials and attestations secured by BOT Chain Mainnet.",
  keywords: [
    "Web3 Reputation",
    "On-Chain Credentials",
    "Botchain",
    "Attestations",
    "Decentralized Identity",
    "Verifiable Credentials",
    "BotRepute",
  ],
  authors: [{ name: "BotRepute Protocol Team" }],
  openGraph: {
    title: "BotRepute — Reputation You Can Verify",
    description:
      "Create, issue, and verify portable Web3 credentials secured by Botchain.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans flex flex-col min-h-screen`}>
        <Providers>
          <NetworkWarning />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
