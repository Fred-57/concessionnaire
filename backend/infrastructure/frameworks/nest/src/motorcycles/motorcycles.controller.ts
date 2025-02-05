import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { MotorcyclesService } from "./motorcycles.service";
import { CreateMotorcycleDto, UpdateMotorcycleDto } from "./motorcycles.dto";
import { MotorcycleNotFoundError } from "@domain/errors/MotorcycleNotFoundError";
@Controller("motorcycles")
export class MotorcyclesController {
  constructor(private readonly motorcyclesService: MotorcyclesService) {}

  @Get()
  async findAll(@Param("companyIdentifier") companyIdentifier: string) {
    return this.motorcyclesService.findAll(companyIdentifier);
  }

  @Get(":identifier")
  async findOne(@Param("identifier") identifier: string) {
    try {
      return await this.motorcyclesService.findOne(identifier);
    } catch (error) {
      if (error instanceof MotorcycleNotFoundError) {
        throw new NotFoundException("Motorcycle not found");
      }
    }
  }

  @Post()
  async create(@Body() createMotorcycleDto: CreateMotorcycleDto) {
    try {
      return await this.motorcyclesService.create(createMotorcycleDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Put(":identifier")
  async update(
    @Param("identifier") identifier: string,
    @Body() updateMotorcycleDto: UpdateMotorcycleDto,
  ) {
    try {
      return await this.motorcyclesService.update(
        identifier,
        updateMotorcycleDto,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Delete(":identifier")
  async delete(@Param("identifier") identifier: string) {
    try {
      return await this.motorcyclesService.delete(identifier);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }
}
