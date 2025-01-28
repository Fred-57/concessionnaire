import { PostgresCompanyRepository } from "@infrastructure/repositories/postgres";
import { Injectable } from "@nestjs/common";
import { CreateCompanyUsecase } from "@application/usecases/company/CreateCompanyUsecase";
import { DeleteCompanyUsecase } from "@application/usecases/company/DeleteCompanyUsecase";
import { GetCompanyUsecase } from "@application/usecases/company/GetCompanyUsecase";
import { ListCompaniesUsecase } from "@application/usecases/company/ListCompaniesUsecase";
import { UpdateCompanyUsecase } from "@application/usecases/company/UpdateCompanyUsecase";
import { CreateCompanyDto } from "./companies.dto";
import { Company } from "@domain/entities/Company";
import { CompanyTypeEnum } from "@domain/types/CompanyTypeEnum";

@Injectable()
export class CompaniesService {
  private readonly companyRepository: PostgresCompanyRepository;
  private readonly listCompaniesUsecase: ListCompaniesUsecase;
  private readonly getCompanyUsecase: GetCompanyUsecase;
  private readonly createCompanyUsecase: CreateCompanyUsecase;
  private readonly updateCompanyUsecase: UpdateCompanyUsecase;
  private readonly deleteCompanyUsecase: DeleteCompanyUsecase;

  constructor() {
    this.companyRepository = new PostgresCompanyRepository();
    this.listCompaniesUsecase = new ListCompaniesUsecase(
      this.companyRepository,
    );
    this.getCompanyUsecase = new GetCompanyUsecase(this.companyRepository);
    this.createCompanyUsecase = new CreateCompanyUsecase(
      this.companyRepository,
    );
    this.updateCompanyUsecase = new UpdateCompanyUsecase(
      this.companyRepository,
    );
    this.deleteCompanyUsecase = new DeleteCompanyUsecase(
      this.companyRepository,
    );
  }

  async findAll() {
    return await this.listCompaniesUsecase.execute();
  }

  async findOne(identifier: string) {
    return await this.getCompanyUsecase.execute(identifier);
  }

  async create(createCompanyDto: CreateCompanyDto) {
    const company = Company.create(
      createCompanyDto.name,
      createCompanyDto.type as CompanyTypeEnum,
    );

    if (company instanceof Error) {
      return company;
    }

    await this.createCompanyUsecase.execute(company);
  }

  async update(identifier: string, createCompanyDto: CreateCompanyDto) {
    const existingCompany = await this.getCompanyUsecase.execute(identifier);

    const company = Company.from(
      existingCompany.identifier,
      createCompanyDto.name,
      createCompanyDto.type as CompanyTypeEnum,
      existingCompany.createdAt,
      new Date(),
    );

    if (company instanceof Error) {
      throw company;
    }

    await this.updateCompanyUsecase.execute(company);
  }

  async remove(identifier: string) {
    await this.deleteCompanyUsecase.execute(identifier);
  }
}
