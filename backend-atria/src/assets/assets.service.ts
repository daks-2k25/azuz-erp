import {
  Injectable,
  NotFoundException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { AssetFileType, Prisma } from '@prisma/client';
import { existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto, QueryAssetsDto } from './dto/asset.dto';

const clientSelect = {
  id: true,
  companyName: true,
  avatarUrl: true,
} as const;

const assetInclude = {
  client: { select: clientSelect },
  uploadedBy: { select: { id: true, name: true, avatarUrl: true } },
} satisfies Prisma.AssetInclude;

type AssetWithRelations = Prisma.AssetGetPayload<{
  include: typeof assetInclude;
}>;

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

@Injectable()
export class AssetsService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor(private readonly prisma: PrismaService) {
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  getUploadDir() {
    return this.uploadDir;
  }

  async findAll(query: QueryAssetsDto) {
    const assets = await this.prisma.asset.findMany({
      where: {
        clientId: query.clientId,
        fileType: query.fileType,
      },
      include: assetInclude,
      orderBy: { uploadedAt: 'desc' },
    });

    return assets.map((asset) => this.toResponse(asset));
  }

  async findByClientGrouped() {
    const assets = await this.prisma.asset.findMany({
      include: assetInclude,
      orderBy: [{ client: { companyName: 'asc' } }, { uploadedAt: 'desc' }],
    });

    const grouped = new Map<
      string,
      {
        client: (typeof assets)[0]['client'];
        assets: ReturnType<typeof this.toResponse>[];
      }
    >();

    for (const asset of assets) {
      const key = asset.clientId;
      const entry = grouped.get(key) ?? {
        client: asset.client,
        assets: [],
      };
      entry.assets.push(this.toResponse(asset));
      grouped.set(key, entry);
    }

    return Array.from(grouped.values());
  }

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: assetInclude,
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return this.toResponse(asset);
  }

  async upload(
    userId: string | null,
    dto: CreateAssetDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new UnsupportedMediaTypeException('No file provided');
    }

    if (!ALLOWED_MIME.has(file.mimetype)) {
      throw new UnsupportedMediaTypeException(
        `File type ${file.mimetype} is not allowed`,
      );
    }

    const client = await this.prisma.client.findUnique({
      where: { id: dto.clientId },
    });
    if (!client) throw new NotFoundException('Client not found');

    const fileUrl = `/uploads/${file.filename}`;

    const asset = await this.prisma.asset.create({
      data: {
        clientId: dto.clientId,
        fileName: file.originalname,
        fileType: dto.fileType,
        fileUrl,
        fileSize: file.size,
        uploadedById: userId ?? undefined,
      },
      include: assetInclude,
    });

    return this.toResponse(asset);
  }

  async remove(id: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) throw new NotFoundException('Asset not found');
    await this.prisma.asset.delete({ where: { id } });
  }

  private toResponse(asset: AssetWithRelations) {
    return {
      id: asset.id,
      clientId: asset.clientId,
      client: asset.client,
      fileName: asset.fileName,
      fileType: asset.fileType.toLowerCase() as
        | 'image'
        | 'logo'
        | 'brand_guide'
        | 'document',
      fileUrl: asset.fileUrl,
      fileSize: asset.fileSize,
      uploadedBy: asset.uploadedBy,
      uploadedAt: asset.uploadedAt.toISOString(),
    };
  }
}
