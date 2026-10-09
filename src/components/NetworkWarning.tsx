"use client";

import React from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { botchain } from "@/config/botchain";
import { AlertCircle, RefreshCw } from "lucide-react";

export const NetworkWarning: React.FC = () => {
  const { chain, isConnected } = useAccount();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || !chain) return null;

  if (chain.id === botchain.id) return null;

  return (
    <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-amber-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            You are currently connected to <strong>{chain.name || `Chain ID ${chain.id}`}</strong>. BotRepute runs exclusively on <strong>{botchain.name} (Chain ID {botchain.id})</strong>.
          </span>
        </div>
        <button
          onClick={() => switchChain?.({ chainId: botchain.id })}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-md transition-colors disabled:opacity-50 text-xs shrink-0"
        >
          {isPending ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : null}
          Switch to {botchain.name}
        </button>
      </div>
    </div>
  );
};
