import { BreakdownPartType } from "@domain/types/BreakdownPartType";
import { StatusMaintenanceBreakdownEnum } from "@domain/types/StatusMaintenanceBreakdownEnum";

export class CreateBreakdownDto {
  identifier: string;
  date: Date;
  description: string;
  rentalIdentifier: string;
  parts: BreakdownPartType[];
  status: StatusMaintenanceBreakdownEnum;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateBreakdownDto extends CreateBreakdownDto {}
