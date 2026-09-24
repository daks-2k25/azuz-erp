"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { ApiError, userGroupsService } from "@/services";
import type { ManagedUser } from "@/services/types";

interface AddGroupMembersDialogProps {
  groupId: string;
  groupName: string;
  users: ManagedUser[];
  onSuccess: () => void;
}

export function AddGroupMembersDialog({
  groupId,
  groupName,
  users,
  onSuccess,
}: AddGroupMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = users.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
  }));

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedIds.length) return;

    setLoading(true);
    setError(null);
    try {
      await userGroupsService.addGroupMembers(groupId, selectedIds);
      setOpen(false);
      setSelectedIds([]);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível adicionar membros ao grupo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" size="sm" />
        }
      >
        <UserPlus className="size-4" />
        Adicionar ao grupo
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicionar membros — {groupName}</DialogTitle>
          </DialogHeader>
          <FieldGroup className="py-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <Field>
              <FieldLabel>Membros</FieldLabel>
              <div className="flex flex-col gap-2">
                {options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(option.value)}
                      onChange={(event) => {
                        setSelectedIds((current) =>
                          event.target.checked
                            ? [...current, option.value]
                            : current.filter((id) => id !== option.value),
                        );
                      }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedIds.length === 0}
              className="bg-[var(--atria-primary)] text-white"
            >
              {loading ? "Salvando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
