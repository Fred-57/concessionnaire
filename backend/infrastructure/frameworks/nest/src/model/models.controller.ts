import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Body,
} from "@nestjs/common";
import { ModelsService } from "./models.service";
import { CreateModelDto, UpdateModelDto } from "./models.dto";

@Controller("models")
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  async findAll() {
    return this.modelsService.findAll();
  }

  @Get(":identifier")
  async findOne(@Param("identifier") identifier: string) {
    return this.modelsService.findOne(identifier);
  }

  @Post()
  async create(@Body() createModelDto: CreateModelDto) {
    return this.modelsService.create(createModelDto);
  }

  @Put(":identifier")
  async update(
    @Param("identifier") identifier: string,
    @Body() updateModelDto: UpdateModelDto,
  ) {
    return this.modelsService.update(identifier, updateModelDto);
  }

  @Delete(":identifier")
  async delete(@Param("identifier") identifier: string) {
    return this.modelsService.delete(identifier);
  }
}
