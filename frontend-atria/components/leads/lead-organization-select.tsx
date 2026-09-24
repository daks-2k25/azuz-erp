"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useAuth } from "@/contexts/auth-context";
import { useSdrAssignedOrganizations } from "@/hooks/use-sdr-assigned-organizations";
import { usePermissions } from "@/hooks/use-permissions";
import { normalizeAppRole } from "@/lib/permissions";
import { isStaffRole } from "@/lib/roles";

interface LeadOrganizationSelectProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function LeadOrganizationSelect({
  value,
  onChange,
  id = "lead-organization",
}: LeadOrganizationSelectProps) {
  const { user } = useAuth();
  const { isMasterOrAdmin } = usePermissions();
  const { organizations, loading } = useSdrAssignedOrganizations(
    Boolean(user) &&
      (isMasterOrAdmin() ||
        (isStaffRole(user?.role) && normalizeAppRole(user?.role) === "crm")),
  );

  const role = user?.role ?? "";
  const showSelector =
    isMasterOrAdmin() || (isStaffRole(role) && normalizeAppRole(role) === "crm");

  if (!showSelector) return null;

  return (
    <Field>
      <FieldLabel htmlFor={id}>Empresa cliente *</FieldLabel>
      <SearchableSelect
        id={id}
        value={value}
        onValueChange={(next) => onChange(next ?? "")}
        disabled={loading}
        loading={loading}
        placeholder="Selecione a empresa"
        searchPlaceholder="Buscar cliente..."
        emptyLabel="Nenhum cliente atribuído"
        options={organizations.map((organization) => ({
          value: organization.id,
          label: organization.companyName,
        }))}
      />
      <p className="mt-1 text-[11px] text-[var(--atria-primary)]/45">
        Leads ficam visíveis apenas para o SDR e o cliente selecionado.
      </p>
    </Field>
  );
}

export function resolveOrganizationIdForPayload(
  value: string,
): string | undefined {
  if (!value) return undefined;
  return value;
}
