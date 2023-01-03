/*
  Warnings:

  - You are about to drop the column `free_balance` on the `Holding` table. All the data in the column will be lost.
  - Added the required column `free_balance` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Holding" DROP COLUMN "free_balance";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "free_balance" DOUBLE PRECISION NOT NULL;
