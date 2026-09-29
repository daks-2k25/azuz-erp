"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DateInput } from "@/components/ui/date-input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { NativeSelect } from "@/components/ui/native-select";
import { useEmployeeProfileMutations } from "@/hooks/use-time-tracking-admin";
import { toast } from "@/lib/toast";
import { ApiError } from "@/services";
import type {
  EmployeeProfile,
  WorkSchedule,
} from "@/services/time-tracking.service";
import type { ManagedUser } from "@/services/types";

interface EmployeeProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** null = cadastrar novo funcionário */
  employee: EmployeeProfile | null;
  members: ManagedUser[];
  registeredUserIds: Set<string>;
  workSchedules: WorkSchedule[];
}

export function EmployeeProfileDialog({
  open,
  onOpenChange,
  employee,
  members,
  registeredUserIds,
  workSchedules,
}: EmployeeProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <EmployeeProfileForm
            key={employee?.id ?? "new"}
            employee={employee}
            members={members}
            registeredUserIds={registeredUserIds}
            workSchedules={workSchedules}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface EmployeeProfileFormProps {
  employee: EmployeeProfile | null;
  members: ManagedUser[];
  registeredUserIds: Set<string>;
  workSchedules: WorkSchedule[];
  onClose: () => void;
}

/** Montado a cada abertura do diálogo, já com o estado inicial correto. */
function EmployeeProfileForm({
  employee,
  members,
  registeredUserIds,
  workSchedules,
  onClose,
}: EmployeeProfileFormProps) {
  const { create, update } = useEmployeeProfileMutations();

  const availableMembers = useMemo(
    () => members.filter((member) => !registeredUserIds.has(member.id)),
    [members, registeredUserIds],
  );
  const activeSchedules = useMemo(
    () => workSchedules.filter((schedule) => schedule.isActive),
    [workSchedules],
  );

  const [userId, setUserId] = useState(employee?.userId ?? "");
  const [admissionDate, setAdmissionDate] = useState(
    employee?.admissionDate ?? "",
  );
  const [workScheduleId, setWorkScheduleId] = useState(
    employee?.workSchedule.id ?? activeSchedules[0]?.id ?? "",
  );
  const [error, setError] = useState<string | null>(null);

  const isEditing = employee !== null;
  const isSaving = create.isPending || update.isPending;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isEditing && !userId) {
      setError("Selecione o usuário.");
      return;
    }
    if (!admissionDate || !workScheduleId) {
      setError("Preencha a data de admissão e a jornada.");
      return;
    }

    try {
      if (isEditing) {
        await update.mutateAsync({
          id: employee.id,
          data: { admissionDate, workScheduleId },
        });
        toast.success("Cadastro atualizado");
      } else {
        await create.mutateAsync({ userId, admissionDate, workScheduleId });
        toast.success("Funcionário CLT cadastrado");
      }
      onClose();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Não foi possível salvar.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle className="text-[var(--atria-primary)]">
          {isEditing
            ? `Editar ${employee.user.name}`
            : "Cadastrar funcionário CLT"}
        </DialogTitle>
      </DialogHeader>

      <FieldGroup className="py-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {!isEditing && (
          <Field>
            <FieldLabel htmlFor="ep-user">Usuário *</FieldLabel>
            <NativeSelect
              id="ep-user"
              aria-label="Selecione o usuário"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            >
              {availableMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </NativeSelect>
          </Field>
        )}

        <Field>
          <FieldLabel htmlFor="ep-admission">Data de admissão *</FieldLabel>
          <DateInput
            id="ep-admission"
            value={admissionDate}
            onChange={(event) => setAdmissionDate(event.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="ep-schedule">Jornada *</FieldLabel>
          <NativeSelect
            id="ep-schedule"
            aria-label="Selecione a jornada"
            value={workScheduleId}
            onChange={(event) => setWorkScheduleId(event.target.value)}
          >
            {activeSchedules.map((schedule) => (
              <option key={schedule.id} value={schedule.id}>
                {schedule.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-[var(--atria-primary)] text-white"
        >
          {isSaving ? "Salvando..." : "Salvar"}
        </Button>
      </DialogFooter>
    </form>
  );
}
