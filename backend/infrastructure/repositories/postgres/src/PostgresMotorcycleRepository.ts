import { MotorcycleRepository } from "@application/repositories/MotorcycleRepository";
import { PrismaClient } from "@prisma/client";
import { Motorcycle } from "@domain/entities/Motorcycle";
const prisma = new PrismaClient();

export class PostgresMotorcycleRepository implements MotorcycleRepository {
  async save(motorcycle: Motorcycle): Promise<void> {
    console.log("motorcycle", motorcycle);
    await prisma.motorcycle.create({
      data: {
        id: motorcycle.identifier,
        mileage: motorcycle.mileage.value,
        dateOfCommissioning: motorcycle.dateOfCommissioning,
        status: motorcycle.status.value,
        companyId: motorcycle.companyIdentifier,
        modelId: motorcycle.modelIdentifier,
        guaranteeId: motorcycle.guaranteeIdentifier ?? undefined,
      },
    });
  }

  async update(motorcycle: Motorcycle): Promise<void> {
    await prisma.motorcycle.update({
      where: { id: motorcycle.identifier },
      data: {
        mileage: motorcycle.mileage.value,
        dateOfCommissioning: motorcycle.dateOfCommissioning,
        status: motorcycle.status.value,
        companyId: motorcycle.companyIdentifier,
        modelId: motorcycle.modelIdentifier,
        guaranteeId: motorcycle.guaranteeIdentifier ?? null,
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<Motorcycle | null> {
    const motorcycleDatabase = await prisma.motorcycle.findUnique({
      where: { id: identifier },
    });

    if (!motorcycleDatabase) {
      return null;
    }

    const rentalsDatabase = await prisma.rental.findMany({
      where: {
        motorcycleId: identifier,
      },
    });

    const maintenanceDatabase = await prisma.maintenance.findMany({
      where: {
        motorcycleId: identifier,
      },
    });

    const motorcycle = Motorcycle.from(
      motorcycleDatabase.id,
      motorcycleDatabase.mileage,
      motorcycleDatabase.dateOfCommissioning,
      motorcycleDatabase.status,
      motorcycleDatabase.companyId,
      motorcycleDatabase.modelId,
      motorcycleDatabase.guaranteeId,
      rentalsDatabase.map((rental) => rental.id),
      maintenanceDatabase.map((maintenance) => maintenance.id),
      motorcycleDatabase.createdAt,
      motorcycleDatabase.updatedAt
    );

    if (motorcycle instanceof Error) {
      throw motorcycle;
    }

    return motorcycle;
  }

  async findManyByCompanyIdentifier(
    companyIdentifier: string
  ): Promise<Motorcycle[]> {
    const motorcyclesDatabase = await prisma.motorcycle.findMany({
      where: { companyId: companyIdentifier },
    });

    if (motorcyclesDatabase instanceof Error) {
      throw motorcyclesDatabase;
    }

    const motorcycles: Motorcycle[] = [];

    for (const motorcycleDatabase of motorcyclesDatabase) {
      const motorcycle = await this.findByIdentifier(motorcycleDatabase.id);

      if (!motorcycle) {
        continue;
      }

      if (motorcycle instanceof Error) {
        throw motorcycle;
      }

      motorcycles.push(motorcycle);
    }

    return motorcycles;
  }

  async delete(motorcycle: Motorcycle): Promise<void> {
    await prisma.motorcycle.delete({
      where: { id: motorcycle.identifier },
    });
  }
}
