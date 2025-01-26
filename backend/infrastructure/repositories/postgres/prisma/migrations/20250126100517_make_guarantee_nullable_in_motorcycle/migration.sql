-- DropForeignKey
ALTER TABLE "Motorcycle" DROP CONSTRAINT "Motorcycle_guaranteeId_fkey";

-- AlterTable
ALTER TABLE "Motorcycle" ALTER COLUMN "guaranteeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Motorcycle" ADD CONSTRAINT "Motorcycle_guaranteeId_fkey" FOREIGN KEY ("guaranteeId") REFERENCES "Guarantee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
