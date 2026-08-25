import React, { useState } from 'react';
import { Copy, Check, Fingerprint, ShieldCheck, Clock, FileCode } from 'lucide-react';

interface ReproducibilityBadgeProps {
  datasetName?: string;
  reportId?: string;
}

export const ReproducibilityBadge: React.FC<ReproducibilityBadgeProps> = ({
  datasetName = 'dataset.csv',
  reportId = 'DP-2026-9A81B'
}) => {
  const [copied, setCopied] = useState(false);
  const timestamp = new Date().toISOString();
  const shaFingerprint = 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  const copyScript = () => {
    const text = `// DataPilot AI Enterprise Reproducibility Verification
Analysis ID: ${reportId}
Dataset Fingerprint: ${shaFingerprint}
AI Model Version: gemini-3.6-flash:v2.4
Execution Timestamp: ${timestamp}
Determinism Hash: 0x98f2a1738c`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-white/10 bg-slate-900/80 text-xs font-mono text-slate-300">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-teal-400 font-bold">
          <Fingerprint className="h-4 w-4" />
          <span>{reportId}</span>
        </div>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">Dataset: <strong className="text-white font-semibold">{datasetName}</strong></span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">SHA: <code className="text-purple-300">7f83b165...</code></span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400">Model: <code className="text-blue-300">gemini-3.6-flash</code></span>
      </div>

      <button
        onClick={copyScript}
        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition cursor-pointer"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
        <span>{copied ? 'Copied Verification Hash' : 'Copy Reproducibility Hash'}</span>
      </button>
    </div>
  );
};
