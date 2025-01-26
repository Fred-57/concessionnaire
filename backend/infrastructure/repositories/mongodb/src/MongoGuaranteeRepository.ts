import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { Guarantee } from "@domain/entities/Guarantee";
import { GuaranteeModel } from "./models/GuaranteeModel";
import { PartModel } from "./models/PartModel";
import { Part } from "@domain/entities/Part";
import { Motorcycle } from "@domain/entities/Motorcycle";
import { MotorcycleModel } from "./models/MotorcycleModel";

export class MongoGuaranteeRepository implements GuaranteeRepository {
  async save(guarantee: Guarantee): Promise<void> {
    const guaranteeDatabase = new GuaranteeModel({
      identifier: guarantee.identifier,
      name: guarantee.name.value,
      motorcyclesId: guarantee.motorcycles.map(
        (motorcycle) => motorcycle.identifier
      ),
      partsId: guarantee.parts.map((part) => part.identifier),
      coveredAmount: guarantee.coveredAmount.value,
      durationInMonths: guarantee.durationInMonths.value,
    });
    await guaranteeDatabase.save();
  }

  async update(guarantee: Guarantee): Promise<void> {
    const guaranteeDatabase = await GuaranteeModel.findOneAndUpdate(
      { identifier: guarantee.identifier },
      {
        name: guarantee.name.value,
        partsId: guarantee.parts.map((part) => part.identifier),
        coveredAmountValue: guarantee.coveredAmount.value,
        durationInMonthsValue: guarantee.durationInMonths.value,
      }
    );
  }

  async delete(guarantee: Guarantee): Promise<void> {
    await GuaranteeModel.findOneAndDelete({ identifier: guarantee.identifier });
  }

  async findByIdentifier(identifier: string): Promise<Guarantee | null> {
    const guaranteeDatabase = await GuaranteeModel.findOne({ identifier });

    if (!guaranteeDatabase) return null;

    const parts = await PartModel.find({
      identifier: { $in: guaranteeDatabase.partsId },
    });

    const partsValue = parts
      .map((part) =>
        Part.from(
          part.id,
          part.reference,
          part.name,
          part.cost,
          part.stock,
          part.createdAt,
          part.updatedAt
        )
      )
      .filter((part): part is Part => part instanceof Part);

    const motorcycles = await MotorcycleModel.find({
      identifier: { $in: guaranteeDatabase.motorcyclesId },
    });

    const motorcyclesValue = motorcycles.map((motorcycle) =>
      Motorcycle.from(
        motorcycle.identifier,
        motorcycle.mileage,
        motorcycle.dateOfCommissioning,
        motorcycle.status,
        motorcycle.modelId,
        motorcycle.guaranteeId,
        motorcycle.createdAt,
        motorcycle.updatedAt
      )
    );
    const guarantee = Guarantee.from(
      guaranteeDatabase.identifier,
      guaranteeDatabase.name,
      guaranteeDatabase.durationInMonths,
      guaranteeDatabase.coveredAmount,
      partsValue,
      motorcyclesValue,
      guaranteeDatabase.createdAt,
      guaranteeDatabase.updatedAt
    );
    return guarantee;
  }

  async findByName(name: string): Promise<Guarantee | null> {
    const guaranteeDatabase = await GuaranteeModel.findOne({ name });

    if (!guaranteeDatabase) return null;

    const parts = await PartModel.find({
      identifier: { $in: guaranteeDatabase.partsId },
    });

    const partsValue = parts
      .map((part) =>
        Part.from(
          part.id,
          part.reference,
          part.name,
          part.cost,
          part.stock,
          part.createdAt,
          part.updatedAt
        )
      )
      .filter((part): part is Part => part instanceof Part);

    const motorcycles = await MotorcycleModel.find({
      identifier: { $in: guaranteeDatabase.motorcyclesId },
    });

    const motorcyclesValue = motorcycles.map((motorcycle) =>
      Motorcycle.from(
        motorcycle.identifier,
        motorcycle.mileage,
        motorcycle.dateOfCommissioning,
        motorcycle.status,
        motorcycle.modelId,
        motorcycle.guaranteeId,
        motorcycle.createdAt,
        motorcycle.updatedAt
      )
    );

    return guaranteeDatabase
      ? Guarantee.from(
          guaranteeDatabase.identifier,
          guaranteeDatabase.name,
          guaranteeDatabase.durationInMonths,
          guaranteeDatabase.coveredAmount,
          partsValue,
          motorcyclesValue,
          guaranteeDatabase.createdAt,
          guaranteeDatabase.updatedAt
        )
      : null;
  }

  async findAll(): Promise<Guarantee[]> {
    const guaranteeDatabase = await GuaranteeModel.find();

    if (!guaranteeDatabase) return [];

    const guarantees: Guarantee[] = [];

    for (const guaranteeData of guaranteeDatabase) {
      const parts = await PartModel.find({
        identifier: { $in: guaranteeData.partsId },
      });

      if (!parts) continue;

      const partsValue = parts
        .map((part) =>
          Part.from(
            part.id,
            part.reference,
            part.name,
            part.cost,
            part.stock,
            part.createdAt,
            part.updatedAt
          )
        )
        .filter((part): part is Part => part instanceof Part);

      const motorcycles = await MotorcycleModel.find({
        identifier: { $in: guaranteeData.motorcyclesId },
      });

      const motorcyclesValue = motorcycles.map((motorcycle) =>
        Motorcycle.from(
          motorcycle.identifier,
          motorcycle.mileage,
          motorcycle.dateOfCommissioning,
          motorcycle.status,
          motorcycle.modelId,
          motorcycle.guaranteeId,
          motorcycle.createdAt,
          motorcycle.updatedAt
        )
      );
      const guarantee = Guarantee.from(
        guaranteeData.identifier,
        guaranteeData.name,
        guaranteeData.durationInMonths,
        guaranteeData.coveredAmount,
        partsValue,
        motorcyclesValue,
        guaranteeData.createdAt,
        guaranteeData.updatedAt
      );

      if (guarantee instanceof Error) {
        throw guarantee;
      }

      guarantees.push(guarantee);
    }

    return guarantees;
  }
}
