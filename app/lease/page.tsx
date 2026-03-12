"use client";
import { useState } from "react";
import Link from "next/link";
import Icon, { ICONS } from "@/components/Icon";
import LoadingSpinner from "@/components/LoadingSpinner";
import UploadZone from "@/components/UploadZone";
import { LeaseResult } from "@/lib/types";
import { SAMPLE_LEASE_TEXT, MOCK_LEASE_LIST } from "@/lib/sample-data";

const T = {
  bg: "#0F0A1E",
  card: "#160D2E",
  cardBorder: "#2D1B69",
  primary: "#F59E0B",
  secondary: "#EC4899",
  accent: "#06B6D4",
  text: "#F1F5F9",
  muted: "#7C6FAB",
  danger: "#EF4444",
  success: "#10B981",
  warning: "#F59E0B",
};

function riskColor(score: number) {
  if (score >= 70) return T.danger;
  if (score >= 40) return T.warning;
  return T.success;
}

function severityColor(s: string) {
  if (s === "high") return T.danger;
  if (s === "medium") return T.warning;
  return T.success;
}

export default function LeasePage() {
  const [tab, setTab] = useState<"upload" | "audit" | "alerts">("upload");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LeaseResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async (text: string, name: string) => {
    setLoading(true);
    setError(null);
    setFileName(name);
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
      setError(e instanceof Error ? e.message : "Analysis failed");
    }
    setLoading(false);
  };

  const tabs = [
    { id: "upload", label: "📄 Upload" },
    { id: "audit", label: "🔍 Audit" },
    { id: "alerts", label: "🔔 Alerts" },
  ] as const;

  const riskDashOffset = result
    ? 283 - (result.riskScore / 100) * 283
    : 283;

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: T.text }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div
          className="sticky top-0 z-50 glass px-6 py-4 flex items-center gap-3"
          style={{
            background: T.bg + "DD",
            borderBottom: `1px solid ${T.cardBorder}`,
          }}
        >
          <Link
            href="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <Icon path={ICONS.back} size={17} color={T.primary} />
          </Link>
          <div className="flex-1">
            <h1 className="font-syne text-base font-bold">Lease Auditor AI</h1>
            <p className="text-xs" style={{ color: T.muted }}>
              Smart Contract Analysis
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(245,158,11,0.12)" }}
          >
            <Icon path={ICONS.bell} size={18} color={T.primary} />
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
                  background:
                    tab === t.id ? T.primary : "transparent",
                  color: tab === t.id ? "#000" : T.muted,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* UPLOAD TAB */}
        {tab === "upload" && (
          <div className="pb-16">
            <div className="py-4">
              <UploadZone
                onFile={runAnalysis}
                primaryColor={T.primary}
                title="Upload Lease Document"
                subtitle="Commercial, retail or equipment leases"
                accept=".txt,.pdf,.doc"
              />
            </div>

            {fileName && (
              <div
                className="mx-5 flex items-center gap-2 px-4 py-3 rounded-xl mb-3"
                style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}
              >
                <Icon path={ICONS.file} size={14} color={T.primary} />
                <span className="text-xs">{fileName}</span>
              </div>
            )}

            <div className="mx-5 mb-6">
              <p
                className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                style={{ color: T.muted }}
              >
                — or try a demo —
              </p>
              <button
                onClick={() =>
                  runAnalysis(SAMPLE_LEASE_TEXT, "commercial_lease.txt")
                }
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-syne font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50"
                style={{
                  background: `linear-gradient(135deg, ${T.primary}, ${T.secondary})`,
                  color: "#fff",
                }}
              >
                <Icon path={ICONS.building} size={16} color="#fff" />
                Audit Sample Commercial Lease
              </button>
            </div>

            {loading && (
              <LoadingSpinner
                color={T.primary}
                secondaryColor={T.secondary}
                message="Scanning lease for risks..."
                submessage="Finding hidden fees, gotcha clauses & key dates"
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

            {/* What we scan */}
            <div className="px-5">
              <p
                className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                style={{ color: T.muted }}
              >
                What we scan for
              </p>
              <div className="flex flex-col gap-2">
                {[
                  {
                    icon: ICONS.calendar,
                    label: "Critical Dates",
                    desc: "Renewals, notice periods, option windows",
                  },
                  {
                    icon: ICONS.dollar,
                    label: "Hidden Fees",
                    desc: "CAM charges, reconciliations, escalations",
                  },
                  {
                    icon: ICONS.alert,
                    label: "Gotcha Clauses",
                    desc: "Personal guarantees, holdovers, penalties",
                  },
                  {
                    icon: ICONS.shield,
                    label: "Risk Score",
                    desc: "0-100 overall risk rating for your lease",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{
                      background: T.card,
                      border: `1px solid ${T.cardBorder}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: T.primary + "18" }}
                    >
                      <Icon path={item.icon} size={16} color={T.primary} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-xs opacity-50">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Lease list */}
            <div className="px-5 mt-6">
              <p
                className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                style={{ color: T.muted }}
              >
                Your Leases
              </p>
              {MOCK_LEASE_LIST.map((l) => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 p-4 rounded-2xl mb-2"
                  style={{
                    background: T.card,
                    border: `1px solid ${T.cardBorder}`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                    style={{ background: riskColor(l.risk) + "18" }}
                  >
                    🏢
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{l.address}</p>
                    <p className="text-xs opacity-40">
                      {l.type} · Expires {l.expiry}
                    </p>
                  </div>
                  <div
                    className="text-xs font-bold px-2 py-1 rounded-lg"
                    style={{
                      background: riskColor(l.risk) + "18",
                      color: riskColor(l.risk),
                    }}
                  >
                    {l.risk}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AUDIT TAB */}
        {tab === "audit" && (
          <div className="pb-16 px-5 pt-2">
            {loading && (
              <LoadingSpinner
                color={T.primary}
                secondaryColor={T.secondary}
                message="Auditing your lease..."
              />
            )}

            {!loading && !result && (
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <div className="text-5xl">📋</div>
                <p className="text-sm opacity-40">
                  Upload a lease to see the audit
                </p>
                <button
                  onClick={() => setTab("upload")}
                  className="text-xs font-bold px-4 py-2 rounded-xl mt-2"
                  style={{ background: T.primary + "22", color: T.primary }}
                >
                  Go to Upload →
                </button>
              </div>
            )}

            {result && !loading && (
              <div className="flex flex-col gap-4 animate-slide-up">
                {/* Risk Score Card */}
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: T.card,
                    border: `1px solid ${riskColor(result.riskScore)}44`,
                  }}
                >
                  <div className="flex items-center gap-5">
                    {/* SVG Ring */}
                    <div className="relative flex-shrink-0">
                      <svg width="80" height="80" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={riskColor(result.riskScore)}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray="283"
                          strokeDashoffset={riskDashOffset}
                          className="risk-ring"
                          style={{
                            transform: "rotate(-90deg)",
                            transformOrigin: "center",
                            transition: "stroke-dashoffset 1.5s ease",
                          }}
                        />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={riskColor(result.riskScore)}
                          fontSize="18"
                          fontWeight="800"
                          fontFamily="Syne, sans-serif"
                        >
                          {result.riskScore}
                        </text>
                      </svg>
                    </div>
                    <div>
                      <div
                        className="text-xs font-syne font-bold uppercase tracking-widest mb-1"
                        style={{ color: riskColor(result.riskScore) }}
                      >
                        Risk Score
                      </div>
                      <div className="font-syne text-xl font-bold mb-2">
                        {result.riskScore >= 70
                          ? "High Risk"
                          : result.riskScore >= 40
                          ? "Moderate Risk"
                          : "Low Risk"}
                      </div>
                      <p className="text-xs opacity-50 leading-relaxed">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hidden Fees */}
                {result.hiddenFees?.length > 0 && (
                  <div>
                    <p
                      className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                      style={{ color: T.muted }}
                    >
                      💸 Hidden Fees
                    </p>
                    <div className="flex flex-col gap-2">
                      {result.hiddenFees.map((f, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl border-l-4"
                          style={{
                            background: T.card,
                            borderColor: severityColor(f.risk),
                          }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <p className="text-sm font-semibold">{f.name}</p>
                            <p
                              className="text-sm font-bold flex-shrink-0"
                              style={{ color: severityColor(f.risk) }}
                            >
                              {f.amount}
                            </p>
                          </div>
                          <p className="text-xs opacity-60 leading-relaxed">
                            {f.explanation}
                          </p>
                          <span
                            className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-2"
                            style={{
                              background: severityColor(f.risk) + "20",
                              color: severityColor(f.risk),
                            }}
                          >
                            {f.risk} risk
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Gotcha Clauses */}
                {result.gotchaClauses?.length > 0 && (
                  <div>
                    <p
                      className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                      style={{ color: T.muted }}
                    >
                      ⚠️ Gotcha Clauses
                    </p>
                    <div className="flex flex-col gap-2">
                      {result.gotchaClauses.map((c, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-2xl border-l-4"
                          style={{
                            background: T.card,
                            borderColor: severityColor(c.severity),
                          }}
                        >
                          <div
                            className="text-[10px] font-bold uppercase tracking-wider mb-1"
                            style={{ color: severityColor(c.severity) }}
                          >
                            {c.type} · {c.severity} risk
                          </div>
                          <p className="text-sm font-semibold mb-1.5">
                            {c.title}
                          </p>
                          <p className="text-xs opacity-60 leading-relaxed">
                            {c.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Savings Tip */}
                {result.savings && (
                  <div
                    className="p-4 rounded-2xl"
                    style={{
                      background: T.primary + "12",
                      border: `1px solid ${T.primary}33`,
                    }}
                  >
                    <p
                      className="font-syne text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: T.primary }}
                    >
                      💡 Negotiation Tip
                    </p>
                    <p className="text-sm leading-relaxed">{result.savings}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ALERTS TAB */}
        {tab === "alerts" && (
          <div className="pb-16 px-5 pt-2">
            <p
              className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
              style={{ color: T.muted }}
            >
              📅 Upcoming Deadlines
            </p>

            {result?.keyDates ? (
              <div className="flex flex-col gap-2">
                {result.keyDates.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{
                      background: d.urgent ? T.danger + "12" : T.card,
                      border: `1px solid ${d.urgent ? T.danger + "44" : T.cardBorder}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: (d.urgent ? T.danger : T.primary) + "20",
                      }}
                    >
                      <Icon
                        path={ICONS.calendar}
                        size={16}
                        color={d.urgent ? T.danger : T.primary}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-semibold">{d.label}</p>
                        <span
                          className="text-xs font-bold ml-2 flex-shrink-0"
                          style={{ color: d.urgent ? T.danger : T.muted }}
                        >
                          {d.daysUntil > 0 ? `${d.daysUntil}d` : "Past"}
                        </span>
                      </div>
                      <p
                        className="text-xs mt-0.5 mb-1.5"
                        style={{ color: T.primary }}
                      >
                        {d.date}
                      </p>
                      <p className="text-xs opacity-60">{d.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {[
                  {
                    label: "Renewal Notice Deadline",
                    date: "Oct 14, 2026",
                    days: 216,
                    urgent: false,
                    note: "Must notify 180 days before Feb 28, 2027 expiration",
                  },
                  {
                    label: "CAM Reconciliation Due",
                    date: "Mar 31, 2026",
                    days: 19,
                    urgent: true,
                    note: "Annual reconciliation — request landlord's actual expense report immediately",
                  },
                  {
                    label: "Personal Guarantee Review",
                    date: "Jun 1, 2026",
                    days: 81,
                    urgent: false,
                    note: "Consider negotiating a cap or burn-down on personal guarantee",
                  },
                  {
                    label: "Lease Expiration",
                    date: "Feb 28, 2027",
                    days: 353,
                    urgent: false,
                    note: "Start renewal discussions 6+ months early to preserve leverage",
                  },
                ].map((d, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{
                      background: d.urgent ? T.danger + "12" : T.card,
                      border: `1px solid ${d.urgent ? T.danger + "44" : T.cardBorder}`,
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: (d.urgent ? T.danger : T.primary) + "20",
                      }}
                    >
                      <Icon
                        path={ICONS.calendar}
                        size={16}
                        color={d.urgent ? T.danger : T.primary}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-semibold">{d.label}</p>
                        <span
                          className="text-xs font-bold ml-2 flex-shrink-0"
                          style={{ color: d.urgent ? T.danger : T.muted }}
                        >
                          {d.days}d
                        </span>
                      </div>
                      <p
                        className="text-xs mt-0.5 mb-1.5"
                        style={{ color: T.primary }}
                      >
                        {d.date}
                      </p>
                      <p className="text-xs opacity-60">{d.note}</p>
                      {d.urgent && (
                        <span
                          className="inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-2"
                          style={{
                            background: T.danger + "20",
                            color: T.danger,
                          }}
                        >
                          ACTION REQUIRED
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Alert Settings */}
            <div className="mt-6">
              <p
                className="text-xs font-syne font-bold uppercase tracking-widest mb-3"
                style={{ color: T.muted }}
              >
                Alert Settings
              </p>
              {[
                { label: "90-day renewal reminders", on: true },
                { label: "CAM reconciliation alerts", on: true },
                { label: "Late fee warnings", on: false },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl mb-2"
                  style={{
                    background: T.card,
                    border: `1px solid ${T.cardBorder}`,
                  }}
                >
                  <p className="text-sm">{s.label}</p>
                  <div
                    className="w-10 h-5 rounded-full relative flex items-center px-0.5"
                    style={{ background: s.on ? T.primary : "rgba(255,255,255,0.1)" }}
                  >
                    <div
                      className="w-4 h-4 rounded-full bg-white transition-all"
                      style={{ marginLeft: s.on ? "20px" : "0" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
