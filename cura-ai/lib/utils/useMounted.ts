"use client";
import { useEffect, useState } from "react";

/**
 * Returns true only after the first client render.
 * Use this to gate UI that depends on browser-only state
 * (Date.now(), user's locale/timezone, window, localStorage, etc.)
 * so SSR HTML matches the initial client render and hydration is clean.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
