import { Module } from "@nestjs/common";
import { DriversModule } from "./drivers/drivers.module";
import { CompaniesModule } from "./company/companies.module";
import { PartsModule } from "./part/parts.module";
@Module({
  imports: [DriversModule, CompaniesModule, PartsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
