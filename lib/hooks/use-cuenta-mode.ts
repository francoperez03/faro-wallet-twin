"use client";

import { useCallback, useEffect, useState } from "react";

export type CuentaMode = "wallet" | "cuenta";

const STORAGE_KEY = "twin-mode";

function isCuentaMode(value: string | null): value is CuentaMode {
  return value === "wallet" || value === "cuenta";
}

/**
 * Preferencia de UI Wallet/Cuenta persistida en localStorage (D-19, sin DB).
 * SSR-safe: default "wallet" hasta que el efecto lea localStorage en el cliente.
 */
export function useCuentaMode() {
  const [mode, setModeState] = useState<CuentaMode>("wallet");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isCuentaMode(stored)) setModeState(stored);
  }, []);

  const setMode = useCallback((next: CuentaMode) => {
    setModeState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return { mode, setMode };
}
