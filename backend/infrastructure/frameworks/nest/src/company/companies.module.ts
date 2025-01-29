import { Module } from "@nestjs/common";
import { CompaniesController } from "./companies.controller";
import { CompaniesService } from "./companies.service";
import { MongoCompanyRepository } from "@infrastructure/repositories/mongodb";
import { PostgresCompanyRepository } from "@infrastructure/repositories/postgres";

@Module({
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    MongoCompanyRepository,
    PostgresCompanyRepository,
  ],
})
export class CompaniesModule {}
