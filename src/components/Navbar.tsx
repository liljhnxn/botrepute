"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./WalletButton";
import { botchain } from "@/config/botchain";
import { BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";
import {
  Shield,
  Award,
  Search,
  CheckCircle,
  User,
  Layers,
  Activity,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Explore", href: "/", icon: Shield },
    { name: "Issue", href: "/issue", icon: Award },
    { name: "Verify", href: "/verify", icon: CheckCircle },
    { name: "Dashboard", href: "/profile", icon: User },
    { name: "Issuer Hub", href: "/dashboard/issuer", icon: Layers },
    { name: "Search", href: "/search", icon: Search },
    { name: "Activity", href: "/activity", icon: Activity },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-cyanGlow group-hover:scale-105 transition-transform duration-200">
                <Shield className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                    Bot<span className="text-cyan-400">Repute</span>
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {botchain.id}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 -mt-1 hidden sm:block">
                  Reputation You Can Verify
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-800 text-cyan-400 font-semibold"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right section: Explorer Link + Wallet Button + Mobile Toggle */}
          <div className="flex items-center gap-2.5">
            <a
              href={`https://scan.botchain.ai/address/${BOTREPUTE_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-slate-700 text-xs font-semibold transition-all shadow-sm group"
              title="View BotRepute Smart Contract on BOT Chain Mainnet Explorer"
            >
              <img
                src="/botchain-logo.png"
                alt="BOT Chain"
                className="w-4 h-4 rounded-sm object-contain shrink-0"
              />
              <span>Mainnet Explorer</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </a>

            <WalletButton />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-800/80">
            <a
              href={`https://scan.botchain.ai/address/${BOTREPUTE_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 transition-colors"
            >
              <span className="flex items-center gap-2">
                <img
                  src="/botchain-logo.png"
                  alt="BOT Chain"
                  className="w-4 h-4 rounded-sm object-contain shrink-0"
                />
                <span>BOT Chain Mainnet Explorer</span>
              </span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
