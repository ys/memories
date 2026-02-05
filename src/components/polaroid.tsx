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
    gridRotation,
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
          transform: hasDropped ? "translateY(0) rotate(0deg)" : "translateY(-120px) rotate(-15deg)",
          transition: "opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
