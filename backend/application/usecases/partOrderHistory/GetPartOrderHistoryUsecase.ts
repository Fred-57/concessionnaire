import { PartOrderHistory } from "../../../domain/entities/PartOrderHistory";
import { PartOrderHistoryRepository } from "@application/repositories/PartOrderHistoryRepository";
import { PartOrderHistoryNotFoundError } from "@domain/errors/partOrderHistory/PartOrderHistoryNotFoundError";
import { Usecase } from "../Usecase";

export class GetPartOrderHistoryUsecase implements Usecase<PartOrderHistory> {
  public constructor(
    private readonly partOrderHistoryRepository: PartOrderHistoryRepository
  ) {}

  public async execute(identifier: string) {
    const partOrderHistoryExists =
      await this.partOrderHistoryRepository.findByIdentifier(identifier);

    if (!partOrderHistoryExists) {
      throw new PartOrderHistoryNotFoundError();
    }

    return partOrderHistoryExists;
  }
}
