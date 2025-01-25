import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { PrismaClient } from "@prisma/client";
import { Guarantee } from "@domain/entities/Guarantee";
import { Part } from "@domain/entities/Part";
import { randomUUID } from "crypto";
import { Motorcycle } from "@domain/entities/Motorcycle";

const prisma = new PrismaClient();

export class PostgresGuaranteeRepository implements GuaranteeRepository {
  async save(guarantee: Guarantee): Promise<void> {
    console.log(guarantee);
    await prisma.guarantee.create({
      data: {
        id: guarantee.identifier,
        name: guarantee.name.value,
        durationInMonths: guarantee.durationInMonths.value,
        coveredAmount: guarantee.coveredAmount.value,
        parts: {
          create: guarantee.parts.map((part) => ({
            partId: part.identifier,
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
          create: guarantee.parts.map((part) => ({
            partId: part.identifier,
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

    const motorcycles = await prisma.motorcycle.findMany({
      where: {
        guaranteeId: guaranteeDatabase.id,
      },
    });

    const motorcyclesValue = motorcycles.map((motorcycle) =>
      Motorcycle.from(
        motorcycle.id,
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

    const motorcycles = await prisma.motorcycle.findMany({
      where: {
        guaranteeId: guaranteeDatabase.id,
      },
    });

    const motorcyclesValue = motorcycles.map((motorcycle) =>
      Motorcycle.from(
        motorcycle.id,
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

      const motorcycles = await prisma.motorcycle.findMany({
        where: {
          guaranteeId: guarantee.id,
        },
      });

      const motorcyclesValue = motorcycles.map((motorcycle) =>
        Motorcycle.from(
          motorcycle.id,
          motorcycle.mileage,
          motorcycle.dateOfCommissioning,
          motorcycle.status,
          motorcycle.modelId,
          motorcycle.guaranteeId,
          motorcycle.createdAt,
          motorcycle.updatedAt
        )
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
