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
  const [hasDropped, setHasDropped] = useState(false);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasDropped(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

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
          opacity: hasDropped ? 1 : 0,
          transform: hasDropped ? "translateY(0)" : "translateY(-30px)",
          transition: "opacity 0.4s ease-out, transform 0.4s ease-out",
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={IMG_SIZE}
          height={IMG_SIZE}
          loading="lazy"
          quality={50}
          sizes={`${IMG_SIZE}px`}
          className="pointer-events-none aspect-square object-cover"
          style={{
            width: IMG_SIZE,
            height: IMG_SIZE,
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.3s ease-out",
          }}
          draggable={false}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
}
