"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Polaroid, CARD_W, CARD_H } from "./polaroid";
import { Logo } from "./logo";

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
const STACK_OVERLAP = 40; // How much polaroids overlap in stack mode
const STACK_TOP = 120;

function useGridPositions(count: number, isGrid: boolean) {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!isGrid) return;
    const vw = window.innerWidth;
    const cols = Math.max(
      1,
      Math.floor((vw - GRID_PADDING * 2 + GAP) / (CARD_W + GAP)),
    );
    const totalW = cols * CARD_W + (cols - 1) * GAP;
    const startX = (vw - totalW) / 2;

    setPositions(
      Array.from({ length: count }, (_, i) => ({
        x: startX + (i % cols) * (CARD_W + GAP),
        y: GRID_TOP + Math.floor(i / cols) * (CARD_H + GAP),
      })),
    );
  }, [count, isGrid]);

  return positions;
}

function useStackPositions(count: number, isMobile: boolean) {
  const [positions, setPositions] = useState<{ x: number; y: number; rotation: number }[]>([]);

  useEffect(() => {
    if (!isMobile) return;
    const vw = window.innerWidth;
    const centerX = (vw - CARD_W) / 2;

    setPositions(
      Array.from({ length: count }, (_, i) => {
        // Small random offset from center
        const offsetX = (Math.random() - 0.5) * 30;
        // Small random rotation
        const rotation = (Math.random() - 0.5) * 8;

        return {
          x: centerX + offsetX,
          y: STACK_TOP + i * (CARD_H - STACK_OVERLAP),
          rotation,
        };
      }),
    );
  }, [count, isMobile]);

  return positions;
}

function gridContentHeight(count: number) {
  if (typeof window === "undefined") return 0;
  const vw = window.innerWidth;
  const cols = Math.max(
    1,
    Math.floor((vw - GRID_PADDING * 2 + GAP) / (CARD_W + GAP)),
  );
  const rows = Math.ceil(count / cols);
  return GRID_TOP + rows * (CARD_H + GAP) + GRID_PADDING;
}

function stackContentHeight(count: number) {
  return STACK_TOP + count * (CARD_H - STACK_OVERLAP) + GRID_PADDING;
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
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [renderLimit, setRenderLimit] = useState(() => {
    // Start with fewer images for nice drop animation
    if (typeof window !== "undefined") {
      const initial = window.innerWidth < 768 ? 5 : 50;
      return Math.min(initial, photos.length);
    }
    return Math.min(50, photos.length);
  });

  const gridPositions = useGridPositions(photos.length, isGrid);
  const stackPositions = useStackPositions(photos.length, isMobile);

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

  const goNext = useCallback(() => {
    setEnlarged((prev) => (prev === null ? null : (prev + 1) % photos.length));
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setEnlarged((prev) =>
      prev === null ? null : (prev - 1 + photos.length) % photos.length,
    );
  }, [photos.length]);

  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setEnlarged(null);
      } else if (e.key === "ArrowRight") {
        setEnlarged((prev) =>
          prev === null ? null : (prev + 1) % photos.length,
        );
      } else if (e.key === "ArrowLeft") {
        setEnlarged((prev) =>
          prev === null ? null : (prev - 1 + photos.length) % photos.length,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photos.length]);

  // Track mobile/desktop breakpoint
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Override body overflow when in grid mode or mobile stack mode
  useEffect(() => {
    document.body.style.overflow = isGrid || isMobile ? "auto" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isGrid, isMobile]);

  // Progressively load more polaroids after initial render
  useEffect(() => {
    if (renderLimit < photos.length) {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const batchSize = isMobile ? 8 : 20;
      const delay = isMobile ? 200 : 150;

      const timer = setTimeout(() => {
        setRenderLimit((prev) => Math.min(prev + batchSize, photos.length));
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [renderLimit, photos.length]);

  const containerStyle = isGrid
    ? { minHeight: gridContentHeight(photos.length) }
    : isMobile
      ? { minHeight: stackContentHeight(photos.length) }
      : undefined;

  return (
    <div
      className={`relative w-screen ${isGrid || isMobile ? "min-h-screen overflow-y-auto" : "h-screen overflow-hidden"}`}
      style={containerStyle}
    >
      <Logo />
      {title && (
        <Link
          href="/"
          className="fixed z-[1000] inline-block no-underline hover:brightness-110 transition-[filter]"
          style={{
            top: 28,
            left: 96,
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

      {/* Grid toggle button - desktop only */}
      {!isMobile && (
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
      )}

      {photos.slice(0, renderLimit).map((photo, i) => {
        const useStackMode = isMobile;
        const useGridMode = isGrid && !isMobile;

        return (
          <Polaroid
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            initialX={photo.initialX}
            initialY={photo.initialY}
            rotation={photo.rotation}
            zIndex={useStackMode || useGridMode ? i + 1 : (zIndices[i] ?? i + 1)}
            onBringToFront={() => bringToFront(i)}
            onEnlarge={() => enlarge(i)}
            isGrid={useStackMode || useGridMode}
            gridX={useStackMode ? stackPositions[i]?.x : gridPositions[i]?.x}
            gridY={useStackMode ? stackPositions[i]?.y : gridPositions[i]?.y}
            gridRotation={useStackMode ? stackPositions[i]?.rotation : undefined}
          />
        );
      })}

      {enlarged !== null && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/60 backdrop-blur-md transition-opacity duration-300"
          onClick={dismiss}
          onTouchStart={(e) => {
            touchStartX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX.current;
            touchStartX.current = null;
            if (dx < -50) goNext();
            else if (dx > 50) goPrev();
          }}
        >
          {/* Polaroid frame */}
          <div
            className="relative flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="bg-white shadow-2xl transition-transform duration-300 inline-flex"
              style={{
                padding: "24px 24px 64px 24px",
              }}
            >
              <Image
                src={photos[enlarged].src}
                alt={photos[enlarged].alt}
                width={800}
                height={800}
                priority={false}
                loading="eager"
                className="block max-h-[70vh] max-w-[85vw] object-contain"
                style={{
                  width: "auto",
                  height: "auto",
                  maxHeight: "70vh",
                  maxWidth: "85vw",
                }}
              />
            </div>

            {/* Counter */}
            <span
              className="mt-4 text-white/70 text-sm"
              style={{
                fontFamily: "var(--font-typewriter), serif",
                letterSpacing: "0.15em",
              }}
            >
              {enlarged + 1} / {photos.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
