import { useRef, useCallback, useEffect } from "react";

function grabOffset(e: React.PointerEvent, el: HTMLDivElement) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  return {
    nx: (e.clientX - cx) / (rect.width / 2),
    ny: (e.clientY - cy) / (rect.height / 2),
  };
}

function dragRotation(
  grabNx: number,
  grabNy: number,
  dx: number,
  dy: number
): number {
  const corner = Math.sqrt(grabNx * grabNx + grabNy * grabNy) / Math.SQRT2;
  const torque = dx * -grabNy + dy * grabNx;
  return corner * torque * 0.06;
}

interface UseDraggableOptions {
  initialX: number;
  initialY: number;
  rotation: number;
  onBringToFront: () => void;
  onClick?: () => void;
  isGrid?: boolean;
  gridX?: number;
  gridY?: number;
  gridRotation?: number;
}

export function useDraggable({
  initialX,
  initialY,
  rotation,
  onBringToFront,
  onClick,
  isGrid,
  gridX,
  gridY,
  gridRotation,
}: UseDraggableOptions) {
  const elRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const initialized = useRef(false);
  const grab = useRef({ nx: 0, ny: 0 });
  const currentRotation = useRef(rotation);
  const lastPointer = useRef({ x: 0, y: 0 });

  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      if (!el) return;
      elRef.current = el;
      if (!initialized.current) {
        initialized.current = true;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const x = initialX * vw;
        const y = initialY * vh;
        pos.current = { x, y };
        currentRotation.current = rotation;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;
      }
    },
    [initialX, initialY, rotation]
  );

  // Animate between grid and scattered positions
  useEffect(() => {
    const el = elRef.current;
    if (!el || !initialized.current) return;

    el.style.transition = "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)";

    if (isGrid && gridX !== undefined && gridY !== undefined) {
      const rot = gridRotation !== undefined ? gridRotation : 0;
      el.style.transform = `translate(${gridX}px, ${gridY}px) rotate(${rot}deg)`;
      el.style.cursor = "pointer";
    } else {
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${currentRotation.current}deg)`;
      el.style.cursor = "grab";
    }

    const tid = setTimeout(() => {
      el.style.transition = "";
    }, 600);
    return () => clearTimeout(tid);
  }, [isGrid, gridX, gridY, gridRotation]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (isGrid) return;
      const el = elRef.current;
      if (!el) return;

      dragging.current = true;
      el.setPointerCapture(e.pointerId);

      offset.current = {
        x: e.clientX - pos.current.x,
        y: e.clientY - pos.current.y,
      };
      pointerStart.current = { x: e.clientX, y: e.clientY };
      lastPointer.current = { x: e.clientX, y: e.clientY };
      grab.current = grabOffset(e, el);

      onBringToFront();

      el.style.cursor = "grabbing";
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${currentRotation.current}deg) scale(1.05)`;
      el.style.boxShadow =
        "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 12px 24px -8px rgba(0, 0, 0, 0.3)";
    },
    [onBringToFront, isGrid]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isGrid) return;
      if (!dragging.current || !elRef.current) return;

      const x = e.clientX - offset.current.x;
      const y = e.clientY - offset.current.y;
      pos.current = { x, y };

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      const dr = dragRotation(grab.current.nx, grab.current.ny, dx, dy);
      currentRotation.current = Math.max(
        -45,
        Math.min(45, currentRotation.current + dr)
      );

      elRef.current.style.transform = `translate(${x}px, ${y}px) rotate(${currentRotation.current}deg) scale(1.05)`;
    },
    [isGrid]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      // In grid mode, just fire click (no drag tracking)
      if (isGrid) {
        onClick?.();
        return;
      }
      if (!dragging.current || !elRef.current) return;

      dragging.current = false;
      elRef.current.releasePointerCapture(e.pointerId);
      elRef.current.style.cursor = "grab";
      elRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) rotate(${currentRotation.current}deg)`;
      elRef.current.style.boxShadow = "";

      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;
      if (Math.sqrt(dx * dx + dy * dy) < 5) {
        onClick?.();
      }
    },
    [onClick, isGrid]
  );

  return { ref, onPointerDown, onPointerMove, onPointerUp };
}
