import { PartRepository } from "./../../../../application/repositories/PartRepository";
import { Part } from "@domain/entities/Part";
import { PartModel } from "./models/PartModel";
import { PartReferenceTooShortError } from "@domain/errors/part/PartReferenceTooShortError";
import { InvalidQuantityError } from "@domain/errors/InvalidQuantityError";
import { PartNameTooShortError } from "@domain/errors/part/PartNameTooShortError";
import { CostLessThanZeroError } from "@domain/errors/CostLessThanZeroError";

export class MongoPartRepository implements PartRepository {
  async save(part: Part): Promise<void> {
    const partDatabase = new PartModel({
      identifier: part.identifier,
      reference: part.reference.value,
      name: part.name.value,
      cost: part.cost.value,
      stock: part.stock.value,
    });
    await partDatabase.save();
  }

  async update(part: Part): Promise<void> {
    const partDatabase = await PartModel.findOne({
      identifier: part.identifier,
    });

    // La vérification de l'existence de l'entité en base de données est réalisée côté application
    // Donc le scénario suivant ne devrait pas se produire, mais on doit s'en prémunir
    if (!partDatabase) {
      return;
    }

    if (
      partDatabase.reference === part.reference.value &&
      partDatabase.identifier != part.identifier
    ) {
      // TODO: je sais pas si j'ai le droit de faire ça ou si je dois lever une exception
      return;
    }

    partDatabase.reference = part.reference.value;
    partDatabase.name = part.name.value;
    partDatabase.cost = part.cost.value;
    partDatabase.stock = part.stock.value;

    await partDatabase.save();
  }
  async findByIdentifier(identifier: string): Promise<Part | null> {
    const partDatabase = await PartModel.findOne({
      identifier: identifier,
    });

    if (!partDatabase) {
      return null;
    }

    const part = Part.from(
      partDatabase.identifier,
      partDatabase.reference,
      partDatabase.name,
      partDatabase.cost,
      partDatabase.stock,
      partDatabase.createdAt,
      partDatabase.updatedAt
    );
    if (
      part instanceof PartReferenceTooShortError ||
      part instanceof PartNameTooShortError ||
      part instanceof CostLessThanZeroError ||
      part instanceof InvalidQuantityError
    ) {
      throw part;
    }
    return part;
  }

  async findByReference(reference: string): Promise<Part | null> {
    const partDatabase = await PartModel.findOne({
      reference: reference,
    });

    if (!partDatabase) {
      return null;
    }

    const part = Part.from(
      partDatabase.identifier,
      partDatabase.reference,
      partDatabase.name,
      partDatabase.cost,
      partDatabase.stock,
      partDatabase.createdAt,
      partDatabase.updatedAt
    );
    if (
      part instanceof PartReferenceTooShortError ||
      part instanceof PartNameTooShortError ||
      part instanceof CostLessThanZeroError ||
      part instanceof InvalidQuantityError
    ) {
      throw part;
    }
    return part;
  }
  async findAll(): Promise<Part[]> {
    const partDatabases = await PartModel.find();

    const parts: Part[] = [];

    for (const partDatabase of partDatabases) {
      const part = Part.from(
        partDatabase.identifier,
        partDatabase.reference,
        partDatabase.name,
        partDatabase.cost,
        partDatabase.stock,
        partDatabase.createdAt,
        partDatabase.updatedAt
      );
      if (
        part instanceof PartReferenceTooShortError ||
        part instanceof PartNameTooShortError ||
        part instanceof CostLessThanZeroError ||
        part instanceof InvalidQuantityError
      ) {
        throw part;
      }
      parts.push(part);
    }

    return parts;
  }

  async delete(part: Part): Promise<void> {
    await PartModel.findOneAndDelete({ identifier: part.identifier }).exec();
  }
}
