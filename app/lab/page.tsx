"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import Icon, { ICONS } from "@/components/Icon";
import LoadingSpinner from "@/components/LoadingSpinner";
import UploadZone from "@/components/UploadZone";
import { LabResult } from "@/lib/types";
import { SAMPLE_LAB_TEXT, MOCK_LAB_HISTORY } from "@/lib/sample-data";

const T = {
  bg: "#0A0E1A",
  card: "#111827",
  cardBorder: "#1E293B",
  primary: "#00D4AA",
  secondary: "#7C3AED",
  accent: "#F59E0B",
  text: "#F1F5F9",
  muted: "#64748B",
  danger: "#EF4444",
  success: "#10B981",
};

function statusColor(s: string) {
  if (s === "normal") return T.success;
  if (s === "high" || s === "low") return T.accent;
  return T.danger;
}

export default function LabPage() {
  const [tab, setTab] = useState<"scan" | "result" | "trends">("scan");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LabResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (text: string, name: string) => {
    setLoading(true);
    setError(null);
    setFileName(name);
    console.log("API hit AAAAAAAAAAAAAAAA")
    try {
      const res = await fetch("/api/analyze-lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    console.log("API hit success AAAAAAAAAAAAAAAA", res.json)

      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setTab("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "scan", label: "📷 Scan" },
    { id: "result", label: "🔬 Results" },
    { id: "trends", label: "📈 Trends" },
  ] as const;

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: T.text }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div
          className="sticky top-0 z-50 glass px-6 py-4 flex items-center gap-3"
          style={{ background: T.bg + "DD", borderBottom: `1px solid ${T.cardBorder}` }}
        >
          <Link
            href="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <Icon path={ICONS.back} size={17} color={T.primary} />
          </Link>
          <div className="flex-1">
            <h1 className="font-syne text-base font-bold">Lab Results AI</h1>
            <p className="text-xs" style={{ color: T.muted }}>
              HIPAA-Grade Analysis
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse-dot"
              style={{ background: T.success }}
            />
            <span className="text-xs font-bold" style={{ color: T.success }}>
              Secure
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-5 pb-3">
          <div
            className="flex gap-1 p-1 rounded-2xl"
            style={{ background: T.card }}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex-1 py-2.5 px-3 rounded-xl text-xs font-syne font-bold transition-all duration-200"
                style={{
                  background: tab === t.id ? T.primary : "transparent",
                  color: tab === t.id ? T.bg : T.muted,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* SCAN TAB */}
        {tab === "scan" && (
          <div className="pb-16">
            <div className="py-4">
              <UploadZone
                onFile={runAnalysis}
                primaryColor={T.primary}
                title="Upload Lab Report"
                subtitle="Select your lab results file to analyze"
                accept=".txt,.csv,.pdf"
              />
            </div>

            {fileName && (
              <div
                className="mx-5 flex items-center gap-2 px-4 py-3 rounded-xl mb-2"
                style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}
              >
                <Icon path={ICONS.file} size={14} color={T.primary} />
                <span className="text-xs text-white">{fileName}</span>
              </div>
            )}

            {/* Demo */}
            <div className="mx-5 mt-3 mb-6">
              <p
                className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                style={{ color: T.muted }}
              >
                — or try a demo —
              </p>
              <button
                onClick={() =>
                  runAnalysis(SAMPLE_LAB_TEXT, "sample_cbc_results.txt")
                }
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-syne font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${T.primary}, ${T.secondary})`,
                  color: "#fff",
                }}
              >
                <Icon path={ICONS.spark} size={16} color="#fff" />
                Analyze Sample CBC Report
              </button>
            </div>

            {loading && (
              <LoadingSpinner
                color={T.primary}
                secondaryColor={T.secondary}
                message="AI is analyzing your report..."
                submessage="Translating medical jargon into plain English"
              />
            )}

            {error && (
              <div
                className="mx-5 p-4 rounded-2xl text-sm"
                style={{
                  background: T.danger + "15",
                  border: `1px solid ${T.danger}44`,
                  color: T.danger,
                }}
              >
                {error}
              </div>
            )}

            {/* History */}
            <div className="px-5">
              <p
                className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                style={{ color: T.muted }}
              >
                Past Reports
              </p>
              <div className="flex flex-col gap-2">
                {MOCK_LAB_HISTORY.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{
                      background: T.card,
                      border: `1px solid ${T.cardBorder}`,
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: T.primary }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{h.label}</p>
                      <p className="text-xs opacity-40">
                        {h.date} · {h.score}
                      </p>
                    </div>
                    <Icon path={ICONS.arrowRight} size={14} color={T.muted} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULT TAB */}
        {tab === "result" && (
          <div className="pb-16 px-5 pt-2">
            {loading && (
              <LoadingSpinner
                color={T.primary}
                secondaryColor={T.secondary}
                message="Analyzing your report..."
              />
            )}

            {!loading && !result && (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <div className="text-5xl">🔬</div>
                <p className="text-sm opacity-40">
                  Upload a lab report to see results here
                </p>
                <button
                  onClick={() => setTab("scan")}
                  className="text-xs font-bold px-4 py-2 rounded-xl mt-2"
                  style={{ background: T.primary + "22", color: T.primary }}
                >
                  Go to Scanner →
                </button>
              </div>
            )}

            {result && !loading && (
              <div className="flex flex-col gap-4 animate-slide-up">
                {/* AI Summary */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: T.card,
                    border: `1px solid ${T.primary}33`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon path={ICONS.spark} size={15} color={T.primary} />
                    <span
                      className="font-syne text-xs font-bold uppercase tracking-widest"
                      style={{ color: T.primary }}
                    >
                      AI Summary
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{result.summary}</p>
                </div>

                {/* Critical flags */}
                {result.critical?.length > 0 && (
                  <div>
                    <p
                      className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                      style={{ color: T.muted }}
                    >
                      ⚠️ Needs Attention
                    </p>
                    <div className="flex flex-col gap-2">
                      {result.critical.map((c, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 rounded-2xl"
                          style={{
                            background: T.danger + "12",
                            border: `1px solid ${T.danger}33`,
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: T.danger + "20" }}
                          >
                            <Icon path={ICONS.alert} size={14} color={T.danger} />
                          </div>
                          <p className="text-sm leading-relaxed">{c}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {result.metrics?.length > 0 && (
                  <div>
                    <p
                      className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                      style={{ color: T.muted }}
                    >
                      All Metrics
                    </p>
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: T.card,
                        border: `1px solid ${T.cardBorder}`,
                      }}
                    >
                      {result.metrics.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-3"
                          style={{
                            borderBottom:
                              i < result.metrics.length - 1
                                ? `1px solid rgba(255,255,255,0.04)`
                                : "none",
                          }}
                        >
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: statusColor(m.status) }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {m.name}
                            </p>
                            <p
                              className="text-xs leading-tight mt-0.5 line-clamp-1"
                              style={{ color: T.muted }}
                            >
                              {m.plain}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold">
                              {m.value}{" "}
                              <span className="text-xs font-normal opacity-50">
                                {m.unit}
                              </span>
                            </p>
                            <span
                              className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-0.5"
                              style={{
                                background: statusColor(m.status) + "20",
                                color: statusColor(m.status),
                              }}
                            >
                              {m.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action */}
                {result.action && (
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      background: T.primary + "12",
                      border: `1px solid ${T.primary}33`,
                    }}
                  >
                    <div className="flex gap-3 items-start">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: T.primary + "22" }}
                      >
                        <Icon path={ICONS.check} size={14} color={T.primary} />
                      </div>
                      <div>
                        <p
                          className="font-syne text-xs font-bold uppercase tracking-wider mb-1.5"
                          style={{ color: T.primary }}
                        >
                          Recommended Action
                        </p>
                        <p className="text-sm leading-relaxed">{result.action}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TRENDS TAB */}
        {tab === "trends" && (
          <div className="pb-16 px-5 pt-2">
            <div className="flex flex-col gap-4">
              {[
                {
                  label: "Glucose (mg/dL)",
                  ref: "Normal < 100",
                  data: [
                    { period: "Aug '24", val: 108, max: 160, color: T.accent },
                    { period: "Nov '24", val: 118, max: 160, color: T.accent },
                    { period: "Feb '25", val: 126, max: 160, color: T.danger },
                  ],
                  note: "↑ Trending upward — prediabetes range",
                  noteColor: T.danger,
                },
                {
                  label: "Total Cholesterol (mg/dL)",
                  ref: "Normal < 200",
                  data: [
                    { period: "Aug '24", val: 198, max: 260, color: T.success },
                    { period: "Nov '24", val: 210, max: 260, color: T.accent },
                    { period: "Feb '25", val: 218, max: 260, color: T.accent },
                  ],
                  note: "↑ Above optimal, discuss with doctor",
                  noteColor: T.accent,
                },
                {
                  label: "Hemoglobin (g/dL)",
                  ref: "Normal 13.5–17.5",
                  data: [
                    { period: "Aug '24", val: 14.2, max: 18, color: T.success },
                    { period: "Nov '24", val: 12.8, max: 18, color: T.accent },
                    { period: "Feb '25", val: 11.8, max: 18, color: T.danger },
                  ],
                  note: "↓ Declining — possible anemia",
                  noteColor: T.danger,
                },
              ].map((chart, ci) => (
                <div
                  key={ci}
                  className="rounded-2xl p-5"
                  style={{
                    background: T.card,
                    border: `1px solid ${T.cardBorder}`,
                  }}
                >
                  <div className="flex items-baseline justify-between mb-4">
                    <p className="font-syne text-sm font-bold">{chart.label}</p>
                    <p className="text-xs opacity-40">{chart.ref}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {chart.data.map((row, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span
                          className="text-xs w-14 text-right flex-shrink-0"
                          style={{ color: T.muted }}
                        >
                          {row.period}
                        </span>
                        <div
                          className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.07)" }}
                        >
                          <div
                            className="h-full rounded-full bar-fill"
                            style={{
                              width: `${(row.val / row.max) * 100}%`,
                              background: row.color,
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-semibold w-10 flex-shrink-0"
                          style={{ color: row.color }}
                        >
                          {row.val}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-xs mt-4 italic"
                    style={{ color: chart.noteColor }}
                  >
                    {chart.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
