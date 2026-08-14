import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  FileSearch,
} from 'lucide-react';
import type { AnalysisReport, AutopilotFinding, AutopilotNextStep } from '../types';
import { deriveAutopilotSummary } from '../lib/autopilot';

interface AutopilotPanelProps {
  report: AnalysisReport;
  onSendFollowUp: (promptText: string) => void;
  className?: string;
}

export const AutopilotPanel: React.FC<AutopilotPanelProps> = ({
  report,
  onSendFollowUp,
  className = '',
}) => {
  const [explainMode, setExplainMode] = useState<'summary' | 'explain'>('explain');
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);

  const autopilotData = useMemo(() => {
    return deriveAutopilotSummary(report);
  }, [report]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Hero Autopilot Card */}
      <section className="relative overflow-hidden rounded-2xl border border-blue-200/80 bg-gradient-to-br from-neutral-900 via-neutral-900 to-slate-900 p-6 text-white shadow-md">
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 gradient-io" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-io-blue/20 border border-io-blue/40 px-3 py-1 text-xs font-bold text-sky-300">
                <Zap className="h-3.5 w-3.5 fill-sky-300 text-sky-300" />
                DataPilot AI Autopilot
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {autopilotData.rowCountText} dataset
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              Autonomous Investigation Report
            </h2>

            <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
              DataPilot analyzed <span className="font-semibold text-white">{autopilotData.datasetName}</span> autonomously — discovering key trends, isolating root causes with evidence, and generating targeted follow-up questions.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex shrink-0 items-center bg-neutral-800/80 p-1 rounded-xl border border-neutral-700/80 self-start md:self-center">
            <button
              onClick={() => setExplainMode('explain')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                explainMode === 'explain'
                  ? 'bg-io-blue text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explain Every Insight</span>
            </button>
            <button
              onClick={() => setExplainMode('summary')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                explainMode === 'summary'
                  ? 'bg-io-blue text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Executive Findings</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats pill row */}
        <div className="mt-6 pt-4 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 block font-medium">Discovered Findings</span>
            <span className="text-lg font-bold text-white font-sans">
              {autopilotData.findings.length} Key Insights
            </span>
          </div>
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 block font-medium">Avg Confidence</span>
            <span className="text-lg font-bold text-emerald-400 font-sans">
              {Math.round(
                autopilotData.findings.reduce((acc, f) => acc + f.confidence, 0) /
                  (autopilotData.findings.length || 1)
              )}%
            </span>
          </div>
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 block font-medium">Analysis Status</span>
            <span className="text-lg font-bold text-sky-300 font-sans flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Complete
            </span>
          </div>
          <div className="bg-neutral-800/50 p-3 rounded-xl border border-neutral-700/50">
            <span className="text-neutral-400 block font-medium">Follow-Up Prompts</span>
            <span className="text-lg font-bold text-amber-300 font-sans">
              {autopilotData.nextSteps.length} Ready
            </span>
          </div>
        </div>
      </section>

      {/* Mode 1: 🔥 Explain Every Insight Mode */}
      {explainMode === 'explain' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100 text-io-blue font-bold text-xs">
                🔥
              </span>
              <h3 className="text-base font-bold text-neutral-900 font-sans">
                Explain Every Insight (Causal Root-Cause & Evidence)
              </h3>
            </div>
            <span className="text-xs text-neutral-500 hidden sm:inline-block">
              Click "Investigate" on any finding to trigger targeted analysis
            </span>
          </div>

          <div className="grid gap-4">
            {autopilotData.findings.map((finding, idx) => {
              const isExpanded = expandedFindingId === finding.id || expandedFindingId === null;
              return (
                <div
                  key={finding.id}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-xs transition hover:border-neutral-300 space-y-4"
                >
                  {/* Finding Title Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-white font-extrabold text-xs">
                        {idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-neutral-900">
                          {finding.title}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {finding.detail}
                        </p>
                      </div>
                    </div>

                    {/* Confidence Score Pill */}
                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Confidence
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-emerald-600 font-mono">
                            {finding.confidence}%
                          </span>
                          <div className="h-1.5 w-12 rounded-full bg-neutral-100 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${finding.confidence}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onSendFollowUp(finding.investigatePrompt)}
                        className="flex items-center gap-1.5 rounded-xl bg-io-blue px-3.5 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-blue-600 cursor-pointer"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Causal Breakdown Grid (Why, Evidence, Action) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-neutral-100 text-xs">
                    {/* Why? Box */}
                    <div className="rounded-xl bg-amber-50/60 border border-amber-200/60 p-3.5 space-y-1">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <HelpCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        Why? (Root Cause)
                      </span>
                      <p className="text-neutral-700 leading-relaxed font-medium">
                        {finding.why}
                      </p>
                    </div>

                    {/* Evidence Box */}
                    <div className="rounded-xl bg-blue-50/60 border border-blue-200/60 p-3.5 space-y-1">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-io-blue shrink-0" />
                        Evidence (Data Proof)
                      </span>
                      <p className="text-neutral-700 leading-relaxed font-medium">
                        {finding.evidence}
                      </p>
                    </div>

                    {/* Recommended Action Box */}
                    <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/60 p-3.5 space-y-1">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <Lightbulb className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        Recommended Action
                      </span>
                      <p className="text-neutral-700 leading-relaxed font-medium">
                        {finding.recommendedAction}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Mode 2: Executive Findings Summary */}
      {explainMode === 'summary' && (
        <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-io-blue" />
            <h3 className="text-base font-bold text-neutral-900 font-sans">
              🔎 Discovered Key Findings
            </h3>
          </div>

          <div className="divide-y divide-neutral-100">
            {autopilotData.findings.map((f, i) => (
              <div key={f.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-io-blue shrink-0" />
                    <span className="font-bold text-sm text-neutral-900">{f.title}</span>
                    <span className="text-[11px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                      {f.confidence}% Conf.
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 pl-4">{f.detail}</p>
                </div>

                <button
                  onClick={() => onSendFollowUp(f.investigatePrompt)}
                  className="shrink-0 text-xs text-io-blue hover:underline font-semibold flex items-center gap-1 cursor-pointer pt-0.5"
                >
                  <span>Investigate</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 🎯 Recommended Next Steps Section */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-purple-100 text-purple-700 font-bold text-xs">
              🎯
            </span>
            <h3 className="text-base font-bold text-neutral-900 font-sans">
              Recommended Next Investigations
            </h3>
          </div>
          <span className="text-xs text-neutral-500">1-click autonomous execution</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {autopilotData.nextSteps.map((step, i) => (
            <div
              key={step.id}
              className="flex flex-col justify-between p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-neutral-50 hover:border-io-blue/40 transition group space-y-3"
            >
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-500 uppercase font-mono">
                  <span>Option {i + 1}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-neutral-900 group-hover:text-io-blue transition">
                  {step.title}
                </p>
              </div>

              <button
                onClick={() => onSendFollowUp(step.prompt)}
                className="flex items-center justify-between w-full pt-2 border-t border-neutral-200/60 text-xs font-bold text-io-blue hover:text-blue-700 transition cursor-pointer"
              >
                <span>Investigate this topic</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
