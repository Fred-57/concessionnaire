import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { PrismaClient } from "@prisma/client";
import { Guarantee } from "@domain/entities/Guarantee";
import { Part } from "@domain/entities/Part";
import { randomUUID } from "crypto";
import { Motorcycle } from "@domain/entities/Motorcycle";

const prisma = new PrismaClient();

export class PostgresGuaranteeRepository implements GuaranteeRepository {
  async save(guarantee: Guarantee): Promise<void> {
    await prisma.guarantee.create({
      data: {
        id: guarantee.identifier,
        name: guarantee.name.value,
        durationInMonths: guarantee.durationInMonths.value,
        coveredAmount: guarantee.coveredAmount.value,
        parts: {
          create: guarantee.partsIdentifiers.map((part) => ({
            partId: part,
          })),
        },
      },
    });
  }
  async update(guarantee: Guarantee): Promise<void> {
    await prisma.guarantee.update({
      where: { id: guarantee.identifier },
      data: {
        name: guarantee.name.value,
        durationInMonths: guarantee.durationInMonths.value,
        coveredAmount: guarantee.coveredAmount.value,
        updatedAt: guarantee.updatedAt,
        parts: {
          deleteMany: {
            guaranteeId: guarantee.identifier,
          },
          create: guarantee.partsIdentifiers.map((part) => ({
            partId: part,
          })),
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
        parts: true,
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
      .map((part) => part.id)
      .filter((part): part is string => typeof part === "string");

    const motorcycles = await prisma.motorcycle.findMany({
      where: {
        guaranteeId: guaranteeDatabase.id,
      },
    });

    const motorcyclesValue = motorcycles
      .map((motorcycle) => motorcycle.id)
      .filter(
        (motorcycle): motorcycle is string => typeof motorcycle === "string"
      );

    const guarantee = Guarantee.from(
      guaranteeDatabase.id,
      guaranteeDatabase.name,
      guaranteeDatabase.durationInMonths,
      guaranteeDatabase.coveredAmount,
      partsValue,
      motorcyclesValue,
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
        parts: true,
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
      .map((part) => part.id)
      .filter((part): part is string => typeof part === "string");

    const motorcycles = await prisma.motorcycle.findMany({
      where: {
        guaranteeId: guaranteeDatabase.id,
      },
    });

    const motorcyclesValue = motorcycles
      .map((motorcycle) => motorcycle.id)
      .filter(
        (motorcycle): motorcycle is string => typeof motorcycle === "string"
      );

    const guarantee = Guarantee.from(
      guaranteeDatabase.id,
      guaranteeDatabase.name,
      guaranteeDatabase.durationInMonths,
      guaranteeDatabase.coveredAmount,
      partsValue,
      motorcyclesValue,
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
        parts: true,
      },
    });

    if (!guaranteesDatabase) {
      return [];
    }

    const guarantees: Guarantee[] = [];

    for (const guarantee of guaranteesDatabase) {
      const parts = await prisma.part.findMany({
        where: {
          id: guarantee.id,
        },
      });

      const partsValue = parts
        .map((part) => part.id)
        .filter((part): part is string => typeof part === "string");

      const motorcycles = await prisma.motorcycle.findMany({
        where: {
          guaranteeId: guarantee.id,
        },
      });

      const motorcyclesValue = motorcycles
        .map((motorcycle) => motorcycle.id)
        .filter(
          (motorcycle): motorcycle is string => typeof motorcycle === "string"
        );

      const guaranteeData = Guarantee.from(
        guarantee.id,
        guarantee.name,
        guarantee.durationInMonths,
        guarantee.coveredAmount,
        partsValue,
        motorcyclesValue,
        guarantee.createdAt,
        guarantee.updatedAt
      );

      if (guaranteeData instanceof Error) {
        throw guaranteeData;
      }

      guarantees.push(guaranteeData);
    }

    return guarantees;
  }

  async delete(guarantee: Guarantee): Promise<void> {
    await prisma.guaranteePart.deleteMany({
      where: {
        guaranteeId: guarantee.identifier,
      },
    });

    await prisma.guarantee.delete({
      where: {
        id: guarantee.identifier,
      },
    });
  }
}
