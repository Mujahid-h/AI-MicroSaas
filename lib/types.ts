// Lab Report Types
export interface LabMetric {
  name: string;
  value: string;
  unit: string;
  status: "normal" | "high" | "low" | "critical";
  plain: string;
}

export interface LabResult {
  summary: string;
  critical: string[];
  normal: string[];
  metrics: LabMetric[];
  action: string;
}

// Lease Types
export interface LeaseKeyDate {
  label: string;
  date: string;
  daysUntil: number;
  urgent: boolean;
  note: string;
}

export interface LeaseHiddenFee {
  name: string;
  amount: string;
  risk: "high" | "medium" | "low";
  explanation: string;
}

export interface LeaseGotchaClause {
  type: string;
  title: string;
  detail: string;
  severity: "high" | "medium" | "low";
}

export interface LeaseResult {
  riskScore: number;
  summary: string;
  keyDates: LeaseKeyDate[];
  hiddenFees: LeaseHiddenFee[];
  gotchaClauses: LeaseGotchaClause[];
  savings: string;
}
