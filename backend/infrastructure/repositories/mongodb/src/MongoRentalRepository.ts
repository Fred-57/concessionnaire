import { RentalRepository } from "@application/repositories/RentalRepository";
import { Rental } from "@domain/entities/Rental";
import { RentalModel } from "./models/RentalModel";
import { MotorcycleModel } from "./models/MotorcycleModel";

export class MongoRentalRepository implements RentalRepository {
  async save(rental: Rental): Promise<void> {
    const rentalDatabase = new RentalModel({
      identifier: rental.identifier,
      startDate: rental.startDate,
      durationInMonths: rental.durationInMonths,
      type: rental.type,
      driverIdentifier: rental.driverIdentifier,
      motorcycleIdentifier: rental.motorcycleIdentifier,
      breakdownIdentifiers: [],
    });

    await rentalDatabase.save();
  }

  async update(rental: Rental): Promise<void> {
    await RentalModel.updateOne(
      { identifier: rental.identifier },
      {
        startDate: rental.startDate,
        durationInMonths: rental.durationInMonths,
        type: rental.type,
        driverIdentifier: rental.driverIdentifier,
        motorcycleIdentifier: rental.motorcycleIdentifier,
        breakdownIdentifiers: rental.breakdownIdentifiers,
      }
    );
  }

  async findAll(): Promise<Rental[]> {
    const rentalsDatabase = await RentalModel.find();

    const rentals: Rental[] = [];

    for (const rentalDatabase of rentalsDatabase) {
      const rental = Rental.from(
        rentalDatabase.identifier,
        rentalDatabase.startDate,
        rentalDatabase.durationInMonths,
        rentalDatabase.type,
        rentalDatabase.driverIdentifier,
        rentalDatabase.motorcycleIdentifier,
        rentalDatabase.breakdownIdentifiers,
        rentalDatabase.createdAt,
        rentalDatabase.updatedAt
      );

      if (rental instanceof Error) {
        throw rental;
      }

      rentals.push(rental);
    }

    return rentals;
  }

  async findByIdentifier(identifier: string): Promise<Rental | null> {
    const rentalDatabase = await RentalModel.findOne({ identifier });

    if (!rentalDatabase) {
      return null;
    }

    const rental = Rental.from(
      rentalDatabase.identifier,
      rentalDatabase.startDate,
      rentalDatabase.durationInMonths,
      rentalDatabase.type,
      rentalDatabase.driverIdentifier,
      rentalDatabase.motorcycleIdentifier,
      rentalDatabase.breakdownIdentifiers,
      rentalDatabase.createdAt,
      rentalDatabase.updatedAt
    );

    if (rental instanceof Error) {
      throw rental;
    }

    return rental;
  }

  async findManyByCompanyIdentifier(
    companyIdentifier: string
  ): Promise<Rental[]> {
    const motorcyclesDatabase = await MotorcycleModel.find({
      companyIdentifier: companyIdentifier,
    });

    const rentalsDatabase = await RentalModel.find({
      motorcycleIdentifier: {
        $in: motorcyclesDatabase.map((motorcycle) => motorcycle.identifier),
      },
    });

    const rentals: Rental[] = [];

    for (const rentalDatabase of rentalsDatabase) {
      const rental = Rental.from(
        rentalDatabase.identifier,
        rentalDatabase.startDate,
        rentalDatabase.durationInMonths,
        rentalDatabase.type,
        rentalDatabase.driverIdentifier,
        rentalDatabase.motorcycleIdentifier,
        rentalDatabase.breakdownIdentifiers,
        rentalDatabase.createdAt,
        rentalDatabase.updatedAt
      );

      if (rental instanceof Error) {
        throw rental;
      }

      rentals.push(rental);
    }

    return rentals;
  }

  async delete(rental: Rental): Promise<void> {
    await RentalModel.deleteOne({ identifier: rental.identifier });
  }

  async findManyByMotorcycleIdentifier(
    motorcycleIdentifier: string
  ): Promise<Rental[]> {
    const rentalsDatabase = await RentalModel.find({
      motorcycleIdentifier,
    });

    const rentals: Rental[] = [];

    for (const rentalDatabase of rentalsDatabase) {
      const rental = Rental.from(
        rentalDatabase.identifier,
        rentalDatabase.startDate,
        rentalDatabase.durationInMonths,
        rentalDatabase.type,
        rentalDatabase.driverIdentifier,
        rentalDatabase.motorcycleIdentifier,
        rentalDatabase.breakdownIdentifiers,
        rentalDatabase.createdAt,
        rentalDatabase.updatedAt
      );

      if (rental instanceof Error) {
        throw rental;
      }

      rentals.push(rental);
    }

    return rentals;
  }

  async findManyByDriverIdentifier(
    driverIdentifier: string
  ): Promise<Rental[]> {
    const rentalsDatabase = await RentalModel.find({
      driverIdentifier,
    });

    const rentals: Rental[] = [];

    for (const rentalDatabase of rentalsDatabase) {
      const rental = Rental.from(
        rentalDatabase.identifier,
        rentalDatabase.startDate,
        rentalDatabase.durationInMonths,
        rentalDatabase.type,
        rentalDatabase.driverIdentifier,
        rentalDatabase.motorcycleIdentifier,
        rentalDatabase.breakdownIdentifiers,
        rentalDatabase.createdAt,
        rentalDatabase.updatedAt
      );

      if (rental instanceof Error) {
        throw rental;
      }

      rentals.push(rental);
    }

    return rentals;
  }
}
