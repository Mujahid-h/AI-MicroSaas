# 🧬 AI Micro-SaaS — Lab Report Summarizer + Lease Auditor

Two production-ready AI agents built with **Next.js 15**, **TypeScript**, and **Claude AI**.

---

## ⚡ Quick Start (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Add your Anthropic API key
cp .env.local.example .env.local
# → Edit .env.local and paste your key from https://console.anthropic.com

# 3. Run the app
npm run dev
# → Open http://localhost:3000
```

---

## 📁 Project Structure

```
ai-microsaas/
├── app/
│   ├── page.tsx                  # Home screen — picks which app to open
│   ├── layout.tsx                # Root layout + Google Fonts
│   ├── globals.css               # Tailwind + custom animations
│   ├── lab/page.tsx              # 🔬 Lab Report Summarizer (3 tabs)
│   ├── lease/page.tsx            # 📋 Lease Auditor (3 tabs)
│   └── api/
│       ├── analyze-lab/route.ts  # Claude API → lab analysis
│       └── analyze-lease/route.ts# Claude API → lease analysis
├── components/
│   ├── Icon.tsx                  # SVG icon system
│   ├── LoadingSpinner.tsx        # Animated loader
│   └── UploadZone.tsx            # File upload dropzone
├── lib/
│   ├── types.ts                  # TypeScript interfaces
│   └── sample-data.ts            # Demo data (CBC report, commercial lease)
├── .env.local.example            # ← Copy this to .env.local
└── README.md
```

---

## 🔬 Lab Report Summarizer

| Tab | What it does |
|-----|-------------|
| 📷 Scan | Upload `.txt` / `.csv` lab file, or run the sample CBC demo |
| 🔬 Results | AI summary, critical flags, per-metric plain-English explanations |
| 📈 Trends | Visual bar charts tracking glucose, cholesterol, hemoglobin over time |

## 📋 Lease Auditor

| Tab | What it does |
|-----|-------------|
| 📄 Upload | Upload `.txt` lease file, or run the sample commercial lease demo |
| 🔍 Audit | Risk score ring, hidden fees, gotcha clauses, negotiation tip |
| 🔔 Alerts | Countdown to every critical deadline with urgency flags |

---

## 🛠 Tech Stack

- **Next.js 15** — App Router, server components, API routes
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling
- **@anthropic-ai/sdk** — Official Claude SDK
- **Google Fonts** — Syne (headings) + DM Sans (body)

---

## 🚀 Deploy to Vercel

```bash
npx vercel
# Add ANTHROPIC_API_KEY in Vercel → Project Settings → Environment Variables
```

---

## 🔑 Getting an API Key

1. Go to https://console.anthropic.com
2. Create an account / sign in
3. Navigate to **API Keys** → **Create Key**
4. Paste it into `.env.local` as `ANTHROPIC_API_KEY=sk-ant-...`
