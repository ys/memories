"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Polaroid, CARD_W, CARD_H } from "./polaroid";

interface PhotoData {
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  rotation: number;
}

interface TableProps {
  photos: PhotoData[];
  title?: string;
}

const GAP = 20;
const GRID_TOP = 80;
const GRID_PADDING = 24;

function useGridPositions(count: number, isGrid: boolean) {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!isGrid) return;
    const vw = window.innerWidth;
    const cols = Math.max(1, Math.floor((vw - GRID_PADDING * 2 + GAP) / (CARD_W + GAP)));
    const totalW = cols * CARD_W + (cols - 1) * GAP;
    const startX = (vw - totalW) / 2;

    setPositions(
      Array.from({ length: count }, (_, i) => ({
        x: startX + (i % cols) * (CARD_W + GAP),
        y: GRID_TOP + Math.floor(i / cols) * (CARD_H + GAP),
      }))
    );
  }, [count, isGrid]);

  return positions;
}

function gridContentHeight(count: number) {
  if (typeof window === "undefined") return 0;
  const vw = window.innerWidth;
  const cols = Math.max(1, Math.floor((vw - GRID_PADDING * 2 + GAP) / (CARD_W + GAP)));
  const rows = Math.ceil(count / cols);
  return GRID_TOP + rows * (CARD_H + GAP) + GRID_PADDING;
}

export function Table({ photos, title }: TableProps) {
  const [zCounter, setZCounter] = useState(photos.length + 1);
  const [zIndices, setZIndices] = useState<Record<number, number>>(() => {
    const indices: Record<number, number> = {};
    photos.forEach((_, i) => {
      indices[i] = i + 1;
    });
    return indices;
  });
  const [enlarged, setEnlarged] = useState<number | null>(null);
  const [isGrid, setIsGrid] = useState(false);

  const gridPositions = useGridPositions(photos.length, isGrid);

  const bringToFront = useCallback((index: number) => {
    setZCounter((prev) => {
      const next = prev + 1;
      setZIndices((indices) => ({ ...indices, [index]: next }));
      return next;
    });
  }, []);

  const enlarge = useCallback((index: number) => {
    setEnlarged(index);
  }, []);

  const dismiss = useCallback(() => {
    setEnlarged(null);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEnlarged(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Override body overflow when in grid mode
  useEffect(() => {
    document.body.style.overflow = isGrid ? "auto" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isGrid]);

  const containerStyle = isGrid
    ? { minHeight: gridContentHeight(photos.length) }
    : undefined;

  return (
    <div
      className={`relative w-screen ${isGrid ? "min-h-screen overflow-y-auto" : "h-screen overflow-hidden"}`}
      style={containerStyle}
    >
      {title && (
        <Link
          href="/"
          className="fixed z-[1000] inline-block no-underline hover:brightness-110 transition-[filter]"
          style={{
            top: 28,
            left: 28,
            padding: "10px 28px",
            borderRadius: 4,
            fontSize: 18,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.3em",
            fontFamily: "var(--font-typewriter), serif",
            background: "#222",
            color: "rgba(255, 255, 255, 0.92)",
            transform: "rotate(-2deg)",
            textShadow:
              "0 1px 0 rgba(255,255,255,0.25), 0 -1px 0 rgba(0,0,0,0.8)",
            boxShadow:
              "0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4)",
          }}
        >
          {title}
        </Link>
      )}

      {/* Grid toggle button */}
      <button
        onClick={() => setIsGrid((v) => !v)}
        className="fixed z-[1001] no-underline hover:brightness-110 transition-[filter]"
        style={{
          top: 28,
          right: 28,
          padding: "10px 22px",
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.25em",
          fontFamily: "var(--font-typewriter), serif",
          background: "#222",
          color: "rgba(255, 255, 255, 0.92)",
          border: "none",
          cursor: "pointer",
          transform: "rotate(1deg)",
          textShadow:
            "0 0.5px 0 rgba(255,255,255,0.25), 0 -0.5px 0 rgba(0,0,0,0.8)",
          boxShadow:
            "0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4)",
        }}
      >
        {isGrid ? "scatter" : "sort"}
      </button>

      {photos.map((photo, i) => (
        <Polaroid
          key={photo.src}
          src={photo.src}
          alt={photo.alt}
          initialX={photo.initialX}
          initialY={photo.initialY}
          rotation={photo.rotation}
          zIndex={isGrid ? i + 1 : (zIndices[i] ?? i + 1)}
          onBringToFront={() => bringToFront(i)}
          onEnlarge={() => enlarge(i)}
          isGrid={isGrid}
          gridX={gridPositions[i]?.x}
          gridY={gridPositions[i]?.y}
        />
      ))}

      {enlarged !== null && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/70 transition-opacity duration-300"
          onClick={dismiss}
        >
          <div
            className="bg-white p-3 pb-10 shadow-2xl transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[enlarged].src}
              alt={photos[enlarged].alt}
              width={800}
              height={800}
              className="max-h-[80vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
