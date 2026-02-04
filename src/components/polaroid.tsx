"use client";

import Image from "next/image";
import { useState } from "react";
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
}: PolaroidProps) {
  const [loaded, setLoaded] = useState(false);

  const { ref, onPointerDown, onPointerMove, onPointerUp } = useDraggable({
    initialX,
    initialY,
    rotation,
    onBringToFront,
    onClick: onEnlarge,
    isGrid,
    gridX,
    gridY,
  });

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="absolute top-0 left-0 cursor-grab select-none bg-white shadow-xl transition-shadow duration-200"
      style={{
        zIndex,
        touchAction: "none",
        padding: `${PADDING}px`,
        paddingBottom: `${PADDING_BOTTOM}px`,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={IMG_SIZE}
        height={IMG_SIZE}
        className="pointer-events-none aspect-square object-cover"
        style={{
          width: IMG_SIZE,
          height: IMG_SIZE,
          opacity: loaded ? 1 : 0,
          filter: loaded
            ? "saturate(1) brightness(1) blur(0px)"
            : "saturate(0) brightness(1.8) blur(2px)",
          transition: "opacity 1.5s ease-out, filter 2.5s ease-out",
        }}
        draggable={false}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
