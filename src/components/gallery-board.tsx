"use client";

import { useState, useCallback } from "react";
import { GalleryCard, GalleryCardData } from "./gallery-card";

interface GalleryBoardProps {
  galleries: GalleryCardData[];
  title?: string;
  description?: string;
}

export function GalleryBoard({ galleries, title, description }: GalleryBoardProps) {
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
      {(title || description) && (
        <div className="fixed top-7 left-7 z-[1000] max-w-xs select-none pointer-events-none">
          {title && (
            <h1 className="text-white/85 text-3xl tracking-wide mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-white/55 text-base leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
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
