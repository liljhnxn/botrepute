"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import { TrustBanner } from "@/components/TrustBanner";
import { BackButton } from "@/components/BackButton";
import {
  Search,
  Hash,
  User,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Award,
} from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const trimmed = query.trim();

    if (!trimmed) {
      setError("Please enter a wallet address or attestation ID.");
      return;
    }

    // Check if EVM address
    if (isAddress(trimmed)) {
      router.push(`/profile/${trimmed}`);
      return;
    }

    // Check if numeric attestation ID
    if (/^\d+$/.test(trimmed)) {
      router.push(`/verify?id=${trimmed}`);
      return;
    }

    // Check if format is "id:123" or "#123"
    const cleaned = trimmed.replace(/^[#id:]+/i, "");
    if (/^\d+$/.test(cleaned)) {
      router.push(`/verify?id=${cleaned}`);
      return;
    }

    setError(
      "Invalid search query. Enter a valid 0x wallet address or numerical Attestation ID."
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div>
        <BackButton />
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Search className="w-3.5 h-3.5" />
          <span>Universal Reputation Lookup</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Search BotRepute
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          Look up any wallet reputation profile or verify a specific credential attestation ID on Botchain Testnet.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-card backdrop-blur-md">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Enter wallet (0x...) or Attestation ID (e.g. 1)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-500">Auto-routes:</span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px]">
                0x... → Profile
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-[11px]">
                #ID → Verify
              </span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-cyanGlow transition-all"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Suggested Lookups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => {
            setQuery("1");
          }}
          className="cursor-pointer p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 transition-colors flex items-start gap-3"
        >
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Attestation ID Lookup</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Inspect validity status, issuer, and parameters for Attestation #1
            </p>
          </div>
        </div>

        <div
          onClick={() => {
            setQuery("0x82a591af3b029482710492837192847291847192");
          }}
          className="cursor-pointer p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/30 transition-colors flex items-start gap-3"
        >
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-white">Wallet Address Lookup</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              View all active and historical credentials held by a specific wallet
            </p>
          </div>
        </div>
      </div>

      <TrustBanner variant="full" />
    </div>
  );
}
