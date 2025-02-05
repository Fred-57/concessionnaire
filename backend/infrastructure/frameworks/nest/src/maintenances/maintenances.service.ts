import { Injectable } from "@nestjs/common";
import {
  PostgresMaintenanceRepository,
  PostgresPartRepository,
} from "@infrastructure/repositories/postgres";
import { ListMaintenancesUsecase } from "@application/usecases/maintenance/ListMaintenanceUsecase";
import { GetMaintenanceUsecase } from "@application/usecases/maintenance/GetMaintenanceUsecase";
import { CreateMaintenanceUsecase } from "@application/usecases/maintenance/CreateMaintenanceUsecase";
import { UpdateMaintenanceUsecase } from "@application/usecases/maintenance/UpdateMaintenanceUsecase";
import { DeleteMaintenanceUsecase } from "@application/usecases/maintenance/DeleteMaintenanceUsecase";
import { Maintenance } from "@domain/entities/Maintenance";
import { CreateMaintenanceDto, UpdateMaintenanceDto } from "./maintenances.dto";
@Injectable()
export class MaintenancesService {
  private readonly maintenancesRepository: PostgresMaintenanceRepository;
  private readonly partsRepository: PostgresPartRepository;
  private readonly listMaintenancesUsecase: ListMaintenancesUsecase;
  private readonly getMaintenanceUsecase: GetMaintenanceUsecase;
  private readonly createMaintenanceUsecase: CreateMaintenanceUsecase;
  private readonly updateMaintenanceUsecase: UpdateMaintenanceUsecase;
  private readonly deleteMaintenanceUsecase: DeleteMaintenanceUsecase;

  constructor() {
    this.maintenancesRepository = new PostgresMaintenanceRepository();
    this.partsRepository = new PostgresPartRepository();
    this.listMaintenancesUsecase = new ListMaintenancesUsecase(
      this.maintenancesRepository,
    );
    this.getMaintenanceUsecase = new GetMaintenanceUsecase(
      this.maintenancesRepository,
    );
    this.createMaintenanceUsecase = new CreateMaintenanceUsecase(
      this.maintenancesRepository,
      this.partsRepository,
    );
    this.updateMaintenanceUsecase = new UpdateMaintenanceUsecase(
      this.maintenancesRepository,
      this.partsRepository,
    );
    this.deleteMaintenanceUsecase = new DeleteMaintenanceUsecase(
      this.maintenancesRepository,
    );
  }

  async findAll() {
    return this.listMaintenancesUsecase.execute();
  }

  async findOne(identifier: string) {
    return this.getMaintenanceUsecase.execute(identifier);
  }

  async create(createMaintenanceDto: CreateMaintenanceDto) {
    const maintenance = Maintenance.create(
      createMaintenanceDto.date,
      createMaintenanceDto.recommendation,
      createMaintenanceDto.motorcycleIdentifier,
      createMaintenanceDto.parts,
    );
    if (maintenance instanceof Error) {
      throw maintenance;
    }
    const maintenanceToCreate = Maintenance.from(
      maintenance.identifier,
      maintenance.date,
      maintenance.recommendation,
      maintenance.status,
      maintenance.totalCost,
      maintenance.motorcycleIdentifier,
      maintenance.parts,
      maintenance.createdAt,
      maintenance.updatedAt,
    );
    if (maintenanceToCreate instanceof Error) {
      throw maintenanceToCreate;
    }
    return this.createMaintenanceUsecase.execute(maintenanceToCreate);
  }

  async update(identifier: string, updateMaintenanceDto: UpdateMaintenanceDto) {
    const maintenance = await this.findOne(identifier);
    if (maintenance instanceof Error) {
      throw maintenance;
    }
    const updatedMaintenance = Maintenance.from(
      maintenance.identifier,
      updateMaintenanceDto.date,
      updateMaintenanceDto.recommendation,
      updateMaintenanceDto.status,
      updateMaintenanceDto.totalCost,
      updateMaintenanceDto.motorcycleIdentifier,
      updateMaintenanceDto.parts,
      maintenance.createdAt,
      new Date(),
    );
    if (updatedMaintenance instanceof Error) {
      throw updatedMaintenance;
    }
    return this.updateMaintenanceUsecase.execute(updatedMaintenance);
  }

  async delete(identifier: string) {
    return this.deleteMaintenanceUsecase.execute(identifier);
  }
}
