import { MongoDriverRepository } from "@infrastructure/repositories/mongodb";
import { PostgresDriverRepository } from "@infrastructure/repositories/postgres";
import { Module } from "@nestjs/common";
import { DriversController } from "./drivers.controller";
import { DriversService } from "./drivers.service";

@Module({
  controllers: [DriversController],
  providers: [DriversService, MongoDriverRepository, PostgresDriverRepository],
})
export class DriversModule {}
