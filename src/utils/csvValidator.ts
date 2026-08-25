export interface ColumnAnalysis {
  name: string;
  inferredType: 'numeric' | 'date' | 'categorical' | 'boolean' | 'unknown';
  sampleValues: string[];
}

export interface CsvValidationIssue {
  type: 'missing_numeric' | 'missing_date' | 'missing_categorical' | 'empty_dataset';
  severity: 'warning' | 'info';
  title: string;
  message: string;
  suggestion: string;
}

export interface CsvValidationResult {
  fileName: string;
  headers: string[];
  columns: ColumnAnalysis[];
  numericColumns: string[];
  dateColumns: string[];
  categoricalColumns: string[];
  issues: CsvValidationIssue[];
  totalRows: number;
  isValid: boolean;
}

const DATE_HEADER_REGEX = /(date|time|dt|timestamp|created_at|updated_at|dob|period|quarter|year|month|day|order_date|txn_date|transaction_date|purchase_date)/i;
const NUMERIC_HEADER_REGEX = /(amount|price|cost|total|sum|count|quantity|qty|revenue|sales|profit|charge|charges|score|value|val|age|tenure|rate|percent|pct|discount|ticket|tickets|rating|margin|budget|balance|number|num)/i;

const ISO_DATE_REGEX = /^\d{4}[-/.]\d{1,2}[-/.]\d{1,2}/;
const US_DATE_REGEX = /^\d{1,2}[-/.]\d{1,2}[-/.]\d{2,4}/;

/**
 * Parses raw CSV content text and analyzes headers and sample data rows.
 */
export function validateCsvContent(fileName: string, content: string): CsvValidationResult {
  const isBinaryFormat = content.startsWith('BASE64:') || /\.(xlsx|xls|parquet|zip|bin)$/i.test(fileName);
  if (isBinaryFormat) {
    return {
      fileName,
      headers: ['Excel / Binary Sheet'],
      columns: [
        {
          name: 'Excel / Binary Sheet Data',
          inferredType: 'numeric',
          sampleValues: ['Binary format loaded. Python engine parses worksheets server-side.'],
        },
      ],
      numericColumns: ['(Excel / Parquet binary worksheets)'],
      dateColumns: [],
      categoricalColumns: [],
      issues: [],
      totalRows: 1,
      isValid: true,
    };
  }

  if (!content || !content.trim()) {
    return {
      fileName,
      headers: [],
      columns: [],
      numericColumns: [],
      dateColumns: [],
      categoricalColumns: [],
      issues: [
        {
          type: 'empty_dataset',
          severity: 'warning',
          title: 'Empty Dataset File',
          message: `File "${fileName}" appears to be empty or contains no readable lines.`,
          suggestion: 'Ensure the uploaded CSV file contains headers and valid data rows.',
        },
      ],
      totalRows: 0,
      isValid: false,
    };
  }

  // Split lines
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return {
      fileName,
      headers: [],
      columns: [],
      numericColumns: [],
      dateColumns: [],
      categoricalColumns: [],
      issues: [
        {
          type: 'empty_dataset',
          severity: 'warning',
          title: 'Empty Dataset File',
          message: `File "${fileName}" contains no data lines.`,
          suggestion: 'Please upload a CSV file with headers and values.',
        },
      ],
      totalRows: 0,
      isValid: false,
    };
  }

  // Helper to split CSV line handling basic quotes
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim().replace(/^["']|["']$/g, ''));
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim().replace(/^["']|["']$/g, ''));
    return result;
  };

  const headers = parseCsvLine(lines[0]);
  const sampleDataLines = lines.slice(1, 30);
  const sampleRows = sampleDataLines.map(parseCsvLine);

  const columns: ColumnAnalysis[] = [];
  const numericColumns: string[] = [];
  const dateColumns: string[] = [];
  const categoricalColumns: string[] = [];

  headers.forEach((headerName, colIdx) => {
    const sampleValues = sampleRows
      .map((row) => row[colIdx])
      .filter((val): val is string => val !== undefined && val !== null && val.trim() !== '');

    let type: 'numeric' | 'date' | 'categorical' | 'boolean' | 'unknown' = 'unknown';

    // 1. Check Date / Time
    const isHeaderDateKeyword = DATE_HEADER_REGEX.test(headerName);
    let dateMatchCount = 0;
    let numericMatchCount = 0;

    sampleValues.forEach((val) => {
      const cleaned = val.trim();
      if (ISO_DATE_REGEX.test(cleaned) || US_DATE_REGEX.test(cleaned)) {
        dateMatchCount++;
      } else if (isNaN(Number(cleaned)) && !isNaN(Date.parse(cleaned)) && cleaned.length > 5) {
        dateMatchCount++;
      }

      // Clean dollar signs, commas, percentages for numeric test
      const cleanNumStr = cleaned.replace(/[\$,%]/g, '');
      if (cleanNumStr !== '' && !isNaN(Number(cleanNumStr))) {
        numericMatchCount++;
      }
    });

    const isSampleDate = sampleValues.length > 0 && dateMatchCount / sampleValues.length >= 0.4;
    const isHeaderNumeric = NUMERIC_HEADER_REGEX.test(headerName);
    const isSampleNumeric = sampleValues.length > 0 && numericMatchCount / sampleValues.length >= 0.6;

    if (isHeaderDateKeyword || isSampleDate) {
      type = 'date';
      dateColumns.push(headerName);
    } else if (isSampleNumeric || (isHeaderNumeric && sampleValues.length > 0)) {
      type = 'numeric';
      numericColumns.push(headerName);
    } else {
      type = 'categorical';
      categoricalColumns.push(headerName);
    }

    columns.push({
      name: headerName,
      inferredType: type,
      sampleValues: sampleValues.slice(0, 3),
    });
  });

  const issues: CsvValidationIssue[] = [];

  // Mandatory Data Type Check 1: Numeric Columns
  if (numericColumns.length === 0) {
    issues.push({
      type: 'missing_numeric',
      severity: 'warning',
      title: 'Missing Numeric Metrics',
      message: `No numeric metric columns (e.g., sales, price, quantity, revenue, score) were detected in "${fileName}".`,
      suggestion: 'Mandatory numeric columns are missing. Statistical calculations, averages, sums, and trend charts will be limited.',
    });
  }

  // Mandatory Data Type Check 2: Date / Time Columns
  if (dateColumns.length === 0) {
    issues.push({
      type: 'missing_date',
      severity: 'info',
      title: 'Missing Date / Time Column',
      message: `No temporal date or timestamp column (e.g., date, order_date, year, month) was detected in "${fileName}".`,
      suggestion: 'Time-series forecasting, trend lines over time, and period-over-period comparisons will be disabled.',
    });
  }

  // Check Categorical Columns
  if (categoricalColumns.length === 0 && headers.length > 1) {
    issues.push({
      type: 'missing_categorical',
      severity: 'info',
      title: 'No Categorical Dimensions',
      message: `No text/category columns were detected for segment breakdowns in "${fileName}".`,
      suggestion: 'Consider adding group identifiers (e.g., category, region, segment) for breakdown charts.',
    });
  }

  return {
    fileName,
    headers,
    columns,
    numericColumns,
    dateColumns,
    categoricalColumns,
    issues,
    totalRows: lines.length - 1,
    isValid: issues.filter((i) => i.severity === 'warning').length === 0,
  };
}
