"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, userGroupsService } from "@/services";
import type { UserGroup } from "@/services/types";

const DEFAULT_COLOR = "#E8C39E";

export function UserGroupsManager({ onChange }: { onChange?: () => void }) {
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(DEFAULT_COLOR);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userGroupsService.getUserGroups();
      setGroups(data);
    } catch {
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGroups();
  }, [loadGroups]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await userGroupsService.createUserGroup({
        name: name.trim(),
        description: description.trim() || undefined,
        color,
      });
      setName("");
      setDescription("");
      setColor(DEFAULT_COLOR);
      await loadGroups();
      onChange?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar o grupo.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este grupo de usuários?")) return;

    try {
      await userGroupsService.deleteUserGroup(id);
      await loadGroups();
      onChange?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir o grupo.",
      );
    }
  }

  return (
    <Card className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
          Grupos de Equipe
        </h2>
        <p className="text-sm text-[var(--atria-primary)]/50">
          Organize membros em grupos como Designers, Financeiro, etc.
        </p>
      </div>

      <form onSubmit={handleCreate} className="mb-6">
        <FieldGroup>
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
            <Field>
              <FieldLabel htmlFor="ug-name">Nome</FieldLabel>
              <Input
                id="ug-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Designers"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ug-desc">Descrição</FieldLabel>
              <Input
                id="ug-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Opcional"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="ug-color">Cor</FieldLabel>
              <Input
                id="ug-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-16 cursor-pointer p-1"
              />
            </Field>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[var(--atria-primary)] text-white"
              >
                <Plus className="size-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </FieldGroup>
      </form>

      {loading ? (
        <p className="text-sm text-[var(--atria-primary)]/50">Carregando...</p>
      ) : groups.length === 0 ? (
        <p className="text-sm text-[var(--atria-primary)]/50">
          Nenhum grupo criado ainda.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--atria-primary)]/10 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <div>
                  <p className="font-medium text-[var(--atria-primary)]">
                    {group.name}
                  </p>
                  {group.description && (
                    <p className="text-xs text-[var(--atria-primary)]/50">
                      {group.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--atria-primary)]/50">
                  {group.userCount} usuário{group.userCount === 1 ? "" : "s"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => void handleDelete(group.id)}
                >
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
