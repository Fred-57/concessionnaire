import { DriverRepository } from "@application/repositories/DriverRepository";
import { PrismaClient } from "@prisma/client";
import { Driver } from "@domain/entities/Driver";

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

  findByIdentifier(identifier: string): Promise<Driver | null> {
    throw new Error("Method not implemented.");
  }

  findAll(): Promise<Driver[]> {
    throw new Error("Method not implemented.");
  }

  delete(driver: Driver): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
