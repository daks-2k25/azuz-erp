import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RoleName } from '@prisma/client';
import { normalizeRoleName } from '../auth/constants/permissions';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSuggestionDto,
  UpdateSuggestionStatusDto,
} from './dto/suggestion.dto';

@Injectable()
export class SuggestionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    companyId: string | null,
    dto: CreateSuggestionDto,
  ) {
    const suggestion = await this.prisma.systemSuggestion.create({
      data: {
        type: dto.type,
        title: dto.title.trim(),
        description: dto.description.trim(),
        submittedById: userId,
        companyId: companyId ?? '00000000-0000-4000-8000-000000000001',
      },
      include: {
        submittedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return this.toResponse(suggestion);
  }

  async findMine(userId: string, companyId: string | null) {
    const items = await this.prisma.systemSuggestion.findMany({
      where: {
        submittedById: userId,
        ...(companyId ? { companyId } : {}),
      },
      include: {
        submittedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => this.toResponse(item));
  }

  async findAll(companyId: string | null) {
    const items = await this.prisma.systemSuggestion.findMany({
      where: companyId ? { companyId } : {},
      include: {
        submittedBy: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => this.toResponse(item));
  }

  async updateStatus(
    id: string,
    role: string,
    companyId: string | null,
    dto: UpdateSuggestionStatusDto,
  ) {
    this.assertMasterRole(role);

    const suggestion = await this.prisma.systemSuggestion.findFirst({
      where: {
        id,
        ...(companyId ? { companyId } : {}),
      },
    });

    if (!suggestion) {
      throw new NotFoundException('Suggestion not found');
    }

    const updated = await this.prisma.systemSuggestion.update({
      where: { id },
      data: { status: dto.status },
      include: {
        submittedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return this.toResponse(updated);
  }

  private assertMasterRole(role: string): void {
    if (normalizeRoleName(role) !== RoleName.MASTER) {
      throw new ForbiddenException(
        'Only MASTER users can view all suggestions',
      );
    }
  }

  private toResponse(item: {
    id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    submittedById: string;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    submittedBy: { id: string; name: string; email: string };
  }) {
    return {
      id: item.id,
      type: item.type,
      title: item.title,
      description: item.description,
      status: item.status,
      submittedById: item.submittedById,
      submittedBy: item.submittedBy,
      companyId: item.companyId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
