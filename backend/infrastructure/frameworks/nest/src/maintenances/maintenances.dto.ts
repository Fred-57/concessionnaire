import { BreakdownPartType } from "@domain/types/BreakdownPartType";
import { StatusMaintenanceBreakdownEnum } from "@domain/types/StatusMaintenanceBreakdownEnum";

export class CreateMaintenanceDto {
  identifier: string;
  date: Date;
  recommendation: string;
  totalCost: number;
  motorcycleIdentifier: string;
  parts: BreakdownPartType[];
  status: StatusMaintenanceBreakdownEnum;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateMaintenanceDto extends CreateMaintenanceDto {}
