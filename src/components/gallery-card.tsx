"use client";

import { useRouter } from "next/navigation";
import { useDraggable } from "@/hooks/use-draggable";

export interface GalleryCardData {
  name: string;
  initialX: number;
  initialY: number;
  rotation: number;
  color: string;
}

interface GalleryCardProps extends GalleryCardData {
  zIndex: number;
  onBringToFront: () => void;
}

export function GalleryCard({
  name,
  initialX,
  initialY,
  rotation,
  color,
  zIndex,
  onBringToFront,
}: GalleryCardProps) {
  const router = useRouter();

  const { ref, onPointerDown, onPointerMove, onPointerUp } = useDraggable({
    initialX,
    initialY,
    rotation,
    onBringToFront,
    onClick: () => router.push(`/${name}`),
  });

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute top-0 left-0 cursor-grab select-none transition-shadow duration-200"
      style={{
        zIndex,
        touchAction: "none",
        width: 240,
        height: 180,
        borderRadius: 3,
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.02) 3px,
            rgba(0,0,0,0.02) 4px
          ),
          linear-gradient(
            160deg,
            ${color} 0%,
            ${color} 100%
          )
        `,
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.35), 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
        border: "1px solid rgba(0,0,0,0.1)",
      }}
    >
      {/* Dymo-style label strip on the envelope */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          bottom: 20,
          left: 16,
          right: 16,
          padding: "6px 14px",
          borderRadius: 3,
          background: "#1a1a1a",
          color: "rgba(255,255,255,0.9)",
          fontSize: 13,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.25em",
          fontFamily: "var(--font-typewriter), serif",
          textShadow:
            "0 0.5px 0 rgba(255,255,255,0.25), 0 -0.5px 0 rgba(0,0,0,0.8)",
          boxShadow:
            "0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
          textAlign: "center",
        }}
      >
        {name}
      </div>
    </div>
  );
}
