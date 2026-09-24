"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KanbanHorizontalScrollProps {
  children: ReactNode;
  className?: string;
}

export function KanbanHorizontalScroll({
  children,
  className,
}: KanbanHorizontalScrollProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback((source: "top" | "main") => {
    const top = topRef.current;
    const main = mainRef.current;
    if (!top || !main) return;

    if (source === "top" && main.scrollLeft !== top.scrollLeft) {
      main.scrollLeft = top.scrollLeft;
      return;
    }

    if (source === "main" && top.scrollLeft !== main.scrollLeft) {
      top.scrollLeft = main.scrollLeft;
    }
  }, []);

  useEffect(() => {
    const inner = innerRef.current;
    const top = topRef.current;
    if (!inner || !top) return;

    const topInner = top.querySelector<HTMLElement>("[data-top-scroll-track]");
    if (!topInner) return;

    const updateTrackWidth = () => {
      topInner.style.width = `${inner.scrollWidth}px`;
    };

    updateTrackWidth();

    const observer = new ResizeObserver(updateTrackWidth);
    observer.observe(inner);

    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("min-w-0", className)}>
      <div
        ref={topRef}
        onScroll={() => syncScroll("top")}
        className="mb-2 h-3 overflow-x-auto overflow-y-hidden"
        aria-hidden
      >
        <div data-top-scroll-track className="h-px" />
      </div>
      <div
        ref={mainRef}
        onScroll={() => syncScroll("main")}
        className="overflow-x-auto pb-4"
      >
        <div ref={innerRef} className="inline-flex gap-4">
          {children}
        </div>
      </div>
    </div>
  );
}
