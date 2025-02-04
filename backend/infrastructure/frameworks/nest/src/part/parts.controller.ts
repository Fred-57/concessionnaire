import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from "@nestjs/common";
import { PartsService } from "./parts.service";
import { PartNotFoundError } from "@domain/errors/part/PartNotFoundError";
import { CreatePartDto, UpdatePartDto } from "./parts.dto";

@Controller("parts")
export class PartsController {
  constructor(private readonly partsService: PartsService) {}

  @Get()
  async findAll() {
    return this.partsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      return await this.partsService.findOne(id);
    } catch (error) {
      if (error instanceof PartNotFoundError) {
        throw new NotFoundException("Part not found");
      }
    }
  }

  @Post()
  async create(@Body() createPartDto: CreatePartDto) {
    try {
      return await this.partsService.create(createPartDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() updatePartDto: UpdatePartDto) {
    try {
      return await this.partsService.update(id, updatePartDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    try {
      return await this.partsService.delete(id);
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
    }
  }
}
