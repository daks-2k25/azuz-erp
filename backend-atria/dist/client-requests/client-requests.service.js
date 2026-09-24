"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientRequestsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const kanban_service_1 = require("../kanban/kanban.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_request_notification_service_1 = require("./client-request-notification.service");
const clientSelect = {
    select: { id: true, companyName: true },
};
const authorSelect = {
    select: { id: true, name: true, avatarUrl: true, role: { select: { name: true } } },
};
let ClientRequestsService = class ClientRequestsService {
    prisma;
    kanbanService;
    requestNotifications;
    constructor(prisma, kanbanService, requestNotifications) {
        this.prisma = prisma;
        this.kanbanService = kanbanService;
        this.requestNotifications = requestNotifications;
    }
    async findAll(query) {
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
    async findAllForClient(clientId, query = {}) {
        return this.findAll({ ...query, clientId });
    }
    async findOne(id) {
        const item = await this.ensureExists(id);
        return this.toResponse(item);
    }
    async create(dto, options) {
        const clientId = options?.clientId ?? dto.clientId;
        if (!clientId) {
            throw new common_1.BadRequestException('clientId is required');
        }
        const client = await this.prisma.client.findUnique({
            where: { id: clientId },
            select: { id: true, companyId: true },
        });
        if (!client) {
            throw new common_1.NotFoundException('Client not found');
        }
        const companyId = options?.companyId ?? client.companyId;
        const item = await this.prisma.clientRequest.create({
            data: {
                companyId,
                clientId,
                title: dto.title.trim(),
                description: dto.description?.trim() || null,
                contentType: dto.contentType ?? client_1.ClientRequestContentType.REDE_SOCIAL,
                referenceLinks: this.toJsonArray(dto.referenceLinks),
                attachments: dto.attachments !== undefined
                    ? dto.attachments
                    : [],
                status: dto.status ?? client_1.ClientRequestStatus.PENDING,
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
    async createForClient(clientId, companyId, dto) {
        return this.create(dto, { clientId, companyId: companyId ?? undefined });
    }
    async update(id, dto) {
        await this.ensureExists(id);
        const item = await this.prisma.clientRequest.update({
            where: { id },
            data: {
                clientId: dto.clientId,
                title: dto.title?.trim(),
                description: dto.description !== undefined
                    ? dto.description?.trim() || null
                    : undefined,
                contentType: dto.contentType,
                referenceLinks: dto.referenceLinks !== undefined
                    ? this.toJsonArray(dto.referenceLinks)
                    : undefined,
                attachments: dto.attachments !== undefined
                    ? dto.attachments
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
    async reject(id, dto) {
        const request = await this.ensureExists(id);
        if (request.status === client_1.ClientRequestStatus.CONVERTED_TO_TASK) {
            throw new common_1.BadRequestException('Cannot reject a request that was already converted to a task');
        }
        if (request.status === client_1.ClientRequestStatus.REJECTED) {
            return this.toResponse(request);
        }
        const item = await this.prisma.clientRequest.update({
            where: { id },
            data: {
                status: client_1.ClientRequestStatus.REJECTED,
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
    async convertToTask(id, userId, dto = {}) {
        const request = await this.ensureExists(id);
        if (request.status === client_1.ClientRequestStatus.REJECTED) {
            throw new common_1.BadRequestException('Cannot convert a request that was rejected');
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
            throw new common_1.BadRequestException('Nenhuma coluna do kanban configurada.');
        }
        const referenceLinks = Array.isArray(request.referenceLinks)
            ? request.referenceLinks
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
            description: dto.description?.trim() ||
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
        const prepared = await this.kanbanService.prepareTaskCreate(userId, createDto);
        const conversion = await this.prisma.$transaction(async (tx) => {
            const current = await tx.clientRequest.findUnique({ where: { id } });
            if (!current) {
                throw new common_1.NotFoundException('Client request not found');
            }
            if (current.status === client_1.ClientRequestStatus.REJECTED) {
                throw new common_1.BadRequestException('Cannot convert a request that was rejected');
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
                    status: client_1.ClientRequestStatus.CONVERTED_TO_TASK,
                    relatedTaskId: task.id,
                },
            });
            return { alreadyConverted: false, taskId: task.id };
        }, prisma_service_1.PRISMA_TRANSACTION_OPTIONS);
        if (conversion.alreadyConverted) {
            const current = await this.ensureExists(id);
            return {
                request: this.toResponse(current),
                task: await this.kanbanService.getTask(conversion.taskId),
                alreadyConverted: true,
            };
        }
        const task = await this.kanbanService.finalizeNewTask(userId, conversion.taskId);
        const updated = await this.ensureExists(id);
        return {
            request: this.toResponse(updated),
            task,
            alreadyConverted: false,
        };
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.clientRequest.delete({ where: { id } });
    }
    async addComment(requestId, authorId, dto, options) {
        const request = await this.prisma.clientRequest.findUnique({
            where: { id: requestId },
            select: { id: true, clientId: true, companyId: true },
        });
        if (!request) {
            throw new common_1.NotFoundException('Client request not found');
        }
        if (options?.clientId && request.clientId !== options.clientId) {
            throw new common_1.NotFoundException('Client request not found');
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
                throw new common_1.BadRequestException('Parent comment not found on this request');
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
    async resolveAuthorUserId(authorId, options) {
        const direct = await this.prisma.user.findUnique({
            where: { id: authorId },
            select: { id: true },
        });
        if (direct)
            return direct.id;
        if (options.email) {
            const byEmail = await this.prisma.user.findFirst({
                where: {
                    companyId: options.companyId,
                    email: options.email.toLowerCase().trim(),
                },
                select: { id: true },
            });
            if (byEmail)
                return byEmail.id;
        }
        const clientUser = await this.prisma.user.findFirst({
            where: { clientId: options.clientId, companyId: options.companyId },
            select: { id: true },
            orderBy: { createdAt: 'asc' },
        });
        if (clientUser)
            return clientUser.id;
        throw new common_1.BadRequestException('No linked user account available to author this comment');
    }
    async ensureExists(id) {
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
        if (!item)
            throw new common_1.NotFoundException('Client request not found');
        return item;
    }
    toJsonArray(value) {
        return (value ?? []).map((item) => item.trim()).filter(Boolean);
    }
    formatContentTypeLabel(contentType) {
        switch (contentType) {
            case client_1.ClientRequestContentType.FLYER:
                return 'Flyer';
            case client_1.ClientRequestContentType.PANFLETO:
                return 'Panfleto';
            case client_1.ClientRequestContentType.BANNER:
                return 'Banner';
            case client_1.ClientRequestContentType.ENSAIO_FOTOGRAFICO:
                return 'Ensaio Fotográfico';
            case client_1.ClientRequestContentType.OUTRO:
                return 'Outro';
            case client_1.ClientRequestContentType.REDE_SOCIAL:
            default:
                return 'Rede Social';
        }
    }
    serializeContentType(contentType) {
        return contentType.toLowerCase();
    }
    toCommentResponse(comment) {
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
    toResponse(item) {
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
            comments: (item.comments ?? []).map((comment) => this.toCommentResponse(comment)),
            createdAt: item.createdAt.toISOString(),
            updatedAt: item.updatedAt.toISOString(),
        };
    }
};
exports.ClientRequestsService = ClientRequestsService;
exports.ClientRequestsService = ClientRequestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        kanban_service_1.KanbanService,
        client_request_notification_service_1.ClientRequestNotificationService])
], ClientRequestsService);
//# sourceMappingURL=client-requests.service.js.map