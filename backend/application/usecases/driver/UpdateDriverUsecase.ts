import { Driver } from "@domain/entities/Driver";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { Usecase } from "../Usecase";
import { DriverNotFoundError } from "@domain/errors/driver/DriverNotFoundError";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";
import { DriverNameAlreadyTakenError } from "@domain/errors/driver/DriverNameAlreadyTakenError";

export class UpdateDriverUsecase implements Usecase<Driver> {
  public constructor(
    private readonly driverRepository: DriverRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  public async execute(driver: Driver, companyIdentifier: string) {
    const company =
      await this.companyRepository.findByIdentifier(companyIdentifier);

    if (!company) {
      throw new CompanyNotFoundError();
    }

    const driverExists = await this.driverRepository.findByIdentifier(
      driver.identifier
    );

    if (!driverExists) {
      throw new DriverNotFoundError();
    }

    const nameExists = await this.driverRepository.findByName(
      driver.name.value,
      company
    );

    if (nameExists && nameExists.identifier !== driver.identifier) {
      throw new DriverNameAlreadyTakenError();
    }

    await this.driverRepository.update(driver, company);
  }
}
