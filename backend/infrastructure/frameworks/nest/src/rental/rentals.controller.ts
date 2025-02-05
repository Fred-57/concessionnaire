import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Body,
  Put,
  Param,
  UnprocessableEntityException,
  Delete,
  Get,
} from "@nestjs/common";
import { RentalsService } from "./rentals.service";
import { CreateRentalDto, UpdateRentalDto } from "./rentals.dto";
import { Headers } from "@nestjs/common";

@Controller("rentals")
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRentalDto: CreateRentalDto) {
    try {
      await this.rentalsService.create(createRentalDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateRentalDto: UpdateRentalDto,
  ) {
    try {
      await this.rentalsService.update(id, updateRentalDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    try {
      await this.rentalsService.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      return await this.rentalsService.findOne(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }

  @Get()
  async findAll(@Headers("Company-Identifier") companyIdentifier: string) {
    try {
      return await this.rentalsService.findAll(companyIdentifier);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }
}
