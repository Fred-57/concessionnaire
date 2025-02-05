import { RentalTypeEnum } from "@domain/types/RentalTypeEnum";
import { IntervalInMonths } from "@domain/values/IntervalInMonths";
export class CreateRentalDto {
  identifier: string;
  startDate: Date;
  durationInMonths: IntervalInMonths;
  type: RentalTypeEnum;
  driverIdentifier: string;
  motorcycleIdentifier: string;
  breakdownIdentifiers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateRentalDto extends CreateRentalDto {}
