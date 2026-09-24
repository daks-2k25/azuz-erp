/**
 * Creates or updates the local MASTER user from environment variables only.
 * Never hardcode credentials in this file or in seed.ts.
 *
 * Required in .env (gitignored):
 *   SEED_MASTER_EMAIL
 *   SEED_MASTER_PASSWORD
 * Optional:
 *   SEED_MASTER_NAME
 */
import { PrismaClient, RoleName, UserCategory } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_MASTER_EMAIL?.trim();
  const password = process.env.SEED_MASTER_PASSWORD;

  if (!email || !password) {
    console.error(
      'Set SEED_MASTER_EMAIL and SEED_MASTER_PASSWORD in atria-backend/.env',
    );
    process.exit(1);
  }

  const company = await prisma.company.findUnique({
    where: { subdomain: 'default' },
  });

  if (!company) {
    console.error(
      'Default company not found. Run migrations/seed first (prisma migrate deploy && prisma db seed).',
    );
    process.exit(1);
  }

  const masterRole = await prisma.role.findUnique({
    where: { name: RoleName.MASTER },
  });

  if (!masterRole) {
    console.error('MASTER role not found. Run prisma db seed first.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const name = process.env.SEED_MASTER_NAME?.trim() || 'Admin';

  await prisma.user.upsert({
    where: {
      companyId_email: {
        companyId: company.id,
        email,
      },
    },
    update: {
      name,
      passwordHash,
      roleId: masterRole.id,
      category: UserCategory.MEMBER,
      mustChangePassword: false,
      isActive: true,
    },
    create: {
      companyId: company.id,
      email,
      name,
      passwordHash,
      roleId: masterRole.id,
      category: UserCategory.MEMBER,
      mustChangePassword: false,
      isActive: true,
    },
  });

  console.log(`Master user ready: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
