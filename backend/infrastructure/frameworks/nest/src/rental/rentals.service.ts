import { BadRequestException, Injectable } from "@nestjs/common";
import { PostgresRentalRepository } from "@infrastructure/repositories/postgres";
import { ListRentalsUsecase } from "@application/usecases/rental/ListRentalsUsecase";
import { CreateRentalUsecase } from "@application/usecases/rental/CreateRentalUsecase";
import { UpdateRentalUsecase } from "@application/usecases/rental/UpdateRentalUsecase";
import { DeleteRentalUsecase } from "@application/usecases/rental/DeleteRentalUsecase";
import { GetRentalUsecase } from "@application/usecases/rental/GetRentalUsecase";
import { Rental } from "@domain/entities/Rental";
import { CreateRentalDto, UpdateRentalDto } from "./rentals.dto";
@Injectable()
export class RentalsService {
  private readonly rentalRepository: PostgresRentalRepository;
  private readonly listRentalsUsecase: ListRentalsUsecase;
  private readonly getRentalUsecase: GetRentalUsecase;
  private readonly createRentalUsecase: CreateRentalUsecase;
  private readonly updateRentalUsecase: UpdateRentalUsecase;
  private readonly deleteRentalUsecase: DeleteRentalUsecase;
  constructor() {
    this.rentalRepository = new PostgresRentalRepository();
    this.listRentalsUsecase = new ListRentalsUsecase(this.rentalRepository);
    this.createRentalUsecase = new CreateRentalUsecase(this.rentalRepository);
    this.updateRentalUsecase = new UpdateRentalUsecase(this.rentalRepository);
    this.deleteRentalUsecase = new DeleteRentalUsecase(this.rentalRepository);
    this.getRentalUsecase = new GetRentalUsecase(this.rentalRepository);
  }

  async findAll(companyIdentifier: string) {
    return this.listRentalsUsecase.execute(companyIdentifier);
  }

  async findOne(identifier: string) {
    return this.getRentalUsecase.execute(identifier);
  }

  async create(createRentalDto: CreateRentalDto) {
    const rental = Rental.create(
      createRentalDto.startDate,
      createRentalDto.durationInMonths.value,
      createRentalDto.type,
      createRentalDto.driverIdentifier,
      createRentalDto.motorcycleIdentifier,
    );
    if (rental instanceof Error) {
      throw new BadRequestException(rental.message);
    }
    await this.createRentalUsecase.execute(rental);
  }

  async update(identifier: string, updateRentalDto: UpdateRentalDto) {
    const rental = await this.rentalRepository.findByIdentifier(identifier);
    if (!rental) {
      throw new BadRequestException("Rental not found");
    }

    const updatedRental = Rental.from(
      rental.identifier,
      updateRentalDto.startDate,
      updateRentalDto.durationInMonths.value,
      updateRentalDto.type,
      updateRentalDto.driverIdentifier,
      updateRentalDto.motorcycleIdentifier,
      updateRentalDto.breakdownIdentifiers,
      rental.createdAt,
      new Date(),
    );
    if (updatedRental instanceof Error) {
      throw new BadRequestException(updatedRental.message);
    }
    await this.updateRentalUsecase.execute(updatedRental);
  }

  async delete(identifier: string) {
    const rental = await this.rentalRepository.findByIdentifier(identifier);
    if (!rental) {
      throw new BadRequestException("Rental not found");
    }
    await this.deleteRentalUsecase.execute(rental);
  }
}
