export type SystemSuggestionType = "BUG" | "SUGGESTION";

export type SystemSuggestionStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export interface SystemSuggestion {
  id: string;
  type: SystemSuggestionType;
  title: string;
  description: string;
  status: SystemSuggestionStatus;
  submittedById: string;
  submittedBy: {
    id: string;
    name: string;
    email: string;
  };
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuggestionInput {
  type: SystemSuggestionType;
  title: string;
  description: string;
}

export interface UpdateSuggestionStatusInput {
  status: SystemSuggestionStatus;
}
