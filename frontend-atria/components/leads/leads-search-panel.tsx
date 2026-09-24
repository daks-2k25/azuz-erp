"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Kanban, Loader2, Search } from "lucide-react";
import { AddToKanbanOrganizationDialog } from "@/components/leads/add-to-kanban-organization-dialog";
import { LeadsTable } from "@/components/leads/leads-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { usePermissions } from "@/hooks/use-permissions";
import { useSdrAssignedOrganizations } from "@/hooks/use-sdr-assigned-organizations";
import {
  buildAddToKanbanInput,
  isExternalLeadId,
  leadMinerLeadToPreviewLead,
  mergeExternalPreviewLeads,
  type ExternalLeadSearchContext,
} from "@/lib/lead-external-utils";
import { normalizeAppRole } from "@/lib/permissions";
import { toast } from "@/lib/toast";
import { leadsService } from "@/services";
import type { Lead } from "@/services/types";
import {
  importLeadMinerLeads,
  pollLeadMinerJob,
  startLeadMinerSearch,
} from "@/services/leadminer.service";

function normalizeCategory(value: string) {
  return value.trim().toLowerCase();
}

function leadMatchesCategory(lead: Lead, category: string) {
  return normalizeCategory(lead.category ?? "") === normalizeCategory(category);
}

function collectSearchCategories(leads: Lead[]) {
  const categories = new Set<string>();
  for (const lead of leads) {
    if (lead.source !== "leadminer") continue;
    const category = lead.category?.trim();
    if (category) categories.add(category);
  }
  return Array.from(categories).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function matchesQuery(lead: Lead, query: string) {
  if (!query) return true;
  const haystack = [
    lead.name,
    lead.city,
    lead.neighborhood,
    lead.category,
    lead.phone,
    lead.email,
    lead.address,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query);
}

function isCrmRole(role: string | null | undefined) {
  return normalizeAppRole(role) === "crm";
}

export function LeadsSearchPanel() {
  const { user } = useAuth();
  const { isMasterOrAdmin } = usePermissions();
  const isCrmUser = isCrmRole(user?.role);
  const showClientFilter = isCrmUser || isMasterOrAdmin();
  const { organizations, loading: organizationsLoading } =
    useSdrAssignedOrganizations(showClientFilter && Boolean(user));
  const [clientFilter, setClientFilter] = useState("all");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [categoria, setCategoria] = useState("");
  const [filterQuery, setFilterQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas as Categorias");
  const [loading, setLoading] = useState(false);
  const [bulkAddingKanban, setBulkAddingKanban] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [qualifyingId, setQualifyingId] = useState<string | null>(null);
  const [addingKanbanId, setAddingKanbanId] = useState<string | null>(null);
  const [savedLeads, setSavedLeads] = useState<Lead[]>([]);
  const [externalPreviewLeads, setExternalPreviewLeads] = useState<Lead[]>([]);
  const [searchContext, setSearchContext] =
    useState<ExternalLeadSearchContext | null>(null);
  const [addToKanbanOnImport, setAddToKanbanOnImport] = useState(false);
  const [searchedCategories, setSearchedCategories] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [jobStatus, setJobStatus] = useState<string | null>(null);
  const [kanbanModalOpen, setKanbanModalOpen] = useState(false);
  const [pendingKanbanLeads, setPendingKanbanLeads] = useState<Lead[]>([]);
  const [confirmingKanban, setConfirmingKanban] = useState(false);

  const allClientsLabel = isMasterOrAdmin()
    ? "Todas as Empresas"
    : "Todos os Meus Clientes";

  const selectedOrganization = useMemo(
    () =>
      clientFilter === "all"
        ? null
        : (organizations.find(
            (organization) => organization.id === clientFilter,
          ) ?? null),
    [clientFilter, organizations],
  );

  const leads = useMemo(
    () => mergeExternalPreviewLeads(savedLeads, externalPreviewLeads),
    [savedLeads, externalPreviewLeads],
  );

  const loadSavedLeads = useCallback(async () => {
    setInitialLoading(true);
    try {
      const data = await leadsService.listProspectingLeads(
        clientFilter === "all" ? undefined : clientFilter,
      );
      setSavedLeads(data);
      setSearchedCategories(collectSearchCategories(data));
    } catch {
      setSavedLeads([]);
      setSearchedCategories([]);
    } finally {
      setInitialLoading(false);
    }
  }, [clientFilter]);

  const addSearchedCategory = useCallback((category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;

    setSearchedCategories((current) => {
      const exists = current.some(
        (item) => normalizeCategory(item) === normalizeCategory(trimmed),
      );
      if (exists) return current;
      return [...current, trimmed].sort((a, b) => a.localeCompare(b, "pt-BR"));
    });
  }, []);

  useEffect(() => {
    void loadSavedLeads();
  }, [loadSavedLeads]);

  const results = useMemo(() => {
    const normalized = filterQuery.trim().toLowerCase();

    let filtered = leads;

    if (filterCategory !== "Todas as Categorias") {
      filtered = filtered.filter((lead) =>
        leadMatchesCategory(lead, filterCategory),
      );
    }

    if (!hasSearched && !normalized) return filtered;
    return filtered.filter((lead) => matchesQuery(lead, normalized));
  }, [leads, filterQuery, filterCategory, hasSearched]);

  const pendingKanbanCount = useMemo(
    () => results.filter((lead) => !lead.kanbanTracked).length,
    [results],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const city = cidade.trim();
    const neighborhood = bairro.trim();
    const category = categoria.trim();

    if (!city || !neighborhood || !category) {
      toast.error("Preencha cidade, bairro e categoria para buscar leads.");
      return;
    }

    if (addToKanbanOnImport && clientFilter === "all") {
      toast.error(
        "Selecione um cliente antes de importar direto para o kanban.",
      );
      return;
    }

    const context: ExternalLeadSearchContext = {
      city,
      neighborhood,
      category,
    };

    setHasSearched(true);
    setLoading(true);
    setJobStatus("pending");
    setSearchContext(context);
    setExternalPreviewLeads([]);
    addSearchedCategory(category);

    try {
      const { job_id } = await startLeadMinerSearch({
        city,
        neighborhood,
        category,
        max_results: 50,
      });

      const job = await pollLeadMinerJob(job_id, (status) => {
        setJobStatus(status);
      });

      if (job.status === "failed") {
        toast.error(job.error ?? "Falha ao buscar leads.");
        await loadSavedLeads();
        return;
      }

      const previewLeads =
        job.data?.map((item, index) =>
          leadMinerLeadToPreviewLead(item, context, index),
        ) ?? [];
      setExternalPreviewLeads(previewLeads);

      const imported =
        job.data && job.data.length > 0
          ? await importLeadMinerLeads({
              city,
              neighborhood,
              category,
              leads: job.data,
              addToKanban: addToKanbanOnImport,
              organizationId: clientFilter === "all" ? undefined : clientFilter,
            })
          : [];

      await loadSavedLeads();
      setExternalPreviewLeads([]);

      const addedToKanban = addToKanbanOnImport
        ? imported.filter((lead) => lead.kanbanTracked).length
        : 0;

      if (imported.length > 0) {
        if (addToKanbanOnImport && addedToKanban > 0) {
          toast.success(
            `${imported.length} lead(s) importados · ${addedToKanban} no kanban.`,
          );
        } else {
          toast.success(
            `${imported.length} lead(s) encontrados para ${category}.`,
          );
        }
      } else {
        toast.info(`Nenhum lead encontrado para ${category}.`);
      }
    } catch {
      try {
        await loadSavedLeads();
      } catch {
        /* toast handled by api */
      }
    } finally {
      setLoading(false);
      setJobStatus(null);
    }
  }

  function shouldOpenOrganizationModal() {
    if (isCrmRole(user?.role)) return true;
    return clientFilter === "all";
  }

  function getDefaultOrganizationId() {
    if (clientFilter !== "all") return clientFilter;
    if (organizations.length === 1) return organizations[0]?.id ?? "";
    return "";
  }

  async function addLeadsToKanban(leadsToAdd: Lead[], organizationId: string) {
    if (leadsToAdd.length === 1) {
      setAddingKanbanId(leadsToAdd[0].id);
    } else {
      setBulkAddingKanban(true);
    }

    let added = 0;

    try {
      for (const lead of leadsToAdd) {
        try {
          const payload = buildAddToKanbanInput(
            lead,
            searchContext ?? undefined,
            organizationId,
          );
          const updated = await leadsService.addToKanban(payload, {
            skipToast: true,
          });
          added += 1;
          setSavedLeads((current) => {
            const withoutExternal = current.filter(
              (item) => item.id !== lead.id,
            );
            const exists = withoutExternal.some(
              (item) => item.id === updated.id,
            );
            if (exists) {
              return withoutExternal.map((item) =>
                item.id === updated.id ? updated : item,
              );
            }
            return [updated, ...withoutExternal];
          });
          if (isExternalLeadId(lead.id)) {
            setExternalPreviewLeads((current) =>
              current.filter((item) => item.id !== lead.id),
            );
          }
        } catch {
          /* continue with next lead */
        }
      }

      if (added > 0) {
        toast.success(
          added === 1
            ? `${leadsToAdd[0]?.name ?? "Lead"} adicionado ao kanban.`
            : `${added} lead(s) adicionados ao kanban.`,
        );
      } else {
        toast.error("Não foi possível adicionar os leads ao kanban.");
      }
    } finally {
      setAddingKanbanId(null);
      setBulkAddingKanban(false);
    }
  }

  function requestAddToKanban(leadsToAdd: Lead[]) {
    if (leadsToAdd.length === 0) return;

    if (shouldOpenOrganizationModal()) {
      setPendingKanbanLeads(leadsToAdd);
      setKanbanModalOpen(true);
      return;
    }

    const organizationId = getDefaultOrganizationId();
    if (!organizationId) {
      setPendingKanbanLeads(leadsToAdd);
      setKanbanModalOpen(true);
      return;
    }

    void addLeadsToKanban(leadsToAdd, organizationId);
  }

  async function handleConfirmKanbanOrganization(organizationId: string) {
    if (pendingKanbanLeads.length === 0) return;

    setConfirmingKanban(true);
    try {
      await addLeadsToKanban(pendingKanbanLeads, organizationId);
      setKanbanModalOpen(false);
      setPendingKanbanLeads([]);
    } finally {
      setConfirmingKanban(false);
    }
  }

  async function handleQualify(lead: Lead) {
    if (isExternalLeadId(lead.id)) return;

    setQualifyingId(lead.id);
    try {
      const updated = await leadsService.qualifyLead(lead.id);
      setSavedLeads((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
      toast.success(
        updated.status === "VENDA_FINALIZADA"
          ? `${updated.name} qualificado (score ${updated.aiScore}).`
          : `${updated.name} sem interesse (score ${updated.aiScore}).`,
      );
    } catch {
      /* toast handled by api */
    } finally {
      setQualifyingId(null);
    }
  }

  function handleAddToKanban(lead: Lead) {
    if (lead.kanbanTracked) return;
    requestAddToKanban([lead]);
  }

  function handleAddAllToKanban() {
    const pending = results.filter((lead) => !lead.kanbanTracked);
    if (pending.length === 0) {
      toast.info("Todos os leads visíveis já estão no kanban.");
      return;
    }
    requestAddToKanban(pending);
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <AddToKanbanOrganizationDialog
        open={kanbanModalOpen}
        onOpenChange={(open) => {
          setKanbanModalOpen(open);
          if (!open) setPendingKanbanLeads([]);
        }}
        organizations={organizations}
        defaultOrganizationId={getDefaultOrganizationId()}
        leadCount={pendingKanbanLeads.length}
        loading={confirmingKanban}
        onConfirm={handleConfirmKanbanOrganization}
      />
      {showClientFilter && organizations.length > 0 && (
        <Card className="rounded-2xl border border-[var(--atria-primary)]/10">
          <CardContent className="pt-6">
            <Field>
              <FieldLabel htmlFor="lead-client-filter">
                Filtrar por Cliente
              </FieldLabel>
              <Select
                value={clientFilter}
                onValueChange={(value) => {
                  if (value) setClientFilter(value);
                }}
                disabled={organizationsLoading}
              >
                <SelectTrigger
                  id="lead-client-filter"
                  className="h-11 w-full max-w-md text-sm font-medium"
                >
                  <SelectValue placeholder={allClientsLabel} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{allClientsLabel}</SelectItem>
                  {organizations.map((organization) => (
                    <SelectItem key={organization.id} value={organization.id}>
                      {organization.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-[var(--atria-primary)]/10">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base">Busca de leads</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="flex flex-col gap-4"
          >
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="lead-cidade">Cidade</FieldLabel>
                  <Input
                    id="lead-cidade"
                    value={cidade}
                    onChange={(event) => setCidade(event.target.value)}
                    placeholder="Ex: São Paulo"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lead-bairro">Bairro</FieldLabel>
                  <Input
                    id="lead-bairro"
                    value={bairro}
                    onChange={(event) => setBairro(event.target.value)}
                    placeholder="Ex: Pinheiros"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lead-categoria">Categoria</FieldLabel>
                  <Input
                    id="lead-categoria"
                    value={categoria}
                    onChange={(event) => setCategoria(event.target.value)}
                    placeholder="Ex: Restaurante"
                    required
                  />
                </Field>
              </div>
            </FieldGroup>

            <div className="flex justify-stretch sm:justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {jobStatus === "processing"
                      ? "Processando busca..."
                      : jobStatus === "pending"
                        ? "Aguardando busca..."
                        : "Buscando..."}
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar leads
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {searchedCategories.length > 0 && (
        <Card className="rounded-2xl border border-[var(--atria-primary)]/10">
          <CardContent className="pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="lead-category-filter">
                  Categoria da busca
                </FieldLabel>
                <Select
                  value={filterCategory}
                  onValueChange={(value) => {
                    if (value) setFilterCategory(value);
                  }}
                >
                  <SelectTrigger id="lead-category-filter">
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todas as Categorias">
                      Todas as categorias
                    </SelectItem>
                    {searchedCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="lead-filter">
                  Filtrar resultados
                </FieldLabel>
                <Input
                  id="lead-filter"
                  value={filterQuery}
                  onChange={(event) => setFilterQuery(event.target.value)}
                  placeholder="Nome, telefone, endereço..."
                />
              </Field>
            </div>
          </CardContent>
        </Card>
      )}

      {(loading || initialLoading) && (
        <div className="flex min-h-[30vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
        </div>
      )}

      {!loading && !initialLoading && (
        <>
          {pendingKanbanCount > 0 && (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                disabled={bulkAddingKanban}
                onClick={() => void handleAddAllToKanban()}
                className="gap-2"
              >
                {bulkAddingKanban ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Kanban className="size-4" />
                )}
                Adicionar {pendingKanbanCount} ao kanban
              </Button>
            </div>
          )}

          <LeadsTable
            leads={results}
            qualifyingId={qualifyingId}
            addingKanbanId={addingKanbanId}
            onQualify={handleQualify}
            onAddToKanban={handleAddToKanban}
            organizationLabel={
              selectedOrganization?.companyName ??
              "todos os clientes atribuídos"
            }
          />
        </>
      )}
    </div>
  );
}
