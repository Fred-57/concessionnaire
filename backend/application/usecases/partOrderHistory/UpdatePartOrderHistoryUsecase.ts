import { PartRepository } from "@application/repositories/PartRepository";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { PartOrderHistory } from "../../../domain/entities/PartOrderHistory";
import { PartOrderHistoryRepository } from "../../repositories/PartOrderHistoryRepository";
import { Usecase } from "../Usecase";
import { Part } from "@domain/entities/Part";
export class UpdatePartOrderHistoryUsecase
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

    const partOrderHistoryWithCost = PartOrderHistory.from(
      partOrderHistory.identifier,
      partOrderHistory.date.value,
      partOrderHistory.quantity.value,
      cost,
      partOrderHistory.status,
      partOrderHistory.partIdentifier.value,
      partOrderHistory.createdAt,
      partOrderHistory.updatedAt
    );

    if (partOrderHistoryWithCost instanceof Error) {
      throw partOrderHistoryWithCost;
    }

    const updatedPart = Part.update(part, partOrderHistory.quantity.value);

    if (updatedPart instanceof Error) {
      throw updatedPart;
    }

    await this.partOrderHistoryRepository.update(partOrderHistoryWithCost);
    await this.partRepository.update(updatedPart);
  }
}
