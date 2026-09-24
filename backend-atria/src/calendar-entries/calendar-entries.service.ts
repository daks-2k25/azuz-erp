import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCalendarEntryDto,
  QueryCalendarEntriesDto,
  UpdateCalendarEntryDto,
} from './dto/calendar-entry.dto';

const clientSelect = {
  select: { id: true, companyName: true },
} as const;

@Injectable()
export class CalendarEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryCalendarEntriesDto) {
    const items = await this.prisma.calendarEntry.findMany({
      where: {
        year: query.year,
        month: query.month,
        clientId: query.clientId,
      },
      include: { client: clientSelect },
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { plannedDate: 'asc' }],
    });
    return items.map((item) => this.toResponse(item));
  }

  async findOne(id: string) {
    const item = await this.ensureExists(id);
    return this.toResponse(item);
  }

  async create(dto: CreateCalendarEntryDto) {
    const item = await this.prisma.calendarEntry.create({
      data: {
        month: dto.month,
        year: dto.year,
        clientId: dto.clientId,
        artType: dto.artType.trim(),
        plannedDate: dto.plannedDate,
        designerId: dto.designerId,
        title: dto.title.trim(),
        description: dto.description?.trim(),
        taskId: dto.taskId,
        productionDeadline: dto.productionDeadline,
        storyQuantity: dto.storyQuantity,
      },
      include: { client: clientSelect },
    });
    return this.toResponse(item);
  }

  async update(id: string, dto: UpdateCalendarEntryDto) {
    await this.ensureExists(id);

    const item = await this.prisma.calendarEntry.update({
      where: { id },
      data: {
        month: dto.month,
        year: dto.year,
        clientId: dto.clientId,
        artType: dto.artType?.trim(),
        plannedDate: dto.plannedDate,
        designerId: dto.designerId,
        title: dto.title?.trim(),
        description: dto.description?.trim(),
        taskId: dto.taskId,
        productionDeadline: dto.productionDeadline,
        storyQuantity: dto.storyQuantity,
      },
      include: { client: clientSelect },
    });
    return this.toResponse(item);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.calendarEntry.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.calendarEntry.findUnique({
      where: { id },
      include: { client: clientSelect },
    });
    if (!item) throw new NotFoundException('Calendar entry not found');
    return item;
  }

  private toResponse(item: {
    id: string;
    month: number;
    year: number;
    clientId: string;
    artType: string;
    plannedDate: string;
    designerId: string;
    title: string;
    description: string | null;
    taskId: string | null;
    productionDeadline: string | null;
    storyQuantity: number | null;
    createdAt: Date;
    updatedAt: Date;
    client?: { id: string; companyName: string } | null;
  }) {
    return {
      id: item.id,
      month: item.month,
      year: item.year,
      clientId: item.clientId,
      client: item.client
        ? { id: item.client.id, companyName: item.client.companyName }
        : null,
      artType: item.artType,
      plannedDate: item.plannedDate,
      designerId: item.designerId,
      title: item.title,
      description: item.description,
      taskId: item.taskId,
      productionDeadline: item.productionDeadline,
      storyQuantity: item.storyQuantity,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
