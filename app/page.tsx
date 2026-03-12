import Link from "next/link";
import Icon, { ICONS } from "@/components/Icon";

const apps = [
  {
    slug: "lab",
    emoji: "🔬",
    title: "Lab Report Summarizer",
    tagline: "Medical jargon → Plain English",
    description:
      "Upload your complex lab results. Claude AI translates every metric into plain English, flags concerns, and tracks your health trends over time.",
    chips: ["Plain English", "Trend Tracking", "HIPAA-Grade"],
    primaryColor: "#00D4AA",
    secondaryColor: "#7C3AED",
    bg: "#111827",
    border: "rgba(0,212,170,0.2)",
    glow: "rgba(0,212,170,0.08)",
    icon: ICONS.flask,
    avatars: ["👨‍⚕️", "👩‍⚕️", "🏥"],
  },
  {
    slug: "lease",
    emoji: "📋",
    title: "AI Lease Auditor",
    tagline: "Hidden fees & gotcha clauses exposed",
    description:
      "Scan any commercial or equipment lease. AI extracts key renewal dates, uncovers hidden fees, and scores your risk — with deadline alerts.",
    chips: ["Hidden Fees", "Deadline Alerts", "Risk Score"],
    primaryColor: "#F59E0B",
    secondaryColor: "#EC4899",
    bg: "#160D2E",
    border: "rgba(245,158,11,0.2)",
    glow: "rgba(245,158,11,0.06)",
    icon: ICONS.building,
    avatars: ["🏢", "🏪", "🏭"],
  },
];

export default function Home() {
  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#080B14" }}
    >
      {/* Background orbs */}
      <div
        className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-20 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #00D4AA, transparent)" }}
      />
      <div
        className="absolute top-[-100px] right-[-150px] w-[400px] h-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }}
      />
      <div
        className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #F59E0B, transparent)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse-dot"
              style={{ background: "#00D4AA" }}
            />
            <span
              className="font-syne text-xs font-bold tracking-[2px] uppercase"
              style={{ color: "#94A3B8" }}
            >
              AI-Native Micro-SaaS
            </span>
          </div>

          <h1 className="font-syne text-5xl md:text-7xl font-extrabold text-white leading-none mb-4">
            Two AI Agents.{" "}
            <span className="gradient-text-lab">Zero Confusion.</span>
          </h1>

          <p className="text-lg md:text-xl opacity-50 max-w-2xl mx-auto leading-relaxed">
            Powered by Claude AI. Handles the high-friction admin tasks you
            hate — so you don&apos;t have to.
          </p>
        </div>

        {/* App Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 stagger-children">
          {apps.map((app) => (
            <Link key={app.slug} href={`/${app.slug}`} className="block">
              <div
                className="card-hover rounded-3xl p-7 relative overflow-hidden cursor-pointer animate-slide-up"
                style={{
                  background: app.bg,
                  border: `1px solid ${app.border}`,
                  boxShadow: `0 0 60px ${app.glow}`,
                }}
              >
                {/* Top glow */}
                <div
                  className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, ${app.primaryColor}18 0%, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: app.primaryColor + "18" }}
                >
                  <Icon path={app.icon} size={26} color={app.primaryColor} />
                </div>

                {/* Tagline */}
                <div
                  className="text-xs font-syne font-bold tracking-widest uppercase mb-2"
                  style={{ color: app.primaryColor + "AA" }}
                >
                  {app.tagline}
                </div>

                {/* Title */}
                <h2 className="font-syne text-2xl font-bold text-white mb-3">
                  {app.title}
                </h2>

                {/* Description */}
                <p className="text-sm leading-relaxed mb-5 opacity-60">
                  {app.description}
                </p>

                {/* Chips */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {app.chips.map((chip) => (
                    <span
                      key={chip}
                      className="text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full"
                      style={{
                        background: app.primaryColor + "18",
                        color: app.primaryColor,
                      }}
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="flex">
                    {app.avatars.map((a, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                        style={{
                          background:
                            i === 0
                              ? "rgba(255,255,255,0.08)"
                              : "rgba(255,255,255,0.05)",
                          marginLeft: i > 0 ? "-10px" : "0",
                          border: `2px solid ${app.bg}`,
                          zIndex: 3 - i,
                          position: "relative",
                        }}
                      >
                        {a}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: app.primaryColor }}
                    >
                      Open App
                    </span>
                    <Icon
                      path={ICONS.arrowRight}
                      size={14}
                      color={app.primaryColor}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tech Stack Footer */}
        <div className="text-center">
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border"
            style={{
              background: "rgba(255,255,255,0.03)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Icon path={ICONS.shield} size={14} color="#64748B" />
            <span className="text-xs tracking-widest uppercase font-syne font-semibold opacity-30">
              Built with Next.js 15 · Claude AI · TypeScript
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
