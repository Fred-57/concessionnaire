/*
  Warnings:

  - Changed the type of `status` on the `Motorcycle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MotorcycleStatus" AS ENUM ('RENTED', 'AVAILABLE', 'IN_REPAIR', 'IN_MAINTENANCE');

-- AlterTable
ALTER TABLE "Motorcycle" DROP COLUMN "status",
ADD COLUMN     "status" "MotorcycleStatus" NOT NULL;

-- DropEnum
DROP TYPE "Status";
