import { CSSProperties } from "react";

interface Props {
  type: "coffee-ring" | "erased-text" | "pencil";
  style?: CSSProperties;
  text?: string;
}

export default function AmbientDetail({ type, style, text }: Props) {
  if (type === "coffee-ring") {
    return (
      <svg
        style={{ position: "absolute", pointerEvents: "none", ...style }}
        width="80"
        height="80"
        viewBox="0 0 80 80"
      >
        {/* Outer ring */}
        <circle cx="40" cy="40" r="36" fill="none" stroke="#c8a46e" strokeWidth="3" opacity="0.25" />
        {/* Inner ring */}
        <circle cx="40" cy="40" r="28" fill="none" stroke="#c8a46e" strokeWidth="1.5" opacity="0.18" />
        {/* Faint fill */}
        <circle cx="40" cy="40" r="36" fill="#c8a46e" opacity="0.04" />
        {/* Irregular stain patches */}
        <ellipse cx="55" cy="30" rx="6" ry="4" fill="#c8a46e" opacity="0.07" transform="rotate(20,55,30)" />
        <ellipse cx="20" cy="50" rx="5" ry="3" fill="#c8a46e" opacity="0.06" transform="rotate(-15,20,50)" />
      </svg>
    );
  }

  if (type === "erased-text") {
    return (
      <div
        style={{
          position: "absolute",
          pointerEvents: "none",
          fontFamily: "Georgia, serif",
          fontSize: 20,
          fontStyle: "italic",
          color: "#9a8070",
          opacity: 0.18,
          userSelect: "none",
          letterSpacing: "0.04em",
          // Smudge via blur
          filter: "blur(1.5px)",
          ...style,
        }}
      >
        {text}
      </div>
    );
  }

  if (type === "pencil") {
    // A simple rotated pencil SVG
    return (
      <svg
        style={{
          position: "absolute",
          pointerEvents: "none",
          transform: "rotate(-30deg)",
          ...style,
        }}
        width="120"
        height="18"
        viewBox="0 0 120 18"
      >
        {/* Body */}
        <rect x="10" y="5" width="90" height="8" rx="2" fill="#f5d16e" />
        {/* Eraser */}
        <rect x="100" y="5" width="14" height="8" rx="1" fill="#f4a7a7" />
        {/* Tip cone */}
        <polygon points="10,5 10,13 0,9" fill="#d4a860" />
        {/* Lead tip */}
        <polygon points="0,9 4,7 4,11" fill="#374151" />
        {/* Wood grain lines */}
        <line x1="10" y1="9" x2="100" y2="9" stroke="#e8b93a" strokeWidth="0.5" opacity="0.5" />
        {/* Metal ferrule */}
        <rect x="96" y="5" width="4" height="8" fill="#9ca3af" />
      </svg>
    );
  }

  return null;
}
