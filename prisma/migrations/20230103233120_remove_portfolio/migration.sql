/*
  Warnings:

  - You are about to drop the `Portfolio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `uid` to the `Holding` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Holding" DROP CONSTRAINT "Holding_portfolio_id_fkey";

-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_uid_fkey";

-- AlterTable
ALTER TABLE "Holding" ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "uid" TEXT NOT NULL;

-- DropTable
DROP TABLE "Portfolio";

-- AddForeignKey
ALTER TABLE "Holding" ADD CONSTRAINT "Holding_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
