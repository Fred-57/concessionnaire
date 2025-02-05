import { BreakdownPartType } from "@domain/types/BreakdownPartType";
import { StatusMaintenanceBreakdownEnum } from "@domain/types/StatusMaintenanceBreakdownEnum";
import { BreakdownDate } from "@domain/values/breakdown/BreakdownDate";

export class CreateBreakdownDto {
  identifier: string;
  date: BreakdownDate;
  description: string;
  rentalIdentifier: string;
  parts: BreakdownPartType[];
  status: StatusMaintenanceBreakdownEnum;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateBreakdownDto extends CreateBreakdownDto {}
