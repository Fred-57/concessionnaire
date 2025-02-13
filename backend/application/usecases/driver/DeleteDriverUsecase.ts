import { DriverRepository } from "@application/repositories/DriverRepository";
import { Driver } from "@domain/entities/Driver";
import { Usecase } from "../Usecase";
import { DriverNotFoundError } from "@domain/errors/driver/DriverNotFoundError";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";

export class DeleteDriverUsecase implements Usecase<Driver> {
  public constructor(
    private readonly driverRepository: DriverRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  public async execute(identifier: string, companyIdentifier: string) {
    const company =
      await this.companyRepository.findByIdentifier(companyIdentifier);

    if (!company) {
      throw new CompanyNotFoundError();
    }

    const driver = await this.driverRepository.findByIdentifier(identifier);

    if (!driver) {
      throw new DriverNotFoundError();
    }

    await this.driverRepository.delete(driver);
  }
}
