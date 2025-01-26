import { Driver } from "@domain/entities/Driver";
import { DriverRepository } from "@application/repositories/DriverRepository";
import { Usecase } from "../Usecase";
import { CompanyRepository } from "@application/repositories/CompanyRepository";
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";

export class ListDriversByCompanyUsecase implements Usecase<Driver[]> {
  public constructor(
    private readonly driverRepository: DriverRepository,
    private readonly companyRepository: CompanyRepository
  ) {}

  public async execute(companyIdentifier: string): Promise<Driver[]> {
    const company =
      await this.companyRepository.findByIdentifier(companyIdentifier);

    if (!company) {
      throw new CompanyNotFoundError();
    }

    const drivers = await this.driverRepository.findAllByCompany(company);
    return drivers;
  }
}
