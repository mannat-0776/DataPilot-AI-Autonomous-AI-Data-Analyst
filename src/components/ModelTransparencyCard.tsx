import React from 'react';
import { Cpu, Database, Code2, Layers, ShieldCheck, Terminal, Server } from 'lucide-react';

export const ModelTransparencyCard: React.FC = () => {
  const stackItems = [
    {
      layer: 'LLM Engine',
      tech: 'Gemini 3.6 Flash (Server Proxy)',
      desc: 'High-throughput reasoning engine with zero client key exposure.',
      color: 'border-blue-500/30 text-blue-400'
    },
    {
      layer: 'Data Processing',
      tech: 'Python Pandas & DuckDB Sandbox',
      desc: 'Isolated execution sandbox for dataset profiling and transformations.',
      color: 'border-purple-500/30 text-purple-400'
    },
    {
      layer: 'SQL & Query Engine',
      tech: 'Autonomous SQL Compiler',
      desc: 'Translates natural language into optimized analytical SQL queries.',
      color: 'border-teal-500/30 text-teal-400'
    },
    {
      layer: 'Visualization Engine',
      tech: 'Recharts 2.x + D3.js Overlays',
      desc: 'Dual-series comparative charts with moving average & linear regressions.',
      color: 'border-blue-500/30 text-blue-400'
    },
    {
      layer: 'Report Generator',
      tech: 'DataPilot Autonomous Pipeline',
      desc: 'Structured JSON report synthesis with executive anomaly auditing.',
      color: 'border-purple-500/30 text-purple-400'
    }
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl p-5 shadow-2xl text-[#F8FAFC] space-y-4">
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-lg shadow-blue-500/20">
          <Server className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-base text-white">
            Model Transparency & AI Architecture Stack
          </h3>
          <p className="text-xs text-slate-400">
            Open & inspectable runtime architecture powering DataPilot AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {stackItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border bg-slate-900/60 space-y-2 ${item.color}`}
          >
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">
              0{idx + 1} / {item.layer}
            </span>
            <div className="font-bold text-xs text-white font-heading">{item.tech}</div>
            <p className="text-[10px] text-slate-400 leading-normal">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
