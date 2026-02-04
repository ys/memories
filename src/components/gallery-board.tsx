"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { GalleryCard, GalleryCardData } from "./gallery-card";
import { Logo } from "./logo";

interface GalleryBoardProps {
  galleries: GalleryCardData[];
  title?: string;
  description?: string;
}

const dymoStyle = {
  padding: "8px 20px",
  borderRadius: 4,
  fontWeight: 800 as const,
  textTransform: "uppercase" as const,
  letterSpacing: "0.25em",
  fontFamily: "var(--font-typewriter), serif",
  background: "#222",
  color: "rgba(255, 255, 255, 0.92)",
  textShadow: "0 0.5px 0 rgba(255,255,255,0.25), 0 -0.5px 0 rgba(0,0,0,0.8)",
  boxShadow:
    "0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.4)",
};

export function GalleryBoard({
  galleries,
  title,
  description,
}: GalleryBoardProps) {
  const [zCounter, setZCounter] = useState(galleries.length + 1);
  const [zIndices, setZIndices] = useState<Record<number, number>>(() => {
    const indices: Record<number, number> = {};
    galleries.forEach((_, i) => {
      indices[i] = i + 1;
    });
    return indices;
  });

  const bringToFront = useCallback((index: number) => {
    setZCounter((prev) => {
      const next = prev + 1;
      setZIndices((indices) => ({ ...indices, [index]: next }));
      return next;
    });
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Logo />
      <div className=" text-yellow fixed top-6 left-24 z-[1000] flex items-center gap-4 select-none pointer-events-none">
        <div className="flex flex-col gap-2">
          {title && (
            <h1
              style={{
                ...dymoStyle,
                fontSize: 20,
                transform: "rotate(-1deg)",
              }}
            >
              {title}
            </h1>
          )}
          {description && (
            <p
              style={{
                ...dymoStyle,
                fontSize: 12,
                fontWeight: 600,
                transform: "rotate(0.5deg)",
              }}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {galleries.map((g, i) => (
        <GalleryCard
          key={g.name}
          {...g}
          zIndex={zIndices[i] ?? i + 1}
          onBringToFront={() => bringToFront(i)}
        />
      ))}
    </div>
  );
}
