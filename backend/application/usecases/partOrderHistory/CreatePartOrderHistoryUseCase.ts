import { PartRepository } from "@application/repositories/PartRepository";
import { PartOrderHistory } from "../../../domain/entities/PartOrderHistory";
import { PartOrderHistoryRepository } from "../../repositories/PartOrderHistoryRepository";
import { Usecase } from "../Usecase";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";

export class CreatePartOrderHistoryUsecase
  implements Usecase<PartOrderHistory>
{
  public constructor(
    private readonly partOrderHistoryRepository: PartOrderHistoryRepository,
    private readonly partRepository: PartRepository
  ) {}

  public async execute(partOrderHistory: PartOrderHistory) {
    const part = await this.partRepository.findByIdentifier(
      partOrderHistory.partIdentifier.value
    );

    if (!part) {
      throw new PartNotFoundError();
    }

    const cost = partOrderHistory.quantity.value * part.cost.value;

    const partOrderHistoryWithCost = PartOrderHistory.create(
      partOrderHistory.date.value,
      partOrderHistory.partIdentifier.value,
      partOrderHistory.quantity.value,
      cost
    );

    if (partOrderHistoryWithCost instanceof Error) {
      throw partOrderHistoryWithCost;
    }

    await this.partOrderHistoryRepository.save(partOrderHistoryWithCost);
  }
}
