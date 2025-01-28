import { CreateDriverUsecase } from "@application/usecases/driver/CreateDriverUsecase";
import { DeleteDriverUsecase } from "@application/usecases/driver/DeleteDriverUsecase";
import { GetDriverUsecase } from "@application/usecases/driver/GetDriverUsecase";
import { ListDriversByCompanyUsecase } from "@application/usecases/driver/ListDriversByCompanyUsecase";
import { UpdateDriverUsecase } from "@application/usecases/driver/UpdateDriverUsecase";
import { Driver } from "@domain/entities/Driver";
import {
  PostgresCompanyRepository,
  PostgresDriverRepository,
} from "@infrastructure/repositories/postgres";
import { Injectable } from "@nestjs/common";
import { CreateDriverDto, UpdateDriverDto } from "./drivers.dto";

@Injectable()
export class DriversService {
  private readonly companyRepopository: PostgresCompanyRepository;
  private readonly driverRepository: PostgresDriverRepository;
  private readonly listDriversByCompanyUsecase: ListDriversByCompanyUsecase;
  private readonly getDriverUsecase: GetDriverUsecase;
  private readonly createDriverUsecase: CreateDriverUsecase;
  private readonly updateDriverUsecase: UpdateDriverUsecase;
  private readonly deleteDriverUsecase: DeleteDriverUsecase;

  constructor() {
    this.driverRepository = new PostgresDriverRepository();
    this.listDriversByCompanyUsecase = new ListDriversByCompanyUsecase(
      this.driverRepository,
      this.companyRepopository,
    );
    this.getDriverUsecase = new GetDriverUsecase(this.driverRepository);
    this.createDriverUsecase = new CreateDriverUsecase(
      this.driverRepository,
      this.companyRepopository,
    );
    this.updateDriverUsecase = new UpdateDriverUsecase(
      this.driverRepository,
      this.companyRepopository,
    );
    this.deleteDriverUsecase = new DeleteDriverUsecase(
      this.driverRepository,
      this.companyRepopository,
    );
  }

  async findAllByCompany(companyIdentifier: string) {
    return await this.listDriversByCompanyUsecase.execute(companyIdentifier);
  }

  async findOne(identifier: string) {
    return await this.getDriverUsecase.execute(identifier);
  }

  async create(createDriverDto: CreateDriverDto, companyIdentifier: string) {
    const driver = Driver.create(
      createDriverDto.name,
      createDriverDto.license,
      createDriverDto.numberOfYearsOfExperience,
      createDriverDto.companyIdentifier,
    );

    if (driver instanceof Error) {
      throw driver;
    }

    await this.createDriverUsecase.execute(driver, companyIdentifier);
  }

  async update(
    identifier: string,
    updateDriverDto: UpdateDriverDto,
    companyIdentifier: string,
  ) {
    const existingDriver = await this.getDriverUsecase.execute(identifier);

    const updatedDriver = Driver.from(
      identifier,
      updateDriverDto.name,
      updateDriverDto.license,
      updateDriverDto.numberOfYearsOfExperience,
      updateDriverDto.companyIdentifier,
      existingDriver.createdAt,
      new Date(),
    );

    if (updatedDriver instanceof Error) {
      throw updatedDriver;
    }

    await this.updateDriverUsecase.execute(updatedDriver, companyIdentifier);
  }

  async remove(identifier: string, companyIdentifier: string) {
    return await this.deleteDriverUsecase.execute(
      identifier,
      companyIdentifier,
    );
  }
}
