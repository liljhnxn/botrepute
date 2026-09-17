"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  fallbackHref?: string;
  className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = "Back",
  fallbackHref = "/",
  className = "",
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Return to previous page"
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 hover:border-cyan-500/40 shadow-sm text-xs font-medium transition-all duration-200 group mb-6 cursor-pointer ${className}`}
    >
      <ArrowLeft className="w-4 h-4 text-cyan-400 transition-transform group-hover:-translate-x-1" />
      <span>{label}</span>
    </button>
  );
};
