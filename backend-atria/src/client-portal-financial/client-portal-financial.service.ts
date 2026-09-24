import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ClientFinancialAttachmentType } from '@prisma/client';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { SupabaseStorageService } from '../supabase/supabase-storage.service';
import { CreateClientFinancialAttachmentDto } from './dto/create-client-financial-attachment.dto';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

@Injectable()
export class ClientPortalFinancialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: SupabaseStorageService,
  ) {}

  async listForClient(clientId: string) {
    const items = await this.prisma.clientFinancialAttachment.findMany({
      where: { clientId },
      orderBy: { uploadedAt: 'desc' },
    });

    return items.map((item) => this.toResponse(item));
  }

  async uploadForClient(
    clientId: string,
    dto: CreateClientFinancialAttachmentDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo obrigatório');
    }

    if (!file.buffer?.length) {
      throw new BadRequestException('Arquivo inválido');
    }

    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        `Tipo de arquivo não permitido: ${file.mimetype}`,
      );
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      select: { id: true, companyId: true },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const bucket = this.storage.getFinancialAttachmentsBucket();
    const extension = extname(file.originalname) || '';
    const storagePath = `${client.companyId}/${clientId}/${randomUUID()}${extension}`;

    let fileUrl: string;
    let storageBucket: string | null = bucket;
    let storagePathValue: string | null = storagePath;

    if (this.storage.isConfigured) {
      fileUrl = await this.storage.uploadFinancialObject({
        bucket,
        path: storagePath,
        body: file.buffer,
        contentType: file.mimetype,
      });
    } else {
      const { writeFileSync, mkdirSync, existsSync } = await import('fs');
      const { join } = await import('path');
      const uploadDir = join(process.cwd(), 'uploads', 'financial', clientId);
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir, { recursive: true });
      }
      const filename = `${randomUUID()}${extension}`;
      const absolutePath = join(uploadDir, filename);
      writeFileSync(absolutePath, file.buffer);
      fileUrl = `/uploads/financial/${clientId}/${filename}`;
      storageBucket = null;
      storagePathValue = null;
    }

    const created = await this.prisma.clientFinancialAttachment.create({
      data: {
        clientId: client.id,
        organizationId: client.companyId,
        fileUrl,
        storageBucket,
        storagePath: storagePathValue,
        fileType: dto.fileType,
        description: dto.description?.trim() || null,
      },
    });

    return this.toResponse(created);
  }

  private toResponse(item: {
    id: string;
    clientId: string;
    organizationId: string;
    fileUrl: string;
    fileType: ClientFinancialAttachmentType;
    description: string | null;
    uploadedAt: Date;
  }) {
    return {
      id: item.id,
      clientId: item.clientId,
      organizationId: item.organizationId,
      fileUrl: item.fileUrl,
      fileType: item.fileType.toLowerCase() as 'invoice' | 'receipt',
      description: item.description,
      uploadedAt: item.uploadedAt.toISOString(),
    };
  }
}
