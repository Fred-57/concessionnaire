import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { PrismaClient } from "@prisma/client";
import { StatusMaintenanceBreakdownEnum } from "@domain/types/StatusMaintenanceBreakdownEnum";
import { MaintenancePartType } from "@domain/types/MaintenancePartType";
import { PostgresPartRepository } from "./PostgresPartRepository";
const prisma = new PrismaClient();

export class PostgresMaintenanceRepository implements MaintenanceRepository {
  public async findAll(): Promise<Maintenance[]> {
    const maintenances = await prisma.maintenance.findMany();

    const maintenanceEntities: Maintenance[] = [];

    for (const maintenance of maintenances) {
      const maintenanceEntity = await this.findByIdentifier(maintenance.id);

      if (maintenanceEntity instanceof Error) {
        throw maintenanceEntity;
      }

      if (maintenanceEntity === null) {
        continue;
      }

      maintenanceEntities.push(maintenanceEntity);
    }
    return maintenanceEntities;
  }

  public async save(maintenance: Maintenance): Promise<void> {
    await prisma.maintenance.create({
      data: {
        id: maintenance.identifier,
        date: maintenance.date,
        motorcycleId: maintenance.motorcycleIdentifier,
        recommendation: maintenance.recommendation,
        status: maintenance.status,
        createdAt: maintenance.createdAt,
        updatedAt: maintenance.updatedAt,
        totalCost: maintenance.totalCost,
        parts: {
          create: maintenance.parts.map((part) => ({
            partId: part.part.identifier,
            quantity: part.quantity,
          })),
        },
      },
    });
  }

  public async delete(maintenance: Maintenance): Promise<void> {
    await prisma.maintenancePart.deleteMany({
      where: { maintenanceId: maintenance.identifier },
    });

    await prisma.maintenance.delete({
      where: { id: maintenance.identifier },
    });
  }

  public async update(maintenance: Maintenance): Promise<void> {
    await prisma.maintenance.update({
      where: { id: maintenance.identifier },
      data: {
        date: maintenance.date,
        motorcycleId: maintenance.motorcycleIdentifier,
        recommendation: maintenance.recommendation,
        status: maintenance.status,
        updatedAt: maintenance.updatedAt,
        totalCost: maintenance.totalCost,
        parts: {
          deleteMany: {},
          create: maintenance.parts.map((part) => ({
            partId: part.part.identifier,
            quantity: part.quantity,
          })),
        },
      },
    });
  }

  public async findByIdentifier(
    identifier: string
  ): Promise<Maintenance | null> {
    const maintenanceDatabase = await prisma.maintenance.findUnique({
      where: { id: identifier },
    });

    if (!maintenanceDatabase) {
      return null;
    }

    const maintenancePartsDatabase = await prisma.maintenancePart.findMany({
      where: { maintenanceId: maintenanceDatabase.id },
    });

    const maintenanceParts: MaintenancePartType[] = [];

    for (const maintenancePart of maintenancePartsDatabase) {
      const part = await new PostgresPartRepository().findByIdentifier(
        maintenancePart.partId
      );

      if (part === null) {
        continue;
      }

      maintenanceParts.push({ part, quantity: maintenancePart.quantity });
    }

    const maintenanceResult = Maintenance.from(
      maintenanceDatabase.id,
      maintenanceDatabase.date,
      maintenanceDatabase.recommendation,
      maintenanceDatabase.status as StatusMaintenanceBreakdownEnum,
      maintenanceDatabase.totalCost ?? 0,
      maintenanceDatabase.motorcycleId,
      maintenanceParts,
      maintenanceDatabase.createdAt,
      maintenanceDatabase.updatedAt
    );

    if (maintenanceResult instanceof Error) {
      return null;
    }

    return maintenanceResult;
  }

  public async findByMotorcycleIdentifier(
    identifier: string
  ): Promise<Maintenance[]> {
    const maintenances = await prisma.maintenance.findMany({
      where: { motorcycleId: identifier },
    });

    const maintenanceEntities: Maintenance[] = [];

    for (const maintenance of maintenances) {
      const maintenanceEntity = await this.findByIdentifier(maintenance.id);

      if (maintenanceEntity instanceof Error) {
        throw maintenanceEntity;
      }

      if (maintenanceEntity === null) {
        continue;
      }

      maintenanceEntities.push(maintenanceEntity);
    }

    return maintenanceEntities;
  }

  public async findPartQuantityByMaintenanceIdentifierAndPartIdentifier(
    maintenanceIdentifier: string,
    partIdentifier: string
  ): Promise<number> {
    const maintenancePart = await prisma.maintenancePart.findUnique({
      where: {
        maintenanceId_partId: {
          maintenanceId: maintenanceIdentifier,
          partId: partIdentifier,
        },
      },
    });

    if (!maintenancePart) {
      return 0;
    }

    return maintenancePart.quantity;
  }

  public async findByMotorcycleAndDate(
    identifier: string,
    date: Date
  ): Promise<Maintenance | null> {
    const maintenanceDatabase = await prisma.maintenance.findFirst({
      where: { motorcycleId: identifier, date: date },
    });

    if (!maintenanceDatabase) {
      return null;
    }

    const maintenancePartsDatabase = await prisma.maintenancePart.findMany({
      where: { maintenanceId: maintenanceDatabase.id },
    });

    const maintenanceParts: MaintenancePartType[] = [];

    for (const maintenancePart of maintenancePartsDatabase) {
      const part = await new PostgresPartRepository().findByIdentifier(
        maintenancePart.partId
      );

      if (part === null) {
        continue;
      }

      maintenanceParts.push({ part, quantity: maintenancePart.quantity });
    }

    const maintenanceResult = Maintenance.from(
      maintenanceDatabase.id,
      maintenanceDatabase.date,
      maintenanceDatabase.recommendation,
      maintenanceDatabase.status as StatusMaintenanceBreakdownEnum,
      maintenanceDatabase.totalCost ?? 0,
      maintenanceDatabase.motorcycleId,
      maintenanceParts,
      maintenanceDatabase.createdAt,
      maintenanceDatabase.updatedAt
    );

    if (maintenanceResult instanceof Error) {
      return null;
    }

    return maintenanceResult;
  }
}
