import { Injectable } from '@nestjs/common';
import { Prisma, RoleName, UserCategory } from '@prisma/client';
import { isClientFacingRole } from '../../auth/constants/permissions';
import { PrismaService } from '../../prisma/prisma.service';
import type { EmployeeProfileWithDetails } from '../domain/employee-profile';
import {
  CreateEmployeeProfileData,
  EligibleUser,
  EmployeeProfileRepository,
  UpdateEmployeeProfileData,
} from '../application/ports/employee-profile.repository';

const EMPLOYEE_PROFILE_INCLUDE = {
  user: { select: { id: true, name: true, email: true, avatarUrl: true } },
  workSchedule: { select: { id: true, name: true } },
} satisfies Prisma.EmployeeProfileInclude;

@Injectable()
export class PrismaEmployeeProfileRepository extends EmployeeProfileRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  listByCompany(companyId: string): Promise<EmployeeProfileWithDetails[]> {
    return this.prisma.employeeProfile.findMany({
      where: { companyId },
      include: EMPLOYEE_PROFILE_INCLUDE,
      orderBy: [{ isActive: 'desc' }, { user: { name: 'asc' } }],
    });
  }

  findById(
    companyId: string,
    employeeProfileId: string,
  ): Promise<EmployeeProfileWithDetails | null> {
    return this.prisma.employeeProfile.findFirst({
      where: { id: employeeProfileId, companyId },
      include: EMPLOYEE_PROFILE_INCLUDE,
    });
  }

  findByUserId(userId: string): Promise<EmployeeProfileWithDetails | null> {
    return this.prisma.employeeProfile.findUnique({
      where: { userId },
      include: EMPLOYEE_PROFILE_INCLUDE,
    });
  }

  async findEligibleUser(userId: string): Promise<EligibleUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        companyId: true,
        isActive: true,
        category: true,
        role: { select: { name: true } },
      },
    });
    if (!user) return null;

    return {
      id: user.id,
      companyId: user.companyId,
      isActive: user.isActive,
      isInternalMember: isInternalMember(user.category, user.role.name),
    };
  }

  create(data: CreateEmployeeProfileData): Promise<EmployeeProfileWithDetails> {
    return this.prisma.employeeProfile.create({
      data: {
        companyId: data.companyId,
        userId: data.userId,
        admissionDate: data.admissionDate,
        workScheduleId: data.workScheduleId,
      },
      include: EMPLOYEE_PROFILE_INCLUDE,
    });
  }

  update(
    employeeProfileId: string,
    data: UpdateEmployeeProfileData,
  ): Promise<EmployeeProfileWithDetails> {
    return this.prisma.employeeProfile.update({
      where: { id: employeeProfileId },
      data,
      include: EMPLOYEE_PROFILE_INCLUDE,
    });
  }
}

function isInternalMember(category: UserCategory, role: RoleName): boolean {
  return category === UserCategory.MEMBER && !isClientFacingRole(role);
}
