import { Driver } from "../../../domain/entities/Driver";
import { DriverRepository } from "../../repositories/DriverRepository";
import { Usecase } from "../Usecase";

export class CreateDriverUsecase implements Usecase<Driver> {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute(driver: Driver) {
    await this.driverRepository.save(driver);
  }
}

