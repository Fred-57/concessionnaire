import { PostgresGuaranteeRepository } from "@infrastructure/repositories/postgres/src/PostgresGuaranteeRepository";
import { Injectable } from "@nestjs/common";
import { ListGuaranteesUsecase } from "@application/usecases/guarantee/ListGuaranteeUsecase";
import { GetGuaranteeUsecase } from "@application/usecases/guarantee/GetGuaranteeUsecase";
import { CreateGuaranteeUsecase } from "@application/usecases/guarantee/CreateGuaranteeUsecase";
import { UpdateGuaranteeUsecase } from "@application/usecases/guarantee/UpdateGuaranteeUsecase";
import { DeleteGuaranteeUsecase } from "@application/usecases/guarantee/DeleteGuaranteeUsecase";
import { PostgresPartRepository } from "@infrastructure/repositories/postgres/src/PostgresPartRepository";
import { Guarantee } from "@domain/entities/Guarantee";
import { CreateGuaranteeDto, UpdateGuaranteeDto } from "./guarentees.dto";
@Injectable()
export class GuaranteesService {
  private readonly guaranteesRepository: PostgresGuaranteeRepository;
  private readonly partsRepository: PostgresPartRepository;
  private readonly listGuaranteesUsecase: ListGuaranteesUsecase;
  private readonly getGuaranteeUsecase: GetGuaranteeUsecase;
  private readonly createGuaranteeUsecase: CreateGuaranteeUsecase;
  private readonly updateGuaranteeUsecase: UpdateGuaranteeUsecase;
  private readonly deleteGuaranteeUsecase: DeleteGuaranteeUsecase;

  constructor() {
    this.guaranteesRepository = new PostgresGuaranteeRepository();
    this.partsRepository = new PostgresPartRepository();
    this.listGuaranteesUsecase = new ListGuaranteesUsecase(
      this.guaranteesRepository,
    );
    this.getGuaranteeUsecase = new GetGuaranteeUsecase(
      this.guaranteesRepository,
    );
    this.createGuaranteeUsecase = new CreateGuaranteeUsecase(
      this.guaranteesRepository,
      this.partsRepository,
    );
    this.updateGuaranteeUsecase = new UpdateGuaranteeUsecase(
      this.guaranteesRepository,
      this.partsRepository,
    );
    this.deleteGuaranteeUsecase = new DeleteGuaranteeUsecase(
      this.guaranteesRepository,
    );
  }

  async findAll() {
    return this.listGuaranteesUsecase.execute();
  }

  async findOne(identifier: string) {
    return this.getGuaranteeUsecase.execute(identifier);
  }

  async create(createGuaranteeDto: CreateGuaranteeDto) {
    const guarantee = Guarantee.create(
      createGuaranteeDto.name,
      createGuaranteeDto.durationInMonths,
      createGuaranteeDto.coveredAmount,
      createGuaranteeDto.partsIdentifiers,
      createGuaranteeDto.motorcyclesIdentifiers,
    );
    if (guarantee instanceof Error) {
      throw guarantee;
    }
    return this.createGuaranteeUsecase.execute(guarantee);
  }

  async update(identifier: string, updateGuaranteeDto: UpdateGuaranteeDto) {
    const guarantee = await this.findOne(identifier);
    if (guarantee instanceof Error) {
      throw guarantee;
    }
    const updatedGuarantee = Guarantee.from(
      guarantee.identifier,
      updateGuaranteeDto.name,
      updateGuaranteeDto.durationInMonths,
      updateGuaranteeDto.coveredAmount,
      updateGuaranteeDto.partsIdentifiers,
      updateGuaranteeDto.motorcyclesIdentifiers,
      guarantee.createdAt,
      new Date(),
    );
    if (updatedGuarantee instanceof Error) {
      throw updatedGuarantee;
    }
    console.log(updatedGuarantee);
    return this.updateGuaranteeUsecase.execute(updatedGuarantee);
  }

  async delete(identifier: string) {
    return this.deleteGuaranteeUsecase.execute(identifier);
  }
}
