import { CreateDriverUsecase } from "@application/usecases/driver/CreateDriverUsecase";
import { DeleteDriverUsecase } from "@application/usecases/driver/DeleteDriverUsecase";
import { GetDriverUsecase } from "@application/usecases/driver/GetDriverUsecase";
import { ListDriversUsecase } from "@application/usecases/driver/ListDriversUsecase";
import { UpdateDriverUsecase } from "@application/usecases/driver/UpdateDriverUsecase";
import { Driver } from "@domain/entities/Driver";
import { MongoDriverRepository } from "@infrastructure/repositories/mongodb";
import { Injectable } from "@nestjs/common";
import { CreateDriverDto, UpdateDriverDto } from "./drivers.dto";

@Injectable()
export class DriversService {
  private readonly driverRepository: MongoDriverRepository;
  private readonly listDriversUsecase: ListDriversUsecase;
  private readonly getDriverUsecase: GetDriverUsecase;
  private readonly createDriverUsecase: CreateDriverUsecase;
  private readonly updateDriverUsecase: UpdateDriverUsecase;
  private readonly deleteDriverUsecase: DeleteDriverUsecase;

  constructor() {
    this.driverRepository = new MongoDriverRepository();
    this.listDriversUsecase = new ListDriversUsecase(this.driverRepository);
    this.getDriverUsecase = new GetDriverUsecase(this.driverRepository);
    this.createDriverUsecase = new CreateDriverUsecase(this.driverRepository);
    this.updateDriverUsecase = new UpdateDriverUsecase(this.driverRepository);
    this.deleteDriverUsecase = new DeleteDriverUsecase(this.driverRepository);
  }

  async findAll() {
    return await this.listDriversUsecase.execute();
  }

  async findOne(identifier: string) {
    return await this.getDriverUsecase.execute(identifier);
  }

  async create(createDriverDto: CreateDriverDto) {
    const driver = Driver.create(
      createDriverDto.name,
      createDriverDto.license,
      createDriverDto.numberOfYearsOfExperience,
    );
    await this.createDriverUsecase.execute(driver);
  }

  async update(identifier: string, updateDriverDto: UpdateDriverDto) {
    const existingDriver = await this.getDriverUsecase.execute(identifier);

    if (!existingDriver) {
      return false;
    }

    const updatedDriver = Driver.from(
      existingDriver.identifier,
      updateDriverDto.name,
      updateDriverDto.license,
      updateDriverDto.numberOfYearsOfExperience,
      existingDriver.createdAt,
      existingDriver.updatedAt,
    );

    await this.updateDriverUsecase.execute(updatedDriver);
    return true;
  }

  async remove(identifier: string) {
    const driver = await this.getDriverUsecase.execute(identifier);

    if (!driver) {
      return false;
    }

    await this.deleteDriverUsecase.execute(identifier);
    return true;
  }
}
