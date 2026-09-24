"use client";

import Image from "next/image";
import { CW_PARTNER_LOGOS } from "@/lib/proposal-utils";

export function ClientLogosCarousel() {
  const logos = [...CW_PARTNER_LOGOS, ...CW_PARTNER_LOGOS];

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />
      <div className="proposal-logo-marquee flex w-max gap-6">
        {logos.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex h-24 w-44 shrink-0 items-center justify-center rounded-xl border border-neutral-100 bg-white px-4 shadow-sm"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={140}
              height={72}
              className="max-h-14 w-auto object-contain"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
