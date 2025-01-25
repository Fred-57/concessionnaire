import { GuaranteeRepository } from "@application/repositories/GuaranteeRepository";
import { Guarantee } from "@domain/entities/Guarantee";
import { Usecase } from "../Usecase";

export class ListGuaranteesUsecase implements Usecase<Guarantee[]> {
  public constructor(
    private readonly guaranteeRepository: GuaranteeRepository
  ) {}

  public async execute() {
    const guarantees = await this.guaranteeRepository.findAll();
    return guarantees;
  }
}
