"use client";

import Image from "next/image";
import { CW_LOGO_URL, PROPOSAL_GOLD, PROPOSAL_TEAL } from "@/lib/proposal-utils";

export function PublicProposalHeader() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-white/10"
      style={{ backgroundColor: PROPOSAL_TEAL }}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Image
          src={CW_LOGO_URL}
          alt="CWBranding"
          width={140}
          height={36}
          className="h-24 w-auto object-contain brightness-0 invert"
          unoptimized
          priority
        />
        <span
          className="text-xs tracking-[0.22em] uppercase"
          style={{ color: PROPOSAL_GOLD }}
        >
          Proposta Comercial
        </span>
      </div>
    </header>
  );
}
