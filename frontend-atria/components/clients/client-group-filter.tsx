"use client";

import { useEffect, useState } from "react";
import { clientGroupsService } from "@/services";
import type { ClientGroup } from "@/services/types";

interface ClientGroupFilterProps {
  value: string;
  onChange: (groupId: string) => void;
}

export function ClientGroupFilter({ value, onChange }: ClientGroupFilterProps) {
  const [groups, setGroups] = useState<ClientGroup[]>([]);

  useEffect(() => {
    void clientGroupsService.getClientGroups().then(setGroups).catch(() => setGroups([]));
  }, []);

  if (groups.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-[var(--atria-primary)]/70">
        Filtrar:
      </span>
      <button
        type="button"
        onClick={() => onChange("")}
        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
          value === ""
            ? "bg-[var(--atria-primary)] text-white"
            : "bg-[var(--atria-primary)]/5 text-[var(--atria-primary)] hover:bg-[var(--atria-primary)]/10"
        }`}
      >
        Todos
      </button>
      {groups.map((group) => (
        <button
          key={group.id}
          type="button"
          onClick={() => onChange(group.id)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            value === group.id
              ? "bg-[var(--atria-primary)] text-white"
              : "text-[var(--atria-primary)] hover:opacity-80"
          }`}
          style={
            value !== group.id
              ? { backgroundColor: `${group.color}66` }
              : undefined
          }
        >
          {group.name}
        </button>
      ))}
    </div>
  );
}
