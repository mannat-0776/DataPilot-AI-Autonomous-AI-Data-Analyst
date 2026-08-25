import React, { useState } from 'react';
import { Code2, Terminal, Database, FileText, Copy, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { ActivityLog } from '../types';

interface DeveloperModeDrawerProps {
  isOpen: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  activityLogs?: ActivityLog[];
  logs?: ActivityLog[];
  report?: any;
}

export const DeveloperModeDrawer: React.FC<DeveloperModeDrawerProps> = ({
  isOpen,
  onToggle,
  onClose,
  activityLogs = [],
  logs = [],
  report
}) => {
  const handleClose = onClose || onToggle || (() => {});
  const effectiveLogs = activityLogs.length > 0 ? activityLogs : logs;
  const [activeTab, setActiveTab] = useState<'python' | 'sql' | 'logs' | 'api'>('python');
  const [copied, setCopied] = useState(false);

  const pythonCode = `import os, json, glob
import pandas as pd
import numpy as np

# DataPilot AI Sandbox Execution Pipeline
df = pd.read_csv("./workspace/data/dataset.csv")

# Clean & profile dataset
df_clean = df.dropna(thresh=len(df.columns) * 0.5)
df_clean.columns = [c.strip().lower().replace(' ', '_') for c in df_clean.columns]

# Compute statistical aggregations
summary = df_clean.groupby('product_category')['revenue'].agg(['sum', 'mean', 'count'])
summary['margin_pct'] = (summary['sum'] * 0.28) / summary['sum']

print("✓ Pipeline executed successfully")
print(summary.head(10))`;

  const sqlCode = `SELECT 
    product_category,
    COUNT(order_id) AS total_orders,
    SUM(revenue) AS total_revenue,
    AVG(unit_price) AS avg_unit_price,
    ROUND(SUM(revenue) * 0.28, 2) AS estimated_gross_margin
FROM datapilot_sandbox.orders
WHERE transaction_date >= '2026-01-01'
GROUP BY product_category
ORDER BY total_revenue DESC
LIMIT 10;`;

  const activeContent =
    activeTab === 'python'
      ? pythonCode
      : activeTab === 'sql'
        ? sqlCode
        : activeTab === 'logs'
          ? effectiveLogs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.name || ''} - ${l.content || ''}`).join('\n') || '[2026-08-25T05:25:01Z] Pipeline ready.'
          : JSON.stringify(report || { status: 'success', data_points: 1240 }, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-[#14F1D9]/30 bg-[#020617] p-5 text-[#F8FAFC] space-y-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-[#14F1D9] border border-teal-500/30">
            <Code2 className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base text-white">Developer Mode & Execution Inspector</h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                PRO DEBUGGER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Inspect generated Python scripts, SQL statements, and backend logs
            </p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-1.5 rounded-lg border border-white/10 bg-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2">
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setActiveTab('python')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'python' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="h-3.5 w-3.5" /> Python Code
              </button>

              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'sql' ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Database className="h-3.5 w-3.5" /> Generated SQL
              </button>

              <button
                onClick={() => setActiveTab('logs')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'logs' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="h-3.5 w-3.5" /> Execution Logs ({activityLogs.length})
              </button>

              <button
                onClick={() => setActiveTab('api')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'api' ? 'bg-slate-800 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5" /> API Response JSON
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs transition cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-teal-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
            </button>
          </div>

          {/* Code Viewer Container */}
          <div className="rounded-xl border border-white/10 bg-slate-950 p-4 font-mono text-xs text-teal-300 max-h-[300px] overflow-auto no-scrollbar">
            <pre className="whitespace-pre-wrap leading-relaxed">{activeContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
