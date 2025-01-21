import { DriverNameTooShortError } from "@domain/errors/driver/DriverNameTooShortError";
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateDriverDto, UpdateDriverDto } from "./drivers.dto";
import { DriversService } from "./drivers.service";

@Controller("drivers")
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  async findAll() {
    return await this.driversService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const driver = await this.driversService.findOne(id);

    if (!driver) {
      throw new NotFoundException("Driver not found");
    }

    return driver;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDriverDto: CreateDriverDto) {
    try {
      await this.driversService.create(createDriverDto);
    } catch (error) {
      if (error instanceof DriverNameTooShortError) {
        throw new UnprocessableEntityException("Driver name is too short");
      }
      throw error;
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    try {
      const driver = await this.driversService.findOne(id);

      if (!driver) {
        throw new NotFoundException("Driver not found");
      }

      await this.driversService.update(id, updateDriverDto);
    } catch (error) {
      if (error instanceof DriverNameTooShortError) {
        throw new UnprocessableEntityException("Driver name is too short");
      }
      throw error;
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param("id") id: string) {
    const deleted = await this.driversService.remove(id);

    if (!deleted) {
      throw new NotFoundException("Driver not found");
    }
  }
}
