"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X, ExternalLink, Copy, Check, QrCode } from "lucide-react";

interface QRCodeModalProps {
  attestationId: number | bigint;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  attestationId,
  title,
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const verificationUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/verify?id=${attestationId}`
      : `https://botrepute.app/verify?id=${attestationId}`;

  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(verificationUrl, {
        width: 280,
        margin: 2,
        color: {
          dark: "#080B11",
          light: "#FFFFFF",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("Error generating QR code:", err));
    }
  }, [isOpen, verificationUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Credential QR Code</h3>
            <p className="text-xs text-slate-400 truncate max-w-[220px]">
              Attestation #{attestationId.toString()}: {title}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-700 my-4 shadow-inner">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR code for attestation #${attestationId}`}
              className="w-56 h-56 rounded-md"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-xs text-slate-500">
              Generating QR...
            </div>
          )}
          <span className="text-[11px] font-mono text-slate-600 mt-2">
            Scan with camera to verify on Botchain
          </span>
        </div>

        <div className="space-y-2 mt-4">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Verification Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Public Verification Link</span>
              </>
            )}
          </button>

          <a
            href={`/verify?id=${attestationId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-medium border border-cyan-500/30 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open Verification Portal</span>
          </a>
        </div>
      </div>
    </div>
  );
};
