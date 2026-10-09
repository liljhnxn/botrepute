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
      {/* Official BOT Chain Logo */}
      <img
        src="/botchain-logo.png"
        alt="BOT Chain"
        width={size}
        height={size}
        className="rounded-md object-contain shrink-0 border border-emerald-500/30 shadow-sm"
        style={{ width: `${size}px`, height: `${size}px` }}
      />

      {showText && (
        <span className="font-bold text-white tracking-tight flex items-center gap-1">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-extrabold">
            BOT Chain
          </span>
        </span>
      )}
    </div>
  );
};
