"use client";

import { useState, CSSProperties } from "react";
import Link from "next/link";

interface Props {
  href: string;
  style?: CSSProperties & { rotate?: string };
}

export default function CTANote({ href, style }: Props) {
  const [hovered, setHovered] = useState(false);
  const { rotate, ...rest } = style ?? {};

  return (
    <div
      data-interactive
      style={{
        position: "absolute",
        ...rest,
        transform: `rotate(${rotate ?? "0deg"}) ${hovered ? "translateY(-10px) scale(1.06)" : ""}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered
          ? "6px 12px 32px rgba(180,83,9,0.3), 2px 4px 10px rgba(0,0,0,0.15)"
          : "3px 6px 16px rgba(180,83,9,0.2)",
        zIndex: hovered ? 50 : 15,
        borderRadius: 2,
        width: 220,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={href} style={{ textDecoration: "none" }}>
        {/* Body */}
        <div style={{
          background: hovered ? "#fef3c7" : "#fde68a",
          padding: "20px 20px 24px",
          transition: "background 0.2s ease",
          position: "relative",
        }}>
          {/* Tape strip */}
          <div style={{
            position: "absolute",
            top: -8,
            left: "50%",
            transform: "translateX(-50%)",
            width: 56,
            height: 16,
            background: "rgba(255,255,255,0.6)",
            borderRadius: 2,
          }} />

          {/* Fold corner */}
          <div style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 32,
            height: 32,
            background: "linear-gradient(135deg, #fde68a 50%, #d97706 50%)",
            opacity: 0.8,
          }} />

          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 22,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#78350f",
            lineHeight: 1.2,
            marginBottom: 10,
          }}>
            Try it →
          </div>

          <div style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 11,
            color: "#92400e",
            opacity: 0.75,
            letterSpacing: "0.05em",
          }}>
            Open your workspace
          </div>
        </div>
      </Link>
    </div>
  );
}
