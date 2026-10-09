import React from "react";

interface BotchainLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const BotchainLogo: React.FC<BotchainLogoProps> = ({
  className = "",
  size = 28,
  showText = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* BOT Chain Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="botchain-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14DCAC" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="botchain-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#14DCAC" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Outer Hexagon Shield */}
        <polygon
          points="18,2 32,9 32,27 18,34 4,27 4,9"
          fill="#0D111A"
          stroke="url(#botchain-grad)"
          strokeWidth="2"
        />

        {/* Inner Tech Core */}
        <polygon
          points="18,7 28,12 28,24 18,29 8,24 8,12"
          fill="url(#botchain-glow)"
        />

        {/* Circuit Interconnects */}
        <circle cx="18" cy="18" r="3.5" fill="#14DCAC" />
        <circle cx="18" cy="10" r="1.8" fill="#06B6D4" />
        <circle cx="25" cy="22" r="1.8" fill="#3B82F6" />
        <circle cx="11" cy="22" r="1.8" fill="#3B82F6" />

        {/* Links */}
        <line x1="18" y1="12" x2="18" y2="15" stroke="#14DCAC" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="20" x2="23.5" y2="21.5" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="20" x2="12.5" y2="21.5" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {showText && (
        <span className="font-bold text-white tracking-tight flex items-center gap-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 font-extrabold">
            BOT Chain
          </span>
        </span>
      )}
    </div>
  );
};
