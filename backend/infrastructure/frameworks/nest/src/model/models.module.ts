import { Module } from "@nestjs/common";
import { ModelsController } from "./models.controller";
import { ModelsService } from "./models.service";
import { MongoModelRepository } from "@infrastructure/repositories/mongodb";
import { PostgresModelRepository } from "@infrastructure/repositories/postgres";

@Module({
  controllers: [ModelsController],
  providers: [ModelsService, MongoModelRepository, PostgresModelRepository],
})
export class ModelsModule {}
