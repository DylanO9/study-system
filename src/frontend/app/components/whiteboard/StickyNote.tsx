"use client";

import { useState, CSSProperties } from "react";

type Color = "yellow" | "blue" | "pink" | "green";

interface Props {
  id: string;
  color: Color;
  title: string;
  preview: string;
  detail: string;
  style?: CSSProperties;
}

const COLORS: Record<Color, { bg: string; fold: string; shadow: string }> = {
  yellow: { bg: "#fde68a", fold: "#f59e0b", shadow: "rgba(245,158,11,0.25)" },
  blue:   { bg: "#bfdbfe", fold: "#3b82f6", shadow: "rgba(59,130,246,0.25)" },
  pink:   { bg: "#fbcfe8", fold: "#ec4899", shadow: "rgba(236,72,153,0.25)" },
  green:  { bg: "#bbf7d0", fold: "#22c55e", shadow: "rgba(34,197,94,0.25)" },
};

export default function StickyNote({ id: _id, color, title, preview, detail, style }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const c = COLORS[color];

  return (
    <div
      data-interactive
      style={{
        position: "absolute",
        width: expanded ? 300 : 220,
        ...style,
        transform: `rotate(${style?.rotate ?? "0deg"}) ${hovered && !expanded ? "translateY(-6px) scale(1.03)" : expanded ? "translateY(-12px) scale(1.05)" : ""}`,
        transition: "transform 0.2s ease, width 0.25s ease, box-shadow 0.2s ease",
        boxShadow: hovered || expanded
          ? `4px 8px 24px ${c.shadow}, 2px 4px 8px rgba(0,0,0,0.12)`
          : `2px 4px 10px rgba(0,0,0,0.1)`,
        cursor: "pointer",
        zIndex: expanded ? 50 : hovered ? 20 : 10,
        borderRadius: 2,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(v => !v)}
    >
      {/* Paper body */}
      <div
        style={{
          background: c.bg,
          padding: "16px 16px 20px",
          position: "relative",
          minHeight: expanded ? 180 : 120,
          transition: "min-height 0.25s ease",
        }}
      >
        {/* Fold corner */}
        <div style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 28,
          height: 28,
          background: `linear-gradient(135deg, ${c.bg} 50%, ${c.fold} 50%)`,
          opacity: 0.7,
        }} />

        <div style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#4b3a1f",
          marginBottom: 8,
          opacity: 0.7,
        }}>
          {title}
        </div>

        <div style={{
          fontFamily: "Georgia, serif",
          fontSize: 14,
          lineHeight: 1.55,
          color: "#2d1f0a",
        }}>
          {expanded ? detail : preview}
        </div>

        {!expanded && (
          <div style={{
            marginTop: 10,
            fontSize: 11,
            color: "#78522a",
            opacity: 0.6,
            fontFamily: "var(--font-geist-mono), monospace",
          }}>
            click to open ↗
          </div>
        )}
      </div>

      {/* Top tape strip */}
      <div style={{
        position: "absolute",
        top: -8,
        left: "50%",
        transform: "translateX(-50%)",
        width: 48,
        height: 16,
        background: "rgba(255,255,255,0.55)",
        borderRadius: 2,
        backdropFilter: "blur(2px)",
      }} />
    </div>
  );
}
