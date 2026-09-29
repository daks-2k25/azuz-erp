"use client";

import { useEffect, useState } from "react";
import { formatClockTime } from "@/lib/time-tracking/format";

interface LiveClockProps {
  /** Diferença entre o relógio do servidor e o do aparelho, em ms. */
  serverOffsetMs: number;
  className?: string;
}

/** Relógio de Brasília sincronizado com o servidor (é ele que vale na marcação). */
export function LiveClock({ serverOffsetMs, className }: LiveClockProps) {
  const [now, setNow] = useState(() => new Date(Date.now() + serverOffsetMs));

  useEffect(() => {
    const intervalId = window.setInterval(
      () => setNow(new Date(Date.now() + serverOffsetMs)),
      1000,
    );
    return () => window.clearInterval(intervalId);
  }, [serverOffsetMs]);

  return (
    <time className={className} dateTime={now.toISOString()}>
      {formatClockTime(now)}
    </time>
  );
}
