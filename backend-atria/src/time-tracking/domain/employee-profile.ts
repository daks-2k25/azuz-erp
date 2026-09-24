import { EmploymentType } from '@prisma/client';

export interface EmployeeProfile {
  id: string;
  companyId: string;
  userId: string;
  employmentType: EmploymentType;
  admissionDate: Date;
  workScheduleId: string;
  isActive: boolean;
}

export interface EmployeeProfileWithDetails extends EmployeeProfile {
  user: { id: string; name: string; email: string; avatarUrl: string | null };
  workSchedule: { id: string; name: string };
}
