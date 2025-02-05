import { Module } from "@nestjs/common";
import { MaintenancesController } from "./maintenances.controller";
import { MaintenancesService } from "./maintenances.service";
import { MongoMaintenanceRepository } from "@infrastructure/repositories/mongodb";
import { PostgresMaintenanceRepository } from "@infrastructure/repositories/postgres";
import { PostgresPartRepository } from "@infrastructure/repositories/postgres";
@Module({
  controllers: [MaintenancesController],
  providers: [
    MaintenancesService,
    MongoMaintenanceRepository,
    PostgresMaintenanceRepository,
    PostgresPartRepository,
  ],
})
export class MaintenancesModule {}
