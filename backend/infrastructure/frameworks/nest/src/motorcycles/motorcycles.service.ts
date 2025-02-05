import { PostgresMotorcycleRepository } from "@infrastructure/repositories/postgres";
import { Injectable } from "@nestjs/common";
import { ListMotorcyclesUsecase } from "@application/usecases/motorcycle/ListMotorcyclesUsecase";
import { GetMotorcycleUsecase } from "@application/usecases/motorcycle/GetMotorcycleUsecase";
import { CreateMotorcycleUsecase } from "@application/usecases/motorcycle/CreateMotorcycleUsecase";
import { UpdateMotorcycleUsecase } from "@application/usecases/motorcycle/UpdateMotorcycleUsecase";
import { DeleteMotorcycleUsecase } from "@application/usecases/motorcycle/DeleteMotorcycleUsecase";
import { CreateMotorcycleDto, UpdateMotorcycleDto } from "./motorcycles.dto";
import { Motorcycle } from "@domain/entities/Motorcycle";

@Injectable()
export class MotorcyclesService {
  private readonly motorcyclesRepository: PostgresMotorcycleRepository;
  private readonly listMotorcyclesUsecase: ListMotorcyclesUsecase;
  private readonly getMotorcycleUsecase: GetMotorcycleUsecase;
  private readonly createMotorcycleUsecase: CreateMotorcycleUsecase;
  private readonly updateMotorcycleUsecase: UpdateMotorcycleUsecase;
  private readonly deleteMotorcycleUsecase: DeleteMotorcycleUsecase;

  constructor() {
    this.motorcyclesRepository = new PostgresMotorcycleRepository();
    this.listMotorcyclesUsecase = new ListMotorcyclesUsecase(
      this.motorcyclesRepository,
    );
    this.getMotorcycleUsecase = new GetMotorcycleUsecase(
      this.motorcyclesRepository,
    );
    this.createMotorcycleUsecase = new CreateMotorcycleUsecase(
      this.motorcyclesRepository,
    );
    this.updateMotorcycleUsecase = new UpdateMotorcycleUsecase(
      this.motorcyclesRepository,
    );
    this.deleteMotorcycleUsecase = new DeleteMotorcycleUsecase(
      this.motorcyclesRepository,
    );
  }

  async findAll(companyIdentifier: string) {
    return this.listMotorcyclesUsecase.execute(companyIdentifier);
  }

  async findOne(identifier: string) {
    return this.getMotorcycleUsecase.execute(identifier);
  }

  async create(createMotorcycleDto: CreateMotorcycleDto) {
    const motorcycle = Motorcycle.create(
      createMotorcycleDto.identifier,
      createMotorcycleDto.mileage,
      createMotorcycleDto.dateOfCommissioning,
      createMotorcycleDto.status,
      createMotorcycleDto.companyIdentifier,
      createMotorcycleDto.modelIdentifier,
      createMotorcycleDto.guaranteeIdentifier,
      createMotorcycleDto.rentalIdentifiers,
      createMotorcycleDto.maintenanceIdentifiers,
    );

    if (motorcycle instanceof Error) {
      return motorcycle;
    }

    return this.createMotorcycleUsecase.execute(motorcycle);
  }

  async update(identifier: string, updateMotorcycleDto: UpdateMotorcycleDto) {
    const motorcycle = await this.findOne(identifier);

    if (motorcycle instanceof Error) {
      return motorcycle;
    }

    const updatedMotorcycle = Motorcycle.from(
      motorcycle.identifier,
      updateMotorcycleDto.mileage,
      updateMotorcycleDto.dateOfCommissioning,
      updateMotorcycleDto.status,
      motorcycle.companyIdentifier,
      updateMotorcycleDto.modelIdentifier,
      updateMotorcycleDto.guaranteeIdentifier,
      updateMotorcycleDto.rentalIdentifiers,
      updateMotorcycleDto.maintenanceIdentifiers,
      motorcycle.createdAt,
      new Date(),
    );

    if (updatedMotorcycle instanceof Error) {
      return updatedMotorcycle;
    }

    return this.updateMotorcycleUsecase.execute(updatedMotorcycle);
  }

  async delete(identifier: string) {
    const motorcycle = await this.findOne(identifier);
    return this.deleteMotorcycleUsecase.execute(motorcycle);
  }
}
