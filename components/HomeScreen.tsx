"use client";

type Screen = "home" | "lab" | "lease";

interface HomeScreenProps {
  onSelect: (screen: Screen) => void;
}

export default function HomeScreen({ onSelect }: HomeScreenProps) {
  return (
    <div style={{ background: "#0A0C18", minHeight: "100%", color: "#F1F5F9", fontFamily: "var(--font-body)" }}>
      {/* Hero */}
      <div style={{ padding: "60px 28px 40px", position: "relative", overflow: "hidden" }}>
        {/* Orbs */}
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "rgba(0,212,170,0.12)", top: -60, right: -60, filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", background: "rgba(245,158,11,0.10)", bottom: -40, left: -40, filter: "blur(60px)", pointerEvents: "none" }} />

        {/* Tag */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", padding: "6px 12px", borderRadius: 20, marginBottom: 20 }}>
          <div className="animate-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D4AA" }} />
          <span style={{ fontFamily: "var(--font-head)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#94A3B8" }}>AI-Native Micro-SaaS</span>
        </div>

        {/* Title */}
        <div style={{ fontFamily: "var(--font-head)", fontSize: 32, fontWeight: 800, lineHeight: 1.1, marginBottom: 12 }}>
          Two AI Agents.<br />
          <span className="gradient-text-lab">Zero Confusion.</span>
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.65 }}>
          Powered by Claude AI. Handles the high-friction admin tasks you hate — so you don&apos;t have to.
        </div>
      </div>

      {/* App Cards */}
      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Lab Card */}
        <div
          className="app-card-hover"
          onClick={() => onSelect("lab")}
          style={{
            background: "#111827",
            border: "1px solid rgba(0,212,170,0.2)",
            borderRadius: 24,
            padding: 24,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(0,212,170,0.08)",
          }}
        >
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)", borderRadius: "0 24px 0 0", pointerEvents: "none" }} />

          <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(0,212,170,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#00D4AA" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3h6m-6 0v6l-4 9a1 1 0 00.9 1.4h12.2a1 1 0 00.9-1.4L15 9V3M9 3H6m12 0h-3" />
            </svg>
          </div>

          <div style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Lab Report Summarizer</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.7, marginBottom: 16 }}>
            Upload your complex medical lab results. AI translates medical jargon into plain English and tracks trends over time.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 16 }}>
            {["Plain English", "Trend Tracking", "HIPAA-Grade"].map((c) => (
              <div key={c} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", padding: "4px 10px", borderRadius: 20, background: "rgba(0,212,170,0.12)", color: "#00D4AA", textTransform: "uppercase" as const }}>
                {c}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex" }}>
              {["👨‍⚕️", "👩‍⚕️", "🏥"].map((e, i) => (
                <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginLeft: i > 0 ? -8 : 0, border: "2px solid #111827" }}>
                  {e}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#64748B" }}>Tap to open →</div>
          </div>
        </div>

        {/* Lease Card */}
        <div
          className="app-card-hover"
          onClick={() => onSelect("lease")}
          style={{
            background: "#160D2E",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 24,
            padding: 24,
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 0 40px rgba(245,158,11,0.06)",
          }}
        >
          <div style={{ position: "absolute", top: 0, right: 0, width: 120, height: 120, background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", borderRadius: "0 24px 0 0", pointerEvents: "none" }} />

          <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(245,158,11,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10" />
            </svg>
          </div>

          <div style={{ fontFamily: "var(--font-head)", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>AI Lease Auditor</div>
          <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.7, marginBottom: 16 }}>
            Scan property or equipment leases. Extracts key dates, hidden fees, and gotcha clauses — with mobile alerts before renewal deadlines.
          </div>

          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, marginBottom: 16 }}>
            {["Hidden Fees", "Deadline Alerts", "Risk Score"].map((c) => (
              <div key={c} style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.5px", padding: "4px 10px", borderRadius: 20, background: "rgba(245,158,11,0.12)", color: "#F59E0B", textTransform: "uppercase" as const }}>
                {c}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex" }}>
              {["🏢", "🏪", "🏭"].map((e, i) => (
                <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: "#2D1B69", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, marginLeft: i > 0 ? -8 : 0, border: "2px solid #160D2E" }}>
                  {e}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, color: "#7C6FAB" }}>Tap to open →</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "28px 20px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#334155", letterSpacing: 1, fontFamily: "var(--font-head)", textTransform: "uppercase" as const }}>
          Built with Claude AI · 2025
        </div>
      </div>
    </div>
  );
}
