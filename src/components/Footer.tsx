import React from "react";
import Link from "next/link";
import { Shield, ExternalLink, Globe, Search, CheckCircle2 } from "lucide-react";
import { botchain } from "@/config/botchain";
import { BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";
import { BotchainLogo } from "@/components/BotchainLogo";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Bot<span className="text-cyan-400">Repute</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Reputation You Can Verify." Decentralized cryptographic credentials and portable attestations anchored to BOT Chain Mainnet.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{botchain.name} Online (Chain ID: {botchain.id})</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Protocol
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-cyan-400 transition-colors">
                  Explore Overview
                </Link>
              </li>
              <li>
                <Link href="/issue" className="hover:text-cyan-400 transition-colors">
                  Issue Credential
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-cyan-400 transition-colors">
                  Verify Attestation
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-cyan-400 transition-colors">
                  Universal Search
                </Link>
              </li>
              <li>
                <Link href="/activity" className="hover:text-cyan-400 transition-colors">
                  Live Activity Feed
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: BOT Chain Ecosystem (Mandatory Name, Logo & Official Links) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BotchainLogo size={20} showText={false} />
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                BOT Chain Network
              </h4>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group hover:text-cyan-400 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium text-slate-300 group-hover:text-cyan-400">
                    <img
                      src="/botchain-logo.png"
                      alt="BOT Chain"
                      className="w-4 h-4 rounded-sm object-contain shrink-0 border border-emerald-500/30"
                    />
                    <span>BOT Chain Website</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group hover:text-cyan-400 transition-colors"
                >
                  <span className="flex items-center gap-2 font-medium text-slate-300 group-hover:text-cyan-400">
                    <img
                      src="/botchain-logo.png"
                      alt="BOT Chain"
                      className="w-4 h-4 rounded-sm object-contain shrink-0 border border-emerald-500/30"
                    />
                    <span>BOT Chain Explorer</span>
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://rpc.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group hover:text-cyan-400 transition-colors"
                >
                  <span>RPC: rpc.botchain.ai</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                </a>
              </li>
              <li>
                <a
                  href={`https://scan.botchain.ai/address/${BOTREPUTE_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
                >
                  <span>Contract ({BOTREPUTE_CONTRACT_ADDRESS.slice(0, 6)}...{BOTREPUTE_CONTRACT_ADDRESS.slice(-4)})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Veracity */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">
              Trust & Veracity
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              BotRepute stores tamper-proof cryptographic proofs of issuance and revocation. No arbitrary centralized reputation scores or artificial metrics.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Portable & Self-Sovereign</span>
            </div>
          </div>
        </div>

        {/* Ecosystem Callout Bar */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <BotchainLogo size={28} showText={true} />
            <span className="text-xs text-slate-400 hidden sm:inline">
              Built on BOT Chain Mainnet (Chain ID 677)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-3.5 h-3.5 rounded-sm object-contain"
              />
              <span>botchain.ai</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-colors"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-3.5 h-3.5 rounded-sm object-contain"
              />
              <span>scan.botchain.ai</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 BotRepute Protocol. Secured by BOT Chain Mainnet.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono">Solidity ^0.8.24</span>
            <span>•</span>
            <span className="font-mono">Chain ID: {botchain.id}</span>
            <span>•</span>
            <span className="font-mono">Zero Centralized Gatekeeping</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
