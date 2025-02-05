import { Module } from "@nestjs/common";
import { DriversModule } from "./drivers/drivers.module";
import { CompaniesModule } from "./company/companies.module";
import { PartsModule } from "./part/parts.module";
import { BreakdownModule } from "./breakdown/breakdowns.module";
import { RentalsModule } from "./rental/rentals.module";
@Module({
  imports: [
    DriversModule,
    CompaniesModule,
    PartsModule,
    BreakdownModule,
    RentalsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
