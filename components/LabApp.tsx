"use client";
import { useState } from "react";
import { labTheme, SAMPLE_LAB } from "@/lib/theme";
import type { LabResult, LabMetric } from "@/lib/types";
import {
  BackButton,
  Loader,
  Tabs,
  SectionLabel,
  UploadZone,
  FileBadge,
  EmptyState,
} from "./UI";

const t = labTheme;

const LAB_TABS = [
  { id: "scan", label: "📷 Scan" },
  { id: "result", label: "🔬 Results" },
  { id: "trends", label: "📈 Trends" },
];

const HISTORY = [
  { date: "Feb 12, 2025", label: "Annual CBC Panel", flags: "2 flags" },
  { date: "Aug 3, 2024", label: "Metabolic Panel", flags: "1 flag" },
  { date: "Jan 15, 2024", label: "Lipid Panel", flags: "0 flags" },
];

const TREND_DATA = {
  glucose: [
    { label: "Aug '24", val: 108, max: 160 },
    { label: "Nov '24", val: 118, max: 160 },
    { label: "Feb '25", val: 126, max: 160 },
  ],
  cholesterol: [
    { label: "Aug '24", val: 198, max: 260 },
    { label: "Nov '24", val: 210, max: 260 },
    { label: "Feb '25", val: 218, max: 260 },
  ],
  hemoglobin: [
    { label: "Aug '24", val: 13.2, max: 18 },
    { label: "Nov '24", val: 12.4, max: 18 },
    { label: "Feb '25", val: 11.8, max: 18 },
  ],
};

function statusColor(status: string): string {
  if (status === "normal") return t.success;
  if (status === "high" || status === "low") return t.accent;
  return t.danger;
}

interface MetricRowProps {
  metric: LabMetric;
}
function MetricRow({ metric }: MetricRowProps) {
  const color = statusColor(metric.status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13 }}>{metric.name}</div>
        <div style={{ fontSize: 11, color: t.muted }}>{metric.plain}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          {metric.value} <span style={{ fontWeight: 400, opacity: 0.6, fontSize: 11 }}>{metric.unit}</span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", padding: "2px 8px", borderRadius: 10, background: `${color}22`, color, textTransform: "uppercase" as const }}>
          {metric.status}
        </div>
      </div>
    </div>
  );
}

interface TrendChartProps {
  title: string;
  data: { label: string; val: number; max: number }[];
  warningThreshold: number;
  unit: string;
  warning?: string;
}
function TrendChart({ title, data, warningThreshold, unit, warning }: TrendChartProps) {
  return (
    <div style={{ marginBottom: 8 }}>
      <SectionLabel>{title}</SectionLabel>
      <div style={{ margin: "0 20px", borderRadius: 20, padding: 20, background: t.card, border: `1px solid ${t.cardBorder}` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.map((row, i) => {
            const pct = (row.val / row.max) * 100;
            const color = row.val > warningThreshold ? t.danger : row.val > warningThreshold * 0.85 ? t.accent : t.success;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 11, opacity: 0.6, width: 50, textAlign: "right", flexShrink: 0, color: t.text }}>{row.label}</div>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div className="trend-bar-fill" style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, width: 45, flexShrink: 0, color }}>
                  {row.val} <span style={{ fontSize: 9, fontWeight: 400, opacity: 0.6 }}>{unit}</span>
                </div>
              </div>
            );
          })}
        </div>
        {warning && (
          <div style={{ fontSize: 12, color: t.danger, marginTop: 12, fontStyle: "italic" }}>
            {warning}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LabApp({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState("scan");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LabResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (text: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/analyze-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setTab("result");
    } catch (e) {
      setError("Analysis failed. Please check your API key and try again.");
      console.error(e);
    }
    setLoading(false);
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) runAnalysis(ev.target.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ background: t.bg, minHeight: "100%", color: t.text, fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div style={{
        padding: "54px 24px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: `${t.bg}CC`,
        backdropFilter: "blur(20px)",
      }}>
        <BackButton onClick={onBack} color={t.primary} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 17, fontWeight: 700 }}>Lab Results AI</div>
          <div style={{ fontSize: 11, color: t.muted }}>HIPAA-Grade Analysis</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div className="animate-pulse-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: t.success }} />
          <span style={{ fontSize: 11, color: t.success, fontWeight: 600 }}>Secure</span>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={LAB_TABS}
        active={tab}
        onChange={setTab}
        primary={t.primary}
        card={t.card}
        muted={t.muted}
        activeFg={t.bg}
      />

      {/* ── SCAN TAB ── */}
      {tab === "scan" && (
        <>
          <UploadZone
            primary={t.primary}
            primaryGlow={t.primaryGlow}
            onFileSelect={handleFile}
            accept=".txt,.csv,.pdf"
            title="Upload Lab Report"
            subtitle="Tap to upload your lab results file"
            icon={
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2zM12 17a4 4 0 100-8 4 4 0 000 8z" />
              </svg>
            }
          />

          {fileName && <FileBadge fileName={fileName} primary={t.primary} card={t.card} cardBorder={t.cardBorder} />}

          {error && (
            <div style={{ margin: "0 20px 12px", padding: "12px 16px", borderRadius: 12, background: `${t.danger}15`, border: `1px solid ${t.danger}44`, fontSize: 13, color: t.danger }}>
              {error}
            </div>
          )}

          <SectionLabel>or try a demo</SectionLabel>
          <button
            className="sample-btn"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              width: "calc(100% - 40px)", margin: "0 20px",
              padding: 14, borderRadius: 14, border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-head)", fontSize: 14, fontWeight: 700,
              background: t.gradient, color: "#fff",
            }}
            onClick={() => { setFileName("sample_cbc_results.txt"); runAnalysis(SAMPLE_LAB); }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            </svg>
            Analyze Sample CBC Report
          </button>

          {loading && <Loader primary={t.primary} secondary={t.secondary} message={"AI is translating medical jargon\ninto plain English…"} />}

          <SectionLabel>Past Reports</SectionLabel>
          <div style={{ padding: "0 20px" }}>
            {HISTORY.map((h, i) => (
              <div key={i} className="history-item" style={{ borderRadius: 14, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: t.card, border: `1px solid ${t.cardBorder}` }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: t.primary, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{h.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.5 }}>{h.date} · {h.flags}</div>
                </div>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            ))}
          </div>
          <div style={{ height: 20 }} />
        </>
      )}

      {/* ── RESULT TAB ── */}
      {tab === "result" && (
        <>
          {loading && <Loader primary={t.primary} secondary={t.secondary} message="Analyzing your report…" />}
          {!loading && !result && <EmptyState emoji="🔬" message="Upload a lab report to see your results here" />}
          {result && (
            <div className="animate-fade-in">
              {/* Summary Card */}
              <div style={{ margin: "12px 20px", borderRadius: 20, padding: 20, background: t.card, border: `1px solid ${t.primary}33` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                  </svg>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 700 }}>AI Summary</div>
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.6 }}>{result.summary}</div>
              </div>

              {/* Critical Findings */}
              {result.critical?.length > 0 && (
                <div style={{ padding: "0 20px" }}>
                  <SectionLabel>⚠️ Needs Attention</SectionLabel>
                  {result.critical.map((c, i) => (
                    <div key={i} className="animate-slide-up" style={{
                      borderRadius: 14, padding: "14px 16px", marginBottom: 10,
                      display: "flex", gap: 12, alignItems: "flex-start",
                      background: `${t.danger}15`, border: `1px solid ${t.danger}33`,
                    }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.danger}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={t.danger} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
                        </svg>
                      </div>
                      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{c}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* All Metrics */}
              <SectionLabel>All Metrics</SectionLabel>
              <div style={{ margin: "0 20px", borderRadius: 20, padding: "8px 16px", background: t.card, border: `1px solid ${t.cardBorder}` }}>
                {result.metrics?.map((m, i) => (
                  <MetricRow key={i} metric={m} />
                ))}
              </div>

              {/* Action */}
              {result.action && (
                <div style={{ margin: "16px 20px", padding: 16, borderRadius: 16, background: `${t.primary}15`, border: `1px solid ${t.primary}33` }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <div>
                      <div style={{ fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, color: t.primary, marginBottom: 4, letterSpacing: "1px", textTransform: "uppercase" as const }}>Recommended Action</div>
                      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{result.action}</div>
                    </div>
                  </div>
                </div>
              )}
              <div style={{ height: 20 }} />
            </div>
          )}
        </>
      )}

      {/* ── TRENDS TAB ── */}
      {tab === "trends" && (
        <div>
          <TrendChart
            title="Glucose Trend (mg/dL)"
            data={TREND_DATA.glucose}
            warningThreshold={100}
            unit="mg/dL"
            warning="↑ Glucose trending upward — discuss with your doctor"
          />
          <TrendChart
            title="Total Cholesterol (mg/dL)"
            data={TREND_DATA.cholesterol}
            warningThreshold={200}
            unit="mg/dL"
            warning="↑ Approaching high range — dietary changes recommended"
          />
          <TrendChart
            title="Hemoglobin (g/dL)"
            data={TREND_DATA.hemoglobin}
            warningThreshold={100}
            unit="g/dL"
          />

          {/* Insight Card */}
          <div style={{ margin: "16px 20px 20px", padding: 16, borderRadius: 16, background: `${t.secondary}15`, border: `1px solid ${t.secondary}33` }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, color: t.secondary, marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" as const }}>AI Trend Insight</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.9 }}>
              Your glucose and cholesterol have been trending upward over the last 6 months while hemoglobin is declining slightly. This pattern is worth discussing with your doctor at your next visit.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
