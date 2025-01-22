import { PartRepository } from "@application/repositories/PartRepository";
import { PrismaClient } from "@prisma/client";
import { Part } from "@domain/entities/Part";

const prisma = new PrismaClient();

export class PostgresPartRepository implements PartRepository {
  async save(part: Part): Promise<void> {
    await prisma.part.create({
      data: {
        id: part.identifier,
        reference: part.reference,
        name: part.name,
        cost: part.cost,
        stock: part.stock,
      },
    });
  }

  async update(part: Part): Promise<void> {
    await prisma.part.update({
      where: { id: part.identifier },
      data: {
        reference: part.reference,
        name: part.name,
        cost: part.cost,
        stock: part.stock,
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
