/*
  Warnings:

  - You are about to drop the column `portfolio_id` on the `Holding` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio_id` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `portfolioId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Holding" DROP COLUMN "portfolio_id";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "portfolio_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "portfolioId";
