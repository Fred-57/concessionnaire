import { Driver } from "@domain/entities/Driver";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { Usecase } from "../Usecase";

export class ListDriversUsecase implements Usecase<Driver[]> {
  public constructor(private readonly driverRepository: DriverRepository) {}

  public async execute() {
    const drivers = await this.driverRepository.findAll();
    return drivers;
  }
}
