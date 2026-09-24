"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AssigneeOrGroupSelect } from "@/components/users/assignee-or-group-select";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { fromDateTimeLocalValue } from "@/lib/datetime-local";
import { calendarService, userGroupsService } from "@/services";
import type {
  ConvertClientRequestToTaskInput,
  TeamMember,
  UserGroup,
} from "@/services/types";

interface ConvertRequestToTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestTitle?: string;
  submitting?: boolean;
  onSubmit: (data: ConvertClientRequestToTaskInput) => Promise<void>;
}

export function ConvertRequestToTaskDialog({
  open,
  onOpenChange,
  requestTitle,
  submitting = false,
  onSubmit,
}: ConvertRequestToTaskDialogProps) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [assigneeId, setAssigneeId] = useState("");
  const [assignedGroupId, setAssignedGroupId] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setOptionsLoading(true);
    Promise.all([
      calendarService.getTeamMembers().catch(() => [] as TeamMember[]),
      userGroupsService.getUserGroups().catch(() => [] as UserGroup[]),
    ])
      .then(([nextMembers, nextGroups]) => {
        if (cancelled) return;
        setMembers(nextMembers);
        setGroups(nextGroups);
      })
      .finally(() => {
        if (!cancelled) setOptionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  function resetForm() {
    setAssigneeId("");
    setAssignedGroupId("");
    setDeliveryDate("");
    setPublicationDate("");
    setError(null);
  }

  async function handleSubmit() {
    const nextDeliveryDate = fromDateTimeLocalValue(deliveryDate);
    const nextPublicationDate = fromDateTimeLocalValue(publicationDate);

    if (!assigneeId && !assignedGroupId) {
      setError("Selecione um responsável ou um grupo / equipe.");
      return;
    }

    if (!nextDeliveryDate || !nextPublicationDate) {
      setError("Informe a data de entrega e a data de publicação.");
      return;
    }

    setError(null);
    await onSubmit({
      assigneeId: assigneeId || undefined,
      assignedGroupId: assignedGroupId || undefined,
      deliveryDate: nextDeliveryDate,
      publicationDate: nextPublicationDate,
    });
  }

  const canSubmit =
    Boolean(assigneeId || assignedGroupId) &&
    Boolean(deliveryDate) &&
    Boolean(publicationDate) &&
    !submitting;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (!value) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Converter em tarefa</DialogTitle>
        </DialogHeader>
        {requestTitle ? (
          <p className="text-sm text-[var(--atria-primary)]/60">{requestTitle}</p>
        ) : null}

        <FieldGroup>
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <Field>
            <FieldLabel htmlFor="convert-assignee">Responsável *</FieldLabel>
            <AssigneeOrGroupSelect
              id="convert-assignee"
              members={members}
              groups={groups}
              assigneeId={assigneeId}
              assignedGroupId={assignedGroupId}
              onChange={(next) => {
                setAssigneeId(next.assigneeId);
                setAssignedGroupId(next.assignedGroupId);
              }}
              loading={optionsLoading}
              allowEmpty={false}
              placeholder="Selecione um responsável ou grupo"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="convert-delivery">
                Data de Entrega *
              </FieldLabel>
              <Input
                id="convert-delivery"
                type="datetime-local"
                value={deliveryDate}
                onChange={(event) => setDeliveryDate(event.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="convert-publication">
                Data de Publicação *
              </FieldLabel>
              <Input
                id="convert-publication"
                type="datetime-local"
                value={publicationDate}
                onChange={(event) => setPublicationDate(event.target.value)}
                required
              />
            </Field>
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-[var(--atria-primary)] text-white hover:bg-[var(--atria-primary)]/90"
            disabled={!canSubmit}
            onClick={() => void handleSubmit()}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Converter em Tarefa"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
