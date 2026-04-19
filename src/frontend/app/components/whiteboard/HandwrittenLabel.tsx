import { CSSProperties } from "react";

interface Props {
  text: string;
  style?: CSSProperties & { rotate?: string; fontSize?: number; color?: string };
}

export default function HandwrittenLabel({ text, style }: Props) {
  const { rotate, fontSize, color, ...rest } = style ?? {};

  return (
    <div
      style={{
        position: "absolute",
        ...rest,
        transform: `rotate(${rotate ?? "0deg"})`,
        fontFamily: "'Georgia', serif",
        fontSize: fontSize ?? 32,
        fontStyle: "italic",
        color: color ?? "#2d1f0a",
        letterSpacing: "-0.01em",
        lineHeight: 1.2,
        userSelect: "none",
        pointerEvents: "none",
        // Slight text-shadow gives a marker-on-whiteboard feel
        textShadow: "1px 1px 0 rgba(0,0,0,0.06)",
      }}
    >
      {text}
    </div>
  );
}
