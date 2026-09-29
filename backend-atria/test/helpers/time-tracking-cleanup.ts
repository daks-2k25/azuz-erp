import { PrismaClient } from '@prisma/client';

type TimeTrackingPrisma = Pick<
  PrismaClient,
  | 'timeClockEntry'
  | 'timeAdjustmentRequest'
  | 'employeeProfile'
  | 'workSchedule'
>;

/**
 * Remove os dados de ponto dos usuários de teste. Precisa rodar antes de
 * apagar os usuários, porque employee_profiles bloqueia a exclusão (RESTRICT).
 */
export async function cleanupTimeTrackingData(
  prisma: TimeTrackingPrisma,
  userIds: string[],
  runId: string,
) {
  if (userIds.length > 0) {
    const employeeFilter = { employeeProfile: { userId: { in: userIds } } };

    // Marcações e ajustes se referenciam; a ordem evita violar as FKs.
    await prisma.timeClockEntry.deleteMany({
      where: { ...employeeFilter, adjustmentRequestId: { not: null } },
    });
    await prisma.timeAdjustmentRequest.deleteMany({ where: employeeFilter });
    await prisma.timeClockEntry.deleteMany({ where: employeeFilter });
    await prisma.employeeProfile.deleteMany({
      where: { userId: { in: userIds } },
    });
  }

  await prisma.workSchedule.deleteMany({
    where: { name: { contains: runId } },
  });
}
