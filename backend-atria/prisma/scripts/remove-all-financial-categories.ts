/**
 * Removes every financial category from the database.
 * Financial transactions must be deleted first because categoryId is required.
 * Default categories are re-seeded afterward so the finance module keeps working.
 *
 * Usage:
 *   npx ts-node prisma/scripts/remove-all-financial-categories.ts
 */
import { PrismaClient } from '@prisma/client';
import { seedDefaultFinancialCategories } from '../../src/finance/finance-category-defaults';

const prisma = new PrismaClient();

async function main() {
  const [transactionCount, categoryCount] = await Promise.all([
    prisma.financialTransaction.count(),
    prisma.financialCategory.count(),
  ]);

  console.log(
    `Before cleanup: ${transactionCount} transactions, ${categoryCount} categories`,
  );

  const deletedTransactions = await prisma.financialTransaction.deleteMany({});
  const deletedCategories = await prisma.financialCategory.deleteMany({});

  console.log(
    `Deleted ${deletedTransactions.count} transactions and ${deletedCategories.count} categories`,
  );

  const companies = await prisma.company.findMany({ select: { id: true, name: true } });

  for (const company of companies) {
    await seedDefaultFinancialCategories(prisma, company.id);
    console.log(`Re-seeded default categories for ${company.name}`);
  }

  const remainingCategories = await prisma.financialCategory.count();
  console.log(`Done. ${remainingCategories} default categories remain.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
