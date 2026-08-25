import React, { useState } from 'react';
import {
  Sparkles,
  Github,
  Play,
  FileSpreadsheet,
  Wand2,
  Database,
  BarChart2,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Code2,
  Layers,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface DataPilotHeroProps {
  onStartDemo: () => void;
}

export const DataPilotHero: React.FC<DataPilotHeroProps> = ({ onStartDemo }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does DataPilot AI analyze my datasets?",
      a: "DataPilot AI executes an autonomous multi-step Python & Pandas pipeline in a secure sandbox to clean data, run statistical profiling, build interactive Recharts/D3 dashboards, and generate executive summaries with anomaly detection."
    },
    {
      q: "What file formats are supported?",
      a: "DataPilot AI natively supports CSV, Excel (.xlsx, .xls), TSV, JSON, and Parquet files with automatic base64 binary decoding."
    },
    {
      q: "Is DataPilot AI open source?",
      a: "Yes! DataPilot AI is built developer-first with open-source integrations, allowing local execution, custom agent prompts, and self-hosted deployments."
    },
    {
      q: "Can I customize the generated charts and dashboards?",
      a: "Absolutely. Our built-in Interactive Visual Analytics Studio lets you switch between 6 chart types (Bar, Line, Area, Pie, Scatter, Radar), toggle comparative dual Y-axes, adjust color themes, and export insights."
    }
  ];

  return (
    <div className="relative overflow-hidden text-[#F8FAFC]">
      {/* 3D Cyberpunk Aurora & Grid Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-400/20 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 blur-[100px] rounded-full" />
        <div className="absolute top-[60%] right-[-10%] w-[500px] h-[500px] bg-teal-500/15 blur-[100px] rounded-full" />
        {/* Animated Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-24">
        {/* Header / Navbar */}
        <header className="flex items-center justify-between py-4 px-6 rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 text-white shadow-lg shadow-blue-500/25">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                DataPilot <span className="text-[#14F1D9] text-xs px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/30">AI</span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#workflow" className="hover:text-white transition">Workflow</a>
            <a href="#open-source" className="hover:text-white transition">Open Source</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-white/10 bg-slate-800/60 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition"
            >
              <Github className="h-4 w-4" />
              <span>Star on GitHub</span>
            </a>
            <button
              onClick={onStartDemo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Launch App</span>
            </button>
          </div>
        </header>

        {/* HERO SECTION */}
        <section className="text-center max-w-4xl mx-auto space-y-8 pt-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 text-xs font-semibold text-[#14F1D9] shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Autonomous AI Data Analyst • 2026 Developer Release</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-bold text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
            Analyze Data.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-300 bg-clip-text text-transparent">
              Not Spreadsheets.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            An autonomous AI agent that cleans data, generates visualizations, detects anomalies, and delivers business insights in seconds.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={onStartDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-500/25 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="h-4 w-4 fill-current" />
              <span>Live Demo & Analysis</span>
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/15 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold text-sm transition flex items-center justify-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
            </a>
          </div>

          {/* Live Preview Pill Card / Tech Floating Sphere Tag */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-teal-400" /> Multi-File CSV & Excel Support</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-blue-400" /> Interactive Recharts & D3</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-purple-400" /> Dual-Series Compare Mode</span>
          </div>
        </section>

        {/* TRUSTED BY DEVELOPERS */}
        <section className="border-y border-white/10 py-8 bg-slate-900/40 rounded-2xl backdrop-blur-xs">
          <p className="text-center text-xs font-mono font-semibold uppercase tracking-widest text-slate-400 mb-6">
            Engineered for Developers & Modern Analytics Stacks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-mono text-sm">
            <span className="flex items-center gap-2 hover:text-white transition"><Terminal className="h-4 w-4 text-blue-400" /> Python Pandas</span>
            <span className="flex items-center gap-2 hover:text-white transition"><Code2 className="h-4 w-4 text-teal-400" /> TypeScript / React</span>
            <span className="flex items-center gap-2 hover:text-white transition"><Layers className="h-4 w-4 text-purple-400" /> Recharts & D3.js</span>
            <span className="flex items-center gap-2 hover:text-white transition"><Cpu className="h-4 w-4 text-blue-400" /> Gemini Agent Sandbox</span>
            <span className="flex items-center gap-2 hover:text-white transition"><Database className="h-4 w-4 text-teal-400" /> Open Source Core</span>
          </div>
        </section>

        {/* BENTO FEATURE GRID */}
        <section id="features" className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white">
              Autonomous Analytics Infrastructure
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Everything you need to automate dataset parsing, SQL generation, anomaly detection, and interactive dashboard creation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Upload CSV */}
            <div className="md:col-span-1 rounded-2xl border border-white/10 bg-[#0F172A]/70 p-6 backdrop-blur-md hover:border-blue-500/40 transition group space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit group-hover:scale-110 transition">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">Upload CSV & Excel</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Seamless drag-and-drop ingestion for CSV, XLSX, TSV, Parquet, and JSON datasets with automated binary restorer encoding.
              </p>
            </div>

            {/* Card 2: AI Data Cleaning */}
            <div className="md:col-span-1 rounded-2xl border border-white/10 bg-[#0F172A]/70 p-6 backdrop-blur-md hover:border-purple-500/40 transition group space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit group-hover:scale-110 transition">
                <Wand2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">AI Data Cleaning</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Autonomous detection of missing values, duplicate records, inconsistent types, and outliers before model execution.
              </p>
            </div>

            {/* Card 3: Smart SQL Generation */}
            <div className="md:col-span-1 rounded-2xl border border-white/10 bg-[#0F172A]/70 p-6 backdrop-blur-md hover:border-teal-500/40 transition group space-y-4">
              <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 w-fit group-hover:scale-110 transition">
                <Database className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">Smart SQL Generation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Converts natural language questions into optimized Python & Pandas query scripts and DuckDB / SQLite SQL queries.
              </p>
            </div>

            {/* Card 4: Interactive Dashboards */}
            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#0F172A]/70 p-6 backdrop-blur-md hover:border-blue-500/40 transition group space-y-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 w-fit group-hover:scale-110 transition">
                <BarChart2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">Interactive Visual Dashboards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Customize 6 chart archetypes (Bar, Line, Area, Pie, Scatter, Radar) with Compare Mode, Dual Y-Axis scaling, D3 regression overlays, and custom palette themes.
              </p>
            </div>

            {/* Card 5: Anomaly Detection */}
            <div className="md:col-span-1 rounded-2xl border border-white/10 bg-[#0F172A]/70 p-6 backdrop-blur-md hover:border-purple-500/40 transition group space-y-4">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 w-fit group-hover:scale-110 transition">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-xl text-white">Anomaly Detection</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automated statistical z-score outlier detection and variance alerting directly in report summaries.
              </p>
            </div>
          </div>
        </section>

        {/* AI WORKFLOW ANIMATION */}
        <section id="workflow" className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 sm:p-12 backdrop-blur-xl relative space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-teal-400 uppercase tracking-wider font-bold">End-to-End Pipeline</span>
            <h2 className="font-heading font-bold text-3xl text-white">How DataPilot AI Operates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="p-5 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
              <div className="text-xs font-mono text-blue-400 font-bold">01 / INGESTION</div>
              <h4 className="font-bold text-white text-base">Raw Data Upload</h4>
              <p className="text-xs text-slate-400">Drag & drop CSV/XLSX files. Restorer script decodes base64 binaries instantly.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
              <div className="text-xs font-mono text-purple-400 font-bold">02 / SANDBOX</div>
              <h4 className="font-bold text-white text-base">Python Agent Sandbox</h4>
              <p className="text-xs text-slate-400">Gemini agent profiles columns, cleans nulls, and executes Pandas analysis.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
              <div className="text-xs font-mono text-teal-400 font-bold">03 / VISUALIZATION</div>
              <h4 className="font-bold text-white text-base">Multi-Chart Dashboard</h4>
              <p className="text-xs text-slate-400">Generates high-resolution chart images + interactive Recharts/D3 controls.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/60 border border-white/5 space-y-3">
              <div className="text-xs font-mono text-blue-400 font-bold">04 / REPORTING</div>
              <h4 className="font-bold text-white text-base">Executive Delivery</h4>
              <p className="text-xs text-slate-400">Outputs key metrics, structured findings, risk flags, and download options.</p>
            </div>
          </div>
        </section>

        {/* GITHUB OPEN SOURCE & FAQ */}
        <section id="faq" className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Open Source Pitch */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-400">
              <Github className="h-3.5 w-3.5" />
              <span>Developer First & Open Source</span>
            </div>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white leading-tight">
              Built for Developers. Powered by AI Agents.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              DataPilot AI combines the speed of Python data science scripts with an interactive web UI. Run it locally, customize prompt instructions, or connect your own data pipelines.
            </p>

            <div className="p-5 rounded-2xl bg-slate-900 border border-white/10 font-mono text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-slate-500 border-b border-white/10 pb-2">
                <span>Terminal</span>
                <span>Bash</span>
              </div>
              <p className="text-teal-400">$ git clone https://github.com/datapilot-ai/datapilot.git</p>
              <p className="text-slate-400">$ cd datapilot && npm install && npm run dev</p>
              <p className="text-blue-400">✓ DataPilot AI initialized on http://localhost:3000</p>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition flex items-center gap-2"
              >
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </a>
            </div>
          </div>

          {/* Right: FAQ Accordion */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-2xl text-white mb-6">Frequently Asked Questions</h3>
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 bg-[#0F172A]/80 overflow-hidden transition">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-white hover:text-teal-400 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-4 w-4 text-teal-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 p-[1px] shadow-2xl">
          <div className="rounded-[23px] bg-[#020617] p-8 sm:p-12 text-center space-y-6">
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-white">
              Ready to Autonomous-Analyze Your Data?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
              Upload your CSV or Excel dataset now to generate instant visual dashboards, statistical anomaly detection, and executive reports.
            </p>
            <div className="pt-2">
              <button
                onClick={onStartDemo}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition cursor-pointer inline-flex items-center gap-2"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Launch DataPilot AI Workbench</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
