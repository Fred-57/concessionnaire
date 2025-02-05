import { MongoRentalRepository } from "@infrastructure/repositories/mongodb";
import { PostgresRentalRepository } from "@infrastructure/repositories/postgres";
import { Module } from "@nestjs/common";
import { RentalsController } from "./rentals.controller";
import { RentalsService } from "./rentals.service";

@Module({
  controllers: [RentalsController],
  providers: [RentalsService, MongoRentalRepository, PostgresRentalRepository],
})
export class RentalsModule {}
