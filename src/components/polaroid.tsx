"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useDraggable } from "@/hooks/use-draggable";

export interface PolaroidProps {
  src: string;
  alt: string;
  initialX: number;
  initialY: number;
  rotation: number;
  zIndex: number;
  onBringToFront: () => void;
  onEnlarge: () => void;
  isGrid?: boolean;
  gridX?: number;
  gridY?: number;
  gridRotation?: number;
}

const IMG_SIZE = 220;
const PADDING = 16;
const PADDING_BOTTOM = 48;

export const CARD_W = IMG_SIZE + PADDING * 2;
export const CARD_H = IMG_SIZE + PADDING + PADDING_BOTTOM;

export function Polaroid({
  src,
  alt,
  initialX,
  initialY,
  rotation,
  zIndex,
  onBringToFront,
  onEnlarge,
  isGrid,
  gridX,
  gridY,
  gridRotation,
}: PolaroidProps) {
  const [hasDropped, setHasDropped] = useState(false);
  const [dropDelay] = useState(() => Math.random() * 400); // Random stagger
  const [dropDuration] = useState(() => 0.5 + Math.random() * 0.3); // Vary drop speed

  const { ref, onPointerDown, onPointerMove, onPointerUp } = useDraggable({
    initialX,
    initialY,
    rotation,
    onBringToFront,
    onClick: onEnlarge,
    isGrid,
    gridX,
    gridY,
    gridRotation,
  });

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (isMobile) {
      // No animation on mobile
      setHasDropped(true);
    } else {
      // Staggered rain drop animation on desktop
      const timer = setTimeout(() => {
        setHasDropped(true);
      }, dropDelay);
      return () => clearTimeout(timer);
    }
  }, [dropDelay]);

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute top-0 left-0 cursor-grab select-none"
      style={{
        zIndex,
        touchAction: "none",
      }}
    >
      <div
        className="bg-white shadow-xl transition-shadow duration-200"
        style={{
          padding: `${PADDING}px`,
          paddingBottom: `${PADDING_BOTTOM}px`,
          transform: hasDropped ? "translateY(0)" : "translateY(-500px)",
          transition: hasDropped
            ? `transform ${dropDuration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
            : "none",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={IMG_SIZE}
          height={IMG_SIZE}
          loading="lazy"
          quality={75}
          sizes={`${IMG_SIZE}px`}
          className="pointer-events-none aspect-square object-cover"
          style={{
            width: IMG_SIZE,
            height: IMG_SIZE,
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
