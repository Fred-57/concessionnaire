import { PartOrderHistory } from "../../../domain/entities/PartOrderHistory";
import { PartOrderHistoryRepository } from "../../repositories/PartOrderHistoryRepository";
import { Usecase } from "../Usecase";

export class ListPartOrderHistoryUsecase
  implements Usecase<PartOrderHistory[]>
{
  public constructor(
    private readonly partOrderHistoryRepository: PartOrderHistoryRepository
  ) {}

  public async execute() {
    return await this.partOrderHistoryRepository.findAll();
  }
}
