import { UserRepository as UserRepositoryInterface } from "../../../../application/repositories/UserRepository";
import { UserEntity } from "../../../../domain/entities/UserEntity";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository implements UserRepositoryInterface {
  async save(user: UserEntity): Promise<void> {
    await prisma.user.create({
      data: {
        id: user.identifier,
        email: user.email,
        hashed_password: user.hashedPassword,
        role: user.role as Role,
      },
    });
  }
}
