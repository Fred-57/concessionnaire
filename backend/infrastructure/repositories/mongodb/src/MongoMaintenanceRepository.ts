import { Maintenance } from "@domain/entities/Maintenance";
import { MaintenanceRepository } from "@application/repositories/MaintenanceRepository";
import { MaintenanceModel } from "./models/MaintenanceModel";
import { PartReference } from "@domain/values/part/PartReference";
import { Part } from "@domain/entities/Part";
import { PartName } from "@domain/values/part/PartName";
import { PartCost } from "@domain/values/part/PartCost";
import { PartStock } from "@domain/values/part/PartStock";
import { PartReferenceTooShortError } from "@domain/errors/part/PartReferenceTooShortError";
import { PartNameTooShortError } from "@domain/errors/part/PartNameTooShortError";
import { MaintenancePartType } from "@domain/types/MaintenancePartType";
import { PartModel } from "./models/PartModel";
import { CostLessThanZeroError } from "@domain/errors/CostLessThanZeroError";
import { InvalidQuantityError } from "@domain/errors/InvalidQuantityError";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
export class MongoMaintenanceRepository implements MaintenanceRepository {
  async save(maintenance: Maintenance): Promise<void> {
    const maintenanceDatabase = new MaintenanceModel({
      identifier: maintenance.identifier,
      motorcycleIdentifier: maintenance.motorcycleIdentifier,
      date: maintenance.date,
      recommendation: maintenance.recommendation,
      status: maintenance.status,
      totalCost: maintenance.totalCost,
      parts: maintenance.parts.map((part) => ({
        part: {
          identifier: part.part.identifier,
          reference: part.part.reference.value,
          name: part.part.name.value,
          cost: part.part.cost.value,
          stock: part.part.stock.value,
        },
        quantity: part.quantity,
      })),
    });

    await maintenanceDatabase.save();
  }

  async update(maintenance: Maintenance): Promise<void> {
    const maintenanceDatabase = await MaintenanceModel.findOne({
      identifier: maintenance.identifier,
    });

    if (!maintenanceDatabase) {
      return;
    }

    maintenanceDatabase.date = maintenance.date;
    maintenanceDatabase.recommendation = maintenance.recommendation;
    maintenanceDatabase.status = maintenance.status;
    maintenanceDatabase.totalCost = maintenance.totalCost;

    maintenanceDatabase.parts = maintenance.parts.map((part) => ({
      part: {
        identifier: part.part.identifier,
        reference: part.part.reference.value,
        name: part.part.name.value,
        cost: part.part.cost.value,
        stock: part.part.stock.value,
        guaranteePartsId: [],
        breakdownPartsId: [],
        maintenancePartsId: [maintenance.identifier],
        createdAt: part.part.createdAt,
        updatedAt: new Date(),
      },
      quantity: part.quantity,
    }));

    await maintenanceDatabase.save();
  }

  async delete(maintenance: Maintenance): Promise<void> {
    await MaintenanceModel.deleteOne({ identifier: maintenance.identifier });
  }

  async findByIdentifier(identifier: string): Promise<Maintenance | null> {
    const maintenanceDatabase = await MaintenanceModel.findOne({
      identifier: identifier,
    });

    if (!maintenanceDatabase) return null;

    const maintenancePart: MaintenancePartType[] = [];

    for (const part of maintenanceDatabase.parts) {
      const partDatabase = await PartModel.findOne({
        identifier: part.part.identifier,
      });

      if (!partDatabase) {
        continue;
      }

      const partReference = PartReference.from(partDatabase.reference);
      const partCost = PartCost.from(partDatabase.cost.toString());
      const partStock = PartStock.from(partDatabase.stock.toString());
      const partName = PartName.from(partDatabase.name);

      if (
        partName instanceof PartNameTooShortError ||
        partReference instanceof PartReferenceTooShortError ||
        partCost instanceof CostLessThanZeroError ||
        partStock instanceof InvalidQuantityError
      ) {
        continue;
      }

      const partValue = Part.from(
        partDatabase.identifier,
        partReference.value,
        partName.value,
        partCost.value,
        partStock.value,
        partDatabase.createdAt,
        partDatabase.updatedAt
      );

      if (
        partValue instanceof PartNotFoundError ||
        partValue instanceof PartReferenceTooShortError ||
        partValue instanceof PartNameTooShortError ||
        partValue instanceof CostLessThanZeroError ||
        partValue instanceof InvalidQuantityError
      ) {
        continue;
      }

      maintenancePart.push({ part: partValue, quantity: part.quantity });
    }

    const maintenance = Maintenance.from(
      maintenanceDatabase.identifier,
      maintenanceDatabase.date,
      maintenanceDatabase.recommendation,
      maintenanceDatabase.status,
      maintenanceDatabase.totalCost,
      maintenanceDatabase.motorcycleIdentifier,
      maintenancePart,
      maintenanceDatabase.createdAt,
      maintenanceDatabase.updatedAt
    );

    if (maintenance instanceof Error) {
      return null;
    }

    return maintenance;
  }

  async findByMotorcycleIdentifier(
    motorcycleIdentifier: string
  ): Promise<Maintenance[]> {
    const maintenanceDatabase = await MaintenanceModel.find({
      motorcycle: motorcycleIdentifier,
    });

    const maintenances: Maintenance[] = [];

    for (const maintenance of maintenanceDatabase) {
      const maintenancePart: MaintenancePartType[] = [];
      for (const part of maintenance.parts) {
        const partDatabase = await PartModel.findOne({
          identifier: part.part.identifier,
        });

        if (!partDatabase) {
          continue;
        }

        const partReference = PartReference.from(partDatabase.reference);
        const partCost = PartCost.from(partDatabase.cost.toString());
        const partStock = PartStock.from(partDatabase.stock.toString());
        const partName = PartName.from(partDatabase.name);

        if (
          partName instanceof PartNameTooShortError ||
          partReference instanceof PartReferenceTooShortError ||
          partCost instanceof CostLessThanZeroError ||
          partStock instanceof InvalidQuantityError
        ) {
          continue;
        }

        const partValue = Part.from(
          partDatabase.identifier,
          partReference.value,
          partName.value,
          partCost.value,
          partStock.value,
          partDatabase.createdAt,
          partDatabase.updatedAt
        );

        if (
          partValue instanceof PartNotFoundError ||
          partValue instanceof PartReferenceTooShortError ||
          partValue instanceof PartNameTooShortError ||
          partValue instanceof CostLessThanZeroError ||
          partValue instanceof InvalidQuantityError
        ) {
          continue;
        }

        maintenancePart.push({ part: partValue, quantity: part.quantity });
      }

      const maintenanceResult = Maintenance.from(
        maintenance.identifier,
        maintenance.date,
        maintenance.recommendation,
        maintenance.status,
        maintenance.totalCost,
        maintenance.motorcycleIdentifier,
        maintenancePart,
        maintenance.createdAt,
        maintenance.updatedAt
      );

      if (maintenanceResult instanceof Error) {
        continue;
      }

      maintenances.push(maintenanceResult);
    }

    return maintenances;
  }

  async findByMotorcycleAndDate(
    motorcycleIdentifier: string,
    date: Date
  ): Promise<Maintenance | null> {
    const maintenanceDatabase = await MaintenanceModel.findOne({
      motorcycle: motorcycleIdentifier,
      date: date,
    });

    if (!maintenanceDatabase) return null;

    const maintenancePart: MaintenancePartType[] = [];

    for (const part of maintenanceDatabase.parts) {
      const partDatabase = await PartModel.findOne({
        identifier: part.part.identifier,
      });

      if (!partDatabase) {
        continue;
      }

      const partReference = PartReference.from(partDatabase.reference);
      const partCost = PartCost.from(partDatabase.cost.toString());
      const partStock = PartStock.from(partDatabase.stock.toString());
      const partName = PartName.from(partDatabase.name);

      if (
        partName instanceof PartNameTooShortError ||
        partReference instanceof PartReferenceTooShortError ||
        partCost instanceof CostLessThanZeroError ||
        partStock instanceof InvalidQuantityError
      ) {
        continue;
      }

      const partValue = Part.from(
        partDatabase.identifier,
        partReference.value,
        partName.value,
        partCost.value,
        partStock.value,
        partDatabase.createdAt,
        partDatabase.updatedAt
      );

      if (
        partValue instanceof PartNotFoundError ||
        partValue instanceof PartReferenceTooShortError ||
        partValue instanceof PartNameTooShortError ||
        partValue instanceof CostLessThanZeroError ||
        partValue instanceof InvalidQuantityError
      ) {
        continue;
      }

      maintenancePart.push({ part: partValue, quantity: part.quantity });
    }

    const maintenance = Maintenance.from(
      maintenanceDatabase.identifier,
      maintenanceDatabase.date,
      maintenanceDatabase.recommendation,
      maintenanceDatabase.status,
      maintenanceDatabase.totalCost,
      maintenanceDatabase.motorcycleIdentifier,
      maintenancePart,
      maintenanceDatabase.createdAt,
      maintenanceDatabase.updatedAt
    );

    if (maintenance instanceof Error) {
      return null;
    }

    return maintenance;
  }

  async findAll(): Promise<Maintenance[]> {
    const maintenanceDatabase = await MaintenanceModel.find();

    const maintenances: Maintenance[] = [];

    for (const maintenance of maintenanceDatabase) {
      const maintenancePart: MaintenancePartType[] = [];

      for (const part of maintenance.parts) {
        const partDatabase = await PartModel.findOne({
          identifier: part.part.identifier,
        });

        if (!partDatabase) {
          continue;
        }

        const partReference = PartReference.from(partDatabase.reference);
        const partCost = PartCost.from(partDatabase.cost.toString());
        const partStock = PartStock.from(partDatabase.stock.toString());
        const partName = PartName.from(partDatabase.name);

        if (
          partName instanceof PartNameTooShortError ||
          partReference instanceof PartReferenceTooShortError ||
          partCost instanceof CostLessThanZeroError ||
          partStock instanceof InvalidQuantityError
        ) {
          continue;
        }

        const partValue = Part.from(
          partDatabase.identifier,
          partReference.value,
          partName.value,
          partCost.value,
          partStock.value,
          partDatabase.createdAt,
          partDatabase.updatedAt
        );

        if (
          partValue instanceof PartNotFoundError ||
          partValue instanceof PartReferenceTooShortError ||
          partValue instanceof PartNameTooShortError ||
          partValue instanceof CostLessThanZeroError ||
          partValue instanceof InvalidQuantityError
        ) {
          continue;
        }

        maintenancePart.push({ part: partValue, quantity: part.quantity });
      }

      const maintenanceResult = Maintenance.from(
        maintenance.identifier,
        maintenance.date,
        maintenance.recommendation,
        maintenance.status,
        maintenance.totalCost,
        maintenance.motorcycleIdentifier,
        maintenancePart,
        maintenance.createdAt,
        maintenance.updatedAt
      );

      if (maintenanceResult instanceof Error) {
        continue;
      }

      maintenances.push(maintenanceResult);
    }

    return maintenances;
  }

  async findPartQuantityByMaintenanceIdentifierAndPartIdentifier(
    maintenanceIdentifier: string,
    partIdentifier: string
  ): Promise<number> {
    const maintenanceDatabase = await MaintenanceModel.findOne({
      identifier: maintenanceIdentifier,
    });

    if (!maintenanceDatabase) {
      return 0;
    }

    const maintenancePart = maintenanceDatabase.parts.find(
      (p) => p.part.identifier === partIdentifier
    );

    if (!maintenancePart) {
      return 0;
    }

    return maintenancePart.quantity;
  }
}
