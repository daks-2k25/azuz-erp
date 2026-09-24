import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConfirmAgendaEventDto,
  CreateAgendaEventDto,
  QueryAgendaEventsDto,
  UpdateAgendaEventDto,
} from './dto/agenda-event.dto';

@Injectable()
export class AgendaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryAgendaEventsDto) {
    const items = await this.prisma.agendaEvent.findMany({
      where: {
        eventDate: {
          ...(query.from ? { gte: query.from } : {}),
          ...(query.to ? { lte: query.to } : {}),
        },
      },
      include: { confirmations: true },
      orderBy: [{ eventDate: 'asc' }, { startTime: 'asc' }],
    });
    return items.map((item) => this.toResponse(item));
  }

  async findOne(id: string) {
    const item = await this.ensureExists(id);
    return this.toResponse(item);
  }

  async create(createdBy: string, dto: CreateAgendaEventDto) {
    const item = await this.prisma.agendaEvent.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim(),
        eventDate: dto.eventDate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        eventType: dto.eventType.trim(),
        recurrence: dto.recurrence,
        participants: (dto.participants ?? []) as Prisma.InputJsonValue,
        meetingLink: dto.meetingLink,
        location: dto.location?.trim(),
        priority: dto.priority,
        status: dto.status,
        createdBy,
      },
      include: { confirmations: true },
    });
    return this.toResponse(item);
  }

  async update(id: string, dto: UpdateAgendaEventDto) {
    await this.ensureExists(id);

    const item = await this.prisma.agendaEvent.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        description: dto.description?.trim(),
        eventDate: dto.eventDate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        eventType: dto.eventType?.trim(),
        recurrence: dto.recurrence,
        participants:
          dto.participants !== undefined
            ? (dto.participants as Prisma.InputJsonValue)
            : undefined,
        meetingLink: dto.meetingLink,
        location: dto.location?.trim(),
        priority: dto.priority,
        status: dto.status,
      },
      include: { confirmations: true },
    });
    return this.toResponse(item);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.agendaEvent.delete({ where: { id } });
  }

  async confirm(id: string, dto: ConfirmAgendaEventDto) {
    await this.ensureExists(id);

    try {
      const confirmation = await this.prisma.agendaConfirmation.create({
        data: {
          eventId: id,
          userId: dto.userId,
        },
      });
      return this.toConfirmationResponse(confirmation);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('User already confirmed this event');
      }
      throw error;
    }
  }

  async removeConfirmation(id: string, userId: string) {
    await this.ensureExists(id);

    const confirmation = await this.prisma.agendaConfirmation.findUnique({
      where: { eventId_userId: { eventId: id, userId } },
    });
    if (!confirmation) {
      throw new NotFoundException('Confirmation not found');
    }

    await this.prisma.agendaConfirmation.delete({
      where: { id: confirmation.id },
    });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.agendaEvent.findUnique({
      where: { id },
      include: { confirmations: true },
    });
    if (!item) throw new NotFoundException('Agenda event not found');
    return item;
  }

  private toConfirmationResponse(confirmation: {
    id: string;
    eventId: string;
    userId: string;
    confirmedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: confirmation.id,
      eventId: confirmation.eventId,
      userId: confirmation.userId,
      confirmedAt: confirmation.confirmedAt.toISOString(),
      createdAt: confirmation.createdAt.toISOString(),
      updatedAt: confirmation.updatedAt.toISOString(),
    };
  }

  private toResponse(item: {
    id: string;
    title: string;
    description: string | null;
    eventDate: string;
    startTime: string | null;
    endTime: string | null;
    eventType: string;
    recurrence: string;
    participants: Prisma.JsonValue;
    meetingLink: string | null;
    location: string | null;
    priority: string;
    status: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    confirmations?: Array<{
      id: string;
      eventId: string;
      userId: string;
      confirmedAt: Date;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }) {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      eventDate: item.eventDate,
      startTime: item.startTime,
      endTime: item.endTime,
      eventType: item.eventType,
      recurrence: item.recurrence,
      participants: item.participants,
      meetingLink: item.meetingLink,
      location: item.location,
      priority: item.priority,
      status: item.status,
      createdBy: item.createdBy,
      confirmations: (item.confirmations ?? []).map((c) =>
        this.toConfirmationResponse(c),
      ),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    );
  }
}
