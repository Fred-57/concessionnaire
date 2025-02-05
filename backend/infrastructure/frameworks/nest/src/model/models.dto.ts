export class CreateModelDto {
  identifier: string;
  name: string;
  repairMileage: number;
  repairDeadline: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateModelDto extends CreateModelDto {}
