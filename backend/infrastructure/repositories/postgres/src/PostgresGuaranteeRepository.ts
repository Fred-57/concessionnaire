import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { PrismaClient } from "@prisma/client";
import { Guarantee } from "@domain/entities/Guarantee";
import { Part } from "@domain/entities/Part";

const prisma = new PrismaClient();

export class PostgresGuaranteeRepository implements GuaranteeRepository {
  async save(guarantee: Guarantee): Promise<void> {
    await prisma.guarantee.create({
      data: {
        id: guarantee.identifier,
        name: guarantee.name.value,
        createdAt: guarantee.createdAt,
        updatedAt: guarantee.updatedAt,
        Part: {
          connect: guarantee.parts.map((part) => ({ id: part.identifier })),
        },
      },
    });
  }
  async update(guarantee: Guarantee): Promise<void> {
    await prisma.guarantee.update({
      where: { id: guarantee.identifier },
      data: {
        name: guarantee.name.value,
        updatedAt: guarantee.updatedAt,
        Part: {
          set: guarantee.parts.map((part) => ({ id: part.identifier })),
        },
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<Guarantee | null> {
    const guaranteeDatabase = await prisma.guarantee.findUnique({
      where: {
        id: identifier,
      },
      include: {
        Part: true,
      },
    });

    if (!guaranteeDatabase) {
      return null;
    }

    const parts = await prisma.part.findMany({
      where: {
        id: guaranteeDatabase.id,
      },
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

    const guarantee = Guarantee.from(
      guaranteeDatabase.id,
      guaranteeDatabase.name,
      partsValue,
      guaranteeDatabase.createdAt,
      guaranteeDatabase.updatedAt
    );

    if (guarantee instanceof Error) {
      throw guarantee;
    }
    return guarantee;
  }

  async findByName(name: string): Promise<Guarantee | null> {
    const guaranteeDatabase = await prisma.guarantee.findFirst({
      where: {
        name,
      },
      include: {
        Part: true,
      },
    });

    if (!guaranteeDatabase) {
      return null;
    }

    const parts = await prisma.part.findMany({
      where: {
        id: guaranteeDatabase.id,
      },
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

    const guarantee = Guarantee.from(
      guaranteeDatabase.id,
      guaranteeDatabase.name,
      partsValue,
      guaranteeDatabase.createdAt,
      guaranteeDatabase.updatedAt
    );

    if (guarantee instanceof Error) {
      throw guarantee;
    }
    return guarantee;
  }

  async findAll(): Promise<Guarantee[]> {
    const guaranteesDatabase = await prisma.guarantee.findMany({
      include: {
        Part: true,
      },
    });

    const guarantees = guaranteesDatabase.map((guaranteeDatabase) => {
      const parts = guaranteeDatabase.Part.map((part) => Part.from(part.id));

      const partsValue = parts.filter(
        (part): part is Part => part instanceof Part
      );

      const guarantee = Guarantee.from(
        guaranteeDatabase.id,
        guaranteeDatabase.name,
        partsValue,
        guaranteeDatabase.createdAt,
        guaranteeDatabase.updatedAt
      );

      if (guarantee instanceof Error) {
        throw guarantee;
      }

      return guarantee;
    });

    return guarantees;
  }

  async delete(guarantee: Guarantee): Promise<void> {
    await prisma.guarantee.delete({
      where: {
        id: guarantee.identifier,
      },
    });
  }
}
