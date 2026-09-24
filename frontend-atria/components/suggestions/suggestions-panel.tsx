"use client";

import { MessageSquarePlus } from "lucide-react";
import { SuggestionForm } from "@/components/suggestions/suggestion-form";
import { SuggestionListItem } from "@/components/suggestions/suggestion-list-item";
import { usePermissions } from "@/hooks/use-permissions";
import {
  useAllSuggestions,
  useMySuggestions,
} from "@/hooks/use-suggestions";

export function SuggestionsPanel() {
  const { isMaster } = usePermissions();
  const master = isMaster();

  const {
    data: mySuggestions = [],
    isLoading: loadingMine,
    refetch: refetchMine,
  } = useMySuggestions();

  const {
    data: allSuggestions = [],
    isLoading: loadingAll,
    refetch: refetchAll,
  } = useAllSuggestions(master);

  const list = master ? allSuggestions : mySuggestions;
  const isLoading = master ? loadingAll : loadingMine;

  function handleSubmitted() {
    void refetchMine();
    if (master) void refetchAll();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-[var(--atria-primary)]/10 bg-[var(--atria-accent)]/20 p-3 text-[var(--atria-primary)]">
          <MessageSquarePlus className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[var(--atria-primary)]">
            Sugestões e Bugs
          </h1>
          <p className="text-sm text-[var(--atria-primary)]/50">
            {master
              ? "Envie feedback e acompanhe o que a equipe reportou."
              : "Envie bugs ou sugestões para melhorar o sistema."}
          </p>
        </div>
      </div>

      <SuggestionForm onSubmitted={handleSubmitted} />

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
            {master ? "Todas as submissões" : "Minhas submissões"}
          </h2>
          {!isLoading && list.length > 0 ? (
            <span className="rounded-full bg-[var(--atria-accent)]/30 px-2.5 py-1 text-xs font-semibold text-[var(--atria-primary)]">
              {list.length}
            </span>
          ) : null}
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-dashed border-[var(--atria-primary)]/15 bg-white/60 px-6 py-10 text-center text-sm text-[var(--atria-primary)]/50">
            Carregando...
          </div>
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--atria-primary)]/15 bg-white/60 px-6 py-10 text-center text-sm text-[var(--atria-primary)]/50">
            {master
              ? "Nenhuma sugestão ou bug enviado ainda."
              : "Você ainda não enviou nenhuma sugestão ou bug."}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((suggestion) => (
              <SuggestionListItem
                key={suggestion.id}
                suggestion={suggestion}
                showAuthor={master}
                canManageStatus={master}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
