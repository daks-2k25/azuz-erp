import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { CrmScopeService } from '../leads/crm-scope.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crmScope: CrmScopeService,
  ) {}

  async updateCrmStatus(id: string, hasCrmEnabled: boolean) {
    const organization = await this.ensureOrganizationExists(id);
    const updated = await this.prisma.client.update({
      where: { id: organization.id },
      data: { hasCrmEnabled },
    });

    return this.toOrganizationResponse(updated);
  }

  async getOrganization(id: string) {
    const organization = await this.ensureOrganizationExists(id);
    const assignments = await this.prisma.crmSdrAssignment.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      ...this.toOrganizationResponse(organization),
      sdrAssignments: assignments.map((assignment) => ({
        id: assignment.id,
        userId: assignment.user.id,
        name: assignment.user.name,
        email: assignment.user.email,
        createdAt: assignment.createdAt.toISOString(),
      })),
    };
  }

  async replaceSdrAssignments(id: string, sdrUserIds: string[]) {
    const organization = await this.ensureOrganizationExists(id);
    await this.crmScope.replaceOrganizationSdrAssignments(
      organization.id,
      sdrUserIds,
    );

    const assignments = await this.prisma.crmSdrAssignment.findMany({
      where: { organizationId: organization.id },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      ...this.toOrganizationResponse(organization),
      sdrAssignments: assignments.map((assignment) => ({
        id: assignment.id,
        userId: assignment.user.id,
        name: assignment.user.name,
        email: assignment.user.email,
        createdAt: assignment.createdAt.toISOString(),
      })),
    };
  }

  listAssignedOrganizations(user: AuthenticatedUser) {
    return this.crmScope.listAssignedOrganizations(user);
  }

  private async ensureOrganizationExists(id: string) {
    const organization = await this.prisma.client.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        isActive: true,
        hasCrmEnabled: true,
      },
    });

    if (!organization) {
      throw new NotFoundException('Organização não encontrada.');
    }

    return organization;
  }

  private toOrganizationResponse(organization: {
    id: string;
    companyName: string;
    isActive: boolean;
    hasCrmEnabled: boolean;
  }) {
    return {
      id: organization.id,
      companyName: organization.companyName,
      isActive: organization.isActive,
      hasCrmEnabled: organization.hasCrmEnabled,
    };
  }
}
