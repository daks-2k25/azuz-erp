"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { PRESET_COLORS } from "@/lib/financial-utils";
import { kanbanService, ApiError } from "@/services";

interface AddColumnDialogProps {
  onSuccess: () => void;
}

export function AddColumnDialog({ onSuccess }: AddColumnDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await kanbanService.createColumn({ title, color });
      setTitle("");
      setColor(PRESET_COLORS[0]);
      setOpen(false);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível criar a coluna.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" className="border-[var(--atria-primary)]/20" />
        }
      >
        <Plus className="size-4" />
        Nova Coluna
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-[var(--atria-primary)]">
              Nova Coluna
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="py-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <Field>
              <FieldLabel htmlFor="column-title">Título</FieldLabel>
              <Input
                id="column-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel>Cor</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setColor(preset)}
                    className={`size-7 rounded-full border-2 ${
                      color === preset
                        ? "border-[var(--atria-primary)]"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: preset }}
                  />
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
              disabled={loading}
              className="bg-[var(--atria-primary)] text-white"
            >
              {loading ? "Salvando..." : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
