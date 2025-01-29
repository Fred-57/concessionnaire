-- CreateEnum
CREATE TYPE "StatusPartOrder" AS ENUM ('PENDING', 'IN_TRANSIT', 'RECEIVED', 'CANCELED');

-- CreateTable
CREATE TABLE "PartOrder" (
    "id" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "status" "StatusPartOrder" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartOrder" ADD CONSTRAINT "PartOrder_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
