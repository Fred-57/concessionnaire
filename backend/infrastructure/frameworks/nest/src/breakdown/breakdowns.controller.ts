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
      return await this.breakdownService.create(createBreakdownDto);
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
      return await this.breakdownService.update(identifier, updateBreakdownDto);
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
