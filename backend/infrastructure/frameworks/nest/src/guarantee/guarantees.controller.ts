import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Body,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateGuaranteeDto, UpdateGuaranteeDto } from "./guarentees.dto";
import { GuaranteesService } from "./guarantees.service";
@Controller("guarantees")
export class GuaranteesController {
  constructor(private readonly guaranteesService: GuaranteesService) {}

  @Get()
  async findAll() {
    return this.guaranteesService.findAll();
  }

  @Get(":identifier")
  async findOne(@Param("identifier") identifier: string) {
    return this.guaranteesService.findOne(identifier);
  }

  @Post()
  async create(@Body() createGuaranteeDto: CreateGuaranteeDto) {
    try {
      return await this.guaranteesService.create(createGuaranteeDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }

  @Put(":identifier")
  async update(
    @Param("identifier") identifier: string,
    @Body() updateGuaranteeDto: UpdateGuaranteeDto,
  ) {
    try {
      return await this.guaranteesService.update(
        identifier,
        updateGuaranteeDto,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }

  @Delete(":identifier")
  async delete(@Param("identifier") identifier: string) {
    try {
      return await this.guaranteesService.delete(identifier);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.message);
      }
    }
  }
}
