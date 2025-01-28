import { CompanyNotFoundError } from "@domain/errors/company/CompanyNotFoundError";
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateCompanyDto, UpdateCompanyDto } from "./companies.dto";
import { CompaniesService } from "./companies.service";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll() {
    return await this.companiesService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      return await this.companiesService.findOne(id);
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException("Company not found");
      }
    }
  }

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      return await this.companiesService.create(createCompanyDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      return await this.companiesService.update(id, updateCompanyDto);
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException("Company not found");
      }
      if (error instanceof Error) {
        throw new UnprocessableEntityException(error.name);
      }
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      return await this.companiesService.remove(id);
    } catch (error) {
      if (error instanceof CompanyNotFoundError) {
        throw new NotFoundException("Company not found");
      }
    }
  }
}
