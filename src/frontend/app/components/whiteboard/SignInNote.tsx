"use client";

import { useState, CSSProperties } from "react";
import Link from "next/link";

interface Props {
  href: string;
  style?: CSSProperties & { rotate?: string };
}

export default function SignInNote({ href, style }: Props) {
  const [hovered, setHovered] = useState(false);
  const { rotate, ...rest } = style ?? {};

  return (
    <div
      data-interactive
      style={{
        position: "absolute",
        width: 200,
        ...rest,
        transform: `rotate(${rotate ?? "0deg"}) ${hovered ? "translateY(-8px) scale(1.04)" : ""}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered
          ? "5px 10px 28px rgba(20,83,45,0.2), 2px 4px 10px rgba(0,0,0,0.1)"
          : "3px 6px 14px rgba(20,83,45,0.12)",
        zIndex: hovered ? 50 : 15,
        borderRadius: 2,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={href} style={{ textDecoration: "none" }}>
        {/* Tape */}
        <div style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 48,
          height: 16,
          background: "rgba(255,255,255,0.55)",
          borderRadius: 2,
        }} />

        {/* Body */}
        <div style={{
          background: hovered ? "#d1fae5" : "#bbf7d0",
          padding: "16px 16px 20px",
          transition: "background 0.2s ease",
          position: "relative",
        }}>
          {/* Fold corner */}
          <div style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 26,
            height: 26,
            background: "linear-gradient(135deg, #bbf7d0 50%, #16a34a 50%)",
            opacity: 0.75,
          }} />

          {/* Already have an account label */}
          <div style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#14532d",
            opacity: 0.6,
            marginBottom: 8,
          }}>
            Already studying?
          </div>

          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 16,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#14532d",
            lineHeight: 1.25,
            marginBottom: 6,
          }}>
            Sign in →
          </div>

          <div style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 10,
            color: "#166534",
            opacity: 0.65,
            letterSpacing: "0.04em",
          }}>
            back to your boards
          </div>
        </div>
      </Link>
    </div>
  );
}
