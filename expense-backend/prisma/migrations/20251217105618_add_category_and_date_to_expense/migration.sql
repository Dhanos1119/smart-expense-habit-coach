-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'Other',
ADD COLUMN     "date" TIMESTAMP(3);
