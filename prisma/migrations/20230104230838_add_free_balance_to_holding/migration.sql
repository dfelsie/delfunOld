/*
  Warnings:

  - Added the required column `free_balance` to the `Holding` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Holding" ADD COLUMN     "free_balance" DOUBLE PRECISION NOT NULL;
