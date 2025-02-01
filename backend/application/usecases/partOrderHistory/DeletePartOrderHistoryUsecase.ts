import { PartOrderHistory } from "../../../domain/entities/PartOrderHistory";
import { PartOrderHistoryRepository } from "../../repositories/PartOrderHistoryRepository";
import { Usecase } from "../Usecase";

export class DeletePartOrderHistoryUsecase
  implements Usecase<PartOrderHistory>
{
  public constructor(
    private readonly partOrderHistoryRepository: PartOrderHistoryRepository
  ) {}

  public async execute(partOrderHistory: PartOrderHistory) {
    await this.partOrderHistoryRepository.delete(partOrderHistory);
  }
}
