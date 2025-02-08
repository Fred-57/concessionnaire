import { BreakdownRepository } from "@application/repositories/BreakdownRepository";
import { Breakdown } from "@domain/entities/Breakdown";
import { PrismaClient } from "@prisma/client";
import { PostgresPartRepository } from "./PostgresPartRepository";
import { BreakdownPartType } from "@domain/types/BreakdownPartType";
const prisma = new PrismaClient();

export class PostgresBreakdownRepository implements BreakdownRepository {
  async save(breakdown: Breakdown): Promise<void> {
    await prisma.breakdown.create({
      data: {
        id: breakdown.identifier,
        date: breakdown.date.value,
        description: breakdown.description,
        rental: {
          connect: {
            id: breakdown.rentalIdentifier,
          },
        },
        status: breakdown.status,
        totalCost: breakdown.totalCost.value,
        createdAt: breakdown.createdAt,
        updatedAt: breakdown.updatedAt,
        parts: {
          create: breakdown.parts.map((part) => ({
            partId: part.part.identifier,
            quantity: part.quantity,
          })),
        },
      },
    });
  }

  async update(breakdown: Breakdown): Promise<void> {
    await prisma.breakdown.update({
      where: { id: breakdown.identifier },
      data: {
        date: breakdown.date.value,
        description: breakdown.description,
        rental: {
          connect: {
            id: breakdown.rentalIdentifier,
          },
        },
        status: breakdown.status,
        totalCost: breakdown.totalCost.value,
        updatedAt: breakdown.updatedAt,
        parts: {
          deleteMany: {
            breakdownId: breakdown.identifier,
          },
          create: breakdown.parts.map((part) => ({
            partId: part.part.identifier,
            quantity: part.quantity,
          })),
        },
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<Breakdown | null> {
    const breakdownDatabase = await prisma.breakdown.findUnique({
      where: { id: identifier },
      include: {
        parts: {
          include: { part: true },
        },
      },
    });

    if (!breakdownDatabase) {
      return null;
    }

    const breakdownParts: BreakdownPartType[] = [];

    for (const breakdownPart of breakdownDatabase.parts) {
      const linkedPart = await new PostgresPartRepository().findByIdentifier(
        breakdownPart.part.id
      );

      if (!linkedPart) {
        return null;
      }

      breakdownParts.push({
        part: linkedPart,
        quantity: breakdownPart.quantity,
      });
    }

    const breakdown = Breakdown.from(
      breakdownDatabase.id,
      breakdownDatabase.date,
      breakdownDatabase.description,
      breakdownDatabase.rentalId,
      breakdownParts,
      breakdownDatabase.status,
      breakdownDatabase.createdAt,
      breakdownDatabase.updatedAt
    );

    if (breakdown instanceof Error) {
      return null;
    }

    return breakdown;
  }

  async findByRentalIdentifier(rentalIdentifier: string): Promise<Breakdown[]> {
    const breakdownsDatabase = await prisma.breakdown.findMany({
      where: { rentalId: rentalIdentifier },
      include: {
        parts: {
          include: { part: true },
        },
      },
    });

    const breakdowns: Breakdown[] = [];

    for (const breakdownDatabase of breakdownsDatabase) {
      const breakdownParts: BreakdownPartType[] = [];

      for (const breakdownPart of breakdownDatabase.parts) {
        const linkedPart = await new PostgresPartRepository().findByIdentifier(
          breakdownPart.part.id
        );

        if (!linkedPart) {
          return [];
        }

        breakdownParts.push({
          part: linkedPart,
          quantity: breakdownPart.quantity,
        });
      }

      const breakdown = Breakdown.from(
        breakdownDatabase.id,
        breakdownDatabase.date,
        breakdownDatabase.description,
        breakdownDatabase.rentalId,
        breakdownParts,
        breakdownDatabase.status,
        breakdownDatabase.createdAt,
        breakdownDatabase.updatedAt
      );

      if (breakdown instanceof Error) {
        return [];
      }

      breakdowns.push(breakdown);
    }

    return breakdowns;
  }

  async findByRentalIdentifierAndDate(
    rentalIdentifier: string,
    date: Date
  ): Promise<Breakdown | null> {
    const breakdownDatabase = await prisma.breakdown.findFirst({
      where: { rentalId: rentalIdentifier, date: date },
      include: {
        parts: {
          include: { part: true },
        },
      },
    });

    if (!breakdownDatabase) {
      return null;
    }

    const breakdownParts: BreakdownPartType[] = [];

    for (const breakdownPart of breakdownDatabase.parts) {
      const linkedPart = await new PostgresPartRepository().findByIdentifier(
        breakdownPart.part.id
      );

      if (!linkedPart) {
        return null;
      }

      breakdownParts.push({
        part: linkedPart,
        quantity: breakdownPart.quantity,
      });
    }

    const breakdown = Breakdown.from(
      breakdownDatabase.id,
      breakdownDatabase.date,
      breakdownDatabase.description,
      breakdownDatabase.rentalId,
      breakdownParts,
      breakdownDatabase.status,
      breakdownDatabase.createdAt,
      breakdownDatabase.updatedAt
    );

    if (breakdown instanceof Error) {
      return null;
    }

    return breakdown;
  }

  async findAllByDriverIdentifier(
    driverIdentifier: string
  ): Promise<Breakdown[]> {
    const breakdownsDatabase = await prisma.breakdown.findMany({
      where: {
        rental: {
          driverId: driverIdentifier,
        },
      },
      include: {
        parts: {
          include: { part: true },
        },
      },
    });

    const breakdowns: Breakdown[] = [];

    for (const breakdownDatabase of breakdownsDatabase) {
      const breakdownParts: BreakdownPartType[] = [];

      for (const breakdownPart of breakdownDatabase.parts) {
        const linkedPart = await new PostgresPartRepository().findByIdentifier(
          breakdownPart.part.id
        );

        if (!linkedPart) {
          return [];
        }

        breakdownParts.push({
          part: linkedPart,
          quantity: breakdownPart.quantity,
        });
      }

      const breakdown = Breakdown.from(
        breakdownDatabase.id,
        breakdownDatabase.date,
        breakdownDatabase.description,
        breakdownDatabase.rentalId,
        breakdownParts,
        breakdownDatabase.status,
        breakdownDatabase.createdAt,
        breakdownDatabase.updatedAt
      );

      if (breakdown instanceof Error) {
        return [];
      }

      breakdowns.push(breakdown);
    }

    return breakdowns;
  }

  async findAll(): Promise<Breakdown[]> {
    const breakdownsDatabase = await prisma.breakdown.findMany({
      include: {
        parts: {
          include: { part: true },
        },
      },
    });

    const breakdowns: Breakdown[] = [];

    for (const breakdownDatabase of breakdownsDatabase) {
      const breakdownParts: BreakdownPartType[] = [];

      for (const breakdownPart of breakdownDatabase.parts) {
        const linkedPart = await new PostgresPartRepository().findByIdentifier(
          breakdownPart.part.id
        );

        if (!linkedPart) {
          return [];
        }

        breakdownParts.push({
          part: linkedPart,
          quantity: breakdownPart.quantity,
        });
      }

      const breakdown = Breakdown.from(
        breakdownDatabase.id,
        breakdownDatabase.date,
        breakdownDatabase.description,
        breakdownDatabase.rentalId,
        breakdownParts,
        breakdownDatabase.status,
        breakdownDatabase.createdAt,
        breakdownDatabase.updatedAt
      );

      if (breakdown instanceof Error) {
        return [];
      }

      breakdowns.push(breakdown);
    }

    return breakdowns;
  }

  async delete(breakdown: Breakdown): Promise<void> {
    await prisma.breakdownPart.deleteMany({
      where: { breakdownId: breakdown.identifier },
    });

    await prisma.breakdown.delete({
      where: { id: breakdown.identifier },
    });
  }

  async findPartQuantityByBreakdownIdentifierAndPartIdentifier(
    breakdownIdentifier: string,
    partIdentifier: string
  ): Promise<number | null> {
    const breakdownPart = await prisma.breakdownPart.findFirst({
      where: { breakdownId: breakdownIdentifier, partId: partIdentifier },
    });

    if (!breakdownPart) {
      return null;
    }

    return breakdownPart.quantity;
  }
}
