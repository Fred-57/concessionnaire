import { PrismaClient } from "@prisma/client";
import { RentalRepository } from "@application/repositories/RentalRepository";
import { Rental } from "@domain/entities/Rental";
import { RentalTypeEnum } from "@domain/types/RentalTypeEnum";

const prisma = new PrismaClient();

export class PostgresRentalRepository implements RentalRepository {
  async save(rental: Rental): Promise<void> {
    await prisma.rental.create({
      data: {
        id: rental.identifier,
        startDate: rental.startDate,
        durationInMonths: rental.durationInMonths.value,
        type: rental.type,
        driverId: rental.driverIdentifier,
        motorcycleId: rental.motorcycleIdentifier,
      },
    });
  }

  async update(rental: Rental): Promise<void> {
    await prisma.rental.update({
      where: { id: rental.identifier },
      data: {
        startDate: rental.startDate,
        durationInMonths: rental.durationInMonths.value,
        type: rental.type,
        driverId: rental.driverIdentifier,
        motorcycleId: rental.motorcycleIdentifier,
      },
    });
  }

  async findAll(): Promise<Rental[]> {
    const rentalsDatabase = await prisma.rental.findMany();

    const rentals: Rental[] = [];

    for (const rentalDatabase of rentalsDatabase) {
      const rental = await this.findByIdentifier(rentalDatabase.id);

      if (!rental) {
        continue;
      }

      if (rental instanceof Error) {
        throw rental;
      }

      rentals.push(rental);
    }

    return rentals;
  }

  async findByIdentifier(identifier: string): Promise<Rental | null> {
    const rentalDatabase = await prisma.rental.findUnique({
      where: { id: identifier },
    });

    if (!rentalDatabase) {
      return null;
    }

    const breakdowns = await prisma.breakdown.findMany({
      where: { rentalId: rentalDatabase.id },
    });

    const rental = Rental.from(
      rentalDatabase.id,
      rentalDatabase.startDate,
      rentalDatabase.durationInMonths,
      rentalDatabase.type as RentalTypeEnum,
      rentalDatabase.driverId,
      rentalDatabase.motorcycleId,
      breakdowns.map((breakdown) => breakdown.id),
      rentalDatabase.createdAt,
      rentalDatabase.updatedAt
    );

    if (rental instanceof Error) {
      return null;
    }

    return rental;
  }

  async findManyByCompanyIdentifier(
    companyIdentifier: string
  ): Promise<Rental[]> {
    const rentalsDatabase = await prisma.rental.findMany({
      where: { motorcycle: { companyId: companyIdentifier } },
    });

    const rentals: Rental[] = [];

    for (const rentalDatabase of rentalsDatabase) {
      const rental = await this.findByIdentifier(rentalDatabase.id);

      if (!rental) {
        continue;
      }

      if (rental instanceof Error) {
        throw rental;
      }

      rentals.push(rental);
    }

    return rentals;
  }

  async delete(rental: Rental): Promise<void> {
    await prisma.rental.delete({
      where: { id: rental.identifier },
    });
  }

  async findManyByMotorcycleIdentifier(
    motorcycleIdentifier: string
  ): Promise<Rental[]> {
    const rentalsDatabase = await prisma.rental.findMany({
      where: { motorcycleId: motorcycleIdentifier },
    });

    const rentals: Rental[] = [];

    for (const rentalDatabase of rentalsDatabase) {
      const rental = await this.findByIdentifier(rentalDatabase.id);

      if (!rental) {
        continue;
      }

      if (rental instanceof Error) {
        throw rental;
      }

      rentals.push(rental);
    }

    return rentals;
  }
}
