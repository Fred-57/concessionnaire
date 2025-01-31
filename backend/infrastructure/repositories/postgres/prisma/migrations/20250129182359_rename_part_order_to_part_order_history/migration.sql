/*
  Warnings:

  - You are about to drop the `PartOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusPartOrderHistory" AS ENUM ('PENDING', 'IN_TRANSIT', 'RECEIVED', 'CANCELED');

-- DropForeignKey
ALTER TABLE "PartOrder" DROP CONSTRAINT "PartOrder_partId_fkey";

-- DropTable
DROP TABLE "PartOrder";

-- DropEnum
DROP TYPE "StatusPartOrder";

-- CreateTable
CREATE TABLE "PartOrderHistory" (
    "id" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "status" "StatusPartOrderHistory" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartOrderHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartOrderHistory" ADD CONSTRAINT "PartOrderHistory_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
