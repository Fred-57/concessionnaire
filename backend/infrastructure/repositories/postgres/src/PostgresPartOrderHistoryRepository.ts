import { PartOrderHistoryRepository } from "@application/repositories/PartOrderHistoryRepository";
import { PartOrderHistory } from "@domain/entities/PartOrderHistory";
import { PartOrderHistoryStatusEnum } from "@domain/types/PartOrderHistoryStatusEnum";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostgresPartOrderHistoryRepository
  implements PartOrderHistoryRepository
{
  async save(partOrderHistory: PartOrderHistory): Promise<void> {
    await prisma.partOrderHistory.create({
      data: {
        id: partOrderHistory.identifier,
        date: partOrderHistory.date.value,
        quantity: partOrderHistory.quantity.value,
        cost: partOrderHistory.cost,
        status: partOrderHistory.status,
        partId: partOrderHistory.partIdentifier.value,
      },
    });
  }

  async update(partOrderHistory: PartOrderHistory): Promise<void> {
    await prisma.partOrderHistory.update({
      where: { id: partOrderHistory.identifier },
      data: {
        date: partOrderHistory.date.value,
        quantity: partOrderHistory.quantity.value,
        cost: partOrderHistory.cost,
        status: partOrderHistory.status,
      },
    });
  }

  async findByIdentifier(identifier: string): Promise<PartOrderHistory | null> {
    const partOrderHistoryDatabase = await prisma.partOrderHistory.findUnique({
      where: { id: identifier },
    });

    if (!partOrderHistoryDatabase) {
      return null;
    }

    const partOrderHistory = PartOrderHistory.from(
      partOrderHistoryDatabase.id,
      partOrderHistoryDatabase.date,
      partOrderHistoryDatabase.quantity,
      partOrderHistoryDatabase.cost,
      partOrderHistoryDatabase.status as PartOrderHistoryStatusEnum,
      partOrderHistoryDatabase.partId,
      partOrderHistoryDatabase.createdAt,
      partOrderHistoryDatabase.updatedAt
    );

    if (partOrderHistory instanceof Error) {
      throw partOrderHistory;
    }

    return partOrderHistory;
  }

  async findAll(): Promise<PartOrderHistory[]> {
    const partOrderHistoriesDatabase = await prisma.partOrderHistory.findMany();
    return partOrderHistoriesDatabase.map((partOrderHistoryDatabase) => {
      const partOrderHistory = PartOrderHistory.from(
        partOrderHistoryDatabase.id,
        partOrderHistoryDatabase.date,
        partOrderHistoryDatabase.quantity,
        partOrderHistoryDatabase.cost,
        partOrderHistoryDatabase.status as PartOrderHistoryStatusEnum,
        partOrderHistoryDatabase.partId,
        partOrderHistoryDatabase.createdAt,
        partOrderHistoryDatabase.updatedAt
      );

      if (partOrderHistory instanceof Error) {
        throw partOrderHistory;
      }

      return partOrderHistory;
    });
  }

  async delete(partOrderHistory: PartOrderHistory): Promise<void> {
    await prisma.partOrderHistory.delete({
      where: { id: partOrderHistory.identifier },
    });
  }
}
