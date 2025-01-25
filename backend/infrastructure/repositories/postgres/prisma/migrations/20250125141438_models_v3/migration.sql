-- CreateEnum
CREATE TYPE "CompanyType" AS ENUM ('CAR_DEALER', 'PARTNER');

-- CreateEnum
CREATE TYPE "License" AS ENUM ('A', 'A2');

-- CreateEnum
CREATE TYPE "RentalType" AS ENUM ('RENTAL', 'TRIAL');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('RENTED', 'AVAILABLE', 'IN_REPAIR', 'IN_MAINTENANCE');

-- CreateEnum
CREATE TYPE "StatusMaintenanceBreakdown" AS ENUM ('PENDING', 'DONE', 'CANCELED');

-- CreateTable
CREATE TABLE "Company" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CompanyType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "license" "License" NOT NULL,
    "numberOfYearsOfExperience" INTEGER NOT NULL,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "repairMileage" INTEGER NOT NULL,
    "repairDeadline" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Motorcycle" (
    "id" TEXT NOT NULL,
    "mileage" INTEGER NOT NULL,
    "dateOfCommissioning" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,
    "companyId" UUID NOT NULL,
    "modelId" UUID NOT NULL,
    "guaranteeId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Motorcycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rental" (
    "id" UUID NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "durationInMonths" INTEGER NOT NULL,
    "type" "RentalType" NOT NULL,
    "driverId" UUID NOT NULL,
    "motorcycleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rental_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breakdown" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "StatusMaintenanceBreakdown" NOT NULL DEFAULT 'PENDING',
    "totalCost" DOUBLE PRECISION DEFAULT 0,
    "rentalId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Breakdown_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "recommendation" TEXT NOT NULL,
    "status" "StatusMaintenanceBreakdown" NOT NULL DEFAULT 'PENDING',
    "totalCost" DOUBLE PRECISION DEFAULT 0,
    "motorcycleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Maintenance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guarantee" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "durationInMonths" INTEGER NOT NULL,
    "coveredAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guarantee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" UUID NOT NULL,
    "reference" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BreakdownPart" (
    "breakdownId" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BreakdownPart_pkey" PRIMARY KEY ("breakdownId","partId")
);

-- CreateTable
CREATE TABLE "MaintenancePart" (
    "maintenanceId" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenancePart_pkey" PRIMARY KEY ("maintenanceId","partId")
);

-- CreateTable
CREATE TABLE "GuaranteePart" (
    "guaranteeId" UUID NOT NULL,
    "partId" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuaranteePart_pkey" PRIMARY KEY ("guaranteeId","partId")
);

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motorcycle" ADD CONSTRAINT "Motorcycle_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motorcycle" ADD CONSTRAINT "Motorcycle_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Model"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Motorcycle" ADD CONSTRAINT "Motorcycle_guaranteeId_fkey" FOREIGN KEY ("guaranteeId") REFERENCES "Guarantee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rental" ADD CONSTRAINT "Rental_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Breakdown" ADD CONSTRAINT "Breakdown_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Maintenance" ADD CONSTRAINT "Maintenance_motorcycleId_fkey" FOREIGN KEY ("motorcycleId") REFERENCES "Motorcycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakdownPart" ADD CONSTRAINT "BreakdownPart_breakdownId_fkey" FOREIGN KEY ("breakdownId") REFERENCES "Breakdown"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BreakdownPart" ADD CONSTRAINT "BreakdownPart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenancePart" ADD CONSTRAINT "MaintenancePart_maintenanceId_fkey" FOREIGN KEY ("maintenanceId") REFERENCES "Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenancePart" ADD CONSTRAINT "MaintenancePart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuaranteePart" ADD CONSTRAINT "GuaranteePart_guaranteeId_fkey" FOREIGN KEY ("guaranteeId") REFERENCES "Guarantee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuaranteePart" ADD CONSTRAINT "GuaranteePart_partId_fkey" FOREIGN KEY ("partId") REFERENCES "Part"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
