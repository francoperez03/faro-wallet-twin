"use client";

import { useEffect, useRef } from "react";
import { createTimeline } from "animejs";
import { cn } from "@/lib/utils";

/**
 * Faro minimal en vista frontal. El haz gira a velocidad angular constante:
 * visto de frente, su proyección es cos(θ), o sea scaleX 1 → -1 con easing seno.
 * Mitad 1: haz delantero de derecha a izquierda. Mitad 2: haz trasero (detrás de la torre) de vuelta.
 */
// ponytail: ciclo fijo; pasar a prop si se usa como loader.
const HALF_MS = 3000;
const BEAM = "100,60 200,38 200,82";

export function Faro({ size = 160, className }: { size?: number; className?: string }) {
  const front = useRef<SVGGElement>(null);
  const back = useRef<SVGGElement>(null);
  const halo = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!front.current || !back.current || !halo.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = createTimeline({ loop: true, defaults: { ease: "inOutSine" } });
    tl.add(front.current, { scaleX: [1, -1], duration: HALF_MS }, 0)
      .add(halo.current, { opacity: [0, 0.35, 0], duration: HALF_MS }, 0)
      .add(front.current, { opacity: 0, duration: 150 }, HALF_MS - 150)
      .add(back.current, { opacity: 0.3, duration: 150 }, HALF_MS - 150)
      .add(back.current, { scaleX: [-1, 1], duration: HALF_MS }, HALF_MS)
      .add(back.current, { opacity: 0, duration: 150 }, HALF_MS * 2 - 150)
      .add(front.current, { opacity: 0.9, duration: 150 }, HALF_MS * 2 - 150);

    return () => {
      tl.revert();
    };
  }, []);

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="Faro"
    >
      <defs>
        <linearGradient id="faro-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--gold)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Haz trasero (detrás de la torre) */}
      <g ref={back} opacity={0} style={{ transformOrigin: "100px 60px" }}>
        <polygon points={BEAM} fill="url(#faro-beam)" />
      </g>

      {/* Torre: base, galería, linterna, cúpula */}
      <g fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinejoin="round" opacity={0.7}>
        <path d="M82 172 L88 84 L112 84 L118 172 Z" />
        <path d="M78 84 L122 84" />
        <path d="M88 84 L88 76 L112 76 L112 84" />
        <path d="M90 76 L90 48 L110 48 L110 76" />
        <path d="M86 48 L114 48" />
        <path d="M90 48 Q100 32 110 48" />
        <path d="M70 172 L130 172" />
      </g>

      {/* Halo al apuntar a cámara */}
      <circle ref={halo} cx="100" cy="60" r="18" fill="var(--gold)" opacity={0} />
      <circle cx="100" cy="60" r="4" fill="var(--gold)" />

      {/* Haz delantero */}
      <g ref={front} opacity={0.9} style={{ transformOrigin: "100px 60px" }}>
        <polygon points={BEAM} fill="url(#faro-beam)" />
      </g>
    </svg>
  );
}
