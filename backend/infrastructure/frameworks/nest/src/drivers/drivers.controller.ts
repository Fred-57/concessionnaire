import { DriverNameTooShortError } from "@domain/errors/driver/DriverNameTooShortError";
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
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
import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";
import { DriverNameAlreadyTakenError } from "@domain/errors/driver/DriverNameAlreadyTakenError";
import { DriverNotFoundError } from "@domain/errors/driver/DriverNotFoundError";

@Controller("drivers")
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Get()
  async findAllByCompany(
    @Headers("Company-Identifier") companyIdentifier: string,
  ) {
    try {
      return await this.driversService.findAllByCompany(companyIdentifier);
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException("Company not found");
      }
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      return await this.driversService.findOne(id);
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException("Company not found");
      }
      if (error instanceof DriverNotFoundError) {
        throw new NotFoundException("Driver not found");
      }
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Headers("Company-Identifier") companyIdentifier: string,
    @Body() createDriverDto: CreateDriverDto,
  ) {
    try {
      await this.driversService.create(createDriverDto, companyIdentifier);
    } catch (error) {
      if (error instanceof DriverNameTooShortError) {
        throw new UnprocessableEntityException("Driver name is too short");
      }
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException("Company not found");
      }
      if (error instanceof DriverNameAlreadyTakenError) {
        throw new UnprocessableEntityException("Driver name already taken");
      }
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Headers("Company-Identifier") companyIdentifier: string,
    @Body() updateDriverDto: UpdateDriverDto,
  ) {
    try {
      await this.driversService.update(id, updateDriverDto, companyIdentifier);
    } catch (error) {
      if (error instanceof DriverNameTooShortError) {
        throw new UnprocessableEntityException("Driver name is too short");
      }
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException("Company not found");
      }
      if (error instanceof DriverNameAlreadyTakenError) {
        throw new UnprocessableEntityException("Driver name already taken");
      }
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Headers("Company-Identifier") companyIdentifier: string,
    @Param("id") id: string,
  ) {
    try {
      await this.driversService.remove(id, companyIdentifier);
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException("Company not found");
      }
      if (error instanceof DriverNotFoundError) {
        throw new NotFoundException("Driver not found");
      }
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }
}
