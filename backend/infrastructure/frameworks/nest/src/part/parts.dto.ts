export class CreatePartDto {
  identifier: string;
  name: string;
  reference: string;
  cost: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdatePartDto extends CreatePartDto {}
