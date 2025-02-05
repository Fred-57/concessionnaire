import { Module } from "@nestjs/common";
import { DriversModule } from "./drivers/drivers.module";
import { CompaniesModule } from "./company/companies.module";
import { PartsModule } from "./part/parts.module";
import { BreakdownModule } from "./breakdown/breakdowns.module";
import { RentalsModule } from "./rental/rentals.module";
import { MotorcyclesModule } from "./motorcycles/motorcycle.module";
import { ModelsModule } from "./model/models.module";
import { MaintenancesModule } from "./maintenances/maintenances.module";
import { GuaranteesModule } from "./guarantee/guarantees.module";
@Module({
  imports: [
    DriversModule,
    CompaniesModule,
    PartsModule,
    BreakdownModule,
    RentalsModule,
    MotorcyclesModule,
    ModelsModule,
    MaintenancesModule,
    GuaranteesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
