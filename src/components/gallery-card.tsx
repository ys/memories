"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDraggable } from "@/hooks/use-draggable";
import { hashString, seededRandom } from "@/lib/utils";

export interface GalleryCardData {
  name: string;
  initialX: number;
  initialY: number;
  rotation: number;
  color: string;
  photoCount: number;
  previews: string[];
}

interface GalleryCardProps extends GalleryCardData {
  zIndex: number;
  onBringToFront: () => void;
}

const FOLDER_W = 260;
const FOLDER_H = 190;
const TAB_W = 100;
const TAB_H = 24;

const PEEK_W = 76;
const PEEK_H = 94;
const PEEK_PAD = 5;
const PEEK_PAD_BOTTOM = 16;
const PEEK_IMG = PEEK_W - PEEK_PAD * 2;

const PEEK_COUNT = 4;

function getPeekingPolaroids(name: string, previews: string[]) {
  if (previews.length === 0) return [];
  const count = Math.min(previews.length, PEEK_COUNT);
  const rand = seededRandom(hashString(name + "peek"));

  const results: { x: number; y: number; rot: number; src: string }[] = [];

  for (let i = 0; i < count; i++) {
    // Scatter polaroids on top of the folder, mostly upper-left area
    const x = 10 + rand() * (FOLDER_W - PEEK_W - 30);
    const y = TAB_H + 8 + rand() * (FOLDER_H - PEEK_H - TAB_H - 30);
    const rot = (rand() - 0.5) * 20;

    results.push({ x, y, rot, src: previews[i] });
  }

  return results;
}

export function GalleryCard({
  name,
  initialX,
  initialY,
  rotation,
  color,
  photoCount,
  previews,
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

  const peeks = getPeekingPolaroids(name, previews);
  const rand = seededRandom(hashString(name + "tab"));
  const tabOffset = 20 + rand() * (FOLDER_W - TAB_W - 40);

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
        width: FOLDER_W,
        height: FOLDER_H + TAB_H,
      }}
    >
      {/* Tab */}
      <div
        className="absolute"
        style={{
          left: tabOffset,
          top: 0,
          width: TAB_W,
          height: TAB_H + 4,
          background: color,
          borderRadius: "5px 5px 0 0",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
          border: "1px solid rgba(0,0,0,0.1)",
          borderBottom: "none",
        }}
      >
        <span
          className="absolute pointer-events-none select-none"
          style={{
            top: 5,
            left: 0,
            right: 0,
            fontSize: 11,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            fontFamily: "var(--font-typewriter), serif",
            color: "rgba(0,0,0,0.5)",
            textAlign: "center",
          }}
        >
          {name}
        </span>
      </div>

      {/* Folder body */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: TAB_H,
          width: FOLDER_W,
          height: FOLDER_H,
          borderRadius: 3,
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.015) 3px,
              rgba(0,0,0,0.015) 4px
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
      />

      {/* Polaroids laid on top of the folder */}
      {peeks.map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none overflow-hidden"
          style={{
            width: PEEK_W,
            height: PEEK_H,
            left: p.x,
            top: p.y + TAB_H,
            transform: `rotate(${p.rot}deg)`,
            background: "#f5f2ed",
            padding: `${PEEK_PAD}px ${PEEK_PAD}px ${PEEK_PAD_BOTTOM}px ${PEEK_PAD}px`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            zIndex: 2 + i,
          }}
        >
          <Image
            src={p.src}
            alt=""
            width={PEEK_IMG}
            height={PEEK_IMG}
            className="object-cover"
            style={{
              width: PEEK_IMG,
              height: PEEK_H - PEEK_PAD - PEEK_PAD_BOTTOM,
              display: "block",
            }}
          />
        </div>
      ))}
    </div>
  );
}
