import { MotorcycleRepository } from "@application/repositories/MotorcycleRepository";
import { Motorcycle } from "@domain/entities/Motorcycle";
import { MaintenanceModel } from "./models/MaintenanceModel";
import { MotorcycleModel } from "./models/MotorcycleModel";
import { RentalModel } from "./models/RentalModel";

export class MongoMotorcycleRepository implements MotorcycleRepository {
  async save(motorcycle: Motorcycle): Promise<void> {
    const motorcycleDatabase = new MotorcycleModel({
      identifier: motorcycle.identifier,
      mileage: motorcycle.mileage,
      dateOfCommissioning: motorcycle.dateOfCommissioning,
      status: motorcycle.status,
      companyIdentifier: motorcycle.companyIdentifier,
      modelIdentifier: motorcycle.modelIdentifier,
      guaranteeIdentifier: motorcycle.guaranteeIdentifier ?? undefined,
    });

    await motorcycleDatabase.save();
  }

  async update(motorcycle: Motorcycle): Promise<void> {
    await MotorcycleModel.updateOne(
      { identifier: motorcycle.identifier },
      {
        mileage: motorcycle.mileage,
        dateOfCommissioning: motorcycle.dateOfCommissioning,
        status: motorcycle.status,
        companyIdentifier: motorcycle.companyIdentifier,
        modelIdentifier: motorcycle.modelIdentifier,
        guaranteeIdentifier: motorcycle.guaranteeIdentifier ?? undefined,
      }
    );
  }

  async findByIdentifier(identifier: string): Promise<Motorcycle | null> {
    const motorcycleDatabase = await MotorcycleModel.findOne({
      identifier: identifier,
    });

    if (!motorcycleDatabase) {
      return null;
    }

    const rentalsDatabase = await RentalModel.find({
      motorcycleIdentifier: identifier,
    });

    const maintenancesDatabase = await MaintenanceModel.find({
      motorcycleIdentifier: identifier,
    });

    const motorcycle = Motorcycle.from(
      motorcycleDatabase.id,
      motorcycleDatabase.mileage,
      motorcycleDatabase.dateOfCommissioning,
      motorcycleDatabase.status,
      motorcycleDatabase.companyIdentifier,
      motorcycleDatabase.modelIdentifier,
      motorcycleDatabase.guaranteeIdentifier ?? null,
      rentalsDatabase.map((rental) => rental.id),
      maintenancesDatabase.map((maintenance) => maintenance.id),
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
    const motorcyclesDatabase = await MotorcycleModel.find({
      companyIdentifier: companyIdentifier,
    });

    const motorcycles: Motorcycle[] = [];

    for (const motorcycleDatabase of motorcyclesDatabase) {
      const motorcycle = await this.findByIdentifier(motorcycleDatabase.id);

      if (!motorcycle) {
        continue;
      }

      motorcycles.push(motorcycle);
    }

    return motorcycles;
  }

  async delete(motorcycle: Motorcycle): Promise<void> {
    await MotorcycleModel.deleteOne({ identifier: motorcycle.identifier });
  }
}
