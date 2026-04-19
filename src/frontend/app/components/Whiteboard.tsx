"use client";

import { useRef, useState, useCallback } from "react";
import StickyNote from "./whiteboard/StickyNote";
import IndexCard from "./whiteboard/IndexCard";
import HandwrittenLabel from "./whiteboard/HandwrittenLabel";
import Arrow from "./whiteboard/Arrow";
import AmbientDetail from "./whiteboard/AmbientDetail";
import DemoVideoNote from "./whiteboard/DemoVideoNote";
import SignInNote from "./whiteboard/SignInNote";

export type Point = { x: number; y: number };

const BOARD_WIDTH = 3200;
const BOARD_HEIGHT = 2400;

// Initial viewport centered on the "interesting" zone of the board
const INITIAL_OFFSET: Point = { x: -600, y: -400 };

export default function Whiteboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<Point>(INITIAL_OFFSET);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ mouse: Point; offset: Point } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("[data-interactive]")) return;
    setIsDragging(true);
    dragStart.current = {
      mouse: { x: e.clientX, y: e.clientY },
      offset: { ...offset },
    };
  }, [offset]);

  const clamp = useCallback((x: number, y: number): Point => {
    const el = containerRef.current;
    if (!el) return { x, y };
    const { width, height } = el.getBoundingClientRect();
    return {
      x: Math.min(width * 0.8, Math.max(-(BOARD_WIDTH - width * 0.2), x)),
      y: Math.min(height * 0.8, Math.max(-(BOARD_HEIGHT - height * 0.2), y)),
    };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.mouse.x;
    const dy = e.clientY - dragStart.current.mouse.y;
    setOffset(clamp(
      dragStart.current.offset.x + dx,
      dragStart.current.offset.y + dy,
    ));
  }, [isDragging, clamp]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  // Touch support
  const touchStart = useRef<{ touch: Point; offset: Point } | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest("[data-interactive]")) return;
    const t = e.touches[0];
    touchStart.current = {
      touch: { x: t.clientX, y: t.clientY },
      offset: { ...offset },
    };
  }, [offset]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStart.current.touch.x;
    const dy = t.clientY - touchStart.current.touch.y;
    setOffset(clamp(
      touchStart.current.offset.x + dx,
      touchStart.current.offset.y + dy,
    ));
  }, [clamp]);

  const onTouchEnd = useCallback(() => {
    touchStart.current = null;
  }, []);


  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden"
      style={{ cursor: isDragging ? "grabbing" : "grab", background: "#f5f0e8" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Dot-grid background */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#c8b89a" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Board world */}
      <div
        className="absolute"
        style={{
          width: BOARD_WIDTH,
          height: BOARD_HEIGHT,
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          willChange: "transform",
          zIndex: 1,
        }}
      >
        {/* ── Ambient details ── */}
        <AmbientDetail
          type="coffee-ring"
          style={{ left: 920, top: 580 }}
        />
        <AmbientDetail
          type="erased-text"
          style={{ left: 1400, top: 300 }}
          text="what do I actually understand..."
        />
        <AmbientDetail
          type="pencil"
          style={{ left: 680, top: 1040 }}
        />

        {/* ── Handwritten labels ── */}
        <HandwrittenLabel
          text="What do I actually know?"
          style={{ left: 700, top: 220, rotate: "-2deg", fontSize: 38 }}
        />
        <HandwrittenLabel
          text="Start here →"
          style={{ left: 480, top: 600, rotate: "1.5deg", fontSize: 28, color: "#b45309" }}
        />
        <HandwrittenLabel
          text="the gap between knowing & understanding"
          style={{ left: 1480, top: 820, rotate: "-1deg", fontSize: 22, color: "#6b7280" }}
        />

        {/* ── Arrows ── */}
        <Arrow id="arrow-1" from={{ x: 820, y: 560 }} to={{ x: 1020, y: 680 }} />
        <Arrow id="arrow-2" from={{ x: 1260, y: 700 }} to={{ x: 1480, y: 760 }} curved />
        <Arrow id="arrow-3" from={{ x: 1020, y: 980 }} to={{ x: 820, y: 1100 }} />
        <Arrow id="arrow-4" from={{ x: 1640, y: 900 }} to={{ x: 1820, y: 980 }} curved />

        {/* ── Sticky notes ── */}
        <StickyNote
          id="sticky-feynman"
          color="yellow"
          title="The Feynman Technique"
          preview="If you can't explain it simply, you don't understand it."
          detail="One of several techniques built into the system. Start from a blank board, reconstruct everything you know about a topic, and let the gaps reveal themselves. No hints. No prompts. Just you and what you actually remember."
          style={{ left: 740, top: 460, rotate: "-3deg" }}
        />
        <StickyNote
          id="sticky-track"
          color="blue"
          title="Track your studying"
          preview="Know exactly where your time and effort are going."
          detail="Log study sessions by subject. See how much time you've put in, which topics you keep avoiding, and where you're actually making progress. Honest data, no streaks to game."
          style={{ left: 1060, top: 540, rotate: "2deg" }}
        />
        <StickyNote
          id="sticky-insights"
          color="pink"
          title="Build insights"
          preview="Patterns in your knowledge, surfaced over time."
          detail="The system watches what you get right, what you hesitate on, and what you blank on entirely. Over time it shows you a real picture of your understanding — not just your effort."
          style={{ left: 860, top: 820, rotate: "-1.5deg" }}
        />
        <StickyNote
          id="sticky-assess"
          color="green"
          title="Assess yourself"
          preview="Testing beats re-reading. Every time."
          detail="Built-in assessments go beyond flashcards. Reconstruct a topic cold, answer open questions, or explain a concept back in your own words. The system evaluates the depth of your answer, not just whether it's correct."
          style={{ left: 1480, top: 960, rotate: "3deg" }}
        />

        {/* ── Index cards ── */}
        <IndexCard
          id="card-topics"
          title="Your Topics"
          lines={["Organic Chemistry", "Linear Algebra", "Roman History", "Machine Learning", "..."]}
          detail="Organize any subject into a workspace. Add concepts, connect them, track your sessions, and run assessments — all in one place. Works for anything worth learning deeply."
          style={{ left: 1200, top: 620, rotate: "-2deg" }}
        />
        <IndexCard
          id="card-loop"
          title="The Study Loop"
          lines={["1. Track a session", "2. Reconstruct from nothing", "3. Run an assessment", "4. Read your insights", "5. Return. Go deeper."]}
          detail="Not a rigid workflow — more like a set of tools you reach for at different points. Some days you reconstruct. Some days you just track and review. The system supports the full cycle."
          style={{ left: 1720, top: 860, rotate: "1.5deg" }}
        />

        {/* ── Demo video ── */}
        <DemoVideoNote
          style={{ left: 1040, top: 1060, rotate: "-2deg" }}
        />

        {/* ── Sign in ── */}
        <SignInNote
          style={{ left: 1320, top: 1100, rotate: "2.5deg" }}
          href="/login"
        />
      </div>

      {/* Drag hint */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm pointer-events-none select-none"
        style={{ color: "#a89070", zIndex: 10, letterSpacing: "0.05em" }}
      >
        drag to explore
      </div>
    </div>
  );
}
