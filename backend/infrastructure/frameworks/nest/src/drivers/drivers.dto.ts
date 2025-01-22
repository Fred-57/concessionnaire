import { License } from "@domain/types/License";

export class CreateDriverDto {
  name: string;
  license: License;
  numberOfYearsOfExperience: number;
}

export class UpdateDriverDto extends CreateDriverDto {}
