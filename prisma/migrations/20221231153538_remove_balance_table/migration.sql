/*
  Warnings:

  - You are about to drop the `UserTimeBalance` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `free_balance` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Holding" ADD COLUMN     "free_balance" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "UserTimeBalance";
