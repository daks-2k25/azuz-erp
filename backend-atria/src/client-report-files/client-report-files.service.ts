import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ApproveClientReportFileDto,
  CreateClientReportFileDto,
  QueryClientReportFilesDto,
  UpdateClientReportFileDto,
} from './dto/client-report-file.dto';

const clientSelect = {
  select: { id: true, companyName: true },
} as const;

@Injectable()
export class ClientReportFilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryClientReportFilesDto) {
    const items = await this.prisma.clientReportFile.findMany({
      where: {
        clientId: query.clientId,
        status: query.status,
      },
      include: { client: clientSelect },
      orderBy: { createdAt: 'desc' },
    });
    return items.map((item) => this.toResponse(item));
  }

  async findOne(id: string) {
    const item = await this.ensureExists(id);
    return this.toResponse(item);
  }

  async create(dto: CreateClientReportFileDto) {
    const item = await this.prisma.clientReportFile.create({
      data: {
        clientId: dto.clientId,
        title: dto.title.trim(),
        fileUrl: dto.fileUrl,
        fileType: dto.fileType.trim(),
        uploadedBy: dto.uploadedBy,
        status: dto.status,
      },
      include: { client: clientSelect },
    });
    return this.toResponse(item);
  }

  async update(id: string, dto: UpdateClientReportFileDto) {
    await this.ensureExists(id);

    const item = await this.prisma.clientReportFile.update({
      where: { id },
      data: {
        clientId: dto.clientId,
        title: dto.title?.trim(),
        fileUrl: dto.fileUrl,
        fileType: dto.fileType?.trim(),
        uploadedBy: dto.uploadedBy,
        status: dto.status,
      },
      include: { client: clientSelect },
    });
    return this.toResponse(item);
  }

  async approve(id: string, dto: ApproveClientReportFileDto) {
    await this.ensureExists(id);

    const item = await this.prisma.clientReportFile.update({
      where: { id },
      data: {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy: dto.approvedBy,
      },
      include: { client: clientSelect },
    });
    return this.toResponse(item);
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.clientReportFile.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.clientReportFile.findUnique({
      where: { id },
      include: { client: clientSelect },
    });
    if (!item) throw new NotFoundException('Client report file not found');
    return item;
  }

  private toResponse(item: {
    id: string;
    clientId: string;
    title: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    status: string;
    approvedAt: Date | null;
    approvedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    client?: { id: string; companyName: string } | null;
  }) {
    return {
      id: item.id,
      clientId: item.clientId,
      client: item.client
        ? { id: item.client.id, companyName: item.client.companyName }
        : null,
      title: item.title,
      fileUrl: item.fileUrl,
      fileType: item.fileType,
      uploadedBy: item.uploadedBy,
      status: item.status,
      approvedAt: item.approvedAt?.toISOString() ?? null,
      approvedBy: item.approvedBy,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
