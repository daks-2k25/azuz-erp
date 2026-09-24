/**
 * Backfill script: assign organizationId to kanban leads that lack it.
 *
 * Usage (set organizationId for a client's leads):
 *   ORGANIZATION_ID=<client-uuid> npx ts-node prisma/scripts/backfill-lead-organization.ts
 *
 * Usage (mark as internal / null org):
 *   INTERNAL=1 npx ts-node prisma/scripts/backfill-lead-organization.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const organizationId = process.env.ORGANIZATION_ID?.trim() || null;
  const internal = process.env.INTERNAL === '1';

  if (!internal && !organizationId) {
    console.error(
      'Set ORGANIZATION_ID=<client-uuid> or INTERNAL=1 to choose target organization.',
    );
    process.exit(1);
  }

  const targetOrgId = internal ? null : organizationId;

  const result = await prisma.lead.updateMany({
    where: {
      kanbanTracked: true,
      deletedAt: null,
      organizationId: null,
    },
    data: {
      organizationId: targetOrgId,
    },
  });

  console.log(
    `Updated ${result.count} kanban lead(s) with organizationId=${targetOrgId ?? 'null'}.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
