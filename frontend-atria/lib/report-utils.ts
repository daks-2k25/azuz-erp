const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function formatReportPeriod(month: number, year: number) {
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  linkedin: "LinkedIn",
};

export const FORMAT_LABELS: Record<string, string> = {
  carousel: "Carrossel",
  reels: "Reels",
  static: "Estático",
  story: "Story",
};

export const STATUS_LABELS: Record<string, string> = {
  pending_approval: "Aguardando Aprovação",
  scheduled: "Agendado",
  published: "Publicado",
  draft: "Rascunho",
};
