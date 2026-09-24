import type {
  SystemSuggestionStatus,
  SystemSuggestionType,
} from "@/services/types";

export const SUGGESTION_TYPE_LABELS: Record<SystemSuggestionType, string> = {
  BUG: "Bug",
  SUGGESTION: "Sugestão",
};

export const SUGGESTION_STATUS_LABELS: Record<SystemSuggestionStatus, string> = {
  OPEN: "Aberto",
  IN_PROGRESS: "Em andamento",
  RESOLVED: "Resolvido",
  CLOSED: "Fechado",
};

export const SUGGESTION_STATUS_OPTIONS: SystemSuggestionStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];
