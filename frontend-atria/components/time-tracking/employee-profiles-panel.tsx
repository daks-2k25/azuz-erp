"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useEmployeeProfileMutations,
  useEmployeeProfiles,
  useWorkSchedules,
} from "@/hooks/use-time-tracking-admin";
import { formatCalendarDate } from "@/lib/time-tracking/format";
import { toast } from "@/lib/toast";
import { ApiError, usersService } from "@/services";
import type { EmployeeProfile } from "@/services/time-tracking.service";
import type { ManagedUser } from "@/services/types";
import { EmployeeProfileDialog } from "./employee-profile-dialog";

export function EmployeeProfilesPanel() {
  const { data: employees = [], isLoading } = useEmployeeProfiles();
  const { data: workSchedules = [] } = useWorkSchedules();
  const { setActive } = useEmployeeProfileMutations();
  const members = useInternalMembers();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EmployeeProfile | null>(null);

  const registeredUserIds = useMemo(
    () => new Set(employees.map((employee) => employee.userId)),
    [employees],
  );
  const hasActiveSchedule = workSchedules.some((schedule) => schedule.isActive);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(employee: EmployeeProfile) {
    setEditing(employee);
    setDialogOpen(true);
  }

  async function toggleActive(employee: EmployeeProfile) {
    try {
      await setActive.mutateAsync({
        id: employee.id,
        isActive: !employee.isActive,
      });
      toast.success(
        employee.isActive ? "Funcionário desativado" : "Funcionário reativado",
      );
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Não foi possível alterar.",
      );
    }
  }

  return (
    <section className="rounded-2xl border border-[var(--atria-primary)]/10 bg-white p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--atria-primary)]">
            Funcionários CLT
          </h2>
          <p className="text-sm text-[var(--atria-primary)]/50">
            Somente os funcionários cadastrados aqui veem a aba Ponto e recebem
            lembretes.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-[var(--atria-primary)] text-white"
          onClick={openCreate}
          disabled={!hasActiveSchedule}
          title={hasActiveSchedule ? undefined : "Crie uma jornada primeiro"}
        >
          <UserPlus className="size-4" />
          Cadastrar funcionário
        </Button>
      </header>

      {isLoading ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <div className="size-8 animate-spin rounded-full border-2 border-[var(--atria-primary)] border-t-transparent" />
        </div>
      ) : employees.length === 0 ? (
        <p className="py-6 text-center text-sm text-[var(--atria-primary)]/50">
          Nenhum funcionário CLT cadastrado.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[var(--atria-primary)]/10 text-left text-xs uppercase tracking-wide text-[var(--atria-primary)]/55">
                <th className="px-3 py-2 font-medium">Funcionário</th>
                <th className="px-3 py-2 font-medium">Admissão</th>
                <th className="px-3 py-2 font-medium">Jornada</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr
                  key={employee.id}
                  className="border-b border-[var(--atria-primary)]/5"
                >
                  <td className="px-3 py-3">
                    <p className="font-medium text-[var(--atria-primary)]">
                      {employee.user.name}
                    </p>
                    <p className="text-xs text-[var(--atria-primary)]/50">
                      {employee.user.email}
                    </p>
                  </td>
                  <td className="px-3 py-3 text-[var(--atria-primary)]/80">
                    {formatCalendarDate(employee.admissionDate)}
                  </td>
                  <td className="px-3 py-3 text-[var(--atria-primary)]/80">
                    {employee.workSchedule.name}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={employee.isActive ? "success" : "outline"}>
                      {employee.isActive ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(employee)}
                      >
                        <Pencil className="size-4" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={setActive.isPending}
                        onClick={() => void toggleActive(employee)}
                      >
                        {employee.isActive ? "Desativar" : "Reativar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EmployeeProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={editing}
        members={members}
        registeredUserIds={registeredUserIds}
        workSchedules={workSchedules}
      />
    </section>
  );
}

/** Usuários internos ativos que podem ser cadastrados como CLT. */
function useInternalMembers(): ManagedUser[] {
  const [members, setMembers] = useState<ManagedUser[]>([]);

  useEffect(() => {
    void usersService
      .getMembers()
      .then((users) => setMembers(users.filter((user) => user.isActive !== false)))
      .catch(() => setMembers([]));
  }, []);

  return members;
}
