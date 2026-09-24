"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, userGroupsService, usersService } from "@/services";
import type { ManagedUser } from "@/services/types";

const DEFAULT_COLOR = "#E8C39E";

interface CreateUserGroupDialogProps {
  onSuccess: () => void;
}

export function CreateUserGroupDialog({ onSuccess }: CreateUserGroupDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<ManagedUser[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [memberIds, setMemberIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    void usersService
      .getMembers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, [open]);

  function resetForm() {
    setName("");
    setDescription("");
    setColor(DEFAULT_COLOR);
    setMemberIds([]);
    setError(null);
  }

  function toggleMember(id: string) {
    setMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userGroupsService.createUserGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        memberIds: memberIds.length > 0 ? memberIds : undefined,
      });
      resetForm();
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar o grupo.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetForm();
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-[var(--atria-primary)] text-white" size="sm" />
        }
      >
        <Plus className="size-4" />
        Novo grupo
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              Criar grupo de equipe
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="py-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Field>
              <FieldLabel htmlFor="cg-name">Nome *</FieldLabel>
              <Input
                id="cg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Designers"
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="cg-desc">Descrição</FieldLabel>
              <Input
                id="cg-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opcional"
              />
            </Field>

            <Field>
              <FieldLabel>Cor do grupo</FieldLabel>
              <ColorPicker value={color} onChange={setColor} />
            </Field>

            <Field>
              <FieldLabel>Membros iniciais</FieldLabel>
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-input p-3">
                {users.length === 0 ? (
                  <p className="text-sm text-[var(--atria-primary)]/50">
                    Nenhum membro disponível.
                  </p>
                ) : (
                  users.map((user) => (
                    <label
                      key={user.id}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={memberIds.includes(user.id)}
                        onChange={() => toggleMember(user.id)}
                      />
                      <span className="text-[var(--atria-primary)]">{user.name}</span>
                      {user.userGroup && (
                        <span className="text-xs text-[var(--atria-primary)]/40">
                          ({user.userGroup.name})
                        </span>
                      )}
                    </label>
                  ))
                )}
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[var(--atria-primary)] text-white"
            >
              {loading ? "Criando..." : "Criar grupo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
