import { UserRepository as PostgresUserRepository } from "@infrastructure/repositories/postgres";
import { UserRepository as MongoUserRepository } from "@infrastructure/repositories/mongodb";
import { Module } from "@nestjs/common";

@Module({
  imports: [],
  controllers: [],
  providers: [MongoUserRepository, PostgresUserRepository],
})
export class AppModule {}
