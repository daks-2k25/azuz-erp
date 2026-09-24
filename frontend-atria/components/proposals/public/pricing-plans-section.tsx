"use client";

import { Check } from "lucide-react";
import {
  formatProposalCurrency,
  PROPOSAL_GOLD,
  PROPOSAL_PRICING_PLANS,
  PROPOSAL_TEAL,
} from "@/lib/proposal-utils";

export function PricingPlansSection() {
  return (
    <section className="bg-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: PROPOSAL_GOLD }}
          >
            Investimento
          </p>
          <h2
            className="mt-3 font-[family-name:var(--font-proposal-serif)] text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ color: PROPOSAL_TEAL }}
          >
            Nossos Planos
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutral-600">
            Escolha o projeto ideal para o momento da sua empresa e transforme
            posicionamento em crescimento comercial.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PROPOSAL_PRICING_PLANS.map((plan) => {
            const featured = "featured" in plan && plan.featured;

            return (
              <article
                key={plan.id}
                className="flex flex-col border transition"
                style={{
                  borderColor: featured ? PROPOSAL_TEAL : `${PROPOSAL_TEAL}22`,
                  backgroundColor: featured ? `${PROPOSAL_TEAL}08` : "white",
                  boxShadow: featured
                    ? `0 20px 50px ${PROPOSAL_TEAL}18`
                    : undefined,
                }}
              >
                <div
                  className="px-6 py-8"
                  style={{
                    backgroundColor: featured ? PROPOSAL_TEAL : "transparent",
                  }}
                >
                  <h3
                    className="text-sm font-semibold tracking-[0.12em] uppercase"
                    style={{ color: featured ? PROPOSAL_GOLD : PROPOSAL_TEAL }}
                  >
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex items-end gap-1">
                    <span
                      className="text-3xl font-semibold tracking-tight sm:text-4xl"
                      style={{ color: featured ? "white" : PROPOSAL_TEAL }}
                    >
                      {formatProposalCurrency(plan.price)}
                    </span>
                    <span
                      className="mb-1 text-sm"
                      style={{
                        color: featured ? "rgba(255,255,255,0.7)" : "#737373",
                      }}
                    >
                      /mês
                    </span>
                  </div>
                  <p
                    className="mt-4 text-sm leading-relaxed"
                    style={{
                      color: featured ? "rgba(255,255,255,0.8)" : "#525252",
                    }}
                  >
                    {plan.description}
                  </p>
                </div>

                <ul className="flex flex-1 flex-col gap-3 px-6 py-6">
                  {plan.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-sm leading-relaxed text-neutral-600"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0"
                        style={{ color: PROPOSAL_GOLD }}
                        strokeWidth={2.5}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
