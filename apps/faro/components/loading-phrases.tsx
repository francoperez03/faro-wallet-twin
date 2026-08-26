"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/utils";

const FADE_MS = 260;

/**
 * Estado de carga con frases que rotan (fade out, cambio de texto, fade in) con anime.js.
 * Cambia el texto por ref, sin re-render. Con prefers-reduced-motion solo alterna el texto.
 */
export function LoadingPhrases({
  phrases,
  intervalMs = 1800,
  className,
}: {
  phrases: readonly string[];
  intervalMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || phrases.length < 2) return;
    const reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let i = 0;
    let current: ReturnType<typeof animate> | null = null;

    const timer = setInterval(() => {
      i = (i + 1) % phrases.length;
      if (reduced) {
        el.textContent = phrases[i];
        return;
      }
      current?.pause();
      current = animate(el, {
        opacity: [1, 0],
        translateY: [0, -4],
        duration: FADE_MS,
        ease: "inQuad",
        onComplete: () => {
          el.textContent = phrases[i];
          current = animate(el, {
            opacity: [0, 1],
            translateY: [4, 0],
            duration: FADE_MS,
            ease: "outQuad",
          });
        },
      });
    }, intervalMs);

    return () => {
      clearInterval(timer);
      current?.pause();
    };
  }, [phrases, intervalMs]);

  return (
    <p
      ref={ref}
      role="status"
      aria-live="polite"
      className={cn("text-sm text-muted-foreground", className)}
    >
      {phrases[0]}
    </p>
  );
}
