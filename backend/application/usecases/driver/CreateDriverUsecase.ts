import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { Driver } from "../../../domain/entities/Driver";
import { DriverRepository } from "../../repositories/DriverRepository";
import { Usecase } from "../Usecase";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";
import { DriverNameAlreadyTakenError } from "@domain/errors/driver/DriverNameAlreadyTakenError";

export class CreateDriverUsecase implements Usecase<Driver> {
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

    const nameExists = await this.driverRepository.findByName(
      driver.name.value,
      company
    );

    if (nameExists) {
      throw new DriverNameAlreadyTakenError();
    }

    // if (driver.companyIdentifier !== companyIdentifier) {
    //   throw new NotCompanyAllowed();
    // }

    await this.driverRepository.save(driver, company);
  }
}
