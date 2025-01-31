import { PartOrderHistoryRepository } from "@application/repositories/PartOrderHistoryRepository";
import { PartOrderHistory } from "@domain/entities/PartOrderHistory";
import { PartOrderHistoryModel } from "./models/PartOrderHistoryModel";
import { PartOrderHistoryStatusEnum } from "@domain/types/PartOrderHistoryStatusEnum";

export class MongoPartOrderHistoryRepository
  implements PartOrderHistoryRepository
{
  async save(partOrderHistory: PartOrderHistory): Promise<void> {
    const partOrderHistoryDatabase = new PartOrderHistoryModel({
      identifier: partOrderHistory.identifier,
      date: partOrderHistory.date.value,
      quantity: partOrderHistory.quantity.value,
      cost: partOrderHistory.cost,
      status: partOrderHistory.status,
      partId: partOrderHistory.partIdentifier.value,
    });
    await partOrderHistoryDatabase.save();
  }

  async update(partOrderHistory: PartOrderHistory): Promise<void> {
    const partOrderHistoryDatabase = await PartOrderHistoryModel.findOne({
      identifier: partOrderHistory.identifier,
    });

    if (!partOrderHistoryDatabase) {
      return;
    }

    partOrderHistoryDatabase.date = partOrderHistory.date.value;
    partOrderHistoryDatabase.quantity = partOrderHistory.quantity.value;
    partOrderHistoryDatabase.cost = partOrderHistory.cost;
    partOrderHistoryDatabase.status = partOrderHistory.status;

    await partOrderHistoryDatabase.save();
  }

  async findByIdentifier(identifier: string): Promise<PartOrderHistory | null> {
    const partOrderHistoryDatabase = await PartOrderHistoryModel.findOne({
      identifier: identifier,
    });

    if (!partOrderHistoryDatabase) {
      return null;
    }

    const partOrderHistory = PartOrderHistory.from(
      partOrderHistoryDatabase.identifier,
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
    const partOrderHistoriesDatabase = await PartOrderHistoryModel.find();
    return partOrderHistoriesDatabase.map((partOrderHistoryDatabase) => {
      const partOrderHistory = PartOrderHistory.from(
        partOrderHistoryDatabase.identifier,
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
    await PartOrderHistoryModel.findOneAndDelete({
      identifier: partOrderHistory.identifier,
    }).exec();
  }
}
