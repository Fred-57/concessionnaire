import { Usecase } from "../Usecase";
import { Rental } from "@domain/entities/Rental";
import { RentalRepository } from "@application/repositories/RentalRepository";

export class ListRentalsUsecase implements Usecase<Rental[]> {
  public constructor(private readonly rentalRepository: RentalRepository) {}

  public async execute(companyIdentifier: string) {
    return this.rentalRepository.findManyByCompanyIdentifier(companyIdentifier);
  }
}
