import { Module } from "@nestjs/common";
import { PartsController } from "./parts.controller";
import { PartsService } from "./parts.service";
import { MongoPartRepository } from "@infrastructure/repositories/mongodb";
import { PostgresPartRepository } from "@infrastructure/repositories/postgres";

@Module({
  controllers: [PartsController],
  providers: [PartsService, MongoPartRepository, PostgresPartRepository],
})
export class PartsModule {}
