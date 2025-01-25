/*
  Warnings:

  - You are about to drop the column `brandId` on the `Model` table. All the data in the column will be lost.
  - You are about to drop the `Brand` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Model" DROP CONSTRAINT "Model_brandId_fkey";

-- AlterTable
ALTER TABLE "Model" DROP COLUMN "brandId";

-- DropTable
DROP TABLE "Brand";
