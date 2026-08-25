import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  Table,
  Calendar,
  Hash,
  Tag,
  ShieldCheck,
  FileSpreadsheet,
  X,
} from 'lucide-react';
import type { UploadedFile } from '../types';
import { validateCsvContent, CsvValidationResult } from '../utils/csvValidator';

interface CsvValidationCardProps {
  files: UploadedFile[];
}

export const CsvValidationCard: React.FC<CsvValidationCardProps> = ({ files }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFileForModal, setSelectedFileForModal] = useState<CsvValidationResult | null>(null);

  // Validate all uploaded files that have text content
  const validationResults = useMemo<CsvValidationResult[]>(() => {
    return files
      .filter((f) => f.content && f.content.trim().length > 0)
      .map((f) => validateCsvContent(f.name, f.content || ''));
  }, [files]);

  if (files.length === 0 || validationResults.length === 0) {
    return null;
  }

  // Collect all issues across all files
  const allIssues = validationResults.flatMap((r) =>
    r.issues.map((issue) => ({ ...issue, fileName: r.fileName }))
  );

  const warnings = allIssues.filter((i) => i.severity === 'warning');
  const infoNotices = allIssues.filter((i) => i.severity === 'info');

  const hasWarnings = warnings.length > 0;
  const hasInfo = infoNotices.length > 0;

  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-xs transition-all">
      {/* Card Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center justify-between p-4 cursor-pointer select-none transition ${
          hasWarnings
            ? 'bg-amber-50/60 hover:bg-amber-50 border-b border-amber-200/60'
            : 'bg-emerald-50/50 hover:bg-emerald-50/80 border-b border-emerald-100'
        }`}
      >
        <div className="flex items-center gap-3">
          {hasWarnings ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <AlertTriangle className="h-4.5 w-4.5" />
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold tracking-tight text-neutral-900">
                {hasWarnings
                  ? 'CSV Schema Validation Warning'
                  : 'CSV Schema Validation Passed'}
              </h4>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  hasWarnings
                    ? 'bg-amber-200 text-amber-800'
                    : 'bg-emerald-200 text-emerald-800'
                }`}
              >
                {validationResults.length} {validationResults.length === 1 ? 'Dataset' : 'Datasets'} Scanned
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              {hasWarnings
                ? 'Mandatory column types (e.g. numeric metrics or dates) appear to be missing for common analysis patterns.'
                : 'Mandatory data types (Numeric metrics & Date/Time fields) were successfully verified.'}
            </p>
          </div>
        </div>

        <button className="p-1 rounded-lg hover:bg-black/5 text-neutral-500 transition">
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Expanded Content Body */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-xs">
          {/* Issue Alert Banners */}
          {allIssues.length > 0 && (
            <div className="space-y-2">
              {warnings.map((issue, idx) => (
                <div
                  key={`warn-${idx}`}
                  className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-amber-900"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-amber-950">
                      {issue.title} in <span className="underline font-mono">{issue.fileName}</span>
                    </p>
                    <p className="text-[11px] text-amber-900 leading-relaxed">{issue.message}</p>
                    <p className="text-[11px] text-amber-800/90 font-medium italic">
                      💡 {issue.suggestion}
                    </p>
                  </div>
                </div>
              ))}

              {infoNotices.map((issue, idx) => (
                <div
                  key={`info-${idx}`}
                  className="flex items-start gap-2.5 rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-blue-900"
                >
                  <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs text-blue-950">
                      {issue.title} in <span className="underline font-mono">{issue.fileName}</span>
                    </p>
                    <p className="text-[11px] text-blue-900 leading-relaxed">{issue.message}</p>
                    <p className="text-[11px] text-blue-800/90 font-medium italic">
                      💡 {issue.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Column Type Breakdown per File */}
          <div className="space-y-3">
            <h5 className="font-bold text-neutral-800 flex items-center justify-between text-xs">
              <span>Detected Column Types by File</span>
              <span className="text-[10px] text-neutral-400 font-normal">
                Click a file to inspect raw CSV headers
              </span>
            </h5>

            <div className="space-y-2.5">
              {validationResults.map((result) => (
                <div
                  key={result.fileName}
                  className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-3 space-y-2 transition hover:border-neutral-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-io-blue" />
                      <span className="font-bold text-neutral-900 font-mono text-xs">
                        {result.fileName}
                      </span>
                      <span className="text-[10px] text-neutral-500 bg-neutral-200/80 px-2 py-0.5 rounded-md font-mono">
                        {result.headers.length} Columns • ~{result.totalRows} Rows
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedFileForModal(result)}
                      className="text-[11px] text-io-blue hover:underline font-medium flex items-center gap-1 cursor-pointer"
                    >
                      <Table className="h-3 w-3" />
                      Inspect Schema
                    </button>
                  </div>

                  {/* Badges for detected types */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {/* Date columns */}
                    <div className="flex items-center gap-1.5 rounded-lg bg-blue-100/70 border border-blue-200 px-2.5 py-1 text-blue-900 font-medium">
                      <Calendar className="h-3 w-3 text-blue-600" />
                      <span>
                        Dates ({result.dateColumns.length}):
                      </span>
                      <span className="font-mono text-blue-950 font-bold">
                        {result.dateColumns.length > 0
                          ? result.dateColumns.join(', ')
                          : 'None detected'}
                      </span>
                    </div>

                    {/* Numeric columns */}
                    <div className="flex items-center gap-1.5 rounded-lg bg-emerald-100/70 border border-emerald-200 px-2.5 py-1 text-emerald-900 font-medium">
                      <Hash className="h-3 w-3 text-emerald-600" />
                      <span>
                        Numeric Metrics ({result.numericColumns.length}):
                      </span>
                      <span className="font-mono text-emerald-950 font-bold truncate max-w-[200px]">
                        {result.numericColumns.length > 0
                          ? result.numericColumns.join(', ')
                          : 'None detected'}
                      </span>
                    </div>

                    {/* Categorical columns */}
                    <div className="flex items-center gap-1.5 rounded-lg bg-purple-100/70 border border-purple-200 px-2.5 py-1 text-purple-900 font-medium">
                      <Tag className="h-3 w-3 text-purple-600" />
                      <span>
                        Categoricals ({result.categoricalColumns.length}):
                      </span>
                      <span className="font-mono text-purple-950 font-bold truncate max-w-[200px]">
                        {result.categoricalColumns.length > 0
                          ? result.categoricalColumns.join(', ')
                          : 'None detected'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Column Schema Inspector Modal */}
      {selectedFileForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4 bg-neutral-50/50">
              <div className="flex items-center gap-2.5">
                <Table className="h-5 w-5 text-io-blue" />
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    CSV Header & Schema Inspection
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono">
                    {selectedFileForModal.fileName} ({selectedFileForModal.headers.length} columns)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFileForModal(null)}
                className="p-1 rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Table Content */}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="rounded-xl border border-neutral-200 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Column Header</th>
                      <th className="p-3">Inferred Data Type</th>
                      <th className="p-3">Sample Row Values</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {selectedFileForModal.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="p-3 text-neutral-400 font-mono text-[11px]">{idx + 1}</td>
                        <td className="p-3 font-bold font-mono text-neutral-900">{col.name}</td>
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              col.inferredType === 'numeric'
                                ? 'bg-emerald-100 text-emerald-800'
                                : col.inferredType === 'date'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {col.inferredType === 'numeric' && <Hash className="h-3 w-3" />}
                            {col.inferredType === 'date' && <Calendar className="h-3 w-3" />}
                            {col.inferredType === 'categorical' && <Tag className="h-3 w-3" />}
                            {col.inferredType}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-600 font-mono text-[11px]">
                          {col.sampleValues.length > 0 ? (
                            col.sampleValues.join(', ')
                          ) : (
                            <span className="italic text-neutral-400">Empty or null</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-neutral-100 px-6 py-3 bg-neutral-50/50 flex justify-end">
              <button
                onClick={() => setSelectedFileForModal(null)}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-bold text-white hover:bg-neutral-800 transition cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
