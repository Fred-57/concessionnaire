import { Breakdown } from "@domain/entities/Breakdown";
import { PostgresBreakdownRepository } from "@infrastructure/repositories/postgres";
import { Injectable } from "@nestjs/common";
import { ListBreakdownsUseCase } from "@application/usecases/breakdown/ListBreakdownsUseCase";
import { GetBreakdownUsecase } from "@application/usecases/breakdown/GetBreakdownUsecase";
import { CreateBreakdownUsecase } from "@application/usecases/breakdown/CreateBreakdownUsecase";
import { UpdateBreakdownUsecase } from "@application/usecases/breakdown/UpdateBreakdownUsecase";
import { DeleteBreakdownUsecase } from "@application/usecases/breakdown/DeleteBreakdownUsecase";
import { PostgresPartRepository } from "@infrastructure/repositories/postgres";

@Injectable()
export class BreakdownService {
  private readonly breakdownRepository: PostgresBreakdownRepository;
  private readonly listBreakdownsUsecase: ListBreakdownsUseCase;
  private readonly getBreakdownUsecase: GetBreakdownUsecase;
  private readonly createBreakdownUsecase: CreateBreakdownUsecase;
  private readonly updateBreakdownUsecase: UpdateBreakdownUsecase;
  private readonly deleteBreakdownUsecase: DeleteBreakdownUsecase;
  private readonly partRepository: PostgresPartRepository;
  constructor() {
    this.breakdownRepository = new PostgresBreakdownRepository();
    this.partRepository = new PostgresPartRepository();
    this.listBreakdownsUsecase = new ListBreakdownsUseCase(
      this.breakdownRepository,
    );
    this.getBreakdownUsecase = new GetBreakdownUsecase(
      this.breakdownRepository,
    );
    this.createBreakdownUsecase = new CreateBreakdownUsecase(
      this.breakdownRepository,
      this.partRepository,
    );
    this.updateBreakdownUsecase = new UpdateBreakdownUsecase(
      this.breakdownRepository,
      this.partRepository,
    );
    this.deleteBreakdownUsecase = new DeleteBreakdownUsecase(
      this.breakdownRepository,
    );
  }

  async findAll() {
    return this.listBreakdownsUsecase.execute();
  }

  async findOne(identifier: string) {
    return this.getBreakdownUsecase.execute(identifier);
  }

  async create(breakdown: Breakdown) {
    const breakdownToCreate = Breakdown.from(
      breakdown.identifier,
      breakdown.date.value,
      breakdown.description,
      breakdown.rentalIdentifier,
      breakdown.parts,
      breakdown.status,
      breakdown.createdAt,
      breakdown.updatedAt,
    );
    if (breakdownToCreate instanceof Error) {
      throw breakdownToCreate;
    }
    return this.createBreakdownUsecase.execute(breakdownToCreate);
  }

  async update(identifier: string, breakdown: Breakdown) {
    const breakdownToUpdate =
      await this.breakdownRepository.findByIdentifier(identifier);

    const updatedBreakdown = Breakdown.from(
      breakdownToUpdate.identifier,
      breakdown.date.value,
      breakdown.description,
      breakdown.rentalIdentifier,
      breakdown.parts,
      breakdown.status,
      breakdownToUpdate.createdAt,
      breakdown.updatedAt,
    );
    if (updatedBreakdown instanceof Error) {
      throw updatedBreakdown;
    }
    return this.updateBreakdownUsecase.execute(updatedBreakdown);
  }

  async delete(identifier: string) {
    const breakdown =
      await this.breakdownRepository.findByIdentifier(identifier);

    if (!breakdown) {
      throw new Error("Breakdown not found");
    }

    return this.deleteBreakdownUsecase.execute(identifier);
  }
}
