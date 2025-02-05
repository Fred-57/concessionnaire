import { RentalTypeEnum } from "@domain/types/RentalTypeEnum";
export class CreateRentalDto {
  identifier: string;
  startDate: Date;
  durationInMonths: number;
  type: RentalTypeEnum;
  driverIdentifier: string;
  motorcycleIdentifier: string;
  breakdownIdentifiers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateRentalDto extends CreateRentalDto {}
