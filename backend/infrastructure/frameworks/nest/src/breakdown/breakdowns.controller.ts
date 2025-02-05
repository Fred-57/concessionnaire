import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  Delete,
  BadRequestException,
} from "@nestjs/common";
import { BreakdownService } from "./breakdowns.service";
import { CreateBreakdownDto, UpdateBreakdownDto } from "./breakdowns.dto";
import { Breakdown } from "@domain/entities/Breakdown";
@Controller("breakdowns")
export class BreakdownController {
  constructor(private readonly breakdownService: BreakdownService) {}

  @Get()
  async findAll() {
    return this.breakdownService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.breakdownService.findOne(id);
  }

  @Post()
  async create(@Body() createBreakdownDto: CreateBreakdownDto) {
    try {
      const breakdown = Breakdown.from(
        createBreakdownDto.identifier,
        createBreakdownDto.date.value,
        createBreakdownDto.description,
        createBreakdownDto.rentalIdentifier,
        createBreakdownDto.parts,
        createBreakdownDto.status,
        new Date(),
        new Date(),
      );
      if (breakdown instanceof Error) {
        throw new BadRequestException(breakdown.message);
      }
      return await this.breakdownService.create(breakdown);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Put(":id")
  async update(
    @Param("id") identifier: string,
    @Body() updateBreakdownDto: UpdateBreakdownDto,
  ) {
    try {
      const breakdown = Breakdown.from(
        updateBreakdownDto.identifier,
        updateBreakdownDto.date.value,
        updateBreakdownDto.description,
        updateBreakdownDto.rentalIdentifier,
        updateBreakdownDto.parts,
        updateBreakdownDto.status,
        updateBreakdownDto.createdAt,
        new Date(),
      );
      if (breakdown instanceof Error) {
        throw new BadRequestException(breakdown.message);
      }
      return await this.breakdownService.update(identifier, breakdown);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    try {
      return await this.breakdownService.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
