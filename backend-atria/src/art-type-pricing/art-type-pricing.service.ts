import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateArtTypePricingDto,
  UpdateArtTypePricingDto,
} from './dto/art-type-pricing.dto';

@Injectable()
export class ArtTypePricingService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const items = await this.prisma.artTypePricing.findMany({
      orderBy: { artType: 'asc' },
    });
    return items.map((item) => this.toResponse(item));
  }

  async findOne(id: string) {
    const item = await this.ensureExists(id);
    return this.toResponse(item);
  }

  async create(dto: CreateArtTypePricingDto) {
    try {
      const item = await this.prisma.artTypePricing.create({
        data: {
          artType: dto.artType.trim(),
          pricePerPiece: dto.pricePerPiece,
          description: dto.description?.trim(),
        },
      });
      return this.toResponse(item);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Art type already exists');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateArtTypePricingDto) {
    await this.ensureExists(id);

    try {
      const item = await this.prisma.artTypePricing.update({
        where: { id },
        data: {
          artType: dto.artType?.trim(),
          pricePerPiece: dto.pricePerPiece,
          description: dto.description?.trim(),
        },
      });
      return this.toResponse(item);
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Art type already exists');
      }
      throw error;
    }
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.artTypePricing.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const item = await this.prisma.artTypePricing.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Art type pricing not found');
    return item;
  }

  private toResponse(item: {
    id: string;
    artType: string;
    pricePerPiece: Prisma.Decimal;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: item.id,
      artType: item.artType,
      pricePerPiece: Number(item.pricePerPiece),
      description: item.description,
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
