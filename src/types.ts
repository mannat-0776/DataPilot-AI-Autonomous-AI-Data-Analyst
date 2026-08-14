export interface D3DataPoint {
  x: number | string;
  y: number;
  label?: string;
  xNormalized?: number;
}

export interface D3TrendResults {
  slope: number;
  intercept: number;
  rSquared: number;
  percentageChange: number;
  direction: 'upward' | 'downward' | 'flat';
  movingAverages: number[];
  exponentialMovingAverages: number[];
  confidenceBand: { upper: number[]; lower: number[] };
  minY: number;
  maxY: number;
  meanY: number;
}

export type D3OverlayMode = 'both' | 'trend' | 'ma' | 'none';
export type D3MovingAverageType = 'sma' | 'ema';

export interface ReportInsight {
  title: string;
  detail: string;
  metric?: string;
  value?: string;
  why?: string;
  evidence?: string;
  confidence?: number;
  recommended_action?: string;
  investigate_prompt?: string;
}

export interface AutopilotFinding {
  id: string;
  title: string;
  detail: string;
  metric?: string;
  value?: string;
  why: string;
  evidence: string;
  confidence: number;
  recommendedAction: string;
  investigatePrompt: string;
}

export interface AutopilotNextStep {
  id: string;
  title: string;
  prompt: string;
  reasoning: string;
}

export interface AutopilotSummary {
  rowCountText: string;
  datasetName: string;
  findings: AutopilotFinding[];
  nextSteps: AutopilotNextStep[];
}

export interface ReportChart {
  title: string;
  file: string;
  caption?: string;
  type?: string;
  /** Base64 data URL injected by the server after extracting the PNG from the sandbox. */
  image?: string;
}

export interface ReportTable {
  title: string;
  columns: string[];
  rows: Array<Array<string | number | null>>;
  caption?: string;
}

export interface AnalysisReport {
  dataset_name: string;
  question: string;
  title: string;
  executive_summary: string;
  insights: ReportInsight[];
  charts: ReportChart[];
  tables: ReportTable[];
  methodology?: string;
  recommendations?: string[];
  generated_at?: string;
}

export type ActivityType =
  | 'info'
  | 'thinking'
  | 'text'
  | 'tool_call'
  | 'tool_result'
  | 'error';

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: ActivityType;
  content?: string;
  name?: string;
  args?: Record<string, unknown>;
  result?: string;
}

export interface UploadedFile {
  name: string;
  content?: string;
  gsUri?: string;
  localPath?: string;
  isLocal?: boolean;
  isGcsUri?: boolean;
  size?: number;
  driveId?: string;
  mimeType?: string;
}

declare global {
  interface Window {
    gapi: any;
    google?: any;
  }
  const google: any;
}
