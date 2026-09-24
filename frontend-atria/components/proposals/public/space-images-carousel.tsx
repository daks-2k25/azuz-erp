"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LOCAL_SPACE_IMAGES, PROPOSAL_GOLD } from "@/lib/proposal-utils";

export function SpaceImagesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const total = LOCAL_SPACE_IMAGES.length;

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((index + total) % total);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    const timer = window.setInterval(goNext, 5000);
    return () => window.clearInterval(timer);
  }, [goNext]);

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] overflow-hidden bg-white/10">
        {LOCAL_SPACE_IMAGES.map((image, index) => (
          <div
            key={image.id}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: index === activeIndex ? 1 : 0 }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={goPrev}
          className="absolute top-1/2 left-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          aria-label="Imagem anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          className="absolute top-1/2 right-3 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition hover:bg-black/60"
          aria-label="Próxima imagem"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
        {LOCAL_SPACE_IMAGES.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => goTo(index)}
            className="h-2 rounded-full transition-all"
            style={{
              width: index === activeIndex ? "1.5rem" : "0.5rem",
              backgroundColor:
                index === activeIndex ? PROPOSAL_GOLD : "rgba(255,255,255,0.35)",
            }}
            aria-label={`Ir para imagem ${index + 1}`}
          />
        ))}
      </div>

      <div className="mt-4 hidden gap-2 sm:grid sm:grid-cols-5">
        {LOCAL_SPACE_IMAGES.slice(0, 5).map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => goTo(index)}
            className="relative aspect-[4/3] overflow-hidden border-2 transition"
            style={{
              borderColor:
                index === activeIndex ? PROPOSAL_GOLD : "transparent",
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              unoptimized
              sizes="10vw"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
