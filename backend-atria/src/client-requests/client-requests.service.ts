import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ClientRequestContentType,
  ClientRequestStatus,
  Prisma,
} from '@prisma/client';
import { KanbanService } from '../kanban/kanban.service';
import { PrismaService, PRISMA_TRANSACTION_OPTIONS } from '../prisma/prisma.service';
import { ClientRequestNotificationService } from './client-request-notification.service';
import {
  ConvertClientRequestToTaskDto,
  CreateClientRequestCommentDto,
  CreateClientRequestDto,
  QueryClientRequestsDto,
  RejectClientRequestDto,
  UpdateClientRequestDto,
} from './dto/client-request.dto';

const clientSelect = {
  select: { id: true, companyName: true },
} as const;

const authorSelect = {
  select: { id: true, name: true, avatarUrl: true, role: { select: { name: true } } },
} as const;

@Injectable()
export class ClientRequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kanbanService: KanbanService,
    private readonly requestNotifications: ClientRequestNotificationService,
  ) {}

  async findAll(query: QueryClientRequestsDto) {
    const items = await this.prisma.clientRequest.findMany({
      where: {
        clientId: query.clientId,
        status: query.status,
        contentType: query.contentType,
      },
      include: {
        client: clientSelect,
        comments: {
          include: { author: authorSelect },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item) => this.toResponse(item));
  }

  async findAllForClient(clientId: string, query: QueryClientRequestsDto = {}) {
    return this.findAll({ ...query, clientId });
  }

  async findOne(id: string) {
    const item = await this.ensureExists(id);
    return this.toResponse(item);
  }

  async create(
    dto: CreateClientRequestDto,
    options?: { clientId?: string; companyId?: string; authorId?: string },
  ) {
    const clientId = options?.clientId ?? dto.clientId;
    if (!clientId) {
      throw new BadRequestException('clientId is required');
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyId: true },
    });
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const companyId = options?.companyId ?? client.companyId;

    const item = await this.prisma.clientRequest.create({
      data: {
        companyId,
        clientId,
        title: dto.title.trim(),
        description: dto.description?.trim() || null,
        contentType: dto.contentType ?? ClientRequestContentType.REDE_SOCIAL,
        referenceLinks: this.toJsonArray(dto.referenceLinks),
        attachments:
          dto.attachments !== undefined
            ? (dto.attachments as Prisma.InputJsonValue)
            : [],
        status: dto.status ?? ClientRequestStatus.PENDING,
        relatedTaskId: dto.relatedTaskId,
      },
      include: {
        client: clientSelect,
        comments: {
          include: { author: authorSelect },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    this.requestNotifications.notifySubmitted({
      companyId: item.companyId,
      clientId: item.clientId,
      clientName: item.client?.companyName ?? 'Cliente',
      requestType: this.formatContentTypeLabel(item.contentType),
      title: item.title,
    });

    return this.toResponse(item);
  }

  async createForClient(
    clientId: string,
    companyId: string | null | undefined,
    dto: CreateClientRequestDto,
  ) {
    return this.create(dto, { clientId, companyId: companyId ?? undefined });
  }

  async update(id: string, dto: UpdateClientRequestDto) {
    await this.ensureExists(id);

    const item = await this.prisma.clientRequest.update({
      where: { id },
      data: {
        clientId: dto.clientId,
        title: dto.title?.trim(),
        description:
          dto.description !== undefined
            ? dto.description?.trim() || null
            : undefined,
        contentType: dto.contentType,
        referenceLinks:
          dto.referenceLinks !== undefined
            ? this.toJsonArray(dto.referenceLinks)
            : undefined,
        attachments:
          dto.attachments !== undefined
            ? (dto.attachments as Prisma.InputJsonValue)
            : undefined,
        status: dto.status,
        relatedTaskId: dto.relatedTaskId,
      },
      include: {
        client: clientSelect,
        comments: {
          include: { author: authorSelect },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return this.toResponse(item);
  }

  async reject(id: string, dto: RejectClientRequestDto) {
    const request = await this.ensureExists(id);

    if (request.status === ClientRequestStatus.CONVERTED_TO_TASK) {
      throw new BadRequestException(
        'Cannot reject a request that was already converted to a task',
      );
    }

    if (request.status === ClientRequestStatus.REJECTED) {
      return this.toResponse(request);
    }

    const item = await this.prisma.clientRequest.update({
      where: { id },
      data: {
        status: ClientRequestStatus.REJECTED,
        rejectionReason: dto.rejectionReason.trim(),
      },
      include: {
        client: clientSelect,
        comments: {
          include: { author: authorSelect },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return this.toResponse(item);
  }

  async convertToTask(
    id: string,
    userId: string,
    dto: ConvertClientRequestToTaskDto = {},
  ) {
    const request = await this.ensureExists(id);

    if (request.status === ClientRequestStatus.REJECTED) {
      throw new BadRequestException(
        'Cannot convert a request that was rejected',
      );
    }

    if (request.relatedTaskId) {
      const task = await this.kanbanService.getTask(request.relatedTaskId);
      return {
        request: this.toResponse(request),
        task,
        alreadyConverted: true,
      };
    }

    const columns = await this.kanbanService.getColumns();
    const defaultColumn = columns[0];
    if (!defaultColumn) {
      throw new BadRequestException('Nenhuma coluna do kanban configurada.');
    }

    const referenceLinks = Array.isArray(request.referenceLinks)
      ? (request.referenceLinks as string[])
      : [];
    const contentTypeLabel = this.formatContentTypeLabel(request.contentType);
    const descriptionParts = [
      request.description?.trim(),
      contentTypeLabel ? `Tipo de conteúdo: ${contentTypeLabel}` : null,
      referenceLinks.length > 0
        ? `Referências:\n${referenceLinks.map((link) => `- ${link}`).join('\n')}`
        : null,
    ].filter(Boolean);

    const assigneeIds = [
      ...(dto.assigneeId ? [dto.assigneeId] : []),
      ...(dto.assigneeIds ?? []),
    ].filter((value, index, all) => all.indexOf(value) === index);

    const createDto = {
      title: dto.title?.trim() || request.title,
      description:
        dto.description?.trim() ||
        (descriptionParts.length > 0
          ? descriptionParts.join('\n\n')
          : undefined),
      columnId: dto.columnId ?? defaultColumn.id,
      clientId: request.clientId,
      referenceUrl: referenceLinks[0],
      priority: dto.priority,
      dueDate: dto.deliveryDate ?? dto.dueDate,
      deliveryDate: dto.deliveryDate ?? dto.dueDate,
      publicationDate: dto.publicationDate,
      assigneeIds: assigneeIds.length ? assigneeIds : undefined,
      assignedGroupId: dto.assignedGroupId,
    };
    const prepared = await this.kanbanService.prepareTaskCreate(
      userId,
      createDto,
    );

    const conversion = await this.prisma.$transaction(async (tx) => {
      const current = await tx.clientRequest.findUnique({ where: { id } });
      if (!current) {
        throw new NotFoundException('Client request not found');
      }
      if (current.status === ClientRequestStatus.REJECTED) {
        throw new BadRequestException(
          'Cannot convert a request that was rejected',
        );
      }
      if (current.relatedTaskId) {
        return { alreadyConverted: true, taskId: current.relatedTaskId };
      }

      const task = await this.kanbanService.createTask(userId, createDto, {
        tx,
        skipSideEffects: true,
        prepared,
      });

      await tx.clientRequest.update({
        where: { id },
        data: {
          status: ClientRequestStatus.CONVERTED_TO_TASK,
          relatedTaskId: task.id,
        },
      });

      return { alreadyConverted: false, taskId: task.id };
    }, PRISMA_TRANSACTION_OPTIONS);

    if (conversion.alreadyConverted) {
      const current = await this.ensureExists(id);
      return {
        request: this.toResponse(current),
        task: await this.kanbanService.getTask(conversion.taskId),
        alreadyConverted: true,
      };
    }

    const task = await this.kanbanService.finalizeNewTask(
      userId,
      conversion.taskId,
    );
    const updated = await this.ensureExists(id);

    return {
      request: this.toResponse(updated),
      task,
      alreadyConverted: false,
    };
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.clientRequest.delete({ where: { id } });
  }

  async addComment(
    requestId: string,
    authorId: string,
    dto: CreateClientRequestCommentDto,
    options?: { clientId?: string; authorEmail?: string },
  ) {
    const request = await this.prisma.clientRequest.findUnique({
      where: { id: requestId },
      select: { id: true, clientId: true, companyId: true },
    });
    if (!request) {
      throw new NotFoundException('Client request not found');
    }

    if (options?.clientId && request.clientId !== options.clientId) {
      throw new NotFoundException('Client request not found');
    }

    const resolvedAuthorId = await this.resolveAuthorUserId(authorId, {
      clientId: options?.clientId ?? request.clientId,
      email: options?.authorEmail,
      companyId: request.companyId,
    });

    if (dto.parentId) {
      const parent = await this.prisma.clientRequestComment.findFirst({
        where: { id: dto.parentId, requestId },
        select: { id: true },
      });
      if (!parent) {
        throw new BadRequestException('Parent comment not found on this request');
      }
    }

    const comment = await this.prisma.clientRequestComment.create({
      data: {
        requestId,
        authorId: resolvedAuthorId,
        body: dto.body.trim(),
        parentId: dto.parentId || null,
      },
      include: { author: authorSelect },
    });

    return this.toCommentResponse(comment);
  }

  private async resolveAuthorUserId(
    authorId: string,
    options: { clientId: string; email?: string; companyId: string },
  ) {
    const direct = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: { id: true },
    });
    if (direct) return direct.id;

    if (options.email) {
      const byEmail = await this.prisma.user.findFirst({
        where: {
          companyId: options.companyId,
          email: options.email.toLowerCase().trim(),
        },
        select: { id: true },
      });
      if (byEmail) return byEmail.id;
    }

    const clientUser = await this.prisma.user.findFirst({
      where: { clientId: options.clientId, companyId: options.companyId },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
    });
    if (clientUser) return clientUser.id;

    throw new BadRequestException(
      'No linked user account available to author this comment',
    );
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.clientRequest.findUnique({
      where: { id },
      include: {
        client: clientSelect,
        comments: {
          include: { author: authorSelect },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!item) throw new NotFoundException('Client request not found');
    return item;
  }

  private toJsonArray(value?: string[]): Prisma.InputJsonValue {
    return (value ?? []).map((item) => item.trim()).filter(Boolean);
  }

  private formatContentTypeLabel(contentType: ClientRequestContentType) {
    switch (contentType) {
      case ClientRequestContentType.FLYER:
        return 'Flyer';
      case ClientRequestContentType.PANFLETO:
        return 'Panfleto';
      case ClientRequestContentType.BANNER:
        return 'Banner';
      case ClientRequestContentType.ENSAIO_FOTOGRAFICO:
        return 'Ensaio Fotográfico';
      case ClientRequestContentType.OUTRO:
        return 'Outro';
      case ClientRequestContentType.REDE_SOCIAL:
      default:
        return 'Rede Social';
    }
  }

  private serializeContentType(contentType: ClientRequestContentType) {
    return contentType.toLowerCase();
  }

  private toCommentResponse(comment: {
    id: string;
    requestId: string;
    authorId: string;
    body: string;
    parentId: string | null;
    createdAt: Date;
    updatedAt: Date;
    author?: {
      id: string;
      name: string;
      avatarUrl: string | null;
      role?: { name: string } | null;
    } | null;
  }) {
    return {
      id: comment.id,
      requestId: comment.requestId,
      body: comment.body,
      parentId: comment.parentId,
      author: comment.author
        ? {
            id: comment.author.id,
            name: comment.author.name,
            avatarUrl: comment.author.avatarUrl,
            role: comment.author.role?.name ?? null,
          }
        : null,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }

  private toResponse(item: {
    id: string;
    companyId: string;
    clientId: string;
    title: string;
    description: string | null;
    contentType: ClientRequestContentType;
    referenceLinks: Prisma.JsonValue;
    attachments: Prisma.JsonValue;
    status: ClientRequestStatus;
    rejectionReason: string | null;
    relatedTaskId: string | null;
    createdAt: Date;
    updatedAt: Date;
    client?: { id: string; companyName: string } | null;
    comments?: Array<{
      id: string;
      requestId: string;
      authorId: string;
      body: string;
      parentId: string | null;
      createdAt: Date;
      updatedAt: Date;
      author?: {
        id: string;
        name: string;
        avatarUrl: string | null;
        role?: { name: string } | null;
      } | null;
    }>;
  }) {
    return {
      id: item.id,
      tenantId: item.companyId,
      companyId: item.companyId,
      clientId: item.clientId,
      client: item.client
        ? { id: item.client.id, companyName: item.client.companyName }
        : null,
      title: item.title,
      description: item.description,
      contentType: this.serializeContentType(item.contentType),
      referenceLinks: Array.isArray(item.referenceLinks)
        ? item.referenceLinks
        : [],
      attachments: item.attachments ?? [],
      status: item.status.toLowerCase(),
      rejectionReason: item.rejectionReason,
      relatedTaskId: item.relatedTaskId,
      comments: (item.comments ?? []).map((comment) =>
        this.toCommentResponse(comment),
      ),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
