import { DeletePartUsecase } from "@application/usecases/part/DeletePartUsecase";
import { GetPartUsecase } from "@application/usecases/part/GetPartUsecase";
import { ListPartsUsecase } from "@application/usecases/part/ListPartsUsecase";
import { CreatePartUsecase } from "@application/usecases/part/CreatePartUsecase";
import { UpdatePartUsecase } from "@application/usecases/part/UpdatePartUsecase";
import { PostgresPartRepository } from "@infrastructure/repositories/postgres";
import { Injectable } from "@nestjs/common";
import { CreatePartDto } from "./parts.dto";
import { UpdatePartDto } from "./parts.dto";
import { Part } from "@domain/entities/Part";
@Injectable()
export class PartsService {
  private readonly partRepository: PostgresPartRepository;
  private readonly listPartsUsecase: ListPartsUsecase;
  private readonly getPartUsecase: GetPartUsecase;
  private readonly createPartUsecase: CreatePartUsecase;
  private readonly updatePartUsecase: UpdatePartUsecase;
  private readonly deletePartUsecase: DeletePartUsecase;

  constructor() {
    this.partRepository = new PostgresPartRepository();
    this.listPartsUsecase = new ListPartsUsecase(this.partRepository);
    this.getPartUsecase = new GetPartUsecase(this.partRepository);
    this.createPartUsecase = new CreatePartUsecase(this.partRepository);
    this.updatePartUsecase = new UpdatePartUsecase(this.partRepository);
    this.deletePartUsecase = new DeletePartUsecase(this.partRepository);
  }

  async findAll() {
    return this.listPartsUsecase.execute();
  }

  async findOne(id: string) {
    return this.getPartUsecase.execute(id);
  }

  async create(createPartDto: CreatePartDto) {
    const part = Part.create(
      createPartDto.reference,
      createPartDto.name,
      createPartDto.cost,
      createPartDto.stock,
    );

    if (part instanceof Error) {
      return part;
    }

    return this.createPartUsecase.execute(part);
  }

  async update(id: string, updatePartDto: UpdatePartDto) {
    const existingPart = await this.getPartUsecase.execute(id);

    const part = Part.from(
      existingPart.identifier,
      updatePartDto.reference,
      updatePartDto.name,
      updatePartDto.cost,
      updatePartDto.stock,
      existingPart.createdAt,
      new Date(),
    );

    if (part instanceof Error) {
      return part;
    }

    return this.updatePartUsecase.execute(part);
  }

  async delete(identifier: string) {
    return this.deletePartUsecase.execute(identifier);
  }
}
