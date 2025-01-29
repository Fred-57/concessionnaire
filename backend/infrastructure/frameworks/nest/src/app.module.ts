import { Module } from "@nestjs/common";
import { DriversModule } from "./drivers/drivers.module";
import { CompaniesModule } from "./company/companies.module";

@Module({
  imports: [DriversModule, CompaniesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
