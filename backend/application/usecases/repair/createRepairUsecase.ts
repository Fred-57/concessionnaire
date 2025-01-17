import { RepairRepository } from "@application/repositories/RepairRepository";
import { RepairCostLessThanZeroError } from "@domain/errors/repair/RepairCostLessThanZero";
import { RepairReplacedPartsNotFound } from "@domain/errors/repair/RepairReplacedPartsNotFound";
import { DateBehindNowError } from "@domain/errors/DateBehindNowError";
import { Usecase } from "../Usecase";
import { Repair } from "@domain/entities/Repair";

export class CreateRepairUsecase implements Usecase {
  public constructor(private readonly repairRepository: RepairRepository) {}

  public async execute(repair: Repair) {
    if (repair.cost < 0) {
      throw new RepairCostLessThanZeroError();
    }

    if (repair.replacedParts.length === 0) {
      throw new RepairReplacedPartsNotFound();
    }

    if (repair.date < new Date()) {
      throw new DateBehindNowError();
    }

    await this.repairRepository.save(repair);
  }
}
