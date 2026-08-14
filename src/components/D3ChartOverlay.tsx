import React, { useState, useMemo, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Sliders,
  Maximize2,
  Info,
  Layers,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import type {
  ReportChart,
  ReportTable,
  D3DataPoint,
  D3OverlayMode,
  D3MovingAverageType,
} from '../types';
import {
  calculateLinearRegression,
  calculateSMA,
  calculateEMA,
  extractDataFromTables,
  generateFallbackDataPoints,
  formatMetricValue,
} from '../lib/d3Analytics';

interface D3ChartOverlayProps {
  chart: ReportChart;
  tables?: ReportTable[];
  onZoom?: () => void;
  className?: string;
}

export const D3ChartOverlay: React.FC<D3ChartOverlayProps> = ({
  chart,
  tables = [],
  onZoom,
  className = '',
}) => {
  const [overlayMode, setOverlayMode] = useState<D3OverlayMode>('both');
  const [windowSize, setWindowSize] = useState<number>(3);
  const [maType, setMaType] = useState<D3MovingAverageType>('sma');
  const [showConfidenceBand, setShowConfidenceBand] = useState<boolean>(true);
  const [showDataPoints, setShowDataPoints] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 600,
    height: 320,
  });

  // Observe element dimensions for responsive D3 rendering
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setDimensions({
            width: Math.floor(entry.contentRect.width),
            height: Math.floor(entry.contentRect.height),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Resolve dataset points from tables or fallback
  const { dataPoints, sourceLabel, xColName, yColName } = useMemo(() => {
    const extracted = extractDataFromTables(tables, chart.title);
    if (extracted && extracted.points.length >= 2) {
      return {
        dataPoints: extracted.points,
        sourceLabel: `Table: ${extracted.yCol} vs ${extracted.xCol}`,
        xColName: extracted.xCol,
        yColName: extracted.yCol,
      };
    }
    const fallback = generateFallbackDataPoints(chart.title);
    return {
      dataPoints: fallback,
      sourceLabel: 'Analyzed Chart Data Series',
      xColName: 'Time / Category',
      yColName: 'Metric Value',
    };
  }, [tables, chart.title]);

  // Compute D3 linear regression and moving average statistics
  const trendStats = useMemo(() => {
    return calculateLinearRegression(dataPoints);
  }, [dataPoints]);

  const movingAverages = useMemo(() => {
    return maType === 'sma'
      ? calculateSMA(dataPoints, windowSize)
      : calculateEMA(dataPoints, windowSize);
  }, [dataPoints, windowSize, maType]);

  // SVG Margins and D3 Scales calculation
  const margin = { top: 28, right: 36, bottom: 36, left: 44 };
  const innerWidth = Math.max(100, dimensions.width - margin.left - margin.right);
  const innerHeight = Math.max(80, dimensions.height - margin.top - margin.bottom);

  const { xScale, yScale, trendLinePath, maPath, dataLinePath, confidenceAreaPath, scaledPoints } =
    useMemo(() => {
      const n = dataPoints.length;
      const ys = dataPoints.map((p) => p.y);
      const allYValues = [...ys, ...movingAverages];

      if (showConfidenceBand && trendStats.confidenceBand) {
        allYValues.push(...trendStats.confidenceBand.upper);
        allYValues.push(...trendStats.confidenceBand.lower);
      }

      const minY = d3.min(allYValues) ?? 0;
      const maxY = d3.max(allYValues) ?? 100;
      const padding = (maxY - minY) * 0.1 || 10;

      const xScale = d3
        .scaleLinear()
        .domain([0, n - 1])
        .range([margin.left, margin.left + innerWidth]);

      const yScale = d3
        .scaleLinear()
        .domain([minY - padding, maxY + padding])
        .range([margin.top + innerHeight, margin.top]);

      // Coordinates for points
      const scaled = dataPoints.map((p, i) => ({
        x: xScale(i),
        y: yScale(p.y),
        raw: p,
        index: i,
        ma: movingAverages[i],
        trendY: trendStats.slope * i + trendStats.intercept,
      }));

      // D3 Generators
      const lineGen = d3
        .line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveMonotoneX);

      // Data Path
      const dataLinePath = lineGen(
        scaled.map((s) => ({ x: s.x, y: s.y }))
      );

      // Moving Average Path
      const maLineGen = d3
        .line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)
        .curve(d3.curveMonotoneX);

      const maPath = maLineGen(
        scaled.map((s) => ({ x: s.x, y: yScale(s.ma) }))
      );

      // Linear Regression Path (straight line from index 0 to n-1)
      const trendPoints = [
        { x: xScale(0), y: yScale(trendStats.slope * 0 + trendStats.intercept) },
        {
          x: xScale(n - 1),
          y: yScale(trendStats.slope * (n - 1) + trendStats.intercept),
        },
      ];
      const trendLinePath = d3
        .line<{ x: number; y: number }>()
        .x((d) => d.x)
        .y((d) => d.y)(trendPoints);

      // Confidence Band Area
      let confidenceAreaPath = '';
      if (showConfidenceBand && trendStats.confidenceBand) {
        const areaGen = d3
          .area<number>()
          .x((_, i) => xScale(i))
          .y0((_, i) => yScale(trendStats.confidenceBand.lower[i]))
          .y1((_, i) => yScale(trendStats.confidenceBand.upper[i]))
          .curve(d3.curveMonotoneX);

        confidenceAreaPath = areaGen(d3.range(n)) || '';
      }

      return {
        xScale,
        yScale,
        trendLinePath,
        maPath,
        dataLinePath,
        confidenceAreaPath,
        scaledPoints: scaled,
      };
    }, [
      dataPoints,
      movingAverages,
      trendStats,
      innerWidth,
      innerHeight,
      margin.left,
      margin.top,
      showConfidenceBand,
    ]);

  const activeHoverPoint = hoveredIndex !== null ? scaledPoints[hoveredIndex] : null;

  return (
    <div className={`relative flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden ${className}`}>
      {/* Top D3 Analytics Summary Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 bg-neutral-50/70 px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3 font-medium text-neutral-800">
          <div className="flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-neutral-900 text-[10px] font-bold text-white font-mono">
              D3
            </span>
            <span className="font-bold text-neutral-900">Dynamic Trend Overlay</span>
          </div>

          <span className="hidden sm:inline-block h-3.5 w-px bg-neutral-200" />

          {/* Slope & Direction Indicator */}
          <div className="flex items-center gap-1">
            {trendStats.direction === 'upward' ? (
              <span className="flex items-center gap-0.5 font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <TrendingUp className="h-3.5 w-3.5" />
                {trendStats.percentageChange >= 0 ? '+' : ''}
                {trendStats.percentageChange.toFixed(1)}% Trend
              </span>
            ) : trendStats.direction === 'downward' ? (
              <span className="flex items-center gap-0.5 font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60">
                <TrendingDown className="h-3.5 w-3.5" />
                {trendStats.percentageChange.toFixed(1)}% Trend
              </span>
            ) : (
              <span className="flex items-center gap-0.5 font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                <Activity className="h-3.5 w-3.5" />
                Flat Trend
              </span>
            )}
          </div>

          <span className="hidden md:inline-block text-[11px] text-neutral-500 font-mono">
            R² = {trendStats.rSquared.toFixed(2)}
          </span>
        </div>

        {/* Toggle & Settings Button */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => setShowControls((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
              showControls
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <Sliders className="h-3 w-3" />
            <span>Overlay Controls</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showControls ? 'rotate-180' : ''}`} />
          </button>

          {onZoom && (
            <button
              onClick={onZoom}
              className="p-1 rounded-lg border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
              title="Zoom Chart"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Controls Drawer */}
      {showControls && (
        <div className="border-b border-neutral-200 bg-neutral-900 text-white p-3.5 text-xs space-y-3 transition-all">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Overlay Mode Selector */}
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-medium">Overlay Mode:</span>
              <div className="flex bg-neutral-800 p-0.5 rounded-lg border border-neutral-700">
                {(['both', 'trend', 'ma', 'none'] as D3OverlayMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setOverlayMode(mode)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize transition cursor-pointer ${
                      overlayMode === mode
                        ? 'bg-io-blue text-white shadow-xs'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {mode === 'ma' ? 'Moving Avg' : mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Moving Average Window & Type */}
            {(overlayMode === 'both' || overlayMode === 'ma') && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-medium">MA Type:</span>
                  <div className="flex bg-neutral-800 p-0.5 rounded-lg border border-neutral-700">
                    <button
                      onClick={() => setMaType('sma')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        maType === 'sma' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      SMA
                    </button>
                    <button
                      onClick={() => setMaType('ema')}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        maType === 'ema' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      EMA
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 font-medium">Window:</span>
                  <div className="flex items-center gap-1">
                    {[2, 3, 5, 7].map((w) => (
                      <button
                        key={w}
                        onClick={() => setWindowSize(w)}
                        className={`h-6 w-6 rounded text-[11px] font-bold font-mono transition cursor-pointer ${
                          windowSize === w
                            ? 'bg-amber-400 text-neutral-950'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-neutral-800 text-[11px]">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-1.5 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showConfidenceBand}
                  onChange={(e) => setShowConfidenceBand(e.target.checked)}
                  className="rounded border-neutral-700 accent-io-blue"
                />
                <span>Confidence Band</span>
              </label>

              <label className="flex items-center gap-1.5 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showDataPoints}
                  onChange={(e) => setShowDataPoints(e.target.checked)}
                  className="rounded border-neutral-700 accent-io-blue"
                />
                <span>Data Nodes</span>
              </label>
            </div>

            <span className="text-neutral-400 italic">
              {sourceLabel} ({dataPoints.length} points)
            </span>
          </div>
        </div>
      )}

      {/* Main Visual Container (Image + D3 Overlay SVG) */}
      <div
        ref={containerRef}
        className="relative bg-white flex-1 flex items-center justify-center min-h-[260px] select-none"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Underlying Original Image */}
        <img
          src={chart.image}
          alt={chart.title}
          className="w-full h-auto max-h-[360px] object-contain mx-auto opacity-90"
        />

        {/* Dynamic D3 SVG Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="none"
        >
          <defs>
            {/* Linear Regression Gradient */}
            <linearGradient id="d3TrendGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ea4335" />
              <stop offset="50%" stopColor="#fbbc04" />
              <stop offset="100%" stopColor="#34a853" />
            </linearGradient>

            {/* Moving Average Glow Filter */}
            <filter id="d3Glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* D3 Confidence Band Area */}
          {showConfidenceBand && confidenceAreaPath && (overlayMode === 'both' || overlayMode === 'trend') && (
            <path
              d={confidenceAreaPath}
              fill="rgba(66, 133, 244, 0.08)"
              stroke="rgba(66, 133, 244, 0.2)"
              strokeDasharray="2 2"
            />
          )}

          {/* D3 Linear Regression Trend Line */}
          {(overlayMode === 'both' || overlayMode === 'trend') && trendLinePath && (
            <g>
              {/* Subtle background stroke for high visibility */}
              <path
                d={trendLinePath}
                fill="none"
                stroke="#ffffff"
                strokeWidth={4}
                strokeLinecap="round"
              />
              <path
                d={trendLinePath}
                fill="none"
                stroke="url(#d3TrendGradient)"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* D3 Moving Average Smooth Curve */}
          {(overlayMode === 'both' || overlayMode === 'ma') && maPath && (
            <g filter="url(#d3Glow)">
              <path
                d={maPath}
                fill="none"
                stroke="#ffffff"
                strokeWidth={4}
              />
              <path
                d={maPath}
                fill="none"
                stroke="#0284c7"
                strokeWidth={3}
                strokeLinecap="round"
              />
            </g>
          )}

          {/* D3 Data Nodes */}
          {showDataPoints &&
            scaledPoints.map((pt, i) => {
              const isHovered = hoveredIndex === i;
              return (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isHovered ? 6 : 3.5}
                    fill={isHovered ? '#4285f4' : '#ffffff'}
                    stroke={isHovered ? '#ffffff' : '#1e293b'}
                    strokeWidth={isHovered ? 2 : 1.5}
                  />
                  {(overlayMode === 'both' || overlayMode === 'ma') && (
                    <circle
                      cx={pt.x}
                      cy={yScale(pt.ma)}
                      r={isHovered ? 5 : 2.5}
                      fill="#0284c7"
                    />
                  )}
                </g>
              );
            })}

          {/* Hover Crosshair */}
          {activeHoverPoint && (
            <g>
              <line
                x1={activeHoverPoint.x}
                y1={margin.top}
                x2={activeHoverPoint.x}
                y2={margin.top + innerHeight}
                stroke="#64748b"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
            </g>
          )}
        </svg>

        {/* Invisible Hover Detection Rectangles across X intervals */}
        <div className="absolute inset-0 flex z-20">
          {scaledPoints.map((pt, i) => (
            <div
              key={i}
              className="flex-1 h-full cursor-crosshair"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          ))}
        </div>

        {/* Hover Tooltip Overlay */}
        {activeHoverPoint && (
          <div
            className="absolute z-30 pointer-events-none bg-neutral-900/95 text-white rounded-xl px-3 py-2 text-xs shadow-xl backdrop-blur-md border border-neutral-700 space-y-1 font-sans"
            style={{
              left: Math.min(
                dimensions.width - 160,
                Math.max(10, activeHoverPoint.x - 70)
              ),
              top: Math.max(10, activeHoverPoint.y - 85),
            }}
          >
            <div className="font-bold border-b border-neutral-700 pb-1 text-neutral-200 flex justify-between gap-2">
              <span>{activeHoverPoint.raw.label || `${xColName} ${activeHoverPoint.index + 1}`}</span>
              <span className="text-io-blue font-mono">{formatMetricValue(activeHoverPoint.raw.y)}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px]">
              {(overlayMode === 'both' || overlayMode === 'trend') && (
                <>
                  <span className="text-neutral-400">Trend Fit:</span>
                  <span className="font-mono text-amber-300 font-semibold">
                    {formatMetricValue(activeHoverPoint.trendY)}
                  </span>
                </>
              )}
              {(overlayMode === 'both' || overlayMode === 'ma') && (
                <>
                  <span className="text-neutral-400">{maType.toUpperCase()} ({windowSize}):</span>
                  <span className="font-mono text-sky-400 font-semibold">
                    {formatMetricValue(activeHoverPoint.ma)}
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom D3 Metric Legend Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 bg-neutral-50/50 px-4 py-2.5 text-xs text-neutral-600">
        <div className="flex flex-wrap items-center gap-4">
          {(overlayMode === 'both' || overlayMode === 'trend') && (
            <div className="flex items-center gap-1.5 font-medium">
              <span className="h-0.5 w-4 rounded-full bg-gradient-to-r from-io-red via-io-yellow to-io-green inline-block" />
              <span>D3 Trend Fit Line</span>
            </div>
          )}

          {(overlayMode === 'both' || overlayMode === 'ma') && (
            <div className="flex items-center gap-1.5 font-medium">
              <span className="h-1 w-4 rounded-full bg-sky-600 inline-block" />
              <span>{windowSize}-Period {maType.toUpperCase()}</span>
            </div>
          )}

          {showConfidenceBand && (overlayMode === 'both' || overlayMode === 'trend') && (
            <div className="flex items-center gap-1.5 text-neutral-500">
              <span className="h-3 w-3 rounded bg-blue-100 border border-blue-200 inline-block" />
              <span>Confidence Envelope</span>
            </div>
          )}
        </div>

        {/* Calculated Moving Average value badge */}
        <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-700 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
          <span>Latest {maType.toUpperCase()}:</span>
          <span className="font-bold text-sky-600">
            {formatMetricValue(movingAverages[movingAverages.length - 1] ?? 0)}
          </span>
        </div>
      </div>
    </div>
  );
};
