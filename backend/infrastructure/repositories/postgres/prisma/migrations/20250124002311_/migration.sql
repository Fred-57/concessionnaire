/*
  Warnings:

  - You are about to drop the `_GuaranteeToPart` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GuaranteeToPart" DROP CONSTRAINT "_GuaranteeToPart_A_fkey";

-- DropForeignKey
ALTER TABLE "_GuaranteeToPart" DROP CONSTRAINT "_GuaranteeToPart_B_fkey";

-- DropTable
DROP TABLE "_GuaranteeToPart";

-- CreateTable
CREATE TABLE "PartsOnGuarantees" (
    "id" UUID NOT NULL,
    "guaranteeId" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartsOnGuarantees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartsOnGuarantees" ADD CONSTRAINT "PartsOnGuarantees_guaranteeId_fkey" FOREIGN KEY ("guaranteeId") REFERENCES "Guarantee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartsOnGuarantees" ADD CONSTRAINT "PartsOnGuarantees_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
