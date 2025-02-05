import { Module } from "@nestjs/common";
import { MotorcyclesController } from "./motorcycles.controller";
import { MotorcyclesService } from "./motorcycles.service";
import { MongoMotorcycleRepository } from "@infrastructure/repositories/mongodb";
import { PostgresMotorcycleRepository } from "@infrastructure/repositories/postgres";

@Module({
  controllers: [MotorcyclesController],
  providers: [
    MotorcyclesService,
    MongoMotorcycleRepository,
    PostgresMotorcycleRepository,
  ],
})
export class MotorcyclesModule {}
