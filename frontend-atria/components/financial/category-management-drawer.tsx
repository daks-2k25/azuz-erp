"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Settings2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategoryBadge } from "@/components/financial/category-badge";
import {
  CATEGORY_TYPE_LABELS,
  PRESET_COLORS,
} from "@/lib/financial-utils";
import { financeService, ApiError } from "@/services";
import { toast } from "@/lib/toast";
import type { FinanceCategory } from "@/services/types";

interface CategoryManagementDrawerProps {
  onCategoriesChange: () => void;
}

type CategoryFormState = {
  name: string;
  type: "income" | "expense";
  color: string;
};

const emptyForm: CategoryFormState = {
  name: "",
  type: "expense",
  color: PRESET_COLORS[0],
};

export function CategoryManagementDrawer({
  onCategoriesChange,
}: CategoryManagementDrawerProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);

  async function loadCategories() {
    try {
      const data = await financeService.getCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    }
  }

  useEffect(() => {
    if (!open) return;
    void loadCategories();
  }, [open]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
  }

  function startEdit(category: FinanceCategory) {
    setEditingId(category.id);
    setForm({
      name: category.name,
      type: category.type,
      color: category.color,
    });
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (editingId) {
        await financeService.updateCategory(editingId, {
          name: form.name,
          color: form.color,
        });
      } else {
        await financeService.createCategory(form);
      }

      resetForm();
      await loadCategories();
      onCategoriesChange();
      toast.success(
        editingId ? "Categoria atualizada" : "Categoria criada com sucesso",
      );
    } catch (err) {
      if (!(err instanceof ApiError)) {
        setError("Não foi possível salvar a categoria.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Deseja excluir esta categoria?")) return;

    setLoading(true);
    setError(null);

    try {
      await financeService.deleteCategory(id);
      if (editingId === id) resetForm();
      await loadCategories();
      onCategoriesChange();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir a categoria.",
      );
    } finally {
      setLoading(false);
    }
  }

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" className="border-[var(--atria-primary)]/20" />
        }
      >
        <Settings2 className="size-4" />
        Categorias
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto px-6 pb-6 sm:max-w-md">
        <SheetHeader className="px-0">
          <SheetTitle className="text-[var(--atria-primary)]">
            Gerenciar Categorias
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--atria-primary)]/10 bg-[var(--atria-accent)]/5 p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--atria-primary)]">
              {editingId ? "Editar Categoria" : "Nova Categoria"}
            </h3>

            {error && (
              <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="cat-name">Nome</FieldLabel>
                <Input
                  id="cat-name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </Field>

              {!editingId && (
                <Field>
                  <FieldLabel htmlFor="cat-type">Tipo</FieldLabel>
                  <NativeSelect
                    id="cat-type"
                    value={form.type}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        type: e.target.value as "income" | "expense",
                      }))
                    }
                  >
                    <option value="income">Receita</option>
                    <option value="expense">Despesa</option>
                  </NativeSelect>
                </Field>
              )}

              <Field>
                <FieldLabel>Cor</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, color }))}
                      className={`size-7 rounded-full border-2 transition-transform hover:scale-110 ${
                        form.color === color
                          ? "border-[var(--atria-primary)]"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Cor ${color}`}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <CategoryBadge name={form.name || "Prévia"} color={form.color} />
                </div>
              </Field>
            </FieldGroup>

            <div className="mt-4 flex gap-2">
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading || !form.name.trim()}
                className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
              >
                <Plus className="size-4" />
                {editingId ? "Salvar" : "Adicionar"}
              </Button>
            </div>
          </form>

          <CategorySection
            title={CATEGORY_TYPE_LABELS.income}
            categories={incomeCategories}
            onEdit={startEdit}
            onDelete={handleDelete}
          />

          <CategorySection
            title={CATEGORY_TYPE_LABELS.expense}
            categories={expenseCategories}
            onEdit={startEdit}
            onDelete={handleDelete}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CategorySection({
  title,
  categories,
  onEdit,
  onDelete,
}: {
  title: string;
  categories: FinanceCategory[];
  onEdit: (category: FinanceCategory) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section>
      <h3 className="mb-3 text-sm font-semibold text-[var(--atria-primary)]">
        {title}
      </h3>
      {categories.length === 0 ? (
        <p className="text-sm text-[var(--atria-primary)]/50">
          Nenhuma categoria cadastrada.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between rounded-xl border border-[var(--atria-primary)]/10 bg-white p-3"
            >
              <CategoryBadge name={category.name} color={category.color} />
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onEdit(category)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onDelete(category.id)}
                >
                  <Trash2 className="size-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
