import { CSSProperties } from "react";

interface Props {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  curved?: boolean;
  style?: CSSProperties;
}

export default function Arrow({ id, from, to, curved = false }: Props) {
  const minX = Math.min(from.x, to.x) - 40;
  const minY = Math.min(from.y, to.y) - 40;
  const width = Math.abs(to.x - from.x) + 80;
  const height = Math.abs(to.y - from.y) + 80;

  const fx = from.x - minX;
  const fy = from.y - minY;
  const tx = to.x - minX;
  const ty = to.y - minY;

  let d: string;
  if (curved) {
    const mx = (fx + tx) / 2;
    const my = (fy + ty) / 2;
    // Perpendicular offset for the control point
    const dx = tx - fx;
    const dy = ty - fy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const bend = 40;
    const cx = mx - (dy / len) * bend;
    const cy = my + (dx / len) * bend;
    d = `M ${fx} ${fy} Q ${cx} ${cy} ${tx} ${ty}`;
  } else {
    d = `M ${fx} ${fy} L ${tx} ${ty}`;
  }

  return (
    <svg
      style={{
        position: "absolute",
        left: minX,
        top: minY,
        width,
        height,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <marker
          id={`arrowhead-${id}`}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill="#9ca3af" />
        </marker>
      </defs>
      <path
        d={d}
        stroke="#9ca3af"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
        markerEnd={`url(#arrowhead-${id})`}
        opacity="0.7"
      />
    </svg>
  );
}
