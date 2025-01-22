import { PartRepository } from "@application/repositories/PartRepository";
import { PrismaClient } from "@prisma/client";
import { Part } from "@domain/entities/Part";

import { PartReferenceTooShortError } from "@domain/errors/part/PartReferenceTooShortError";
import { PartNameTooShortError } from "@domain/errors/part/PartNameTooShortError";
import { InvalidQuantityError } from "@domain/errors/InvalidQuantityError";
import { CostLessThanZeroError } from "@domain/errors/CostLessThanZeroError";

const prisma = new PrismaClient();

export class PostgresPartRepository implements PartRepository {
  async save(part: Part): Promise<void> {
    await prisma.part.create({
      data: {
        id: part.identifier,
        reference: part.reference.value,
        name: part.name.value,
        cost: part.cost.value,
        stock: part.stock.value,
      },
    });
  }

  async update(part: Part): Promise<void> {
    await prisma.part.update({
      where: { id: part.identifier },
      data: {
        reference: part.reference.value,
        name: part.name.value,
        cost: part.cost.value,
        stock: part.stock.value,
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<Part | null> {
    const partDatabase = await prisma.part.findUnique({
      where: {
        id: identifier,
      },
    });

    if (!partDatabase) {
      return null;
    }

    const part = Part.from(
      partDatabase.id,
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
    const partDatabase = await prisma.part.findFirst({
      where: {
        reference,
      },
    });

    if (!partDatabase) {
      return null;
    }

    const part = Part.from(
      partDatabase.id,
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
    const partsDatabase = await prisma.part.findMany();
    const parts: Part[] = [];
    for (const partDatabase of partsDatabase) {
      const part = Part.from(
        partDatabase.id,
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
    await prisma.part.delete({
      where: {
        id: part.identifier,
      },
    });
  }
}
