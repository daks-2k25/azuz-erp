"use client";

import { SearchableSelect } from "@/components/ui/searchable-select";
import type { TeamMember, UserGroup } from "@/services/types";

const USER_PREFIX = "user:";
const GROUP_PREFIX = "group:";

export function encodeAssigneeOrGroupValue(params: {
  assigneeId?: string;
  assignedGroupId?: string;
}): string {
  if (params.assignedGroupId) return `${GROUP_PREFIX}${params.assignedGroupId}`;
  if (params.assigneeId) return `${USER_PREFIX}${params.assigneeId}`;
  return "";
}

export function decodeAssigneeOrGroupValue(value: string): {
  assigneeId: string;
  assignedGroupId: string;
} {
  if (value.startsWith(GROUP_PREFIX)) {
    return {
      assigneeId: "",
      assignedGroupId: value.slice(GROUP_PREFIX.length),
    };
  }

  if (value.startsWith(USER_PREFIX)) {
    return {
      assigneeId: value.slice(USER_PREFIX.length),
      assignedGroupId: "",
    };
  }

  return { assigneeId: "", assignedGroupId: "" };
}

interface AssigneeOrGroupSelectProps {
  id?: string;
  members: TeamMember[];
  groups: UserGroup[];
  assigneeId: string;
  assignedGroupId: string;
  onChange: (next: { assigneeId: string; assignedGroupId: string }) => void;
  loading?: boolean;
  allowEmpty?: boolean;
  emptyOptionLabel?: string;
  placeholder?: string;
}

export function AssigneeOrGroupSelect({
  id,
  members,
  groups,
  assigneeId,
  assignedGroupId,
  onChange,
  loading = false,
  allowEmpty = true,
  emptyOptionLabel = "Nenhum",
  placeholder = "Selecione um responsável ou grupo",
}: AssigneeOrGroupSelectProps) {
  return (
    <SearchableSelect
      id={id}
      value={encodeAssigneeOrGroupValue({ assigneeId, assignedGroupId })}
      onValueChange={(value) => onChange(decodeAssigneeOrGroupValue(value))}
      loading={loading}
      allowEmpty={allowEmpty}
      emptyOptionLabel={emptyOptionLabel}
      placeholder={placeholder}
      searchPlaceholder="Buscar pessoa ou grupo..."
      emptyLabel="Nenhum responsável encontrado"
      options={[
        ...members.map((member) => ({
          value: `${USER_PREFIX}${member.id}`,
          label: member.name,
          group: "Pessoas",
        })),
        ...groups.map((group) => ({
          value: `${GROUP_PREFIX}${group.id}`,
          label: group.name,
          group: "Grupos / Equipes",
        })),
      ]}
    />
  );
}
