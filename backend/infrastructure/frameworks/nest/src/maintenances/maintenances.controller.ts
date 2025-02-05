import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  NotFoundException,
  UnprocessableEntityException,
  Delete,
} from "@nestjs/common";
import { MaintenancesService } from "./maintenances.service";
import { CreateMaintenanceDto, UpdateMaintenanceDto } from "./maintenances.dto";
import { MaintenanceNotFoundError } from "@domain/errors/maintenance/MaintenanceNotFoundError";

@Controller("maintenances")
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  @Get()
  async findAll() {
    return this.maintenancesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      return await this.maintenancesService.findOne(id);
    } catch (error) {
      if (error instanceof MaintenanceNotFoundError) {
        throw new NotFoundException("Maintenance not found");
      }
    }
  }

  @Post()
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    try {
      return await this.maintenancesService.create(createMaintenanceDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateMaintenanceDto: UpdateMaintenanceDto,
  ) {
    try {
      return await this.maintenancesService.update(id, updateMaintenanceDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    try {
      return await this.maintenancesService.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }
}
