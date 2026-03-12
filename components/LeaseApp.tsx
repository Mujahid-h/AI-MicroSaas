"use client";
import { useState } from "react";
import { leaseTheme, SAMPLE_LEASE } from "@/lib/theme";
import type { LeaseResult } from "@/lib/types";
import {
  BackButton,
  Loader,
  Tabs,
  SectionLabel,
  UploadZone,
  FileBadge,
  EmptyState,
} from "./UI";

const t = leaseTheme;

const LEASE_TABS = [
  { id: "upload", label: "📄 Upload" },
  { id: "audit", label: "🔍 Audit" },
  { id: "alerts", label: "🔔 Alerts" },
];

const DEFAULT_ALERTS = [
  {
    label: "Renewal Notice Deadline",
    date: "Oct 14, 2026",
    daysUntil: 216,
    urgent: false,
    note: "Must notify 180 days before Feb 28, 2027 expiration",
  },
  {
    label: "CAM Reconciliation Due",
    date: "Mar 31, 2026",
    daysUntil: 19,
    urgent: true,
    note: "Annual reconciliation — request landlord's actual expense report",
  },
  {
    label: "Lease Expiration",
    date: "Feb 28, 2027",
    daysUntil: 353,
    urgent: false,
    note: "Start renewal discussions at least 6 months early",
  },
];

const SCAN_FEATURES = [
  {
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 4h18v18H3zM16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    label: "Critical Dates",
    desc: "Renewals, notice periods, option windows",
  },
  {
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    label: "Hidden Fees",
    desc: "CAM charges, reconciliations, escalations",
  },
  {
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
      </svg>
    ),
    label: "Gotcha Clauses",
    desc: "Personal guarantees, holdovers, penalties",
  },
];

function severityColor(s: string): string {
  if (s === "high") return t.danger;
  if (s === "medium") return t.accent;
  return t.success;
}

function riskColor(score: number): string {
  if (score >= 70) return t.danger;
  if (score >= 40) return t.accent;
  return t.success;
}

export default function LeaseApp({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState("upload");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LeaseResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (text: string) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/analyze-lease", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setTab("audit");
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

  const alerts = result?.keyDates ?? DEFAULT_ALERTS;

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
          <div style={{ fontFamily: "var(--font-head)", fontSize: 17, fontWeight: 700 }}>Lease Auditor AI</div>
          <div style={{ fontSize: 11, color: t.muted }}>Smart Contract Analysis</div>
        </div>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={LEASE_TABS}
        active={tab}
        onChange={setTab}
        primary={t.primary}
        card={t.card}
        muted={t.muted}
        activeFg="#000"
      />

      {/* ── UPLOAD TAB ── */}
      {tab === "upload" && (
        <>
          <UploadZone
            primary={t.primary}
            primaryGlow={t.primaryGlow}
            onFileSelect={handleFile}
            accept=".txt,.pdf,.doc"
            title="Upload Lease Document"
            subtitle="Commercial, retail, or equipment leases"
            icon={
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke={t.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
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
            onClick={() => { setFileName("commercial_lease.txt"); runAnalysis(SAMPLE_LEASE); }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10" />
            </svg>
            Audit Sample Commercial Lease
          </button>

          {loading && <Loader primary={t.primary} secondary={t.secondary} message={"Scanning for hidden fees,\ngotcha clauses & key dates…"} />}

          <SectionLabel>What We Scan For</SectionLabel>
          <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
            {SCAN_FEATURES.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 14, background: t.card, border: `1px solid ${t.cardBorder}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `${t.primary}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: t.muted }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ height: 20 }} />
        </>
      )}

      {/* ── AUDIT TAB ── */}
      {tab === "audit" && (
        <>
          {loading && <Loader primary={t.primary} secondary={t.secondary} message="Auditing your lease…" />}
          {!loading && !result && <EmptyState emoji="📋" message="Upload a lease to see the audit results here" />}

          {result && (
            <div className="animate-fade-in">
              {/* Risk Score */}
              <div style={{ margin: "12px 20px", borderRadius: 20, padding: 20, background: t.card, border: `1px solid ${riskColor(result.riskScore)}44` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 13, fontWeight: 700 }}>Risk Score</div>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "var(--font-head)", color: riskColor(result.riskScore) }}>
                    {result.riskScore}<span style={{ fontSize: 14, opacity: 0.5 }}>/100</span>
                  </div>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.1)", overflow: "hidden", marginBottom: 12 }}>
                  <div className="risk-bar-fill" style={{ height: "100%", width: `${result.riskScore}%`, background: riskColor(result.riskScore), borderRadius: 3 }} />
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.85 }}>{result.summary}</div>
              </div>

              {/* Hidden Fees */}
              {result.hiddenFees?.length > 0 && (
                <div style={{ padding: "0 20px" }}>
                  <SectionLabel>💸 Hidden Fees</SectionLabel>
                  {result.hiddenFees.map((f, i) => (
                    <div key={i} className="animate-slide-up" style={{
                      borderRadius: 14, padding: "14px 16px", marginBottom: 10,
                      background: t.card,
                      borderLeft: `3px solid ${severityColor(f.risk)}`,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{f.name}</div>
                        <div style={{ fontFamily: "var(--font-head)", fontSize: 14, fontWeight: 800, color: severityColor(f.risk) }}>
                          {f.amount}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>{f.explanation}</div>
                      <div style={{ marginTop: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", padding: "2px 8px", borderRadius: 10, background: `${severityColor(f.risk)}22`, color: severityColor(f.risk), textTransform: "uppercase" as const }}>
                          {f.risk} risk
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Gotcha Clauses */}
              {result.gotchaClauses?.length > 0 && (
                <div style={{ padding: "0 20px" }}>
                  <SectionLabel>⚠️ Gotcha Clauses</SectionLabel>
                  {result.gotchaClauses.map((c, i) => (
                    <div key={i} className="animate-slide-up" style={{
                      borderRadius: 14, padding: "14px 16px", marginBottom: 10,
                      background: t.card,
                      borderLeft: `3px solid ${severityColor(c.severity)}`,
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" as const, color: severityColor(c.severity), opacity: 0.9, marginBottom: 4 }}>
                        {c.type} · {c.severity} risk
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{c.title}</div>
                      <div style={{ fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>{c.detail}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Savings Tip */}
              {result.savings && (
                <div style={{ margin: "4px 20px 20px", padding: 16, borderRadius: 16, background: `${t.primary}18`, border: `1px solid ${t.primary}44` }}>
                  <div style={{ fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, color: t.primary, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" as const }}>
                    💡 Negotiation Tip
                  </div>
                  <div style={{ fontSize: 13, lineHeight: 1.5 }}>{result.savings}</div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── ALERTS TAB ── */}
      {tab === "alerts" && (
        <div style={{ padding: "0 20px" }}>
          <SectionLabel>📅 Key Dates & Deadlines</SectionLabel>
          {alerts.map((d, i) => (
            <div key={i} className="animate-slide-up" style={{
              borderRadius: 14, padding: "14px 16px", marginBottom: 10,
              display: "flex", gap: 12, alignItems: "flex-start",
              background: d.urgent ? `${t.danger}15` : t.card,
              border: `1px solid ${d.urgent ? `${t.danger}44` : t.cardBorder}`,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${d.urgent ? t.danger : t.primary}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={d.urgent ? t.danger : t.primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 4h18v18H3zM16 2v4M8 2v4M3 10h18" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{d.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: d.urgent ? t.danger : t.muted, flexShrink: 0, marginLeft: 8 }}>
                    {d.daysUntil > 0 ? `${d.daysUntil}d` : "Past"}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: t.primary, marginBottom: 4 }}>{d.date}</div>
                <div style={{ fontSize: 11, opacity: 0.7, lineHeight: 1.4 }}>{d.note}</div>
                {d.urgent && (
                  <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.5px", padding: "3px 8px", borderRadius: 10, background: `${t.danger}22`, color: t.danger }}>
                    <div className="animate-pulse-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: t.danger }} />
                    ACTION REQUIRED
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Alert Setup CTA */}
          <div style={{ margin: "16px 0 20px", padding: 16, borderRadius: 16, background: `${t.secondary}15`, border: `1px solid ${t.secondary}33` }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700, color: t.secondary, marginBottom: 6, letterSpacing: 1, textTransform: "uppercase" as const }}>
              📱 Mobile Alerts
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, marginBottom: 12 }}>
              Get push notifications 30, 60, and 90 days before each critical deadline.
            </div>
            <button style={{
              padding: "10px 16px", borderRadius: 10, border: `1px solid ${t.secondary}44`,
              background: `${t.secondary}22`, color: t.secondary,
              fontFamily: "var(--font-head)", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: "0.5px",
            }}>
              Enable Notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
