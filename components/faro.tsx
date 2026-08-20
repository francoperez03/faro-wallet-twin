"use client";

import { useEffect, useId, useRef } from "react";
import { createTimeline } from "animejs";
import { cn } from "@/lib/utils";

/**
 * Faro minimal en vista frontal, sobre una roca, con su gemelo reflejado en el agua.
 * El haz gira a velocidad angular constante: visto de frente, su proyección es cos(θ),
 * o sea scaleX 1 → -1 con easing seno. Mitad 1: haz delantero de derecha a izquierda.
 * Mitad 2: haz trasero (detrás de la torre) de vuelta. El reflejo es un <use> del mismo
 * árbol, así que hereda la animación sin animarse dos veces.
 */
// ponytail: ciclo fijo; pasar a prop si se usa como loader.
const HALF_MS = 3000;
const FADE_MS = 150;
// Cono inclinado ~8° hacia abajo; el espejo por scaleX mantiene la inclinación en ambos lados.
const BEAM = "100,60 200,54 200,102";

export function Faro({ size = 160, className }: { size?: number; className?: string }) {
  const id = useId();
  const front = useRef<SVGGElement>(null);
  const back = useRef<SVGGElement>(null);
  const halo = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!front.current || !back.current || !halo.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tl = createTimeline({ loop: true, defaults: { ease: "inOutSine" } });
    // El trasero espera a la izquierda desde el arranque (si no, su crossfade arranca en scaleX = 1).
    tl.set(back.current, { scaleX: -1 }, 0)
      .add(front.current, { scaleX: [1, -1], duration: HALF_MS }, 0)
      .add(halo.current, { opacity: [0.15, 0.5, 0.15], duration: HALF_MS }, 0)
      .add(front.current, { opacity: 0, duration: FADE_MS }, HALF_MS - FADE_MS)
      .add(back.current, { opacity: 0.35, duration: FADE_MS }, HALF_MS - FADE_MS)
      .add(back.current, { scaleX: [-1, 1], duration: HALF_MS }, HALF_MS)
      // Recolocar el delantero a la derecha mientras está invisible: el crossfade final
      // ocurre con ambos haces en scaleX = 1 y solo cambia la opacidad (sin salto).
      .set(front.current, { scaleX: 1 }, HALF_MS + FADE_MS)
      .add(back.current, { opacity: 0, duration: FADE_MS }, HALF_MS * 2 - FADE_MS)
      .add(front.current, { opacity: 1, duration: FADE_MS }, HALF_MS * 2 - FADE_MS);

    return () => {
      tl.revert();
    };
  }, []);

  const sceneId = `${id}-scene`;
  const beamGrad = `${id}-beam`;
  const glow = `${id}-glow`;
  const blur = `${id}-blur`;
  const fade = `${id}-fade`;
  const fadeGrad = `${id}-fade-grad`;

  return (
    <svg
      viewBox="0 0 200 320"
      width={size}
      height={size * 1.6}
      className={cn("overflow-visible", className)}
      role="img"
      aria-label="Faro"
    >
      <defs>
        <linearGradient id={beamGrad} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--gold)" stopOpacity="1" />
          <stop offset="0.4" stopColor="var(--gold)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
        <filter id={glow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
        <filter id={blur} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <linearGradient id={fadeGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="white" stopOpacity="1" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.6" />
          <stop offset="1" stopColor="white" stopOpacity="0.2" />
        </linearGradient>
        <mask id={fade} maskUnits="userSpaceOnUse" x="0" y="184" width="200" height="136">
          <rect x="0" y="184" width="200" height="136" fill={`url(#${fadeGrad})`} />
        </mask>
      </defs>

      <g id={sceneId}>
        {/* Haz trasero (detrás de la torre) */}
        <g ref={back} opacity={0} filter={`url(#${glow})`} style={{ transformOrigin: "100px 60px" }}>
          <polygon points={BEAM} fill={`url(#${beamGrad})`} />
        </g>

        {/* Torre: base, galería, linterna, cúpula */}
        <g fill="none" stroke="var(--foreground)" strokeWidth="1.5" strokeLinejoin="round" opacity={0.7}>
          <path d="M82 168 L88 84 L112 84 L118 168 Z" />
          <path d="M78 84 L122 84" />
          <path d="M88 84 L88 76 L112 76 L112 84" />
          <path d="M90 76 L90 48 L110 48 L110 76" />
          <path d="M86 48 L114 48" />
          <path d="M90 48 Q100 32 110 48" />
        </g>

        {/* Halo al apuntar a cámara */}
        <circle ref={halo} cx="100" cy="60" r="18" fill="var(--gold)" opacity={0.15} />
        <circle cx="100" cy="60" r="4" fill="var(--gold)" />

        {/* Haz delantero */}
        <g ref={front} opacity={1} filter={`url(#${glow})`} style={{ transformOrigin: "100px 60px" }}>
          <polygon points={BEAM} fill={`url(#${beamGrad})`} />
        </g>
      </g>

      {/* Roca y línea de agua */}
      <path
        d="M60 176 L82 166 L118 166 L140 176 L130 184 L70 184 Z"
        fill="var(--background)"
        stroke="var(--foreground)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity={0.7}
      />
      <path d="M0 184 L200 184" stroke="var(--muted-foreground)" strokeWidth="1" opacity={0.6} />

      {/* Gemelo: reflejo invertido, difuminado y desvanecido hacia abajo */}
      <g mask={`url(#${fade})`} opacity={0.6}>
        <use href={`#${sceneId}`} transform="translate(0 368) scale(1 -1)" filter={`url(#${blur})`} />
      </g>

      {/* ponytail: ripples estáticas; animar con anime si se quiere movimiento */}
      <g stroke="var(--muted-foreground)" strokeWidth="1" opacity={0.15}>
        <path d="M40 205 L160 205" />
        <path d="M60 230 L140 230" />
      </g>
    </svg>
  );
}
