"use client";

import {
  formatClientAddress,
  formatCurrency,
  formatLongDate,
  FREQUENCY_LABELS,
  STATUS_LABELS,
} from "@/lib/contract-utils";
import { useBranding } from "@/contexts/branding-context";
import { AgencyLogo } from "@/components/branding/agency-logo";
import type { Contract } from "@/services/types";

interface ContractDocumentProps {
  contract: Contract;
  className?: string;
}

export function ContractDocument({ contract, className }: ContractDocumentProps) {
  const { branding } = useBranding();
  const address = formatClientAddress(contract.client);
  const scopeRows = [
    ["Valor", formatCurrency(contract.recurringValue)],
    ["Frequência", FREQUENCY_LABELS[contract.paymentFrequency]],
    ["Início da vigência", formatLongDate(contract.startDate)],
    [
      "Término",
      contract.endDate ? formatLongDate(contract.endDate) : "Indeterminado",
    ],
    ["Status", STATUS_LABELS[contract.status]],
  ];

  return (
    <article
      className={`contract-document bg-white text-[#1e293b] ${className ?? ""}`}
    >
      <header className="contract-document-header">
        <AgencyLogo
          size="sm"
          variant="login"
          subtitle="Gestão inteligente para agências e estúdios"
          showName
        />

        <h1 className="mt-5 text-[20px] font-bold leading-tight text-[#004949]">
          {contract.title}
        </h1>
        <p className="mt-1 text-[10px] text-[#64748b]">
          Contrato de Prestação de Serviços · {STATUS_LABELS[contract.status]}
        </p>

        <div className="mt-4 h-0.5 w-full bg-[#e8c39e]" />
      </header>

      <section className="contract-document-section contract-document-parties">
        <h2 className="contract-document-heading">Dados das Partes</h2>
        <div className="contract-document-parties-grid grid gap-4 md:grid-cols-2">
          <PartyCard
            title="Contratante (Cliente)"
            lines={[
              contract.client.companyName,
              contract.client.contactName
                ? `Contato: ${contract.client.contactName}`
                : null,
              contract.client.email ? `E-mail: ${contract.client.email}` : null,
              contract.client.phone ? `Telefone: ${contract.client.phone}` : null,
              address,
            ]}
          />
          <PartyCard
            title="Contratada (Agência)"
            lines={[
              branding.agencyName,
              `Responsável: ${contract.createdBy.name}`,
              contract.createdBy.email
                ? `E-mail: ${contract.createdBy.email}`
                : null,
            ]}
          />
        </div>
      </section>

      <section className="contract-document-section contract-document-scope">
        <h2 className="contract-document-heading">Escopo e Valores</h2>
        <table className="w-full overflow-hidden rounded-md border border-[#e2e8f0] text-[9px]">
          <tbody>
            {scopeRows.map(([label, value], index) => (
              <tr
                key={label}
                className={index % 2 === 0 ? "bg-[#f8fafa]" : "bg-white"}
              >
                <th className="w-[34%] px-3 py-2 text-left font-bold text-[#004949]">
                  {label}
                </th>
                <td className="px-3 py-2 text-[#1e293b]">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="contract-document-section contract-document-terms">
        <h2 className="contract-document-heading">Cláusulas e Termos</h2>
        <div className="contract-document-terms-body whitespace-pre-wrap text-justify text-[10px] leading-relaxed text-[#334155]">
          {contract.termsContent}
        </div>
      </section>

      <section className="contract-document-section contract-document-signatures">
        <h2 className="contract-document-heading">Assinaturas</h2>
        <div className="contract-document-signatures-grid mt-6 grid gap-8 md:grid-cols-2">
          <SignatureBlock
            party={contract.client.companyName}
            representative={contract.client.contactName ?? "Representante legal"}
          />
          <SignatureBlock
            party={branding.agencyName}
            representative={contract.createdBy.name}
          />
        </div>
        {contract.status === "signed" && (
          <p className="mt-6 text-center text-[8px] italic text-[#64748b]">
            Documento assinado digitalmente em{" "}
            {formatLongDate(contract.updatedAt)}.
          </p>
        )}
      </section>

      <footer className="contract-document-footer mt-10 text-center text-[8px] text-[#64748b]">
        Gerado em {formatLongDate(new Date())} · ID{" "}
        {contract.id.slice(0, 8).toUpperCase()}
      </footer>
    </article>
  );
}

function PartyCard({
  title,
  lines,
}: {
  title: string;
  lines: (string | null)[];
}) {
  return (
    <div className="rounded-md border border-[#e2e8f0] bg-[#f8fafa] p-3">
      <p className="text-[8px] font-bold uppercase text-[#004949]">{title}</p>
      <div className="mt-2 space-y-1 text-[9px] text-[#334155]">
        {lines
          .filter((line): line is string => Boolean(line))
          .map((line) => (
            <p key={line}>{line}</p>
          ))}
      </div>
    </div>
  );
}

function SignatureBlock({
  party,
  representative,
}: {
  party: string;
  representative: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-3 h-12 w-full border-b border-[#cbd5e1]" />
      <p className="text-[9px] font-bold text-[#004949]">{party}</p>
      <p className="mt-1 text-[8px] text-[#64748b]">{representative}</p>
    </div>
  );
}
