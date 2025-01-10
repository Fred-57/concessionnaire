import { DriverRepository } from "../../../../application/repositories/DriverRepository";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PostgresDriverRepository implements DriverRepository {
  async save(): Promise<void> {
    // await prisma.driver.create({
    //   data: {
    //     id: user.identifier,
    //     email: user.email,
    //     hashed_password: user.hashedPassword,
    //     role: user.role as Role,
    //   },
    // });
  }
}