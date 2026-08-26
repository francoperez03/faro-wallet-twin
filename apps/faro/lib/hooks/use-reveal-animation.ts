"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

/**
 * Anima la entrada (opacity + translateY) de un panel que aparece tras una interacción del
 * usuario, por ejemplo un tab o una fila que se expande. Solo corre cuando `active` pasa a
 * true (el panel recién se monta), respeta prefers-reduced-motion con el estado final
 * instantáneo y limpia con `.pause()` en el cleanup (patrón vault-aggregator/strategy-ring.tsx).
 */
export function useRevealAnimation<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    if (typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }
    const animation = animate(el, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 300,
      ease: "outQuint",
    });
    return () => {
      animation.pause();
    };
  }, [active]);

  return ref;
}
