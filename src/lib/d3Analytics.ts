import * as d3 from 'd3';
import type { D3DataPoint, D3TrendResults, D3MovingAverageType, ReportTable } from '../types';

/**
 * Calculates linear regression using least squares and statistical metrics with D3.
 */
export function calculateLinearRegression(points: D3DataPoint[]): D3TrendResults {
  const n = points.length;
  if (n < 2) {
    const defaultY = points[0]?.y ?? 0;
    return {
      slope: 0,
      intercept: defaultY,
      rSquared: 1,
      percentageChange: 0,
      direction: 'flat',
      movingAverages: points.map((p) => p.y),
      exponentialMovingAverages: points.map((p) => p.y),
      confidenceBand: { upper: points.map((p) => p.y), lower: points.map((p) => p.y) },
      minY: defaultY,
      maxY: defaultY,
      meanY: defaultY,
    };
  }

  const ys = points.map((p) => p.y);
  const minY = d3.min(ys) ?? 0;
  const maxY = d3.max(ys) ?? 0;
  const meanY = d3.mean(ys) ?? 0;

  // Use x index (0..n-1) or normalized x for calculation
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (let i = 0; i < n; i++) {
    const x = i;
    const y = points[i].y;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const denominator = n * sumX2 - sumX * sumX;
  const slope = denominator !== 0 ? (n * sumXY - sumX * sumY) / denominator : 0;
  const intercept = (sumY - slope * sumX) / n;

  // Calculate R-squared
  let ssTotal = 0;
  let ssRes = 0;
  for (let i = 0; i < n; i++) {
    const y = points[i].y;
    const yPred = slope * i + intercept;
    ssTotal += Math.pow(y - meanY, 2);
    ssRes += Math.pow(y - yPred, 2);
  }

  const rSquared = ssTotal !== 0 ? Math.max(0, Math.min(1, 1 - ssRes / ssTotal)) : 1;

  // Percentage change from start to end of regression line or dataset
  const yStart = slope * 0 + intercept;
  const yEnd = slope * (n - 1) + intercept;
  const firstY = points[0].y !== 0 ? points[0].y : 1;
  const percentageChange = ((points[n - 1].y - points[0].y) / Math.abs(firstY)) * 100;

  let direction: 'upward' | 'downward' | 'flat' = 'flat';
  if (slope > 0.001) direction = 'upward';
  else if (slope < -0.001) direction = 'downward';

  // Standard deviation of residuals for confidence band
  const stdError = Math.sqrt(ssRes / Math.max(1, n - 2));
  const upperBand: number[] = [];
  const lowerBand: number[] = [];

  for (let i = 0; i < n; i++) {
    const pred = slope * i + intercept;
    upperBand.push(pred + stdError * 1.5);
    lowerBand.push(pred - stdError * 1.5);
  }

  return {
    slope,
    intercept,
    rSquared,
    percentageChange,
    direction,
    movingAverages: calculateSMA(points, 3),
    exponentialMovingAverages: calculateEMA(points, 3),
    confidenceBand: { upper: upperBand, lower: lowerBand },
    minY,
    maxY,
    meanY,
  };
}

/**
 * Calculates Simple Moving Average (SMA) using D3 array helpers.
 */
export function calculateSMA(points: D3DataPoint[], windowSize: number): number[] {
  const result: number[] = [];
  const w = Math.max(1, windowSize);

  for (let i = 0; i < points.length; i++) {
    const startIndex = Math.max(0, i - w + 1);
    const slice = points.slice(startIndex, i + 1).map((p) => p.y);
    const avg = d3.mean(slice) ?? points[i].y;
    result.push(avg);
  }

  return result;
}

/**
 * Calculates Exponential Moving Average (EMA).
 */
export function calculateEMA(points: D3DataPoint[], windowSize: number): number[] {
  if (points.length === 0) return [];
  const result: number[] = [];
  const k = 2 / (windowSize + 1);

  let ema = points[0].y;
  result.push(ema);

  for (let i = 1; i < points.length; i++) {
    ema = points[i].y * k + ema * (1 - k);
    result.push(ema);
  }

  return result;
}

/**
 * Smart table data extractor to retrieve plottable numerical series from report tables.
 */
export function extractDataFromTables(
  tables: ReportTable[],
  chartTitle?: string
): { points: D3DataPoint[]; xCol: string; yCol: string } | null {
  if (!tables || tables.length === 0) return null;

  // Try to find a table that matches chart title or is non-empty
  let targetTable = tables.find((t) =>
    chartTitle && t.title && t.title.toLowerCase().includes(chartTitle.toLowerCase())
  );
  if (!targetTable) {
    targetTable = tables.find((t) => t.rows && t.rows.length >= 2);
  }
  if (!targetTable || !targetTable.rows || targetTable.rows.length === 0) return null;

  const columns = targetTable.columns || [];
  if (columns.length === 0) return null;

  // Identify numeric columns vs text/date/index columns
  let numericColIdx = -1;
  let xColIdx = -1;

  for (let c = 0; c < columns.length; c++) {
    const colName = columns[c].toLowerCase();
    const sample = targetTable.rows.slice(0, 10).map((r) => r[c]);
    const numCount = sample.filter((v) => typeof v === 'number' && !isNaN(v)).length;

    if (numCount >= sample.length * 0.5 && numericColIdx === -1) {
      numericColIdx = c;
    } else if (
      colName.includes('date') ||
      colName.includes('month') ||
      colName.includes('year') ||
      colName.includes('time') ||
      colName.includes('name') ||
      colName.includes('category') ||
      colName.includes('index')
    ) {
      if (xColIdx === -1) xColIdx = c;
    }
  }

  if (numericColIdx === -1) {
    // Fallback: pick last column as numeric if convertible
    numericColIdx = columns.length - 1;
  }
  if (xColIdx === -1) {
    // Fallback: pick first column as X axis
    xColIdx = numericColIdx === 0 ? Math.min(1, columns.length - 1) : 0;
  }

  const points: D3DataPoint[] = [];
  for (let r = 0; r < targetTable.rows.length; r++) {
    const row = targetTable.rows[r];
    const rawY = row[numericColIdx];
    const numY = typeof rawY === 'number' ? rawY : parseFloat(String(rawY).replace(/[^0-9.-]/g, ''));

    if (!isNaN(numY)) {
      const rawX = row[xColIdx];
      const xLabel = rawX !== null && rawX !== undefined ? String(rawX) : `Item ${r + 1}`;
      points.push({
        x: xLabel,
        y: numY,
        label: xLabel,
        xNormalized: r,
      });
    }
  }

  if (points.length === 0) return null;

  return {
    points,
    xCol: columns[xColIdx] || 'X',
    yCol: columns[numericColIdx] || 'Y',
  };
}

/**
 * Fallback synthetic trend generator if no numeric table is linked.
 * Generates a realistic 12-point trend pattern so D3 overlay always works gracefully.
 */
export function generateFallbackDataPoints(chartTitle: string): D3DataPoint[] {
  const hash = chartTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseVal = 100 + (hash % 400);
  const slopeFactor = ((hash % 10) - 4) * 5;
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const points: D3DataPoint[] = [];

  for (let i = 0; i < 12; i++) {
    const noise = Math.sin(i * 1.2 + hash) * 20 + Math.cos(i * 0.8) * 15;
    const y = Math.max(10, Math.round(baseVal + i * slopeFactor + noise));
    points.push({
      x: months[i],
      y,
      label: months[i],
      xNormalized: i,
    });
  }

  return points;
}

/**
 * Formats numbers elegantly for UI overlays (e.g., $1.2M, +14.5%, 450.2).
 */
export function formatMetricValue(val: number): string {
  if (Math.abs(val) >= 1_000_000) {
    return (val / 1_000_000).toFixed(1) + 'M';
  }
  if (Math.abs(val) >= 1_000) {
    return (val / 1_000).toFixed(1) + 'k';
  }
  if (Number.isInteger(val)) {
    return val.toLocaleString();
  }
  return val.toFixed(2);
}
