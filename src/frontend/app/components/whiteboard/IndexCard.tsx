"use client";

import { useState, CSSProperties } from "react";

interface Props {
  id: string;
  title: string;
  lines: string[];
  detail: string;
  style?: CSSProperties;
}

export default function IndexCard({ id: _id, title, lines, detail, style }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-interactive
      style={{
        position: "absolute",
        width: expanded ? 340 : 260,
        ...style,
        transform: `rotate(${style?.rotate ?? "0deg"}) ${hovered && !expanded ? "translateY(-8px) scale(1.03)" : expanded ? "translateY(-14px) scale(1.06)" : ""}`,
        transition: "transform 0.2s ease, width 0.25s ease, box-shadow 0.2s ease",
        boxShadow: hovered || expanded
          ? "4px 10px 28px rgba(0,0,0,0.18), 2px 4px 8px rgba(0,0,0,0.1)"
          : "2px 5px 12px rgba(0,0,0,0.12)",
        cursor: "pointer",
        zIndex: expanded ? 50 : hovered ? 20 : 10,
        borderRadius: 3,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setExpanded(v => !v)}
    >
      {/* Red header bar */}
      <div style={{
        background: "#dc2626",
        height: 28,
        borderRadius: "3px 3px 0 0",
        display: "flex",
        alignItems: "center",
        paddingLeft: 12,
      }}>
        <span style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "rgba(255,255,255,0.9)",
        }}>
          {title}
        </span>
      </div>

      {/* Card body — lined paper */}
      <div style={{
        background: "#fffef7",
        padding: "12px 14px 16px",
        backgroundImage: "repeating-linear-gradient(transparent, transparent 23px, #c8d4e8 23px, #c8d4e8 24px)",
        backgroundPositionY: "12px",
        minHeight: expanded ? 180 : 130,
        transition: "min-height 0.25s ease",
        borderRadius: "0 0 3px 3px",
        position: "relative",
      }}>
        {/* Pushpin */}
        <div style={{
          position: "absolute",
          top: -6,
          right: 20,
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #fca5a5, #dc2626)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          zIndex: 2,
        }} />

        {expanded ? (
          <p style={{
            fontFamily: "Georgia, serif",
            fontSize: 13,
            lineHeight: 1.7,
            color: "#1e293b",
            margin: 0,
          }}>
            {detail}
          </p>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {lines.map((line, i) => (
              <li key={i} style={{
                fontFamily: "Georgia, serif",
                fontSize: 13,
                lineHeight: "24px",
                color: i === 0 ? "#1e293b" : "#475569",
              }}>
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
