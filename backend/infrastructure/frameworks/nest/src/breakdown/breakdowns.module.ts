import { Module } from "@nestjs/common";
import { BreakdownController } from "./breakdowns.controller";
import { BreakdownService } from "./breakdowns.service";
import {
  PostgresBreakdownRepository,
  PostgresPartRepository,
} from "@infrastructure/repositories/postgres";

@Module({
  controllers: [BreakdownController],
  providers: [
    BreakdownService,
    PostgresBreakdownRepository,
    PostgresPartRepository,
  ],
})
export class BreakdownModule {}
