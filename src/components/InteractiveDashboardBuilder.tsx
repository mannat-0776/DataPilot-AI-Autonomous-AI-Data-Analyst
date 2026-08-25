import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon,
  ScatterChart as ScatterChartIcon, Radar as RadarIcon,
  Palette, Layers, Sparkles, GitCompare, ArrowRightLeft,
  Columns
} from 'lucide-react';
import type { ReportTable, ReportChart } from '../types';

export type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'scatter' | 'radar';

interface InteractiveDashboardBuilderProps {
  tables?: ReportTable[];
  charts?: ReportChart[];
  datasetName?: string;
}

const COLOR_PALETTES = {
  vibrant: ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#06b6d4'],
  ocean: ['#2563eb', '#0284c7', '#0d9488', '#059669', '#3b82f6', '#06b6d4'],
  sunset: ['#f43f5e', '#fb7185', '#f97316', '#eab308', '#a855f7', '#ec4899'],
  emerald: ['#059669', '#10b981', '#14b8a6', '#06b6d4', '#84cc16', '#22c55e'],
};

export const InteractiveDashboardBuilder: React.FC<InteractiveDashboardBuilderProps> = ({
  tables = [],
  charts = [],
  datasetName = 'Dataset',
}) => {
  const [selectedTableIndex, setSelectedTableIndex] = useState<number>(0);
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [selectedPalette, setSelectedPalette] = useState<keyof typeof COLOR_PALETTES>('vibrant');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [selectedXCol, setSelectedXCol] = useState<string>('');
  const [selectedYCol, setSelectedYCol] = useState<string>('');

  // Compare Mode State
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [compareTableIndex, setCompareTableIndex] = useState<number>(0);
  const [compareYCol, setCompareYCol] = useState<string>('');
  const [useDualYAxis, setUseDualYAxis] = useState<boolean>(false);

  const activeTable = tables[selectedTableIndex] || tables[0];
  const compareTable = tables[compareTableIndex] || tables[0];

  // Helper to extract columns & rows
  const getTableInfo = (table?: ReportTable) => {
    if (!table) return { columns: [], rows: [], categoricalCols: [], numericCols: [] };
    const cols = table.columns || [];
    const rws = table.rows || [];
    const cat: string[] = [];
    const num: string[] = [];

    cols.forEach((col, colIdx) => {
      const sampleVals = rws.slice(0, 10).map((r) => r[colIdx]);
      const numericCount = sampleVals.filter((v) => v !== null && v !== '' && !isNaN(Number(v))).length;
      if (numericCount >= sampleVals.length * 0.7) {
        num.push(col);
      } else {
        cat.push(col);
      }
    });

    if (num.length === 0 && cols.length > 1) num.push(cols[cols.length - 1]);
    if (cat.length === 0 && cols.length > 0) cat.push(cols[0]);

    return { columns: cols, rows: rws, categoricalCols: cat, numericCols: num };
  };

  const primaryInfo = useMemo(() => getTableInfo(activeTable), [activeTable]);
  const compareInfo = useMemo(() => getTableInfo(compareTable), [compareTable]);

  // Set default primary axes
  const effectiveXCol = selectedXCol || primaryInfo.categoricalCols[0] || primaryInfo.columns[0] || 'Category';
  const effectiveYCol = selectedYCol || primaryInfo.numericCols[0] || primaryInfo.columns[1] || 'Value';

  // Set default compare axes
  const effectiveCompareYCol =
    compareYCol ||
    compareInfo.numericCols.find((c) => c !== effectiveYCol) ||
    compareInfo.numericCols[0] ||
    compareInfo.columns[1] ||
    'Compare Value';

  const xColIdx = primaryInfo.columns.indexOf(effectiveXCol);
  const yColIdx = primaryInfo.columns.indexOf(effectiveYCol);

  const compareYColIdx = compareInfo.columns.indexOf(effectiveCompareYCol);
  const compareXColIdx = compareInfo.columns.indexOf(effectiveXCol) !== -1
    ? compareInfo.columns.indexOf(effectiveXCol)
    : compareInfo.columns.indexOf(compareInfo.categoricalCols[0]);

  // Format merged data for Recharts (handling Primary + Compare overlay)
  const chartData = useMemo(() => {
    if (!primaryInfo.rows.length || xColIdx === -1 || yColIdx === -1) {
      return [
        { name: 'Segment A', value: 420, compareValue: 310 },
        { name: 'Segment B', value: 680, compareValue: 590 },
        { name: 'Segment C', value: 950, compareValue: 820 },
        { name: 'Segment D', value: 530, compareValue: 610 },
        { name: 'Segment E', value: 810, compareValue: 740 },
      ];
    }

    // Map compare table rows for fast category or row-index lookup
    const compareRowMap = new Map<string, number>();
    if (isCompareMode && compareInfo.rows.length && compareYColIdx !== -1) {
      compareInfo.rows.forEach((row, idx) => {
        const catKey = compareXColIdx !== -1 && row[compareXColIdx] !== null
          ? String(row[compareXColIdx]).trim().toLowerCase()
          : `row_${idx}`;
        const numVal = Number(row[compareYColIdx]);
        if (!isNaN(numVal)) {
          compareRowMap.set(catKey, numVal);
        }
      });
    }

    return primaryInfo.rows.slice(0, 30).map((row, idx) => {
      const rawX = row[xColIdx] !== null ? String(row[xColIdx]) : `Item ${idx + 1}`;
      const rawY = row[yColIdx] !== null ? Number(row[yColIdx]) : 0;

      let compVal: number | undefined = undefined;
      if (isCompareMode) {
        const lookupKey = rawX.trim().toLowerCase();
        if (compareRowMap.has(lookupKey)) {
          compVal = compareRowMap.get(lookupKey);
        } else if (compareInfo.rows[idx] && compareYColIdx !== -1) {
          // Fallback by row index
          const numVal = Number(compareInfo.rows[idx][compareYColIdx]);
          compVal = isNaN(numVal) ? 0 : numVal;
        } else {
          compVal = 0;
        }
      }

      return {
        name: rawX.length > 20 ? rawX.slice(0, 20) + '...' : rawX,
        fullName: rawX,
        value: isNaN(rawY) ? 0 : rawY,
        compareValue: compVal,
        xNum: idx + 1,
      };
    });
  }, [
    primaryInfo.rows,
    xColIdx,
    yColIdx,
    isCompareMode,
    compareInfo.rows,
    compareYColIdx,
    compareXColIdx,
  ]);

  const paletteColors = COLOR_PALETTES[selectedPalette];

  // Series Labels
  const series1Name = isCompareMode
    ? `${activeTable?.title ? activeTable.title.slice(0, 15) + '...' : 'Table 1'}: ${effectiveYCol}`
    : effectiveYCol;

  const series2Name = isCompareMode
    ? `${compareTable?.title ? compareTable.title.slice(0, 15) + '...' : 'Table 2'}: ${effectiveCompareYCol}`
    : effectiveCompareYCol;

  return (
    <div className="space-y-6">
      {/* Dashboard Top Controls */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Sparkles className="h-4 w-4" />
              </span>
              <h3 className="font-bold text-neutral-900 text-lg">Interactive Visual Analytics Studio</h3>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Customize chart types, metrics, dimensions, and overlay comparative series across tables
            </p>
          </div>

          {/* Chart Type Selector Buttons */}
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setChartType('bar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === 'bar' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" /> Bar
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === 'line' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <LineChartIcon className="h-3.5 w-3.5" /> Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === 'area' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Layers className="h-3.5 w-3.5" /> Area
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === 'pie' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <PieChartIcon className="h-3.5 w-3.5" /> Pie / Donut
            </button>
            <button
              onClick={() => setChartType('scatter')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === 'scatter' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <ScatterChartIcon className="h-3.5 w-3.5" /> Scatter
            </button>
            <button
              onClick={() => setChartType('radar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                chartType === 'radar' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <RadarIcon className="h-3.5 w-3.5" /> Radar
            </button>
          </div>
        </div>

        {/* Mode Toggle & Dual Axis Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                isCompareMode
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <GitCompare className="h-3.5 w-3.5" />
              {isCompareMode ? 'Compare Mode Enabled' : 'Enable Compare Mode'}
            </button>
            <span className="text-xs text-neutral-500 hidden sm:inline">
              {isCompareMode
                ? 'Overlay a 2nd metric or table to analyze cross-column trends'
                : 'Click to overlay two data series on a single visualization'}
            </span>
          </div>

          {isCompareMode && (
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 cursor-pointer bg-white px-2.5 py-1 rounded-md border border-neutral-200">
              <input
                type="checkbox"
                checked={useDualYAxis}
                onChange={(e) => setUseDualYAxis(e.target.checked)}
                className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
              />
              Dual Y-Axis Scaling
            </label>
          )}
        </div>

        {/* Data Mapping Controls (Primary + Compare Series) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Primary Table Source */}
          {tables.length > 0 && (
            <div>
              <label className="block font-semibold text-neutral-700 mb-1">
                {isCompareMode ? 'Primary Table Source' : 'Data Source Table'}
              </label>
              <select
                value={selectedTableIndex}
                onChange={(e) => setSelectedTableIndex(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-neutral-300 bg-neutral-50 focus:bg-white text-neutral-800 outline-none"
              >
                {tables.map((t, idx) => (
                  <option key={idx} value={idx}>
                    {t.title || `Table ${idx + 1}`} ({t.rows.length} rows)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* X Axis Dimension */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Dimension (X Axis)</label>
            <select
              value={effectiveXCol}
              onChange={(e) => setSelectedXCol(e.target.value)}
              className="w-full p-2 rounded-lg border border-neutral-300 bg-neutral-50 focus:bg-white text-neutral-800 outline-none"
            >
              {primaryInfo.columns.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Y Axis Metric */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">
              {isCompareMode ? 'Primary Series 1 Metric' : 'Metric Column (Y Axis)'}
            </label>
            <select
              value={effectiveYCol}
              onChange={(e) => setSelectedYCol(e.target.value)}
              className="w-full p-2 rounded-lg border border-neutral-300 bg-neutral-50 focus:bg-white text-neutral-800 outline-none"
            >
              {primaryInfo.columns.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          {/* Color Theme */}
          <div>
            <label className="block font-semibold text-neutral-700 mb-1 flex items-center gap-1">
              <Palette className="h-3 w-3 text-neutral-500" /> Color Theme
            </label>
            <select
              value={selectedPalette}
              onChange={(e) => setSelectedPalette(e.target.value as any)}
              className="w-full p-2 rounded-lg border border-neutral-300 bg-neutral-50 focus:bg-white text-neutral-800 outline-none uppercase font-mono text-[11px]"
            >
              <option value="vibrant">Vibrant Indigo / Pink</option>
              <option value="ocean">Ocean Blue / Teal</option>
              <option value="sunset">Sunset Orange / Purple</option>
              <option value="emerald">Emerald Green / Cyan</option>
            </select>
          </div>
        </div>

        {/* Secondary Series Controls when Compare Mode is active */}
        {isCompareMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
            <div>
              <label className="block font-semibold text-indigo-950 mb-1 flex items-center gap-1">
                <Columns className="h-3 w-3 text-indigo-600" /> Comparative Series 2 Table
              </label>
              <select
                value={compareTableIndex}
                onChange={(e) => setCompareTableIndex(Number(e.target.value))}
                className="w-full p-2 rounded-lg border border-indigo-200 bg-white text-neutral-800 outline-none"
              >
                {tables.map((t, idx) => (
                  <option key={idx} value={idx}>
                    {t.title || `Table ${idx + 1}`} ({t.rows.length} rows)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-indigo-950 mb-1 flex items-center gap-1">
                <ArrowRightLeft className="h-3 w-3 text-indigo-600" /> Comparative Series 2 Metric
              </label>
              <select
                value={effectiveCompareYCol}
                onChange={(e) => setCompareYCol(e.target.value)}
                className="w-full p-2 rounded-lg border border-indigo-200 bg-white text-neutral-800 outline-none"
              >
                {compareInfo.columns.map((col, idx) => (
                  <option key={idx} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end pb-1">
              <span className="text-[11px] text-indigo-700 italic">
                Data series mapped automatically by category label / row index alignment.
              </span>
            </div>
          </div>
        )}

        {/* Display Toggles */}
        <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-neutral-100">
          <label className="flex items-center gap-1.5 font-medium text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
            />
            Show Grid Lines
          </label>
          <label className="flex items-center gap-1.5 font-medium text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
              className="rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
            />
            Show Legend
          </label>
        </div>
      </div>

      {/* Primary Chart Viewport Canvas */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm relative">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-neutral-900 text-base flex items-center gap-2">
              {isCompareMode ? (
                <>
                  <span>{series1Name}</span>
                  <span className="text-neutral-400 font-normal">vs</span>
                  <span className="text-pink-600">{series2Name}</span>
                </>
              ) : (
                activeTable?.title || `${effectiveYCol} by ${effectiveXCol}`
              )}
            </h4>
            <p className="text-xs text-neutral-500 mt-0.5">
              Visualizing top {chartData.length} records • {isCompareMode ? 'Comparative Overlay Enabled' : `Metric: ${effectiveYCol}`}
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-bold text-neutral-600 uppercase tracking-wider font-mono">
            {chartType} {isCompareMode ? 'compare' : 'chart'}
          </span>
        </div>

        <div className="w-full h-[380px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-25} textAnchor="end" />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                {isCompareMode && useDualYAxis && (
                  <YAxis yAxisId="right" orientation="right" stroke="#ec4899" fontSize={11} />
                )}
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                  formatter={(val: any, name: any) => [val?.toLocaleString() ?? 0, name]}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
                <Bar yAxisId="left" dataKey="value" name={series1Name} fill={paletteColors[0]} radius={[6, 6, 0, 0]}>
                  {!isCompareMode && chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={paletteColors[index % paletteColors.length]} />
                  ))}
                </Bar>
                {isCompareMode && (
                  <Bar
                    yAxisId={useDualYAxis ? 'right' : 'left'}
                    dataKey="compareValue"
                    name={series2Name}
                    fill={paletteColors[1] || '#ec4899'}
                    radius={[6, 6, 0, 0]}
                  />
                )}
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-25} textAnchor="end" />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                {isCompareMode && useDualYAxis && (
                  <YAxis yAxisId="right" orientation="right" stroke="#ec4899" fontSize={11} />
                )}
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="value"
                  name={series1Name}
                  stroke={paletteColors[0]}
                  strokeWidth={3}
                  dot={{ r: 4, fill: paletteColors[0] }}
                  activeDot={{ r: 7 }}
                />
                {isCompareMode && (
                  <Line
                    yAxisId={useDualYAxis ? 'right' : 'left'}
                    type="monotone"
                    dataKey="compareValue"
                    name={series2Name}
                    stroke={paletteColors[1] || '#ec4899'}
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    dot={{ r: 4, fill: paletteColors[1] || '#ec4899' }}
                    activeDot={{ r: 7 }}
                  />
                )}
              </LineChart>
            ) : chartType === 'area' ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                <defs>
                  <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={paletteColors[0]} stopOpacity={0.7} />
                    <stop offset="95%" stopColor={paletteColors[0]} stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={paletteColors[1] || '#ec4899'} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={paletteColors[1] || '#ec4899'} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} interval={0} angle={-25} textAnchor="end" />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={11} />
                {isCompareMode && useDualYAxis && (
                  <YAxis yAxisId="right" orientation="right" stroke="#ec4899" fontSize={11} />
                )}
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#38bdf8' }}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />}
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="value"
                  name={series1Name}
                  stroke={paletteColors[0]}
                  fillOpacity={1}
                  fill="url(#areaGrad1)"
                />
                {isCompareMode && (
                  <Area
                    yAxisId={useDualYAxis ? 'right' : 'left'}
                    type="monotone"
                    dataKey="compareValue"
                    name={series2Name}
                    stroke={paletteColors[1] || '#ec4899'}
                    fillOpacity={0.6}
                    fill="url(#areaGrad2)"
                  />
                )}
              </AreaChart>
            ) : chartType === 'pie' ? (
              <PieChart>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [val?.toLocaleString() ?? 0, 'Value']}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
                <Pie
                  data={chartData}
                  cx={isCompareMode ? '30%' : '50%'}
                  cy="50%"
                  innerRadius={60}
                  outerRadius={105}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={!isCompareMode ? ({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)` : undefined}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-1-${index}`} fill={paletteColors[index % paletteColors.length]} />
                  ))}
                </Pie>
                {isCompareMode && (
                  <Pie
                    data={chartData}
                    cx="70%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={105}
                    paddingAngle={3}
                    dataKey="compareValue"
                    nameKey="name"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-2-${index}`} fill={paletteColors[(index + 2) % paletteColors.length]} />
                    ))}
                  </Pie>
                )}
              </PieChart>
            ) : chartType === 'scatter' ? (
              <ScatterChart margin={{ top: 10, right: 30, left: 10, bottom: 25 }}>
                {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
                <XAxis dataKey="xNum" name="Sequence / Index" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="value" name={series1Name} stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
                <Scatter name={series1Name} data={chartData} fill={paletteColors[0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-sc-1-${index}`} fill={paletteColors[index % paletteColors.length]} />
                  ))}
                </Scatter>
                {isCompareMode && (
                  <Scatter name={series2Name} data={chartData.map(d => ({ ...d, value: d.compareValue }))} fill={paletteColors[1] || '#ec4899'} />
                )}
              </ScatterChart>
            ) : (
              <RadarChart cx="50%" cy="50%" outerRadius={110} data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <PolarRadiusAxis stroke="#94a3b8" fontSize={10} />
                <Radar name={series1Name} dataKey="value" stroke={paletteColors[0]} fill={paletteColors[0]} fillOpacity={0.5} />
                {isCompareMode && (
                  <Radar
                    name={series2Name}
                    dataKey="compareValue"
                    stroke={paletteColors[1] || '#ec4899'}
                    fill={paletteColors[1] || '#ec4899'}
                    fillOpacity={0.4}
                  />
                )}
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
              </RadarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

