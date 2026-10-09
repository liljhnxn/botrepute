"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from "wagmi";
import { botchain } from "@/config/botchain";
import { formatAddress } from "@/lib/botns";
import { getExplorerUrl } from "@/lib/utils";
import {
  Wallet,
  LogOut,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export const WalletButton: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [switching, setSwitching] = useState(false);

  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();

  const handleSwitchNetwork = async () => {
    setSwitching(true);
    try {
      if (switchChain) {
        await switchChain({ chainId: botchain.id });
      }
    } catch {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${botchain.id.toString(16)}`,
                chainName: botchain.name,
                nativeCurrency: botchain.nativeCurrency,
                rpcUrls: botchain.rpcUrls.default.http,
                blockExplorerUrls: [botchain.blockExplorers.default.url],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add BOT Chain Mainnet:", addError);
        }
      }
    } finally {
      setSwitching(false);
    }
  };

  const { data: balanceData } = useBalance({
    address,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg text-xs font-semibold animate-pulse">
        Connecting...
      </button>
    );
  }

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isConnected || !address) {
    return (
      <div className="relative inline-block">
        <button
          onClick={() => {
            const injectedConnector = connectors.find((c) => c.name === "MetaMask") || connectors[0];
            if (injectedConnector) {
              connect({ connector: injectedConnector });
            }
          }}
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-semibold text-xs sm:text-sm shadow-cyanGlow transition-all duration-200 active:scale-95 disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          <span>{isPending ? "Connecting..." : "Connect Wallet"}</span>
        </button>
      </div>
    );
  }

  const isWrongChain = chain?.id !== botchain.id;

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-medium transition-all ${
          isWrongChain
            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
            : "bg-slate-900 border-slate-700 text-slate-200 hover:border-cyan-500/50"
        }`}
      >
        <div
          className={`w-2 h-2 rounded-full ${
            isWrongChain ? "bg-amber-500 animate-ping" : "bg-emerald-400"
          }`}
        />
        <span>{formatAddress(address)}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setDropdownOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Connected Account</p>
              <p className="text-xs font-mono text-slate-200 font-semibold truncate mt-0.5">
                {address}
              </p>
              {balanceData && (
                <p className="text-xs text-cyan-400 mt-1 font-mono">
                  {Number(balanceData.formatted).toFixed(4)} {balanceData.symbol}
                </p>
              )}
            </div>

            {isWrongChain && (
              <button
                onClick={handleSwitchNetwork}
                disabled={switching}
                className="w-full mb-2 p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-[11px] flex items-center justify-between gap-1.5 transition-colors text-left"
              >
                <div className="flex items-center gap-1.5">
                  {switching ? (
                    <RefreshCw className="w-3.5 h-3.5 shrink-0 animate-spin text-amber-400" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  )}
                  <span>Wrong network! Switch to {botchain.name} ({botchain.id})</span>
                </div>
                <span className="text-[10px] font-bold underline shrink-0">Switch</span>
              </button>
            )}

            <div className="space-y-1">
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Copy Address
                </span>
                {copied && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <a
                href={getExplorerUrl("address", address)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  View on Explorer
                </span>
              </a>

              <div className="pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    disconnect();
                    setDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
