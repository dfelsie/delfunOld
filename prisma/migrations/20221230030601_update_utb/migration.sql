/*
  Warnings:

  - You are about to drop the column `price` on the `UserTimeBalance` table. All the data in the column will be lost.
  - Added the required column `value` to the `UserTimeBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserTimeBalance" DROP COLUMN "price",
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL;
