/*
  Warnings:

  - You are about to drop the column `value` on the `UserTimeBalance` table. All the data in the column will be lost.
  - Added the required column `balance` to the `UserTimeBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserTimeBalance" DROP COLUMN "value",
ADD COLUMN     "balance" DOUBLE PRECISION NOT NULL;
