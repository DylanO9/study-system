"use client";

import { useState, useEffect, CSSProperties } from "react";
import { createPortal } from "react-dom";

interface Props {
  src?: string; // video URL — omit for placeholder
  style?: CSSProperties & { rotate?: string };
}

export default function DemoVideoNote({ src, style }: Props) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { rotate, ...rest } = style ?? {};

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* The note on the board */}
      <div
        data-interactive
        style={{
          position: "absolute",
          width: 240,
          ...rest,
          transform: `rotate(${rotate ?? "0deg"}) ${hovered ? "translateY(-8px) scale(1.04)" : ""}`,
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: hovered
            ? "5px 10px 28px rgba(30,58,138,0.22), 2px 4px 10px rgba(0,0,0,0.12)"
            : "3px 6px 16px rgba(30,58,138,0.15)",
          zIndex: hovered ? 50 : 15,
          borderRadius: 2,
          cursor: "pointer",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setOpen(true)}
      >
        {/* Tape */}
        <div style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 56,
          height: 16,
          background: "rgba(255,255,255,0.55)",
          borderRadius: 2,
        }} />

        {/* Body */}
        <div style={{
          background: hovered ? "#dbeafe" : "#bfdbfe",
          padding: "16px 16px 20px",
          transition: "background 0.2s ease",
          position: "relative",
        }}>
          {/* Fold corner */}
          <div style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 28,
            height: 28,
            background: "linear-gradient(135deg, #bfdbfe 50%, #3b82f6 50%)",
            opacity: 0.75,
          }} />

          {/* Play icon */}
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(30,58,138,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            border: "1.5px solid rgba(30,58,138,0.2)",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <polygon points="5,3 13,8 5,13" fill="#1e3a8a" opacity="0.75" />
            </svg>
          </div>

          <div style={{
            fontFamily: "Georgia, serif",
            fontSize: 15,
            fontStyle: "italic",
            fontWeight: "bold",
            color: "#1e3a8a",
            lineHeight: 1.25,
            marginBottom: 6,
          }}>
            Watch the demo
          </div>

          <div style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontSize: 10,
            color: "#1d4ed8",
            opacity: 0.65,
            letterSpacing: "0.05em",
          }}>
            see it in action ↗
          </div>
        </div>
      </div>

      {/* Modal — portaled to body so transform ancestry doesn't break fixed positioning */}
      {mounted && open && createPortal(
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "#fffef7",
              borderRadius: 6,
              padding: 24,
              maxWidth: 720,
              width: "90vw",
              position: "relative",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              style={{
                position: "absolute",
                top: 12,
                right: 14,
                background: "none",
                border: "none",
                fontSize: 20,
                cursor: "pointer",
                color: "#6b7280",
                lineHeight: 1,
              }}
              onClick={() => setOpen(false)}
            >
              ×
            </button>

            <div style={{
              fontFamily: "Georgia, serif",
              fontSize: 13,
              fontStyle: "italic",
              color: "#6b7280",
              marginBottom: 16,
            }}>
              Demo
            </div>

            <div style={{
              width: "100%",
              aspectRatio: "16/9",
              background: "#f1f5f9",
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px dashed #cbd5e1",
              gap: 10,
            }}>
              {src ? (
                <video
                  src={src}
                  controls
                  autoPlay
                  style={{ width: "100%", height: "100%", borderRadius: 4 }}
                />
              ) : (
                <>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <circle cx="20" cy="20" r="18" stroke="#94a3b8" strokeWidth="1.5" />
                    <polygon points="15,12 30,20 15,28" fill="#94a3b8" />
                  </svg>
                  <span style={{
                    fontFamily: "var(--font-geist-mono), monospace",
                    fontSize: 11,
                    color: "#94a3b8",
                    letterSpacing: "0.05em",
                  }}>
                    demo coming soon
                  </span>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
