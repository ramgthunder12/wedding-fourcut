import { useEffect, useRef } from "react";

export function useSessionReset(enabled: boolean, timeoutMs: number, onReset: () => void) {
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    timerRef.current = window.setTimeout(() => onReset(), timeoutMs);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [enabled, timeoutMs, onReset]);
}
