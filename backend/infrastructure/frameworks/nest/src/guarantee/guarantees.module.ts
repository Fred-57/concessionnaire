import {
  PostgresGuaranteeRepository,
  PostgresPartRepository,
} from "@infrastructure/repositories/postgres";
import { Module } from "@nestjs/common";
import { GuaranteesController } from "./guarantees.controller";
import { GuaranteesService } from "./guarantees.service";

@Module({
  controllers: [GuaranteesController],
  providers: [
    GuaranteesService,
    PostgresGuaranteeRepository,
    PostgresPartRepository,
  ],
})
export class GuaranteesModule {}
