import React from 'react';
import { Sparkles, TrendingUp, ShieldAlert, Users, Package, ArrowRight, Zap } from 'lucide-react';

interface SmartRecommendationsListProps {
  onSelectRecommendation: (prompt: string) => void;
  disabled?: boolean;
}

export const SmartRecommendationsList: React.FC<SmartRecommendationsListProps> = ({
  onSelectRecommendation,
  disabled
}) => {
  const recommendations = [
    {
      title: '📈 Create Sales Forecast',
      prompt: 'Generate a 12-month predictive sales forecast with confidence intervals and revenue trend projections.',
      category: 'Predictive Analytics'
    },
    {
      title: '🛡️ Detect Fraud & Anomalies',
      prompt: 'Execute z-score anomaly detection across transactions to identify suspicious outlier records and pricing spikes.',
      category: 'Risk & Audit'
    },
    {
      title: '📉 Predict Churn Risk',
      prompt: 'Analyze customer retention cohorts to pinpoint early warning indicators for subscription churn.',
      category: 'Customer Intelligence'
    },
    {
      title: '🎯 Segment Customers',
      prompt: 'Run K-Means clustering on order frequency and average monetary value to create high-value RFM segments.',
      category: 'Segmentation'
    },
    {
      title: '📦 Optimize Inventory Levels',
      prompt: 'Identify top fast-moving SKUs vs stockout risks to recommend optimal inventory reorder points.',
      category: 'Operations'
    }
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 space-y-3 text-[#F8FAFC]">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-teal-400" />
          <h4 className="font-heading font-bold text-sm text-white">
            AI Smart Next Actions & Recommendations
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Click any action to run
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {recommendations.map((rec, idx) => (
          <button
            key={idx}
            disabled={disabled}
            onClick={() => onSelectRecommendation(rec.prompt)}
            className="p-3 rounded-xl border border-white/10 bg-slate-800/80 hover:bg-slate-800 hover:border-teal-400/50 text-left transition group cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed space-y-2 flex flex-col justify-between"
          >
            <div>
              <div className="text-[9px] font-mono font-bold text-teal-300 uppercase tracking-wider">
                {rec.category}
              </div>
              <div className="font-semibold text-xs text-white group-hover:text-teal-300 transition mt-1">
                {rec.title}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/5 font-mono">
              <span>Launch</span>
              <ArrowRight className="h-3 w-3 text-slate-400 group-hover:text-teal-400 group-hover:translate-x-0.5 transition" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
