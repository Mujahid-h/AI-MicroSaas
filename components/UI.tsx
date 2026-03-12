"use client";
import React from "react";

// ── Back Button ─────────────────────────────────────────────────────────────
interface BackButtonProps {
  onClick: () => void;
  color: string;
}
export function BackButton({ onClick, color }: BackButtonProps) {
  return (
    <button
      className="back-btn"
      onClick={onClick}
      style={{
        width: 36,
        height: 36,
        borderRadius: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        border: "none",
        background: "rgba(255,255,255,0.08)",
        flexShrink: 0,
      }}
    >
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

// ── Loader ───────────────────────────────────────────────────────────────────
interface LoaderProps {
  primary: string;
  secondary: string;
  message: string;
}
export function Loader({ primary, secondary, message }: LoaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "40px 20px" }}>
      <div
        className="loader-ring"
        style={{
          borderTopColor: primary,
          borderRightColor: secondary,
          borderBottomColor: "transparent",
          borderLeftColor: "transparent",
        }}
      />
      <div style={{ fontSize: 13, color: "#64748B", textAlign: "center", lineHeight: 1.6 }}>
        {message}
      </div>
    </div>
  );
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
interface TabItem {
  id: string;
  label: string;
}
interface TabsProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  primary: string;
  card: string;
  muted: string;
  activeFg: string;
}
export function Tabs({ tabs, active, onChange, primary, card, muted, activeFg }: TabsProps) {
  return (
    <div style={{ display: "flex", gap: 4, padding: 4, borderRadius: 14, background: card, margin: "0 20px 16px" }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: 10,
            border: "none",
            fontFamily: "var(--font-head)",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            background: active === tab.id ? primary : "transparent",
            color: active === tab.id ? activeFg : muted,
            letterSpacing: "0.3px",
            transition: "all 0.2s",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ── Section Label ─────────────────────────────────────────────────────────────
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "var(--font-head)",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "1.5px",
      textTransform: "uppercase" as const,
      opacity: 0.4,
      padding: "0 20px",
      margin: "16px 0 8px",
      color: "#F1F5F9",
    }}>
      {children}
    </div>
  );
}

// ── Divider ──────────────────────────────────────────────────────────────────
export function Divider() {
  return <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "8px 20px" }} />;
}

// ── Upload Zone ───────────────────────────────────────────────────────────────
interface UploadZoneProps {
  primary: string;
  primaryGlow: string;
  onFileSelect: (file: File) => void;
  accept?: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}
export function UploadZone({ primary, primaryGlow, onFileSelect, accept, title, subtitle, icon }: UploadZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept={accept}
        style={{ display: "none" }}
      />
      <div
        className="upload-zone"
        onClick={() => inputRef.current?.click()}
        style={{
          margin: "16px 20px",
          borderRadius: 20,
          border: `2px dashed ${primary}55`,
          background: primaryGlow,
          padding: "32px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          textAlign: "center",
        }}
      >
        <div style={{ width: 60, height: 60, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: `${primary}22` }}>
          {icon}
        </div>
        <div style={{ fontFamily: "var(--font-head)", fontSize: 16, fontWeight: 700, color: "#F1F5F9" }}>{title}</div>
        <div style={{ fontSize: 12, opacity: 0.6, color: "#F1F5F9" }}>{subtitle}</div>
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>TXT, CSV, or PDF</div>
      </div>
    </>
  );
}

// ── File Badge ────────────────────────────────────────────────────────────────
interface FileBadgeProps {
  fileName: string;
  primary: string;
  card: string;
  cardBorder: string;
}
export function FileBadge({ fileName, primary, card, cardBorder }: FileBadgeProps) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 14px",
      borderRadius: 12,
      background: card,
      border: `1px solid ${cardBorder}`,
      margin: "0 20px 12px",
    }}>
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
      <span style={{ fontSize: 12, color: "#F1F5F9" }}>{fileName}</span>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
interface EmptyStateProps {
  emoji: string;
  message: string;
}
export function EmptyState({ emoji, message }: EmptyStateProps) {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{emoji}</div>
      <div style={{ color: "#64748B", fontSize: 14 }}>{message}</div>
    </div>
  );
}
