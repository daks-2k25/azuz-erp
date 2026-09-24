import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ClientBriefStatus,
  KanbanColumnType,
  KanbanTaskPriority,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_COMPANY_ID } from '../company/company.constants';
import { UpdateClientBriefSlaDto, UpdateSlaSettingsDto } from './dto/sla.dto';
import {
  computeSlaDueDates,
  computeSlaStatus,
  DEFAULT_SLA_SETTINGS,
  toSlaSettingsResponse,
  type SlaSettingsResponse,
  type SlaUiStatus,
} from './sla.utils';

const userSelect = { id: true, name: true, avatarUrl: true } as const;

@Injectable()
export class SlaService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(): Promise<SlaSettingsResponse> {
    const settings = await this.ensureAgencySettings();
    return toSlaSettingsResponse(settings);
  }

  async updateSettings(dto: UpdateSlaSettingsDto) {
    const companyId = DEFAULT_COMPANY_ID;
    const settings = await this.prisma.agencySettings.update({
      where: { companyId },
      data: dto,
    });
    return toSlaSettingsResponse(settings);
  }

  async getSettingsForComputation(): Promise<SlaSettingsResponse> {
    const settings = await this.ensureAgencySettings();
    return toSlaSettingsResponse(settings);
  }

  async computeDueDatesForPriority(
    priority: KanbanTaskPriority,
    createdAt: Date,
  ) {
    const settings = await this.getSettingsForComputation();
    return computeSlaDueDates(priority, createdAt, settings);
  }

  computeTaskSlaStatus(task: {
    createdAt: Date;
    slaResponseDueAt: Date | null;
    slaResolutionDueAt: Date | null;
    firstResponseAt: Date | null;
    resolvedAt: Date | null;
    column?: { type: KanbanColumnType | null } | null;
  }): SlaUiStatus {
    return computeSlaStatus({
      createdAt: task.createdAt,
      slaResponseDueAt: task.slaResponseDueAt,
      slaResolutionDueAt: task.slaResolutionDueAt,
      firstResponseAt: task.firstResponseAt,
      resolvedAt: task.resolvedAt,
      isDone: task.column?.type === KanbanColumnType.DONE,
    });
  }

  computeBriefSlaStatus(brief: {
    createdAt: Date;
    slaResponseDueAt: Date | null;
    slaResolutionDueAt: Date | null;
    firstResponseAt: Date | null;
    resolvedAt: Date | null;
    status: ClientBriefStatus;
  }): SlaUiStatus {
    const isDone =
      brief.status === ClientBriefStatus.RESOLVED ||
      brief.status === ClientBriefStatus.CLOSED;
    return computeSlaStatus({
      createdAt: brief.createdAt,
      slaResponseDueAt: brief.slaResponseDueAt,
      slaResolutionDueAt: brief.slaResolutionDueAt,
      firstResponseAt: brief.firstResponseAt,
      resolvedAt: brief.resolvedAt,
      isDone,
    });
  }

  async getDashboard() {
    const now = new Date();
    const doneColumns = await this.prisma.kanbanColumn.findMany({
      where: { type: KanbanColumnType.DONE },
      select: { id: true },
    });
    const doneColumnIds = doneColumns.map((c) => c.id);

    const openTasks = await this.prisma.kanbanTask.findMany({
      where: {
        columnId: { notIn: doneColumnIds },
        OR: [
          { slaResponseDueAt: { not: null } },
          { slaResolutionDueAt: { not: null } },
        ],
      },
      include: {
        column: true,
        client: { select: { id: true, companyName: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const openBriefs = await this.prisma.clientBrief.findMany({
      where: {
        status: { in: [ClientBriefStatus.OPEN, ClientBriefStatus.IN_PROGRESS] },
      },
      include: {
        client: { select: { id: true, companyName: true } },
        assignedTo: { select: userSelect },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    const taskItems = openTasks.map((task) => {
      const slaStatus = this.computeTaskSlaStatus(task);
      return {
        id: task.id,
        type: 'task' as const,
        title: task.title,
        clientName: task.client?.companyName ?? null,
        priority: task.priority.toLowerCase(),
        slaStatus,
        slaResponseDueAt: task.slaResponseDueAt?.toISOString() ?? null,
        slaResolutionDueAt: task.slaResolutionDueAt?.toISOString() ?? null,
        firstResponseAt: task.firstResponseAt?.toISOString() ?? null,
        resolvedAt: task.resolvedAt?.toISOString() ?? null,
        createdAt: task.createdAt.toISOString(),
      };
    });

    const briefItems = openBriefs.map((brief) => {
      const slaStatus = this.computeBriefSlaStatus(brief);
      return {
        id: brief.id,
        type: 'brief' as const,
        title: brief.title,
        clientName: brief.client.companyName,
        priority: brief.priority.toLowerCase(),
        status: brief.status.toLowerCase(),
        assignee: brief.assignedTo,
        slaStatus,
        slaResponseDueAt: brief.slaResponseDueAt?.toISOString() ?? null,
        slaResolutionDueAt: brief.slaResolutionDueAt?.toISOString() ?? null,
        firstResponseAt: brief.firstResponseAt?.toISOString() ?? null,
        resolvedAt: brief.resolvedAt?.toISOString() ?? null,
        createdAt: brief.createdAt.toISOString(),
      };
    });

    const breached = [...taskItems, ...briefItems].filter(
      (item) =>
        item.slaStatus === 'response_breached' ||
        item.slaStatus === 'resolution_breached',
    );
    const atRisk = [...taskItems, ...briefItems].filter(
      (item) =>
        item.slaStatus === 'approaching_response' ||
        item.slaStatus === 'approaching_resolution',
    );

    return {
      summary: {
        openTasks: taskItems.length,
        openBriefs: briefItems.length,
        breachedCount: breached.length,
        atRiskCount: atRisk.length,
      },
      breached,
      atRisk,
      tasks: taskItems,
      briefs: briefItems,
    };
  }

  async updateBrief(id: string, dto: UpdateClientBriefSlaDto) {
    const existing = await this.prisma.clientBrief.findUnique({
      where: { id },
    });
    if (!existing) throw new NotFoundException('Brief not found');

    if (dto.assignedToId) {
      const user = await this.prisma.user.findUnique({
        where: { id: dto.assignedToId },
      });
      if (!user) throw new NotFoundException('Assignee not found');
    }

    const now = new Date();
    const data: {
      status?: ClientBriefStatus;
      priority?: KanbanTaskPriority;
      assignedToId?: string | null;
      firstResponseAt?: Date;
      resolvedAt?: Date;
      slaResponseDueAt?: Date;
      slaResolutionDueAt?: Date;
    } = {};

    if (dto.status !== undefined) data.status = dto.status;
    if (dto.priority !== undefined) {
      data.priority = dto.priority;
      const dueDates = await this.computeDueDatesForPriority(
        dto.priority,
        existing.createdAt,
      );
      data.slaResponseDueAt = dueDates.slaResponseDueAt;
      data.slaResolutionDueAt = dueDates.slaResolutionDueAt;
    }
    if (dto.assignedToId !== undefined) {
      data.assignedToId = dto.assignedToId;
      if (dto.assignedToId && !existing.firstResponseAt) {
        data.firstResponseAt = now;
      }
    }

    if (
      dto.status === ClientBriefStatus.RESOLVED ||
      dto.status === ClientBriefStatus.CLOSED
    ) {
      data.resolvedAt = now;
    }

    const brief = await this.prisma.clientBrief.update({
      where: { id },
      data,
      include: {
        client: { select: { id: true, companyName: true } },
        assignedTo: { select: userSelect },
      },
    });

    const slaStatus = this.computeBriefSlaStatus(brief);

    return {
      id: brief.id,
      title: brief.title,
      content: brief.content,
      clientId: brief.clientId,
      clientName: brief.client.companyName,
      status: brief.status.toLowerCase(),
      priority: brief.priority.toLowerCase(),
      assignedTo: brief.assignedTo,
      slaStatus,
      slaResponseDueAt: brief.slaResponseDueAt?.toISOString() ?? null,
      slaResolutionDueAt: brief.slaResolutionDueAt?.toISOString() ?? null,
      firstResponseAt: brief.firstResponseAt?.toISOString() ?? null,
      resolvedAt: brief.resolvedAt?.toISOString() ?? null,
      createdAt: brief.createdAt.toISOString(),
      updatedAt: brief.updatedAt.toISOString(),
    };
  }

  private async ensureAgencySettings() {
    const companyId = DEFAULT_COMPANY_ID;
    return this.prisma.agencySettings.upsert({
      where: { companyId },
      create: {
        companyId,
        ...DEFAULT_SLA_SETTINGS,
      },
      update: {},
    });
  }
}
