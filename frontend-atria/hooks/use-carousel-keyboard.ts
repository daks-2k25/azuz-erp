"use client";

import { useCallback, useEffect } from "react";

interface UseCarouselKeyboardOptions {
  enabled: boolean;
  itemCount: number;
  index: number;
  onIndexChange: (index: number) => void;
  onEscape?: () => void;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    tag === "VIDEO" ||
    tag === "AUDIO" ||
    target.isContentEditable
  );
}

export function useCarouselKeyboard({
  enabled,
  itemCount,
  index,
  onIndexChange,
  onEscape,
}: UseCarouselKeyboardOptions) {
  const goPrev = useCallback(() => {
    if (itemCount <= 1) return;
    onIndexChange((index - 1 + itemCount) % itemCount);
  }, [index, itemCount, onIndexChange]);

  const goNext = useCallback(() => {
    if (itemCount <= 1) return;
    onIndexChange((index + 1) % itemCount);
  }, [index, itemCount, onIndexChange]);

  useEffect(() => {
    if (!enabled || itemCount === 0) return;

    function onKeyDown(event: KeyboardEvent) {
      if (isEditableTarget(event.target)) return;

      if (event.key === "Escape" && onEscape) {
        event.preventDefault();
        onEscape();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled, itemCount, goPrev, goNext, onEscape]);

  return { goPrev, goNext };
}
