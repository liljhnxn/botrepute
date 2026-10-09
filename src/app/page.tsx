import React from "react";
import Link from "next/link";
import { TrustBanner } from "@/components/TrustBanner";
import { botchain } from "@/config/botchain";
import { BOTREPUTE_CONTRACT_ADDRESS } from "@/config/contract";
import { BotchainLogo } from "@/components/BotchainLogo";
import {
  ShieldCheck,
  Award,
  Search,
  CheckCircle2,
  Lock,
  Zap,
  ArrowRight,
  Layers,
  Users,
  Code2,
  Building2,
  Sparkles,
  HelpCircle,
  Cpu,
  Fingerprint,
  ExternalLink,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const steps = [
    {
      number: "01",
      title: "Define & Issue",
      description:
        "DAOs, projects, or users create an on-chain attestation specifying the recipient address, role or achievement, and expiration policy.",
      icon: Award,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30",
    },
    {
      number: "02",
      title: "Immutable Anchoring",
      description:
        `The attestation is cryptographically signed and permanently recorded on ${botchain.name} (Chain ID ${botchain.id}) with an unforgeable attestation ID.`,
      icon: Lock,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    },
    {
      number: "03",
      title: "Zero-Friction Verification",
      description:
        "Anyone in Web3 can instantly verify the attestation validity, issuer identity, and status without needing to connect a wallet.",
      icon: ShieldCheck,
      color: "from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30",
    },
  ];

  const stakeholders = [
    {
      title: "For Individuals",
      subtitle: "Own Your Web3 Reputation",
      description:
        "Accumulate portable on-chain credentials across protocols. Prove you are a core developer, DAO voter, or hackathon winner without exposing private identity documents.",
      icon: Users,
      perks: [
        "Self-sovereign wallet ownership",
        "Portable across dApps and ecosystems",
        "Zero private documents required",
      ],
      gradient: "hover:border-cyan-500/50",
    },
    {
      title: "For DAOs & Communities",
      subtitle: "Merit-Based Governance",
      description:
        "Issue verified roles to active contributors, council members, and voters. Prevent Sybil attacks by tying access to verifiable credentials rather than arbitrary metrics.",
      icon: Building2,
      perks: [
        "Cryptographically signed roles",
        "Instant member verification",
        "Issuer-controlled revocation if terms change",
      ],
      gradient: "hover:border-purple-500/50",
    },
    {
      title: "For Builders & Projects",
      subtitle: "Ecosystem Sybil Resistance",
      description:
        "Filter ecosystem contributors, airdrop recipients, and grant applicants using transparent on-chain attestations issued by trusted ecosystem partners.",
      icon: Code2,
      perks: [
        "Composable bytes32 credential types",
        "Zero-gas public read verification",
        "Direct integration via Solidity contract",
      ],
      gradient: "hover:border-emerald-500/50",
    },
  ];

  const faqs = [
    {
      question: "Does BotRepute calculate a single arbitrary reputation score?",
      answer:
        "No. BotRepute purposefully rejects arbitrary scores like '94/100'. Instead, it focuses on verifiable on-chain attestations and credentials where viewers can inspect exactly who issued what, when, and under what conditions.",
    },
    {
      question: "What does 'Verified Attestation' mean?",
      answer:
        "It means the attestation exists on BOT Chain Mainnet, was cryptographically signed by the specified issuer, and has neither been revoked nor expired. It confirms that the issuer made this claim, but the protocol does not independently audit real-world facts.",
    },
    {
      question: "Do I have to connect a wallet to verify a credential?",
      answer:
        "No! Public verification is completely open and zero-friction. Any recruiter, dApp, or user can input an Attestation ID on /verify or scan a credential QR code without connecting a wallet or paying gas.",
    },
    {
      question: "Can a recipient revoke a credential issued by someone else?",
      answer:
        "No. Smart contract rules guarantee that only the original issuing address has the authority to revoke a credential they created.",
    },
    {
      question: "Are sensitive personal documents stored on-chain?",
      answer:
        "Never. BotRepute is designed for privacy. Users should never upload passports, government IDs, or private data on-chain. Optional metadataURI can point to decentralized public schemas.",
    },
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 lg:pt-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge linking to Explorer */}
          <a
            href={`https://scan.botchain.ai/address/${BOTREPUTE_CONTRACT_ADDRESS}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 transition-all group"
            title="View Contract on BOT Chain Mainnet Explorer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{botchain.name} • Chain ID: {botchain.id}</span>
            <ExternalLink className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
          </a>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Reputation You Can{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Verify.
            </span>
          </h1>

          {/* Tagline & Subheading */}
          <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create, issue, and verify portable Web3 credentials secured by Botchain. Build authentic on-chain trust without subjective scores.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm sm:text-base shadow-cyanGlow transition-all duration-200 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Explore Reputation</span>
            </Link>

            <Link
              href="/issue"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-sm sm:text-base border border-slate-700 hover:border-slate-600 transition-all duration-200 active:scale-95"
            >
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Issue Credential</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            <a
              href={`https://scan.botchain.ai/address/${BOTREPUTE_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm sm:text-base border border-slate-800 hover:border-slate-700 transition-all duration-200 active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-cyan-400" />
              <span>Mainnet Explorer</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400">0%</div>
              <div className="text-xs text-slate-400 mt-1">Fabricated Scores</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">On-Chain Verifiable</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-purple-400">{botchain.id}</div>
              <div className="text-xs text-slate-400 mt-1">{botchain.name}</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-mono font-bold text-pink-400">Zero</div>
              <div className="text-xs text-slate-400 mt-1">Private Data Leak</div>
            </div>
          </div>

          {/* Trust Banner Preview */}
          <div className="mt-10 max-w-3xl mx-auto">
            <TrustBanner variant="inline" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">
            Architecture
          </h2>
          <p className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            How BotRepute Works
          </p>
          <p className="text-slate-400 text-sm mt-3">
            A three-step decentralized pipeline providing cryptographic certainty without centralized control.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl bg-slate-900/80 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-mono font-extrabold text-slate-700">
                      {step.number}
                    </span>
                    <div className={`p-3 rounded-xl border ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stakeholders Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-widest">
            Ecosystem Use Cases
          </h2>
          <p className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            Empowering the Bot Ecosystem
          </p>
          <p className="text-slate-400 text-sm mt-3">
            Tailored for individuals, communities, DAOs, and autonomous builders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stakeholders.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`rounded-2xl bg-slate-900/90 border border-slate-800 p-8 flex flex-col justify-between transition-all duration-300 ${s.gradient}`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                    {s.title}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-3">
                    {s.subtitle}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {s.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-6 border-t border-slate-800/80">
                  {s.perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why On-Chain Credentials vs Arbitrary Scores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Transparent Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2 mb-4 leading-tight">
                Why On-Chain Credentials Outperform Subjective Scores
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
                Most Web3 reputation platforms fail because they aggregate diverse actions into an opaque, gaming-prone single number like <em>"94/100"</em>.
              </p>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                BotRepute turns this on its head: credentials are discrete, immutable attestations signed by identifiable issuers. You can inspect who certified your skills, verify expiration, and confirm non-revocation directly on the Botchain ledger.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/verify"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Try Public Verification</span>
                </Link>
                <Link
                  href="/dashboard/issuer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors border border-slate-700"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Issuer Portal</span>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/20">
                <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-1">
                  <span>Traditional "Score" Model (Flawed)</span>
                </div>
                <div className="text-slate-400 text-xs leading-relaxed">
                  Opaque algorithms calculate "Score: 780". Hard to verify who contributed what, easily gamed by wash activity, and controlled by a single centralized entity.
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
                  <span>BotRepute Verifiable Attestation Model (Standard)</span>
                </div>
                <div className="text-slate-300 text-xs leading-relaxed">
                  Clear cryptographic proof: <em>"BotDAO Council certified Alice as Core Contributor on Block #12048."</em> Validated on-chain, verifiable by anyone, unforgeable.
                </div>
              </div>

              <TrustBanner variant="full" />
            </div>
          </div>
        </div>
      </section>

      {/* BOT Chain Ecosystem & Network Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-xl">
              {/* BOT Chain Name and Logo Header */}
              <div className="flex items-center gap-3">
                <BotchainLogo size={36} showText={false} />
                <div>
                  <span className="text-[11px] font-mono font-semibold tracking-wider uppercase text-cyan-400 block">
                    Underlying Ecosystem Layer
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                    <span>Powered by</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500">
                      BOT Chain
                    </span>
                  </h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                BotRepute runs natively on <strong>BOT Chain Mainnet</strong> — providing ultra-low latency, EVM-compatible execution, negligible gas fees, and transparent on-chain attestation verification.
              </p>

              {/* Mandatory Official BOT Chain Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 hover:text-white text-xs font-semibold border border-slate-700 transition-all shadow-sm group"
                >
                  <Globe className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>BOT Chain Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
                </a>

                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold border border-cyan-500/30 transition-all group"
                >
                  <Search className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span>BOT Chain Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>

                <a
                  href={`https://scan.botchain.ai/address/${BOTREPUTE_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-cyan-300 text-xs font-mono border border-slate-800 transition-all"
                >
                  <span>Contract: 0x3ec8...a2ad</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>

            {/* Network Statistics & Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div className="px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">NETWORK</span>
                <span className="text-white font-bold">{botchain.name}</span>
              </div>
              <div className="px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CHAIN ID</span>
                <span className="text-cyan-400 font-bold">{botchain.id}</span>
              </div>
              <div className="px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">NATIVE TOKEN</span>
                <span className="text-emerald-400 font-bold">{botchain.nativeCurrency.symbol}</span>
              </div>
              <div className="px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-slate-500 block text-[10px]">RPC</span>
                <span className="text-slate-200 font-bold truncate block">
                  rpc.botchain.ai
                </span>
              </div>
              <a
                href="https://scan.botchain.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-colors col-span-2 group block"
              >
                <span className="text-slate-500 block text-[10px]">MAINNET EXPLORER</span>
                <span className="text-cyan-400 font-bold flex items-center gap-1 group-hover:underline">
                  <span>scan.botchain.ai</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1 text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <h4 className="text-base font-semibold text-white mb-2 flex items-start gap-2">
                <span className="text-cyan-400">Q:</span>
                <span>{faq.question}</span>
              </h4>
              <p className="text-sm text-slate-400 pl-5 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
