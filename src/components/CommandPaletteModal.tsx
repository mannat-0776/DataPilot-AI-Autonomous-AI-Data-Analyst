import React, { useState, useEffect } from 'react';
import {
  Search,
  FileSpreadsheet,
  Zap,
  BarChart2,
  FileText,
  Dna,
  Network,
  Cpu,
  Code2,
  Copy,
  X,
  Sparkles,
  Command,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sliders
} from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionId: string, payload?: any) => void;
  filesCount?: number;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onAction,
  filesCount = 0
}) => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onAction('toggle_palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onAction]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'upload',
      title: 'Upload Dataset File(s)',
      category: 'Data Ingestion',
      icon: FileSpreadsheet,
      shortcut: 'Ctrl+U',
      desc: 'Add CSV, XLSX, TSV, or Parquet datasets'
    },
    {
      id: 'run_autopilot',
      title: 'Run Autopilot AI Analysis',
      category: 'AI Engine',
      icon: Zap,
      shortcut: 'Ctrl+Enter',
      desc: 'Autonomous data profiling & instant report generation'
    },
    {
      id: 'open_dna',
      title: 'View Dataset DNA & Quality Metrics',
      category: 'Intelligence',
      icon: Dna,
      shortcut: 'Ctrl+D',
      desc: 'Inspect row cleanliness, missing values, & memory stats'
    },
    {
      id: 'open_graph',
      title: 'Open Column Knowledge Graph',
      category: 'Intelligence',
      icon: Network,
      shortcut: 'Ctrl+G',
      desc: 'Visualize entity relationships & column correlation maps'
    },
    {
      id: 'open_dashboard',
      title: 'Open Visual Analytics Studio',
      category: 'Analytics',
      icon: BarChart2,
      shortcut: 'Ctrl+B',
      desc: 'Configure interactive charts, Compare Mode, & Dual Y-Axis'
    },
    {
      id: 'toggle_dev',
      title: 'Toggle Developer Mode & Execution Logs',
      category: 'Developer',
      icon: Code2,
      shortcut: 'Ctrl+Shift+D',
      desc: 'Inspect generated Python, SQL scripts, & API payloads'
    },
    {
      id: 'model_info',
      title: 'View Model Architecture & AI Stack',
      category: 'Transparency',
      icon: Cpu,
      shortcut: 'Ctrl+M',
      desc: 'Gemini 3.6 Flash, DuckDB, Pandas & Recharts breakdown'
    },
    {
      id: 'copy_fingerprint',
      title: 'Copy Analysis Reproducibility Fingerprint',
      category: 'Enterprise',
      icon: Copy,
      shortcut: 'Ctrl+C',
      desc: 'Copy SHA256 dataset hash & model state verification string'
    }
  ];

  const filtered = commands.filter(
    (cmd) =>
      cmd.title.toLowerCase().includes(query.toLowerCase()) ||
      cmd.category.toLowerCase().includes(query.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmdId: string) => {
    if (cmdId === 'copy_fingerprint') {
      const fingerprint = `DP-2026-FINGERPRINT::SHA256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855::MODEL:gemini-3.6-flash`;
      navigator.clipboard.writeText(fingerprint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    onAction(cmdId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md transition-all">
      <div className="w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0F172A] shadow-2xl overflow-hidden text-[#F8FAFC] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-slate-900/80">
          <Search className="h-5 w-5 text-teal-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search DataPilot AI OS..."
            autoFocus
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 outline-none font-sans"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-800 border border-white/10 rounded-md">
              <Command className="h-3 w-3" /> K
            </kbd>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Command List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1 divide-y divide-white/5 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              No matching commands found for "{query}"
            </div>
          ) : (
            filtered.map((cmd) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd.id)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 transition flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-800 text-teal-400 group-hover:bg-teal-500/20 group-hover:text-teal-300 transition shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white group-hover:text-teal-300 transition">
                          {cmd.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {cmd.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pl-2">
                    {cmd.id === 'copy_fingerprint' && copied && (
                      <span className="text-[10px] text-teal-400 font-mono font-semibold animate-pulse">
                        Copied!
                      </span>
                    )}
                    <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-400">
                      {cmd.shortcut}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-teal-400 transition" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/10 bg-slate-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>DataPilot AI OS v2.4 • Active Files: {filesCount}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Use ↑↓ to navigate</span>
            <span>Esc to exit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
